import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PricingCard from "../components/PricingCard";
import { isPremium, setPremium } from "../lib/storage";

export default function Pricing() {
  const [premium, setPremiumState] = useState(false);

  useEffect(() => {
    setPremiumState(isPremium());
  }, []);

  // -----------------------------------------------------------------
  // PLACEHOLDER — connect Stripe here.
  //
  // This button does not charge anyone. It only flips a localStorage
  // flag so you can preview what the Pro experience looks like.
  //
  // To wire up real payments:
  //   1. Create a Stripe account + a Product/Price for the $7.99/mo plan.
  //   2. Add a Next.js API route, e.g. pages/api/create-checkout-session.js,
  //      that creates a Stripe Checkout Session server-side using your
  //      secret key (never expose it in the browser).
  //   3. Replace handleUpgradeClick() below with a call to that route,
  //      then redirect the browser to the returned Stripe Checkout URL:
  //
  //        const res = await fetch("/api/create-checkout-session", { method: "POST" });
  //        const { url } = await res.json();
  //        window.location.href = url;
  //
  //   4. Add a Stripe webhook (pages/api/webhooks/stripe.js) that listens
  //      for checkout.session.completed / customer.subscription.deleted
  //      and updates the user's plan in your database (see lib/storage.js
  //      for where the "is this user premium?" check currently lives).
  // -----------------------------------------------------------------
  function handleUpgradeClick() {
    const next = !premium;
    setPremium(next);
    setPremiumState(next);
  }

  return (
    <Layout title="Pricing — HustleFinder AI">
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="text-center">
          <h1 className="font-display text-4xl text-paper sm:text-5xl">Simple pricing</h1>
          <p className="mx-auto mt-4 max-w-md text-paper-dim">
            Try it free. Upgrade when you want the full list and the tools to act on it.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <PricingCard
            name="Free"
            price="$0"
            period="forever"
            description="Enough to see if this is worth pursuing."
            features={[
              "3 personalized hustle ideas",
              "Startup cost, difficulty, and income range for each",
              "Step-by-step getting-started plan",
              "Common mistakes to avoid",
            ]}
            cta={premium ? "Currently on Pro" : "Get started"}
            href="/find-a-hustle"
          />
          <PricingCard
            name="Pro"
            price="$7.99"
            period="month"
            description="For when you're ready to actually pick one and go."
            features={[
              "Unlimited hustle ideas",
              "Detailed plans for every match",
              "Personalized 30-day action plans",
              "Profit calculator",
              "AI-generated business names",
              "Marketing & social content ideas",
            ]}
            cta={premium ? "Downgrade to Free (demo)" : "Upgrade to Pro (demo)"}
            onClick={handleUpgradeClick}
            highlighted
          />
        </div>

        <p className="mt-6 text-center text-xs text-paper-faint">
          Payments aren't connected yet — the Pro button above only simulates the upgrade in
          your browser so you can preview the experience.
        </p>

        <div className="mx-auto mt-20 max-w-2xl border-t border-ink-border pt-10">
          <h2 className="font-display text-2xl text-paper">A couple of things worth knowing</h2>
          <div className="mt-6 space-y-6 text-sm text-paper-dim">
            <div>
              <p className="font-semibold text-paper">Can I cancel anytime?</p>
              <p className="mt-1">Once billing is connected, yes — Pro will be a standard monthly subscription with no lock-in.</p>
            </div>
            <div>
              <p className="font-semibold text-paper">Is there a free trial of Pro?</p>
              <p className="mt-1">The free plan is really a permanent trial — 3 full matches, no time limit, no card required.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
