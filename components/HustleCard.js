import { useState } from "react";
import Button from "./Button";

function StatBlock({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-paper-faint">{label}</p>
      <p className="figures text-sm text-paper">{value}</p>
    </div>
  );
}

export default function HustleCard({ hustle, index, locked = false }) {
  const [expanded, setExpanded] = useState(false);

  if (locked) {
    return (
      <div className="relative overflow-hidden rounded-card border border-ink-border bg-ink-panel">
        <div className="pointer-events-none select-none p-6 opacity-30 blur-[2px]">
          <p className="font-display text-xl text-paper">Hustle #{index + 1}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBlock label="Startup cost" value="$—" />
            <StatBlock label="Difficulty" value="—" />
            <StatBlock label="Time" value="—" />
            <StatBlock label="Income range" value="$— – $—" />
          </div>
          <p className="mt-4 text-sm text-paper-dim">
            Upgrade to see the name, full plan, and why this one fits you.
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/70 p-6 text-center">
          <span className="figures text-xs uppercase tracking-wide text-gold">Locked</span>
          <p className="max-w-xs text-sm text-paper-dim">
            You've used your 3 free hustle ideas. Unlock the rest with Pro.
          </p>
          <Button href="/pricing" variant="gold">
            Unlock with Pro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-ink-border bg-ink-panel">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-border p-6">
        <div>
          <p className="figures text-xs text-cash">
            {String(index + 1).padStart(2, "0")} / {hustle.category}
          </p>
          <h3 className="font-display mt-1 text-2xl text-paper">{hustle.name}</h3>
          <p className="mt-2 max-w-xl text-sm text-paper-dim">{hustle.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-ink-border p-6 sm:grid-cols-4">
        <StatBlock
          label="Startup cost"
          value={hustle.minBudget === 0 ? `$0 – $${hustle.maxBudget}` : `$${hustle.minBudget} – $${hustle.maxBudget}`}
        />
        <StatBlock label="Difficulty" value={hustle.difficulty} />
        <StatBlock label="Time needed" value={`${hustle.hoursMin}+ hrs/wk`} />
        <StatBlock
          label="Income range"
          value={`$${hustle.incomeMin} – $${hustle.incomeMax}/mo`}
        />
      </div>

      <div className="p-6">
        <p className="text-sm text-paper-dim">
          <span className="font-semibold text-paper">Why this fits you: </span>
          {hustle.whyItMatches}
        </p>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-5 text-sm font-semibold text-cash hover:text-cash-bright"
        >
          {expanded ? "Hide the step-by-step plan" : "View the step-by-step plan"}
        </button>

        {expanded && (
          <div className="mt-5 grid gap-6 border-t border-ink-border pt-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-paper">Getting started</p>
              <ol className="space-y-2 text-sm text-paper-dim">
                {hustle.steps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="figures text-cash">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-paper">What you'll need</p>
                <ul className="space-y-1.5 text-sm text-paper-dim">
                  {hustle.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cash">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-paper">Common mistakes to avoid</p>
                <ul className="space-y-1.5 text-sm text-paper-dim">
                  {hustle.mistakes.map((m, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gold">·</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
