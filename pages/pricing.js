import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import PricingCard from "../components/PricingCard";
import { isPremium, setPremium } from "../lib/storage";

export default function Pricing() {
  const router = useRouter();
  const [premium, setPremiumState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null); // { type: "success" | "error" | "canceled", text }

  useEffect(() => {
    setPremiumState(isPremium());
  }, []);

  // After a successful Stripe Checkout, the browser lands back here with
  // ?success=true&session_id=.... Verify it server-side (see
  // pages/api/verify-session.js) before unlocking anything locally.
  useEffect(() => {
    if (!router.isReady) return;

    const { success, canceled, session_id } = router.query;

    if (success === "true" && session_id) {
      (async () => {
        try {
          const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(session_id)}`);
          const data = await res.json();
          if (data.paid) {
            setPremium(true);
            setPremiumState(true);
            setBanner({ type: "success", text: "Payment confirmed — Pro is unlocked in this browser." });
          } else {
            setBanner({ type: "error", text: "We couldn't confirm that payment went through yet." });
          }
        } catch {
          setBanner({ type: "error", text: "Something went wrong confirming your payment." });
        }
        router.replace("/pricing", undefined, { shallow: true });
      })();
    } else if (canceled === "true") {
      setBanner({ type: "canceled", text: "Checkout canceled — you weren't charged." });
      router.replace("/pricing", undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  async function handleUpgradeClick() {
    setLoading(true);
    setBanner(null);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe's hosted checkout page
      } else {
        setBanner({ type: "error", text: data.error || "Unable to start checkout." });
        setLoading(false);
      }
    } catch {
      setBanner({ type: "error", text: "Unable to reach the checkout server." });
      setLoading(false);
    }
  }

  // Local-only reset for this browser. This does NOT cancel a real Stripe
  // subscription — see the note below the pricing cards.
  function handleResetLocalDemo() {
    setPremium(false);
    setPremiumState(false);
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

        {banner && (
          <div
            className={`mx-auto mt-8 max-w-xl rounded-card border px-4 py-3 text-center text-sm ${
              banner.type === "success"
                ? "border-cash/40 bg-cash/10 text-cash-bright"
                : banner.type === "canceled"
                ? "border-ink-border bg-ink-panel text-paper-dim"
                : "border-gold/40 bg-gold/10 text-gold"
            }`}
          >
            {banner.text}
          </div>
        )}

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
            cta={loading ? "Redirecting to checkout…" : premium ? "You're on Pro" : "Upgrade to Pro"}
            onClick={premium || loading ? undefined : handleUpgradeClick}
            highlighted
          />
        </div>

        <div className="mx-auto mt-6 max-w-xl text-center text-xs text-paper-faint">
          {premium ? (
            <p>
              Checkout runs through Stripe's test mode right now, so no real card is charged.{" "}
              <button onClick={handleResetLocalDemo} className="underline hover:text-paper-dim">
                Reset Pro status in this browser
              </button>{" "}
              — note this only clears the local flag; it does not cancel anything in Stripe.
              Real self-serve cancellation needs user accounts, which aren't built yet (see README).
            </p>
          ) : (
            <p>
              Checkout runs through Stripe's test mode right now — use card number 4242 4242 4242 4242,
              any future expiry date, and any CVC to simulate a successful payment.
            </p>
          )}
        </div>

        <div className="mx-auto mt-20 max-w-2xl border-t border-ink-border pt-10">
          <h2 className="font-display text-2xl text-paper">A couple of things worth knowing</h2>
          <div className="mt-6 space-y-6 text-sm text-paper-dim">
            <div>
              <p className="font-semibold text-paper">Can I cancel anytime?</p>
              <p className="mt-1">
                Once real (non-test) billing is live, yes — Pro will be a standard monthly
                subscription with no lock-in. Self-serve cancellation from this site specifically
                needs user accounts, which aren't built yet.
              </p>
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
