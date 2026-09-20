// -----------------------------------------------------------------------
// pages/api/create-checkout-session.js
//
// Server-side only — this file never runs in the browser, so it's safe to
// use the Stripe Secret Key here. It creates a Checkout Session for the
// Pro plan and hands back the hosted Stripe URL to redirect the browser
// to. The customer enters their card details on Stripe's own page —
// this project never sees or touches raw card numbers.
//
// Needs two environment variables, set in Vercel under
// Project -> Settings -> Environment Variables (never committed to git):
//   STRIPE_SECRET_KEY   your sk_test_... key (sk_live_... once you go live)
//   STRIPE_PRICE_ID     the price_... ID for the $7.99/month Pro plan
// -----------------------------------------------------------------------
import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID env vars");
    return res.status(500).json({ error: "Payments aren't configured yet." });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return res.status(500).json({ error: "Unable to start checkout." });
  }
}
