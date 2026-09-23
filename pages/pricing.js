import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import PricingCard from "../components/PricingCard";

export default function Pricing() {
  const router = useRouter();
  const { data: authSession, status: authStatus } = useSession();
  const [me, setMe] = useState(null); // { loggedIn, isPro, email } from /api/me
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [banner, setBanner] = useState(null);
  const pollRef = useRef(null);

  async function refreshMe() {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      setMe(data);
      return data;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (authStatus !== "loading") refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  // After returning from Stripe Checkout, the webhook needs a moment to
  // fire before the database actually shows is_pro = true. Poll /api/me
  // a few times rather than trusting the URL parameter alone.
  useEffect(() => {
    if (!router.isReady) return;
    const { success, canceled } = router.query;

    if (success === "true") {
      setBanner({ type: "pending", text: "Confirming your payment…" });
      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts += 1;
        const data = await refreshMe();
        if (data?.isPro) {
          clearInterval(pollRef.current);
          setBanner({ type: "success", text: "Payment confirmed — Pro is unlocked on your account." });
        } else if (attempts >= 8) {
          clearInterval(pollRef.current);
          setBanner({
            type: "error",
            text: "Payment is processing — refresh this page in a moment if Pro doesn't show up yet.",
          });
        }
      }, 2000);
      router.replace("/pricing", undefined, { shallow: true });
    } else if (canceled === "true") {
      setBanner({ type: "canceled", text: "Checkout canceled — you weren't charged." });
      router.replace("/pricing", undefined, { shallow: true });
    }

    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  async function handleUpgradeClick() {
    if (authStatus !== "authenticated") {
      router.push("/signup");
      return;
    }

    setLoadingCheckout(true);
    setBanner(null);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setBanner({ type: "error", text: data.error || "Unable to start checkout." });
        setLoadingCheckout(false);
      }
    } catch {
      setBanner({ type: "error", text: "Unable to reach the checkout server." });
      setLoadingCheckout(false);
    }
  }

  const isPro = me?.isPro || false;

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
                : banner.type === "canceled" || banner.type === "pending"
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
            cta={isPro ? "Currently on Pro" : "Get started"}
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
            cta={
              loadingCheckout
                ? "Redirecting to checkout…"
                : isPro
                ? "You're on Pro"
                : authStatus === "authenticated"
                ? "Upgrade to Pro"
                : "Sign up to upgrade"
            }
            onClick={isPro || loadingCheckout ? undefined : handleUpgradeClick}
            highlighted
          />
        </div>

        <div className="mx-auto mt-6 max-w-xl text-center text-xs text-paper-faint">
          {isPro ? (
            <p>You're logged in as {me.email}. Checkout runs through Stripe's test mode right now, so no real card is charged.</p>
          ) : authStatus === "authenticated" ? (
            <p>
              Logged in as {authSession.user.email}. Checkout runs through Stripe's test mode right
              now — use card number 4242 4242 4242 4242, any future expiry date, and any CVC.
            </p>
          ) : (
            <p>Upgrading requires a free account first, so a real payment can be tied to you specifically.</p>
          )}
        </div>

        <div className="mx-auto mt-20 max-w-2xl border-t border-ink-border pt-10">
          <h2 className="font-display text-2xl text-paper">A couple of things worth knowing</h2>
          <div className="mt-6 space-y-6 text-sm text-paper-dim">
            <div>
              <p className="font-semibold text-paper">Can I cancel anytime?</p>
              <p className="mt-1">
                Once real (non-test) billing is live, yes — Pro will be a standard monthly
                subscription with no lock-in. Self-serve cancellation from this site isn't built
                yet; for now, cancel from Stripe's customer portal or contact support.
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
