import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-border">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="figures text-cash">$</span>
              <span className="font-display text-base text-paper">
                HustleFinder <span className="text-cash">AI</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-paper-dim">
              A personalized starting point for making extra money — not a promise, not
              financial advice, just a realistic plan based on what you actually have to work with.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold text-paper">Product</p>
              <ul className="space-y-2 text-paper-dim">
                <li><Link href="/find-a-hustle" className="hover:text-paper">Find a Hustle</Link></li>
                <li><Link href="/pricing" className="hover:text-paper">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-paper">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-paper">Company</p>
              <ul className="space-y-2 text-paper-dim">
                <li><Link href="/about" className="hover:text-paper">About</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-paper">Legal</p>
              <ul className="space-y-2 text-paper-dim">
                <li><Link href="/privacy" className="hover:text-paper">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-paper">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink-border pt-6 text-xs text-paper-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HustleFinder AI. All rights reserved.</p>
          <p>Built as a demo — payments and accounts are not yet connected.</p>
        </div>
      </div>
    </footer>
  );
}
