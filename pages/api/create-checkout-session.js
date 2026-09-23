// -----------------------------------------------------------------------
// pages/api/create-checkout-session.js
//
// Creates a Stripe Checkout Session for the logged-in account. Requiring
// login here (instead of letting checkout start anonymously) is what
// lets the Stripe webhook (pages/api/webhooks/stripe.js) reliably tie a
// completed payment back to a specific row in the database — the session
// is tagged with client_reference_id = this user's database id, and
// Stripe hands that back on the webhook event once payment succeeds.
//
// Env vars needed (Vercel -> Settings -> Environment Variables):
//   STRIPE_SECRET_KEY   your sk_test_... (sk_live_... once live)
//   STRIPE_PRICE_ID     the price_... ID for the $7.99/month Pro plan
// -----------------------------------------------------------------------
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getUserById } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Please log in first." });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID env vars");
    return res.status(500).json({ error: "Payments aren't configured yet." });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const user = await getUserById(session.user.id);
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Reuse the existing Stripe customer if this account already has
      // one (e.g. re-subscribing), otherwise let Stripe create one from
      // the email — either way, client_reference_id is what the webhook
      // actually uses to find this account.
      customer: user.stripe_customer_id || undefined,
      customer_email: user.stripe_customer_id ? undefined : user.email,
      client_reference_id: String(user.id),
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return res.status(500).json({ error: "Unable to start checkout." });
  }
}
