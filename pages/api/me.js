// -----------------------------------------------------------------------
// pages/api/me.js
//
// Returns the currently logged-in user's email and REAL, current Pro
// status, read fresh from the database every time. The rest of the app
// (pricing page, results page) calls this instead of trusting anything
// stored in the browser, since only the database (updated by the Stripe
// webhook after an actual payment) is a trustworthy source for "is this
// person actually Pro."
// -----------------------------------------------------------------------
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getUserById } from "../../lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(200).json({ loggedIn: false, isPro: false, email: null });
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    return res.status(200).json({ loggedIn: false, isPro: false, email: null });
  }

  return res.status(200).json({ loggedIn: true, isPro: user.is_pro, email: user.email });
}
