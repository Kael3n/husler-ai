import Link from "next/link";

const VARIANTS = {
  primary: "bg-cash text-ink hover:bg-cash-bright",
  gold: "bg-gold text-ink hover:bg-gold-bright",
  outline: "border border-paper/30 text-paper hover:border-cash hover:text-cash",
  ghost: "text-paper-dim hover:text-paper",
};

export default function Button({
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-card px-5 py-3 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const classes = `${base} ${VARIANTS[variant] || VARIANTS.primary} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {children}
    </button>
  );
}
