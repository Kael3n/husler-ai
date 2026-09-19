# HustleFinder AI

A Next.js site that turns a short form (budget, skills, hours, location, income goal) into a
ranked, personalized list of realistic side-hustle ideas — startup cost, difficulty, time
required, income range, why it matched, step-by-step plan, what to buy, and mistakes to avoid.

This is a **working frontend with sample data**. There is no backend yet: matching runs
entirely in the browser against `data/hustles.js`, form answers are saved to `localStorage`,
and the Pro plan is a local demo toggle (no real payments). Every place you'd wire in a real
backend is marked with a `>>> WHERE TO CONNECT <<<` comment in the code — see "Where things
connect" below.

## Project structure

```
hustlefinder-ai/
├─ pages/              # One file per route (Home, Find a Hustle, Results, Pricing, About, FAQ, Privacy, Terms)
├─ components/         # Reusable UI: NavBar, Footer, Layout, Button, HustleCard, PricingCard
├─ lib/
│  ├─ hustleEngine.js  # Scoring/matching logic + where to plug in a real AI API
│  └─ storage.js       # localStorage helpers + where to plug in a real database/accounts
├─ data/hustles.js     # Sample hustle dataset (24 hustles across 7 categories)
└─ styles/globals.css  # Theme, fonts, base styles
```

## Running it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
cd hustlefinder-ai
npm install
npm run dev
```

Then open **http://localhost:3000**. Fill out "Find a Hustle" — you'll see real generated
results immediately, no setup required.

To build and run a production build locally:

```bash
npm run build
npm run start
```

## Deploying it online

The easiest path is **Vercel** (made by the creators of Next.js):

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign in, and click "Add New Project".
3. Import the repo — Vercel auto-detects Next.js, no config needed.
4. Click Deploy. You'll get a live URL in about a minute.

Other options that work with zero config changes: Netlify, Render, or Railway (all support
Next.js). Avoid static-only hosts (like plain GitHub Pages) unless you first run
`next export`-style static generation, since some future features (API routes for Stripe/AI)
will need a Node.js server.

## Where things connect (for when you're ready)

**An AI API** — `lib/hustleEngine.js`. Right now `generateHustleMatches()` scores the fixed
sample dataset locally. The comment block at the top of that file shows how to layer a real
AI API call on top (e.g. to write more personalized "why this matches you" copy, or generate
entirely new hustles beyond the sample set) via a new Next.js API route that calls the
Anthropic API server-side.

**Stripe payments** — `pages/pricing.js`. The "Upgrade to Pro" button currently just flips a
`localStorage` flag. The comment block above `handleUpgradeClick()` walks through creating a
Stripe Product/Price, adding a `pages/api/create-checkout-session.js` route, redirecting to
Stripe Checkout, and adding a webhook to update the user's plan after payment.

**A database** — `lib/storage.js`. Every function here (`saveFormData`, `getResults`,
`isPremium`, etc.) currently reads/writes `localStorage`. The comment at the top shows how to
swap these for API calls to your own backend once you add one (Postgres, Supabase,
PlanetScale, etc.) — the rest of the app never needs to change since it only imports from
this file.

**User accounts** — also `lib/storage.js`, alongside the database note. Once you add auth
(NextAuth, Clerk, Supabase Auth...), form answers and plan status should be keyed to a real
user ID server-side instead of (or in addition to) the browser's local storage.

## Customizing

- **Hustle data**: edit `data/hustles.js` — add, remove, or tweak any hustle's numbers, steps,
  requirements, or mistakes. The matching engine picks up new entries automatically.
- **Matching logic**: tune the scoring weights in `lib/hustleEngine.js` (budget, hours, mode,
  skills, income functions).
- **Colors/fonts**: edit the `ink`/`paper`/`cash`/`gold` tokens in `tailwind.config.js` and the
  Google Fonts import at the top of `styles/globals.css`.
- **Free plan limit**: `RESULT_LIMITS.free` in `lib/hustleEngine.js` (currently 3).
