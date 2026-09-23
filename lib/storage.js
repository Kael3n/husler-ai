// -----------------------------------------------------------------------
// lib/storage.js
//
// Reads/writes the browser's localStorage — used only for the free-tier
// hustle form answers and generated results, which still work without an
// account (matching the "3 matches, no signup" promise on the homepage).
//
// Pro status is NOT stored here anymore. It lives in the Postgres
// database (see lib/db.js) and is only trustworthy there, since it's set
// by a real account + a real Stripe payment via the webhook in
// pages/api/webhooks/stripe.js. Pages check it via a fetch to /api/me.
// -----------------------------------------------------------------------

const KEYS = {
  FORM: "hf_form_data",
  RESULTS: "hf_last_results",
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

export function clearAll() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}
