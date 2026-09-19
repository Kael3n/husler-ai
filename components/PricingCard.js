import Button from "./Button";

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  onClick,
  highlighted = false,
}) {
  return (
    <div
      className={`flex flex-col rounded-card border p-8 ${
        highlighted ? "border-gold bg-ink-panel2" : "border-ink-border bg-ink-panel"
      }`}
    >
      {highlighted && (
        <span className="mb-4 inline-block w-fit rounded-card bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
          Most popular
        </span>
      )}
      <h3 className="font-display text-2xl text-paper">{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="figures text-4xl text-paper">{price}</span>
        {period && <span className="text-sm text-paper-dim">/{period}</span>}
      </div>
      <p className="mt-3 text-sm text-paper-dim">{description}</p>

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-paper-dim">
            <span className={highlighted ? "text-gold" : "text-cash"}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        href={href}
        onClick={onClick}
        variant={highlighted ? "gold" : "outline"}
        className="mt-8 w-full"
      >
        {cta}
      </Button>
    </div>
  );
}
