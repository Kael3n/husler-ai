// -----------------------------------------------------------------------
// lib/storage.js
//
// Everything in this file reads/writes the browser's localStorage. It's a
// stand-in for real persistence. There is no backend and no accounts yet,
// so a user's answers only live in their own browser.
//
// >>> WHERE TO CONNECT A DATABASE + USER ACCOUNTS <<<
// When you add real accounts (e.g. NextAuth, Clerk, Supabase Auth, etc.)
// and a database (Postgres, Supabase, PlanetScale, Mongo...), swap the
// bodies of these functions for API calls, e.g.:
//
//   export async function saveFormData(data) {
//     await fetch("/api/profile", { method: "POST", body: JSON.stringify(data) });
//   }
//
// Keeping all storage access behind this one module means the rest of the
// app (pages/components) never needs to change when you make that switch.
// -----------------------------------------------------------------------

const KEYS = {
  FORM: "hf_form_data",
  RESULTS: "hf_last_results",
  PREMIUM: "hf_premium", // demo-only flag, see note in pages/pricing.js
  FREE_VIEWS: "hf_free_views_used",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveFormData(data) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEYS.FORM, JSON.stringify(data));
}

export function getFormData() {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(KEYS.FORM);
  return raw ? JSON.parse(raw) : null;
}

export function saveResults(results) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
}

export function getResults() {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(KEYS.RESULTS);
  return raw ? JSON.parse(raw) : null;
}

export function isPremium() {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(KEYS.PREMIUM) === "true";
}

export function setPremium(value) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEYS.PREMIUM, value ? "true" : "false");
}

export function clearAll() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}
