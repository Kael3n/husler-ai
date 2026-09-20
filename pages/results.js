import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Button from "../components/Button";
import HustleCard from "../components/HustleCard";
import { getFormData, getResults, isPremium } from "../lib/storage";
import { RESULT_LIMITS } from "../lib/hustleEngine";

function ProToolsPreview({ topHustle }) {
  const [expense, setExpense] = useState(50);
  const monthlyLow = Math.max(0, topHustle.incomeMin - expense);
  const monthlyHigh = Math.max(0, topHustle.incomeMax - expense);

  // Placeholder name-parts. In production, replace generateName() below
  // with a real call to an AI API for genuinely custom name ideas.
  const nameParts = ["Bright", "Summit", "Nova", "North", "Prime", "Anchor"];
  const nameSuffix = ["Studio", "Collective", "Works", "Co.", "Lab"];
  function generateName() {
    const a = nameParts[Math.floor(Math.random() * nameParts.length)];
    const b = nameSuffix[Math.floor(Math.random() * nameSuffix.length)];
    return `${a} ${b}`;
  }
  const [name, setName] = useState(generateName());

  return (
    <div className="rounded-card border border-gold/30 bg-ink-panel2 p-6">
      <p className="figures text-xs text-gold">Pro tools · demo</p>
      <h3 className="font-display mt-1 text-2xl text-paper">
        Extra tools for {topHustle.name}
      </h3>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-paper">Profit calculator</p>
          <p className="mt-1 text-xs text-paper-dim">Rough monthly expenses ($)</p>
          <input
            type="range"
            min="0"
            max="500"
            value={expense}
            onChange={(e) => setExpense(Number(e.target.value))}
            className="mt-2 w-full accent-cash"
          />
          <p className="figures mt-2 text-sm text-paper">
            Est. profit: <span className="text-cash">${monthlyLow} – ${monthlyHigh}/mo</span>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-paper">AI-generated business name</p>
          <p className="figures mt-2 text-lg text-paper">{name}</p>
          <button
            onClick={() => setName(generateName())}
            className="mt-2 text-xs font-semibold text-cash hover:text-cash-bright"
          >
            Generate another
          </button>
        </div>

        <div>
          <p className="text-sm font-semibold text-paper">Your first 30 days</p>
          <ol className="mt-2 space-y-1.5 text-sm text-paper-dim">
            <li>Week 1 — {topHustle.steps[0]}</li>
            <li>Week 2 — {topHustle.steps[1] || "Book your first paying customer."}</li>
            <li>Week 3 — {topHustle.steps[2] || "Collect your first review or testimonial."}</li>
            <li>Week 4 — {topHustle.steps[3] || "Raise your price or add a second offer."}</li>
          </ol>
        </div>

        <div>
          <p className="text-sm font-semibold text-paper">Marketing angle</p>
          <p className="mt-2 text-sm text-paper-dim">
            Lead with a specific before/after result instead of a generic offer — for {topHustle.category.toLowerCase()},
            proof beats promises. Post it where your first customers already spend time.
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-paper-faint">
        These are simple placeholder tools. Swap them for real AI-generated output by wiring
        an API route into lib/hustleEngine.js (see the comment block there).
      </p>
    </div>
  );
}

export default function Results() {
  const [formData, setFormData] = useState(null);
  const [results, setResults] = useState(null);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    setFormData(getFormData());
    setResults(getResults());
    setPremium(isPremium());
  }, []);

  if (results === null) {
    // still loading from localStorage on first client render
    return (
      <Layout title="Your results — HustleFinder AI">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center text-paper-dim">Loading your matches…</div>
      </Layout>
    );
  }

  if (!results.length) {
    return (
      <Layout title="Your results — HustleFinder AI">
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="font-display text-3xl text-paper">No answers on file yet</h1>
          <p className="mt-3 text-paper-dim">
            Fill out the form first so we have something to match against.
          </p>
          <Button href="/find-a-hustle" className="mt-8">
            Go to Find a Hustle
          </Button>
        </div>
      </Layout>
    );
  }

  const limit = premium ? results.length : RESULT_LIMITS.free;
  const visible = results.slice(0, limit);
  const lockedCount = premium ? 0 : Math.min(RESULT_LIMITS.lockedTeaser, results.length - visible.length);

  return (
    <Layout title="Your results — HustleFinder AI">
      <section className="mx-auto max-w-4xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">
          {premium ? "Pro plan" : `Free plan · ${visible.length} of ${results.length} matches unlocked`}
        </p>
        <h1 className="font-display mt-3 text-3xl text-paper sm:text-4xl">
          Your personalized matches
        </h1>
        {formData && (
          <p className="mt-3 max-w-2xl text-paper-dim">
            Based on a ${formData.budget || 0} budget, {formData.hoursPerWeek || 0} hrs/week, and{" "}
            {formData.mode === "both" ? "openness to online or local" : `a ${formData.mode} preference`}.
          </p>
        )}

        <div className="mt-10 space-y-6">
          {visible.map((hustle, i) => (
            <HustleCard key={hustle.id} hustle={hustle} index={i} />
          ))}

          {!premium &&
            Array.from({ length: Math.max(lockedCount, 0) }).map((_, i) => (
              <HustleCard key={`locked-${i}`} hustle={results[visible.length + i]} index={visible.length + i} locked />
            ))}
        </div>

        {premium && visible.length > 0 && (
          <div className="mt-10">
            <ProToolsPreview topHustle={visible[0]} />
          </div>
        )}

        {!premium && (
          <div className="mt-10 rounded-card border border-ink-border bg-ink-panel p-6 text-center">
            <p className="font-display text-xl text-paper">Want the other {results.length - visible.length}?</p>
            <p className="mt-2 text-sm text-paper-dim">
              Pro also unlocks 30-day action plans, a profit calculator, business name ideas, and marketing angles.
            </p>
            <Button href="/pricing" variant="gold" className="mt-5">
              See Pro pricing
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button href="/find-a-hustle" variant="ghost">
            Start over with different answers
          </Button>
        </div>
      </section>
    </Layout>
  );
}
