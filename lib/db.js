// -----------------------------------------------------------------------
// lib/db.js
//
// Thin data-access layer over a Postgres database, using Neon's official
// serverless driver (the current recommended way to connect to a
// database provisioned through Vercel's Storage tab). This is the ONLY
// file that talks to the database directly — everything else (API
// routes) goes through these functions.
//
// The `users` table is the source of truth for who has a real account
// and whether they're actually Pro (set by the Stripe webhook after a
// real payment, not by anything the browser can claim on its own).
//
// SETUP: expects a Postgres database connected via Vercel's Storage tab,
// which automatically provides a DATABASE_URL environment variable. See
// README.md for the exact steps.
// -----------------------------------------------------------------------
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// Safe to call repeatedly — CREATE TABLE IF NOT EXISTS is a no-op if the
// table already exists. Called lazily from API routes rather than run as
// a separate migration step, to keep setup simple for a small project.
export async function ensureUsersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_pro BOOLEAN NOT NULL DEFAULT FALSE,
      stripe_customer_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function getUserByEmail(email) {
  await ensureUsersTable();
  const rows = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1;`;
  return rows[0] || null;
}

export async function getUserById(id) {
  await ensureUsersTable();
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1;`;
  return rows[0] || null;
}

export async function createUser(email, passwordHash) {
  await ensureUsersTable();
  const rows = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email.toLowerCase()}, ${passwordHash})
    RETURNING *;
  `;
  return rows[0];
}

export async function setUserProByCustomerId(stripeCustomerId, isPro) {
  await ensureUsersTable();
  await sql`
    UPDATE users SET is_pro = ${isPro} WHERE stripe_customer_id = ${stripeCustomerId};
  `;
}

export async function attachStripeCustomerId(userId, stripeCustomerId) {
  await ensureUsersTable();
  await sql`
    UPDATE users SET stripe_customer_id = ${stripeCustomerId} WHERE id = ${userId};
  `;
}

// Called from the webhook on checkout.session.completed: ties this
// account to the Stripe customer that was just created/used, and marks
// them Pro, in one step.
export async function attachCustomerAndActivate(userId, stripeCustomerId) {
  await ensureUsersTable();
  await sql`
    UPDATE users
    SET stripe_customer_id = ${stripeCustomerId}, is_pro = TRUE
    WHERE id = ${userId};
  `;
}

export async function setUserProById(userId, isPro) {
  await ensureUsersTable();
  await sql`UPDATE users SET is_pro = ${isPro} WHERE id = ${userId};`;
}
