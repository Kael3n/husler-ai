import Layout from "../components/Layout";

export default function Terms() {
  return (
    <Layout title="Terms of Service — HustleFinder AI">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">Legal</p>
        <h1 className="font-display mt-3 text-4xl text-paper">Terms of Service</h1>
        <p className="mt-3 text-sm text-paper-faint">Last updated: placeholder — set this when you launch.</p>

        <div className="mt-10 space-y-8 text-sm text-paper-dim">
          <div>
            <h2 className="font-display text-xl text-paper">No guaranteed income</h2>
            <p className="mt-2">
              Hustle ideas, income ranges, startup costs, and plans shown on this site are
              estimates for general informational purposes only. They are not a promise or
              guarantee of any income, results, or business outcome. Your results will depend
              on effort, market conditions, local regulations, and factors outside this site's
              control.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Not professional advice</h2>
            <p className="mt-2">
              Nothing on this site constitutes financial, legal, tax, or business advice.
              Consult a qualified professional before making financial decisions, forming a
              business entity, or relying on any figures shown here.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Your local answers</h2>
            <p className="mt-2">
              In this demo version, the answers you submit are stored only in your browser and
              are not verified or reviewed by anyone. Don't submit information you consider
              sensitive.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Free and Pro plans</h2>
            <p className="mt-2">
              The Free plan provides a limited number of matches at no cost. The Pro plan, once
              billing is connected, will be a paid monthly subscription. Payment processing is
              not active in this version — the "Upgrade to Pro" action on the Pricing page
              only simulates the upgrade locally and does not charge any payment method.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Changes to these terms</h2>
            <p className="mt-2">
              These terms may be updated as real accounts, payments, and AI-generated content
              are added. Continued use after an update means you accept the revised terms.
            </p>
          </div>
        </div>

        <p className="mt-10 rounded-card border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold">
          This page is placeholder legal text for a demo project, not a reviewed legal
          document. Have real terms drafted (or reviewed) by a lawyer before accepting real
          payments or user data.
        </p>
      </section>
    </Layout>
  );
}
