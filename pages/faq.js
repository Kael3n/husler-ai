import Layout from "../components/Layout";

const FAQS = [
  {
    q: "Is this actual financial or business advice?",
    a: "No. HustleFinder AI gives general, educational starting points based on the information you provide. It isn't personalized financial, legal, or tax advice, and results (income ranges especially) are estimates, not guarantees.",
  },
  {
    q: "How are matches generated?",
    a: "Your answers (budget, hours, skills, location type, income goal) are scored against a dataset of researched hustles. Each match's score depends on how well the budget, time, skills, and mode line up with your specific answers — that's also why two people get different results.",
  },
  {
    q: "Do I need to create an account?",
    a: "Not yet. Your answers and results are saved only in your own browser's local storage. If you clear your browser data or switch devices, they won't carry over. Accounts are on the roadmap.",
  },
  {
    q: "What's included in the free plan?",
    a: "Three full hustle matches with startup cost, difficulty, time required, income range, why it matched, and a full step-by-step plan — no card required.",
  },
  {
    q: "What does Pro add?",
    a: "Unlimited matches, plus a profit calculator, personalized 30-day action plans, AI-generated business name ideas, and marketing/content angles for your matched hustle.",
  },
  {
    q: "Is payment set up yet?",
    a: "Not in this version. The Pro button on the pricing page simulates the upgrade locally so you can preview the experience — no charge happens. Real billing will run through Stripe.",
  },
  {
    q: "Can I redo the form with different answers?",
    a: "Yes, anytime — the \"Find a Hustle\" page can be filled out again and will replace your saved answers and results.",
  },
];

export default function FAQ() {
  return (
    <Layout title="FAQ — HustleFinder AI">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">FAQ</p>
        <h1 className="font-display mt-3 text-4xl text-paper">Questions, answered plainly.</h1>

        <div className="mt-10 divide-y divide-ink-border border-y border-ink-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-paper">
                <span className="font-display text-lg">{item.q}</span>
                <span className="figures shrink-0 text-cash transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-paper-dim">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </Layout>
  );
}
