// -----------------------------------------------------------------------
// pages/api/verify-session.js
//
// After Stripe redirects the browser back to /pricing?session_id=..., the
// front end calls this route to confirm — using the Secret Key, server-side
// — that the session actually shows a completed, paid subscription. This
// matters because the URL itself is not trustworthy on its own: without
// this check, anyone could type ?success=true into the address bar and
// "unlock" Pro without paying.
//
// >>> KNOWN LIMITATION (see README) <<<
// This still only flips a localStorage flag in the browser that requested
// it, exactly like the old demo toggle did — there's no database or user
// account yet tying that payment to a person across devices/browsers.
// A real production version needs a webhook (Stripe -> your server) plus
// accounts + a database so Pro status is reliable even if, say, the
// person clears their browser data or opens the site on a new device.
// -----------------------------------------------------------------------
import Stripe from "stripe";

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ paid: false, error: "Missing session_id" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY env var");
    return res.status(500).json({ paid: false, error: "Payments aren't configured yet." });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid" || session.status === "complete";
    return res.status(200).json({ paid });
  } catch (err) {
    console.error("Stripe session verify error:", err);
    return res.status(500).json({ paid: false, error: "Unable to verify session." });
  }
}
