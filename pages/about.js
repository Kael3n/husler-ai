import Layout from "../components/Layout";
import Button from "../components/Button";

export default function About() {
  return (
    <Layout title="About — HustleFinder AI">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">About</p>
        <h1 className="font-display mt-3 text-4xl text-paper">
          Most side-hustle advice ignores your actual constraints.
        </h1>
        <div className="mt-8 space-y-5 text-paper-dim">
          <p>
            Search "side hustle ideas" and you get the same 30 generic listicles, none of which
            ask what you have to work with. A $20,000 dropshipping plan is useless to someone
            with $200 and 6 hours a week. A local pressure-washing route is useless to someone
            who wants to work from bed in another country.
          </p>
          <p>
            HustleFinder AI starts from your situation instead: your budget, your schedule,
            your skills, your location, and what you'd actually consider worth doing. From
            there it matches you against a real, researched set of hustles across seven
            categories — local services, reselling, content creation, freelancing, digital
            products, small businesses, and online services — and explains exactly why each one
            made the list.
          </p>
          <p>
            The plan for each match isn't a vague "just start a business" — it's the actual
            first steps, what to buy or sign up for, and the specific mistakes that trip up
            most beginners in that hustle.
          </p>
          <p>
            This is an early, working version. The matching engine currently runs entirely on
            a hand-built dataset in the browser; the roadmap includes deeper AI-personalized
            plans, accounts, and real payments (see the code comments throughout the project
            for exactly where those connect).
          </p>
        </div>
        <div className="mt-10">
          <Button href="/find-a-hustle">Find your hustle</Button>
        </div>
      </section>
    </Layout>
  );
}
