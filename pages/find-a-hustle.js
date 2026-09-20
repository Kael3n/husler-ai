import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { saveFormData, saveResults } from "../lib/storage";
import { generateHustleMatches } from "../lib/hustleEngine";

const initialForm = {
  age: "",
  location: "",
  budget: "",
  skills: "",
  hoursPerWeek: "",
  mode: "both",
  desiredIncome: "",
};

function Field({ label, hint, htmlFor, children }) {
  return (
    <div className="border-t border-ink-border py-6 first:border-t-0 first:pt-0">
      <div className="grid gap-2 sm:grid-cols-[220px_1fr] sm:gap-8">
        <div>
          <label htmlFor={htmlFor} className="text-sm font-semibold text-paper">
            {label}
          </label>
          {hint && <p className="mt-1 text-xs text-paper-faint">{hint}</p>}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

const inputClasses =
  "w-full rounded-card border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-faint focus:border-cash";

export default function FindAHustle() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.age || !form.location || !form.budget || !form.hoursPerWeek) {
      setError("Fill in age, location, budget, and hours available — the rest helps but isn't required.");
      return;
    }
    setError("");

    // In a future version with accounts, this is also where you'd persist
    // formData to a database keyed by user ID instead of (or in addition
    // to) localStorage. See lib/storage.js for that hand-off point.
    saveFormData(form);

    const results = generateHustleMatches(form);
    saveResults(results);

    router.push("/results");
  }

  return (
    <Layout title="Find a Hustle — HustleFinder AI">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="figures text-sm text-cash">Step 1 of 1</p>
        <h1 className="font-display mt-3 text-3xl text-paper sm:text-4xl">
          A few honest answers get you a real plan.
        </h1>
        <p className="mt-3 text-paper-dim">
          Nothing here is stored anywhere but your own browser right now.
        </p>

        <form onSubmit={handleSubmit} className="mt-10">
          <Field label="Age" htmlFor="age">
            <input
              id="age"
              type="number"
              min="13"
              max="100"
              required
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="e.g. 27"
              className={inputClasses}
            />
          </Field>

          <Field label="City/state or country" htmlFor="location" hint="Used to flag local-only ideas that fit your area.">
            <input
              id="location"
              type="text"
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Austin, TX or Canada"
              className={inputClasses}
            />
          </Field>

          <Field label="Starting budget" htmlFor="budget" hint="How much you could realistically put in on day one.">
            <div className="relative">
              <span className="figures pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paper-faint">$</span>
              <input
                id="budget"
                type="number"
                min="0"
                required
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
                placeholder="200"
                className={`${inputClasses} pl-8`}
              />
            </div>
          </Field>

          <Field label="Skills & interests" htmlFor="skills" hint="A few words is plenty — writing, cars, fitness, design, teaching...">
            <textarea
              id="skills"
              rows={3}
              value={form.skills}
              onChange={(e) => update("skills", e.target.value)}
              placeholder="e.g. good with people, decent photographer, into fitness"
              className={inputClasses}
            />
          </Field>

          <Field label="Hours available per week" htmlFor="hoursPerWeek">
            <input
              id="hoursPerWeek"
              type="number"
              min="1"
              max="80"
              required
              value={form.hoursPerWeek}
              onChange={(e) => update("hoursPerWeek", e.target.value)}
              placeholder="10"
              className={inputClasses}
            />
          </Field>

          <Field label="Online, local, or both">
            <div role="group" aria-label="Work preference" className="flex flex-wrap gap-3">
              {[
                { value: "online", label: "Online only" },
                { value: "local", label: "Local only" },
                { value: "both", label: "Both work" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  aria-pressed={form.mode === opt.value}
                  onClick={() => update("mode", opt.value)}
                  className={`rounded-card border px-4 py-2 text-sm transition-colors ${
                    form.mode === opt.value
                      ? "border-cash bg-cash/10 text-cash"
                      : "border-ink-border text-paper-dim hover:text-paper"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Desired monthly income" htmlFor="desiredIncome" hint="What would feel worth the effort?">
            <div className="relative">
              <span className="figures pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paper-faint">$</span>
              <input
                id="desiredIncome"
                type="number"
                min="0"
                value={form.desiredIncome}
                onChange={(e) => update("desiredIncome", e.target.value)}
                placeholder="500"
                className={`${inputClasses} pl-8`}
              />
            </div>
          </Field>

          {error && (
            <p className="mt-6 rounded-card border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-8 w-full py-4 text-base sm:w-auto">
            Show my hustle matches
          </Button>
        </form>
      </section>
    </Layout>
  );
}
