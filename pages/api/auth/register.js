// -----------------------------------------------------------------------
// pages/api/auth/register.js
//
// Creates a new account: hashes the password (never stores it in plain
// text) and inserts a row into the users table. Login itself happens
// through NextAuth's credentials provider (see [...nextauth].js), not
// this route — this route only handles sign-up.
// -----------------------------------------------------------------------
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(email, passwordHash);

    return res.status(200).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Unable to create account. Please try again." });
  }
}
