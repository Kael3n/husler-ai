import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/pricing");
  }

  return (
    <Layout title="Log in — HustleFinder AI">
      <section className="mx-auto max-w-md px-5 py-16 sm:py-20">
        <h1 className="font-display text-3xl text-paper">Log in</h1>

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-card border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-faint focus:border-cash"
              placeholder="Your password"
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
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-paper-dim">
          Don't have an account?{" "}
          <a href="/signup" className="font-semibold text-cash hover:text-cash-bright">
            Sign up
          </a>
        </p>
      </section>
    </Layout>
  );
}
