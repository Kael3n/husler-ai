// -----------------------------------------------------------------------
// pages/api/auth/[...nextauth].js
//
// NextAuth handles login sessions (who is currently signed in) via a
// secure, httpOnly cookie holding a signed JWT. It does NOT store whether
// someone is Pro — that's looked up fresh from the database on every
// request that needs it (see pages/api/me.js), so a Stripe webhook
// updating the database is immediately reflected without needing to
// force everyone to log out and back in.
//
// Needs one more environment variable in Vercel:
//   NEXTAUTH_SECRET   any long random string (used to sign session tokens)
// You can generate one with: openssl rand -base64 32
// -----------------------------------------------------------------------
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../../../lib/db";

export const authOptions = {
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email);
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.userId;
      return session;
    },
  },
};

export default NextAuth(authOptions);
