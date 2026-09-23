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

**Stripe payments + accounts + a database** — all now wired up together, since a real payment
needs a real account to attach to. Here's the full setup, in order:

### 1. Create a database

In your Vercel project: **Storage tab → Create Database → Postgres (Neon)**. Follow the
prompts to connect it to this project — Vercel automatically adds a `DATABASE_URL`
environment variable for you. `lib/db.js` creates the one table it needs (`users`)
automatically the first time it's queried — no manual migration step required.

### 2. Add the auth secret

Add one more environment variable in **Vercel → Settings → Environment Variables**:

```
NEXTAUTH_SECRET   any long random string, e.g. output of: openssl rand -base64 32
```

### 3. Set up the Stripe webhook

This is what makes "Pro" reliable — Stripe tells your server directly when someone actually
pays, rather than the browser being trusted to say so.

1. In Stripe's dashboard: **Developers → Webhooks → Add endpoint**.
2. URL: `https://<your-live-domain>/api/webhooks/stripe`
3. Events to send: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.
4. Copy the **Signing secret** Stripe shows you (starts with `whsec_...`) and add it as an
   environment variable:

```
STRIPE_WEBHOOK_SECRET   whsec_...
STRIPE_SECRET_KEY       your sk_test_... key (sk_live_... once you go live)
STRIPE_PRICE_ID         the price_... ID for the $7.99/month Pro plan
```

### 4. Redeploy

After adding all four environment variables (`DATABASE_URL` is automatic, the other three you
add manually), redeploy from Vercel's Deployments tab so the new variables actually take
effect.

### How it fits together

- `pages/signup.js` / `pages/login.js` — account creation and login, via NextAuth
  (`pages/api/auth/[...nextauth].js`) using email + a bcrypt-hashed password.
- `pages/api/create-checkout-session.js` — now requires login, and tags the Stripe session
  with `client_reference_id` so the webhook can reliably match it back to a database row.
- `pages/api/webhooks/stripe.js` — the source of truth. Only this route ever sets `is_pro`
  to true in the database, and only in response to a real Stripe event.
- `pages/api/me.js` — every page that needs to know "is this person Pro?" asks this route,
  which reads straight from the database, never from anything the browser stored itself.

**To test end-to-end:** sign up for an account, go to Pricing, click Upgrade, and pay with
Stripe's test card `4242 4242 4242 4242` (any future expiry date, any CVC). Within a couple
seconds the webhook fires and your account is marked Pro for real, tied to that account
specifically — logging in from a different browser now correctly shows Pro too.

## Customizing

- **Hustle data**: edit `data/hustles.js` — add, remove, or tweak any hustle's numbers, steps,
  requirements, or mistakes. The matching engine picks up new entries automatically.
- **Matching logic**: tune the scoring weights in `lib/hustleEngine.js` (budget, hours, mode,
  skills, income functions).
- **Colors/fonts**: edit the `ink`/`paper`/`cash`/`gold` tokens in `tailwind.config.js` and the
  Google Fonts import at the top of `styles/globals.css`.
- **Free plan limit**: `RESULT_LIMITS.free` in `lib/hustleEngine.js` (currently 3).
