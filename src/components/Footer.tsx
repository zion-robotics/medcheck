import { Link } from "@tanstack/react-router";
import { ShieldCheck, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-light/40 bg-gradient-to-b from-transparent to-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/medcheck-icon.svg" alt="" className="h-10 w-10 rounded-lg" />
              <span className="text-xl font-bold">
                <span className="text-navy">Med</span><span className="text-brand">Check</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Proactive counterfeit-drug intelligence for Nigeria. A community layer on top of
              NAFDAC's official verification tools — never a replacement.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-mid font-medium">
              <ShieldCheck className="h-4 w-4" /> Built to complement NAFDAC, not replace it.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-navy">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/search" className="story-link hover:text-brand">Search</Link></li>
              <li><Link to="/pre-screen" className="story-link hover:text-brand">AI Pre-Screen</Link></li>
              <li><Link to="/alerts" className="story-link hover:text-brand">Alerts Map</Link></li>
              <li><Link to="/report" className="story-link hover:text-brand">Report a Fake</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-navy">Official Sources</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="https://nafdac.gov.ng" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-brand">nafdac.gov.ng <ExternalLink className="h-3 w-3" /></a></li>
              <li><a href="https://greenbook.nafdac.gov.ng" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-brand">NAFDAC Green Book <ExternalLink className="h-3 w-3" /></a></li>
              <li><Link to="/verify" className="hover:text-brand">All NAFDAC Tools</Link></li>
              <li><a href="mailto:hello@medcheck.ng" className="inline-flex items-center gap-1 hover:text-brand"><Mail className="h-3 w-3" /> hello@medcheck.ng</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-light/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MedCheck. Pre-screen tool — not a diagnostic device.</p>
          <p className="text-xs text-muted-foreground">Made with care for safer medicine access in Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
