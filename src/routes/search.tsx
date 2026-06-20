import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageWrap } from "@/components/PageWrap";
import { StatusBadge, RiskBadge } from "@/components/Badges";
import { Stagger, staggerItem, FadeIn } from "@/components/motion-primitives";
import { getDrugs, getRiskScore } from "@/data/mockData";

type SearchParams = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Search medicines — MedCheck" },
      { name: "description", content: "Search NAFDAC-indexed medicines by name, batch, or registration number. Each result shows a computed risk score." },
      { property: "og:title", content: "Search medicines — MedCheck" },
      { property: "og:description", content: "Search NAFDAC-indexed medicines and see risk signals." },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initialQ } = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQ ?? "");
  useEffect(() => { setQ(initialQ ?? ""); }, [initialQ]);

  const drugs = useMemo(() => getDrugs(), []);
  const results = useMemo(() => {
    if (!q.trim()) return drugs;
    const t = q.trim().toLowerCase();
    return drugs.filter((d) =>
      d.name.toLowerCase().includes(t) ||
      d.manufacturer.toLowerCase().includes(t) ||
      d.batchNumber.toLowerCase().includes(t) ||
      (d.nafdacRegNumber ?? "").toLowerCase().includes(t),
    );
  }, [q, drugs]);

  return (
    <PageWrap>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">Search medicines</h1>
          <p className="mt-2 text-muted-foreground">Look up a drug by name, batch, or NAFDAC registration number.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/search", search: { q } }); }}
            className="mt-6 flex gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. Augmentin, AC3N, 04-6433…"
                className="h-13 pl-11 pr-4 rounded-full text-base bg-white border-light/60 focus-visible:ring-mid"
              />
            </div>
            <Button type="submit" variant="gradient" size="lg">Search</Button>
          </form>
        </FadeIn>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"}</p>
        </div>

        <Stagger className="mt-4 grid grid-cols-1 gap-3" stagger={0.05}>
          {results.map((d) => {
            const risk = getRiskScore(d.name);
            return (
              <motion.div key={d.id} variants={staggerItem}>
                <Link
                  to="/drug/$id"
                  params={{ id: d.id }}
                  className="group block card-surface p-5 hover:[box-shadow:var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={d.status} />
                        <RiskBadge count={risk.alertCount} severity={risk.highestSeverity} />
                      </div>
                      <h3 className="mt-2.5 text-lg font-bold text-navy">{d.name}</h3>
                      <p className="text-sm text-muted-foreground">{d.manufacturer}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Batch: <span className="font-semibold text-navy/80">{d.batchNumber}</span></span>
                        {d.nafdacRegNumber && <span>NAFDAC Reg: <span className="font-semibold text-navy/80">{d.nafdacRegNumber}</span></span>}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
          {results.length === 0 && (
            <div className="card-surface p-8 text-center">
              <p className="text-muted-foreground">No medicines match "{q}". Try a different term or check NAFDAC's Green Book.</p>
            </div>
          )}
        </Stagger>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          {/* TODO: replace mock array + risk-score computation with real backend query */}
          Indexed from NAFDAC public alerts. Always cross-check with the official NAFDAC Green Book.
        </p>
      </section>
    </PageWrap>
  );
}
