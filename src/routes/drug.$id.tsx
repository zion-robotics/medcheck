import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Package, Hash, Building2, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageWrap } from "@/components/PageWrap";
import { StatusBadge, RiskBadge, SeverityPill } from "@/components/Badges";
import { FadeIn } from "@/components/motion-primitives";
import { getDrugById, getRiskScore, getAlertsForDrug, getCrowdReportsForDrug } from "@/data/mockData";
import { formatDistanceToNow, format } from "date-fns";

export const Route = createFileRoute("/drug/$id")({
  loader: ({ params }) => {
    // TODO: replace with backend query
    const drug = getDrugById(params.id);
    if (!drug) throw notFound();
    return { drug };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.drug.name ?? "Drug"} — MedCheck` },
      { name: "description", content: loaderData?.drug.description.slice(0, 155) ?? "Drug detail on MedCheck." },
      { property: "og:title", content: `${loaderData?.drug.name ?? "Drug"} — MedCheck` },
      { property: "og:description", content: loaderData?.drug.description.slice(0, 155) ?? "" },
    ],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => (
    <PageWrap><div className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-2xl font-bold text-navy">Drug not found</h1><Link to="/search"><Button variant="gradient" className="mt-6">Back to search</Button></Link></div></PageWrap>
  ),
  component: DrugDetailPage,
});

function DrugDetailPage() {
  const { drug } = Route.useLoaderData();
  const risk = getRiskScore(drug.name, 12);
  const alerts = getAlertsForDrug(drug.name);
  const crowd = getCrowdReportsForDrug(drug.name);

  // Build a simple sparkline: alerts grouped by month over last 12 months
  const months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (11 - i)); d.setDate(1);
    return { label: format(d, "MMM"), key: format(d, "yyyy-MM"), count: 0 };
  });
  alerts.forEach((a) => {
    const k = format(new Date(a.createdAt), "yyyy-MM");
    const m = months.find((x) => x.key === k);
    if (m) m.count += 1;
  });
  const max = Math.max(1, ...months.map((m) => m.count));

  return (
    <PageWrap>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/search" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>

        <FadeIn>
          <div className="mt-4 card-surface p-6 sm:p-8">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={drug.status} />
              <RiskBadge count={risk.alertCount} severity={risk.highestSeverity} />
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-navy">{drug.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{drug.manufacturer}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <Field icon={Hash} label="Batch" value={drug.batchNumber} />
              <Field icon={ShieldCheck} label="NAFDAC Reg" value={drug.nafdacRegNumber ?? "Not registered"} alert={!drug.nafdacRegNumber} />
              <Field icon={Building2} label="Status" value={drug.status === "verified" ? "Verified reference" : drug.status === "flagged" ? "Counterfeit flagged" : "Unknown"} />
            </div>

            <p className="mt-6 text-sm text-navy/85 leading-relaxed">{drug.description}</p>
          </div>
        </FadeIn>

        {/* Risk Score visualization */}
        <FadeIn delay={0.1}>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="card-surface p-6 lg:col-span-2">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Risk score</p>
                  <h2 className="mt-1 text-xl font-extrabold text-navy">Alert frequency · last 12 months</h2>
                </div>
                <RiskBadge count={risk.alertCount} severity={risk.highestSeverity} />
              </div>
              <div className="mt-6 flex items-end gap-1.5 h-32">
                {months.map((m, i) => (
                  <motion.div key={m.key} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }} whileInView={{ height: `${(m.count / max) * 100}%` }} viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" }}
                      className={`w-full rounded-t-md ${m.count > 0 ? "bg-gradient-to-t from-brand to-mid" : "bg-light/50"}`}
                      style={{ minHeight: m.count > 0 ? "8%" : "2%" }}
                    />
                    <span className="text-[10px] text-muted-foreground">{m.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="card-surface p-6">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Summary</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Alerts (12mo)</span><span className="font-bold text-navy">{risk.alertCount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Crowd reports</span><span className="font-bold text-navy">{crowd.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Highest severity</span><span className="font-bold text-navy uppercase">{risk.highestSeverity ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Most recent</span><span className="font-semibold text-navy">{risk.mostRecentAlert ? formatDistanceToNow(new Date(risk.mostRecentAlert.createdAt), { addSuffix: true }) : "—"}</span></div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Related alerts */}
        {alerts.length > 0 && (
          <FadeIn delay={0.15}>
            <h2 className="mt-10 text-xl font-extrabold text-navy">Related NAFDAC alerts</h2>
            <div className="mt-3 space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="card-surface p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <SeverityPill severity={a.severity} />
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
                  </div>
                  <h3 className="mt-2 font-bold text-navy">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-mid font-semibold"><MapPin className="h-3.5 w-3.5" /> {a.state}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {crowd.length > 0 && (
          <FadeIn delay={0.2}>
            <h2 className="mt-10 text-xl font-extrabold text-navy">Community reports</h2>
            <div className="mt-3 space-y-3">
              {crowd.map((c) => (
                <div key={c.id} className="card-surface p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-semibold text-mid">{c.reporter}</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="mt-2 text-sm text-navy/85">{c.description}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-mid font-semibold"><MapPin className="h-3.5 w-3.5" /> {c.state}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.25}>
          <div className="mt-10 card-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-navy">Want an official confirmation?</h3>
              <p className="text-sm text-muted-foreground">Cross-check this drug with NAFDAC's Green Book.</p>
            </div>
            <a href="https://greenbook.nafdac.gov.ng" target="_blank" rel="noreferrer">
              <Button variant="gradient">Verify with NAFDAC <ExternalLink className="h-4 w-4" /></Button>
            </a>
          </div>
        </FadeIn>
      </section>
    </PageWrap>
  );
}

function Field({ icon: Icon, label, value, alert }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; alert?: boolean }) {
  return (
    <div className="rounded-xl bg-light/15 border border-light/40 px-4 py-3">
      <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-mid"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <p className={`mt-0.5 text-sm font-semibold ${alert ? "text-alert" : "text-navy"} break-words`}>{value}</p>
    </div>
  );
}
