import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Account created — log them in immediately rather than making
      // them re-type their password on a separate login page.
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but automatic login failed — try logging in.");
        setLoading(false);
        return;
      }

      router.push("/pricing");
    } catch {
      setError("Unable to reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Layout title="Sign up — HustleFinder AI">
      <section className="mx-auto max-w-md px-5 py-16 sm:py-20">
        <h1 className="font-display text-3xl text-paper">Create an account</h1>
        <p className="mt-2 text-sm text-paper-dim">
          Needed only for Pro, so a real payment can be tied to you specifically.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-paper">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-card border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-faint focus:border-cash"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-paper">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-card border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-faint focus:border-cash"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <p className="rounded-card border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-card bg-cash px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cash-bright disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-paper-dim">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-cash hover:text-cash-bright">
            Log in
          </a>
        </p>
      </section>
    </Layout>
  );
}
