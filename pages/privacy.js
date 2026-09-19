import Layout from "../components/Layout";

export default function Privacy() {
  return (
    <Layout title="Privacy Policy — HustleFinder AI">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">Legal</p>
        <h1 className="font-display mt-3 text-4xl text-paper">Privacy Policy</h1>
        <p className="mt-3 text-sm text-paper-faint">Last updated: placeholder — set this when you launch.</p>

        <div className="mt-10 space-y-8 text-sm text-paper-dim">
          <div>
            <h2 className="font-display text-xl text-paper">What this demo currently stores</h2>
            <p className="mt-2">
              In this version, the form answers you submit (age, location, budget, skills,
              hours available, work preference, and desired income) and the results generated
              from them are saved only in your browser's local storage. Nothing is sent to a
              server or third party, because this version has no backend or accounts.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">What changes once accounts and payments are added</h2>
            <p className="mt-2">
              When accounts, a database, and Stripe billing are connected (see the code
              comments in lib/storage.js and pages/pricing.js), this policy needs to be
              rewritten to accurately describe: what personal data is collected, how it's
              stored, how long it's retained, whether it's shared with processors (like
              Stripe for payment processing or an AI provider for generating plans), and how
              users can request deletion of their data.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Cookies and analytics</h2>
            <p className="mt-2">
              This demo does not include any analytics or advertising cookies. If you add
              analytics later, disclose exactly what's tracked here before launch.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-paper">Contact</h2>
            <p className="mt-2">
              Replace this section with a real contact method (email or form) before this
              site goes live to real users.
            </p>
          </div>
        </div>

        <p className="mt-10 rounded-card border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold">
          This page is placeholder legal text for a demo project, not a reviewed legal
          document. Have an actual privacy policy drafted (or reviewed) by a lawyer before
          launching to real users, especially once you collect real personal data or payments.
        </p>
      </section>
    </Layout>
  );
}
