import hustles from "../data/hustles";

// -----------------------------------------------------------------------
// lib/hustleEngine.js
//
// This file turns a filled-out form into a ranked, personalized list of
// hustle results. Right now everything runs locally in the browser
// against the sample dataset in data/hustles.js — there is no network
// call and no AI involved yet. That keeps the app fully working and
// testable with zero setup.
//
// >>> WHERE TO CONNECT A REAL AI API <<<
// The natural place to add one is generateHustleMatches() below. A simple
// approach that keeps this file's shape: keep the local scoring as a fast,
// free fallback, and layer an AI call on top for Pro users to (a) write
// more personalized "why this matches you" copy, and/or (b) generate
// entirely new hustle ideas beyond the fixed sample dataset. For example:
//
//   export async function generateHustleMatches(formData, options = {}) {
//     const scored = scoreAndRankLocally(formData);              // keep this
//     if (options.useAI) {
//       const res = await fetch("/api/generate-hustles", {        // <- add this route
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ formData, baseline: scored }),
//       });
//       return await res.json();
//     }
//     return scored;
//   }
//
// The actual `/api/generate-hustles` route would live on your backend
// (e.g. a Next.js API route or a separate server) and call the Anthropic
// API with formData to either rewrite the "why it matches" text per user
// or propose brand-new hustles. Keep the API key server-side only —
// never call a paid AI API with a secret key directly from the browser.
// -----------------------------------------------------------------------

const FREE_RESULT_LIMIT = 3;
// Free users see a fixed number of blurred "locked" teaser cards below their
// unlocked results, regardless of how many total matches exist — see
// LOCKED_TEASER_COUNT below. Pro has no fixed cap: it unlocks every hustle
// in the dataset that scored a real match.
const LOCKED_TEASER_COUNT = 5;

function budgetScore(hustle, budget) {
  if (budget >= hustle.minBudget && budget <= hustle.maxBudget * 1.5) return 3;
  if (budget >= hustle.minBudget) return 2;
  if (budget >= hustle.minBudget * 0.5) return 1;
  return -2;
}

function hoursScore(hustle, hoursPerWeek) {
  if (hoursPerWeek >= hustle.hoursMin) return 2;
  if (hoursPerWeek >= hustle.hoursMin * 0.6) return 0;
  return -2;
}

function modeScore(hustle, mode) {
  // mode is "online" | "local" | "both"
  if (mode === "both") return hustle.modes.length ? 2 : 0;
  return hustle.modes.includes(mode) ? 3 : -3;
}

function ageScore(hustle, age) {
  if (!age) return 0;
  const minAge = hustle.minAge || 16;
  if (age >= minAge) return 1;
  // Under the realistic minimum (e.g. most marketplaces like Etsy/eBay/
  // Upwork require account holders to be 18+, some local work needs a
  // driver's license). Push it down hard rather than hiding it outright,
  // since a parent/guardian can sometimes make it work anyway.
  return -5;
}

function skillScore(hustle, skillsText) {
  if (!skillsText) return 0;
  const text = skillsText.toLowerCase();
  const matchedTags = hustle.tags.filter((tag) => text.includes(tag.toLowerCase()));
  return matchedTags.length * 2;
}

function incomeScore(hustle, desiredIncome) {
  if (!desiredIncome) return 0;
  if (desiredIncome <= hustle.incomeMax && desiredIncome >= hustle.incomeMin * 0.4) return 2;
  if (desiredIncome > hustle.incomeMax * 2) return -1; // hustle likely can't hit their goal alone
  return 0;
}

function computeScore(hustle, formData) {
  const budget = Number(formData.budget) || 0;
  const hours = Number(formData.hoursPerWeek) || 0;
  const income = Number(formData.desiredIncome) || 0;
  const age = Number(formData.age) || 0;

  return (
    budgetScore(hustle, budget) +
    hoursScore(hustle, hours) +
    modeScore(hustle, formData.mode) +
    ageScore(hustle, age) +
    skillScore(hustle, formData.skills) +
    incomeScore(hustle, income)
  );
}

function matchedSkillTags(hustle, skillsText) {
  if (!skillsText) return [];
  const text = skillsText.toLowerCase();
  return hustle.tags.filter((tag) => text.includes(tag.toLowerCase()));
}

// Builds a short, specific "why this matches you" explanation from the
// user's actual answers instead of a generic blurb.
function generateWhyMatch(hustle, formData) {
  const budget = Number(formData.budget) || 0;
  const hours = Number(formData.hoursPerWeek) || 0;
  const reasons = [];

  if (budget >= hustle.minBudget) {
    reasons.push(
      `it realistically starts around $${hustle.minBudget}${
        hustle.minBudget === 0 ? " (basically free to try)" : ""
      }, which fits your $${budget} starting budget`
    );
  }

  if (hours >= hustle.hoursMin) {
    reasons.push(`it can get moving on about ${hustle.hoursMin} hrs/week, within your ${hours} hrs/week`);
  }

  const tags = matchedSkillTags(hustle, formData.skills);
  if (tags.length) {
    reasons.push(`it lines up with what you listed (${tags.slice(0, 3).join(", ")})`);
  }

  if (formData.mode && formData.mode !== "both") {
    reasons.push(`it's fully ${formData.mode}, matching your preference`);
  } else if (formData.mode === "both") {
    reasons.push(`it works whether you lean online or local`);
  }

  if (!reasons.length) {
    reasons.push("it's a realistic, low-barrier way to start earning given your answers");
  }

  const capitalized = reasons[0][0].toUpperCase() + reasons[0].slice(1);
  const rest = reasons.slice(1);
  return rest.length ? `${capitalized}, and ${rest.join(", and ")}.` : `${capitalized}.`;
}

function scoreAndRankLocally(formData) {
  const scored = hustles
    .map((hustle) => ({
      ...hustle,
      score: computeScore(hustle, formData),
      whyItMatches: generateWhyMatch(hustle, formData),
    }))
    .sort((a, b) => b.score - a.score);

  return scored;
}

/**
 * Main entry point used by pages/find-a-hustle.js and pages/results.js.
 * Returns a ranked array of hustle result objects (already sliced to the
 * caller's plan limit is handled by the caller, not here, so Results can
 * decide how many to reveal vs. blur for free users).
 */
export function generateHustleMatches(formData) {
  return scoreAndRankLocally(formData);
}

export const RESULT_LIMITS = {
  free: FREE_RESULT_LIMIT,
  lockedTeaser: LOCKED_TEASER_COUNT,
};
