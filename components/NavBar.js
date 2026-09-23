import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/find-a-hustle", label: "Find a Hustle" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="figures text-cash text-lg">$</span>
          <span className="font-display text-lg text-paper">
            HustleFinder <span className="text-cash">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                router.pathname === link.href
                  ? "text-paper"
                  : "text-paper-dim hover:text-paper"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {status === "authenticated" ? (
            <>
              <span className="text-sm text-paper-dim">{session.user.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-paper-dim hover:text-paper"
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-paper-dim hover:text-paper">
              Log in
            </Link>
          )}
          <Link
            href="/find-a-hustle"
            className="rounded-card bg-cash px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cash-bright"
          >
            Find My Hustle
          </Link>
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`h-0.5 w-6 bg-paper transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-paper transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-paper transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-border bg-ink px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-base text-paper-dim hover:text-paper"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/find-a-hustle"
                className="mt-2 block rounded-card bg-cash px-4 py-3 text-center text-sm font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                Find My Hustle
              </Link>
            </li>
            <li className="border-t border-ink-border pt-4">
              {status === "authenticated" ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-base text-paper-dim hover:text-paper"
                >
                  Log out ({session.user.email})
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block text-base text-paper-dim hover:text-paper"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
