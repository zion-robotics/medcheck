import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { PageWrap } from "@/components/PageWrap";
import { FadeIn } from "@/components/motion-primitives";
import { SeverityPill } from "@/components/Badges";
import { getAlerts, getAvailableStates } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

const MapView = lazy(() => import("@/components/AlertsMap"));

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Live Alerts Map — MedCheck" },
      { name: "description", content: "Live map of NAFDAC counterfeit-drug alerts and community reports across Nigeria." },
      { property: "og:title", content: "Live Alerts Map — MedCheck" },
      { property: "og:description", content: "Counterfeit drug alerts mapped across Nigerian states." },
      { property: "og:url", content: "/alerts" },
    ],
    links: [{ rel: "canonical", href: "/alerts" }],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const allAlerts = useMemo(() => getAlerts(), []);
  const states = useMemo(() => ["All", ...getAvailableStates()], []);
  const [filter, setFilter] = useState("All");
  const alerts = useMemo(
    () => (filter === "All" ? allAlerts : allAlerts.filter((a) => a.state === filter)),
    [filter, allAlerts],
  );

  return (
    <PageWrap>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Live alerts</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">Counterfeit alerts across Nigeria</h1>
          <p className="mt-2 text-muted-foreground">Tap a marker to see the alert. Clusters expand as you zoom.</p>
        </FadeIn>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card-surface overflow-hidden h-[420px] sm:h-[560px] relative">
            {mounted ? (
              <Suspense fallback={<MapLoading />}>
                <MapView alerts={alerts} />
              </Suspense>
            ) : <MapLoading />}
          </div>

          <div className="card-surface p-5 max-h-[560px] flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-navy">{alerts.length} alerts</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm rounded-full border border-light bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-mid"
              >
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-4 flex-1 overflow-auto space-y-2.5 pr-1">
              <AnimatePresence mode="popLayout">
                {alerts.map((a, i) => (
                  <motion.div
                    key={a.id} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: Math.min(i, 8) * 0.04 }}
                    className="rounded-xl border border-border bg-white p-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <SeverityPill severity={a.severity} />
                      <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-navy line-clamp-2">{a.title}</p>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-mid font-semibold"><MapPin className="h-3 w-3" /> {a.state}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts in {filter}.</p>}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          {/* TODO: replace mock report array with real backend query */}
          State-level granularity matches what NAFDAC alerts publish. Coordinates are state centroids.
        </p>
      </section>
    </PageWrap>
  );
}

function MapLoading() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-light/20">
      <div className="text-center">
        <Loader2 className="h-7 w-7 text-brand animate-spin mx-auto" />
        <p className="mt-3 text-sm font-medium text-navy/80">Loading map…</p>
      </div>
    </div>
  );
}
