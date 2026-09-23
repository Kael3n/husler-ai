import Layout from "../components/Layout";

export default function Privacy() {
  return (
    <Layout title="Privacy Policy — HustleFinder AI">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">Legal</p>
        <h1 className="font-display mt-3 text-4xl text-paper">Privacy Policy</h1>
        <p className="mt-3 text-sm text-paper-faint">Last updated: [add the date you publish this]</p>

        <div className="mt-10 space-y-8 text-sm text-paper-dim">
          <div>
            <h2 className="font-display text-xl text-paper">What we collect</h2>
            <p className="mt-2">If you create an account, we collect your email address and a password.</p>
            <p className="mt-2">
              Your password is never stored in plain text — it's run through a one-way hashing
              algorithm (bcrypt) before it touches our database, so even we can't see or recover
              your actual password.
            </p>
            <p className="mt-2">
              If you subscribe to Pro, Stripe (our payment processor) handles your card details
              directly — we never see, receive, or store your card number. We only receive a
              Stripe customer ID and your subscription's active/inactive status, so we know
              whether to unlock Pro features on your account.
            </p>
            <p className="mt-2">
              The hustle-matching form (age, location, budget, skills, hours, income goal) and
              your generated results are stored only in your own browser's local storage, not on
              our servers. If you clear your browser data or switch devices, those answers are
              gone and you'd need to fill out the form again — this is a deliberate design choice
              to let the free tier work without an account.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">How we use it</h2>
            <ul className="mt-2 space-y-1.5">
              <li>• To create and authenticate your account (log you in, keep you logged in)</li>
              <li>• To know whether your account has an active Pro subscription</li>
              <li>• To process your payment (handled by Stripe, not by us directly)</li>
            </ul>
            <p className="mt-2">
              We do not use your email for marketing, we do not sell or share your data with
              advertisers, and we don't run any analytics or tracking scripts on this site.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Who we share it with</h2>
            <p className="mt-2">Three service providers process data on our behalf, only as needed to run the site:</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                • <strong className="text-paper">Stripe</strong> — processes payments and subscription billing.
                Stripe's own privacy policy governs the card and billing details they handle directly.
              </li>
              <li>
                • <strong className="text-paper">Vercel</strong> — hosts the website and its server functions.
              </li>
              <li>
                • <strong className="text-paper">Neon</strong> — hosts the Postgres database where account
                records (email, hashed password, Pro status) are stored.
              </li>
            </ul>
            <p className="mt-2">We don't sell your data to anyone, for any reason.</p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Cookies</h2>
            <p className="mt-2">
              We use one functional cookie to keep you logged in (set by our authentication
              system, NextAuth). It's not used for tracking or advertising, and there are no
              third-party ad or analytics cookies on this site.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Data retention and deletion</h2>
            <p className="mt-2">
              We keep your account information for as long as your account exists. To request
              deletion of your account and associated data, contact us at hustlefinderai.help@gmail.com. Note that Stripe retains its own transaction records
              independently, as required for their own legal and accounting obligations.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Security</h2>
            <p className="mt-2">
              Passwords are hashed with bcrypt before storage. All traffic to this site is
              encrypted (HTTPS). No online service can guarantee absolute security, but we don't
              store anything we don't need, and we never handle raw payment card details
              ourselves.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Children's privacy</h2>
            <p className="mt-2">
              This site is not directed at children, and account creation isn't intended for
              anyone under 18. If you believe a child has created an account, contact us and
              we'll remove it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Changes to this policy</h2>
            <p className="mt-2">
              If this policy changes in a meaningful way, we'll update the date at the top of
              this page.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Contact</h2>
            <p className="mt-2">
              Questions about this policy or your data: hustlefinderai.help@gmail.com.
            </p>
          </div>
        </div>

        <p className="mt-10 rounded-card border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold">
          This page accurately describes what this application actually does with data today.
          It is not a substitute for review by a qualified lawyer, especially before accepting
          real (live-mode) payments or operating in jurisdictions with specific requirements
          (e.g. GDPR in the EU/UK, CCPA in California) — those may require additional
          disclosures or user rights this page doesn't yet cover.
        </p>
      </section>
    </Layout>
  );
}
