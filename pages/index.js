import Layout from "../components/Layout";
import Button from "../components/Button";
import Link from "next/link";

const CATEGORIES = [
  { name: "Local services", example: "Pressure washing, pet sitting, detailing" },
  { name: "Reselling", example: "Retail arbitrage, thrift flipping, sneakers" },
  { name: "Content creation", example: "Faceless YouTube, UGC, newsletters" },
  { name: "Freelancing", example: "Writing, VA work, social media, bookkeeping" },
  { name: "Digital products", example: "Templates, printables, mini courses" },
  { name: "Small businesses", example: "Vending routes, coffee carts, handmade goods" },
  { name: "Online services", example: "Tutoring, web builds, transcription, support" },
];

const STEPS = [
  {
    n: "01",
    title: "Tell us your starting point",
    body: "Age, location, budget, hours available, and what you're actually good at — no fluff, just the inputs that matter.",
  },
  {
    n: "02",
    title: "Get matched, not googled",
    body: "We score real hustles against your exact answers instead of handing you a generic top-10 blog list.",
  },
  {
    n: "03",
    title: "Follow the plan",
    body: "Every match comes with startup steps, what to buy, and the mistakes that trip up most beginners.",
  },
];

export default function Home() {
  return (
    <Layout title="HustleFinder AI — Find a side hustle that fits you">
      {/* Hero */}
      <section className="ledger-rule border-b border-ink-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="rise-in">
            <p className="figures text-sm text-cash">Free to start · 3 matches, no signup</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.1] text-paper sm:text-5xl md:text-6xl">
              Find a side hustle that actually fits you.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-paper-dim">
              Tell us what you have, what you're good at, and how much you want to make.
              We'll build your personalized game plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/find-a-hustle" className="px-7 py-4 text-base">
                Find My Hustle
              </Button>
              <Button href="/pricing" variant="outline" className="px-7 py-4 text-base">
                See pricing
              </Button>
            </div>
          </div>

          <div className="rise-in flex items-center" style={{ animationDelay: "120ms" }}>
            <div className="w-full rounded-card border border-ink-border bg-ink-panel p-6">
              <p className="text-xs text-paper-faint">Sample match</p>
              <p className="font-display mt-1 text-xl text-paper">Mobile Car Detailing</p>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-border pt-5 text-sm">
                <div>
                  <p className="text-[11px] text-paper-faint">Startup cost</p>
                  <p className="figures text-paper">$200 – $900</p>
                </div>
                <div>
                  <p className="text-[11px] text-paper-faint">Time needed</p>
                  <p className="figures text-paper">6+ hrs/wk</p>
                </div>
                <div>
                  <p className="text-[11px] text-paper-faint">Difficulty</p>
                  <p className="figures text-paper">Beginner</p>
                </div>
                <div>
                  <p className="text-[11px] text-paper-faint">Income range</p>
                  <p className="figures text-cash">$500 – $3,500/mo</p>
                </div>
              </div>
              <p className="mt-5 border-t border-ink-border pt-5 text-sm text-paper-dim">
                "Fits your $400 budget and 8 hrs/week — matches your interest in cars and
                cleaning, and it's fully local."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-ink-border">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl text-paper">How it works</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="border-t border-ink-border pt-5">
                <span className="figures text-sm text-cash">{step.n}</span>
                <h3 className="font-display mt-3 text-xl text-paper">{step.title}</h3>
                <p className="mt-2 text-sm text-paper-dim">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-ink-border">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-paper">Every category, covered</h2>
            <Link href="/find-a-hustle" className="text-sm font-semibold text-cash hover:text-cash-bright">
              Get matched across all of them
            </Link>
          </div>
          <div className="mt-8 divide-y divide-ink-border border-y border-ink-border">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col justify-between gap-1 py-5 sm:flex-row sm:items-center"
              >
                <p className="font-display text-lg text-paper">{cat.name}</p>
                <p className="text-sm text-paper-dim">{cat.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <h2 className="font-display text-3xl text-paper sm:text-4xl">
            Your first 3 matches are free.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-paper-dim">
            No account required. Answer a few questions and see what fits before you decide
            on anything.
          </p>
          <div className="mt-8">
            <Button href="/find-a-hustle" className="px-8 py-4 text-base">
              Find My Hustle
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
