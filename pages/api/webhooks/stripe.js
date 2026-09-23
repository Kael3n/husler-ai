// -----------------------------------------------------------------------
// pages/api/webhooks/stripe.js
//
// Stripe calls this URL directly (server-to-server, not through the
// browser) whenever something happens on a subscription: a successful
// payment, a cancellation, a failed renewal, etc. This is what makes Pro
// status trustworthy — it's driven by Stripe telling your server what
// actually happened, not by anything the browser claims.
//
// SETUP (see README.md for the full walkthrough):
//   1. In Stripe's dashboard: Developers -> Webhooks -> Add endpoint
//      URL: https://<your-domain>/api/webhooks/stripe
//      Events to send: checkout.session.completed,
//                       customer.subscription.updated,
//                       customer.subscription.deleted
//   2. Copy the "Signing secret" Stripe gives you (whsec_...) into Vercel
//      as the STRIPE_WEBHOOK_SECRET environment variable.
//
// Stripe requires the RAW request body to verify the signature, so body
// parsing is disabled below and we read the raw bytes manually.
// -----------------------------------------------------------------------
import Stripe from "stripe";
import { setUserProByCustomerId, attachCustomerAndActivate } from "../../../lib/db";

export const config = {
  api: { bodyParser: false },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method not allowed");
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET env vars");
    return res.status(500).end("Webhook not configured");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const rawBody = await readRawBody(req);
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // client_reference_id was set to our own database user id when
        // the session was created (see create-checkout-session.js) —
        // that's what reliably ties this payment to a real account,
        // rather than trying to match by email (which can change).
        const userId = session.client_reference_id;
        if (userId && session.customer) {
          await attachCustomerAndActivate(Number(userId), session.customer);
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const active = ["active", "trialing"].includes(subscription.status);
        await setUserProByCustomerId(subscription.customer, active);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await setUserProByCustomerId(subscription.customer, false);
        break;
      }
      default:
        // Other event types are ignored — not needed for this app.
        break;
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }
}
