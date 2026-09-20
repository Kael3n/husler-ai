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

**Stripe payments** — this is now wired up in test mode. `pages/api/create-checkout-session.js`
creates a real Stripe Checkout Session, `pages/pricing.js` redirects to it, and
`pages/api/verify-session.js` confirms server-side that a session actually shows a completed
payment before unlocking Pro. Two environment variables are required — set these in
**Vercel → your project → Settings → Environment Variables** (never commit them to the repo):

```
STRIPE_SECRET_KEY   your sk_test_... key (sk_live_... once you go live)
STRIPE_PRICE_ID     the price_... ID for the $7.99/month Pro plan
```

After adding them, redeploy (Vercel does this automatically on the next push, or you can
trigger a redeploy manually from the Deployments tab). To test a payment without a real card,
use Stripe's test card number `4242 4242 4242 4242`, any future expiry date, and any CVC.

**Known limitation:** Pro status still only lives in the browser's `localStorage`, exactly
like the old demo toggle — a real payment now unlocks it, but it isn't yet tied to an actual
account, so it won't follow the same person to a different browser or device, and there's no
webhook yet to handle subscription cancellations/renewals happening on Stripe's side. Fixing
that is the next step, and needs the "database + accounts" piece described below first.

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
