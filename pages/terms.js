import Layout from "../components/Layout";

export default function Terms() {
  return (
    <Layout title="Terms of Service — HustleFinder AI">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">Legal</p>
        <h1 className="font-display mt-3 text-4xl text-paper">Terms of Service</h1>
        <p className="mt-3 text-sm text-paper-faint">Last updated: [add the date you publish this]</p>

        <div className="mt-10 space-y-8 text-sm text-paper-dim">
          <div>
            <h2 className="font-display text-xl text-paper">What this service is</h2>
            <p className="mt-2">
              HustleFinder AI generates personalized side-hustle suggestions based on
              information you provide (age, location, budget, skills, hours available, income
              goal). Suggestions, startup costs, and income ranges are estimates for general
              informational purposes only — not a promise or guarantee of any income, results,
              or business outcome. Your actual results will depend on effort, local market
              conditions, regulations in your area, and factors entirely outside our control.
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
            <h2 className="font-display text-xl text-paper">Accounts</h2>
            <p className="mt-2">
              You're responsible for keeping your password secure and for all activity under
              your account. Provide accurate information when signing up. One account per
              person — don't share your login with others.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Free and Pro plans</h2>
            <p className="mt-2">
              The Free plan provides three hustle matches at no cost, with no account required.
              The Pro plan is a $7.99/month subscription, billed automatically through Stripe
              until canceled. By subscribing, you authorize recurring monthly charges to your
              payment method until you cancel.
            </p>
            <p className="mt-2">
              <strong className="text-paper">Cancellation:</strong> self-serve cancellation from
              this site isn't built yet as of this version. To cancel, contact us at
              hustlefinderai.help@gmail.com and we'll process it manually, or cancel directly
              through Stripe's customer portal if you have access to it.
            </p>
            <p className="mt-2">
              <strong className="text-paper">Refunds:</strong> All charges are final and
              non-refundable. Canceling stops future billing but doesn't refund the current
              billing period. If a jurisdiction's consumer protection law grants you a
              non-waivable refund right regardless of this policy, that law controls.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Acceptable use</h2>
            <p className="mt-2">
              Don't use this site to violate any law, attempt to gain unauthorized access to our
              systems or other users' accounts, or interfere with the site's normal operation.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Termination</h2>
            <p className="mt-2">
              We may suspend or terminate accounts that violate these terms. You may stop using
              the service and request account deletion at any time (see the Privacy Policy for
              how).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Limitation of liability</h2>
            <p className="mt-2">
              This service is provided "as is," without warranties of any kind. To the maximum
              extent permitted by law, we aren't liable for any indirect, incidental, or
              consequential damages arising from your use of this site, including business
              decisions made based on its suggestions.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Changes to these terms</h2>
            <p className="mt-2">
              If these terms change in a meaningful way, we'll update the date at the top of
              this page. Continued use after a change means you accept the revised terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Contact</h2>
            <p className="mt-2">Questions about these terms: hustlefinderai.help@gmail.com.</p>
          </div>
        </div>

        <p className="mt-10 rounded-card border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold">
          This page accurately describes how this application actually works today, including
          its real limitations (no self-serve cancellation yet). It is not a substitute for
          review by a qualified lawyer, especially before accepting real (live-mode) payments —
          a lawyer can help you finalize the refund policy, confirm what's enforceable in your
          jurisdiction, and add anything specific to your situation this page doesn't cover.
        </p>
      </section>
    </Layout>
  );
}
