import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Search, Camera, ScanLine, Database, Sparkles, ShieldCheck, ArrowRight, ExternalLink, MapPin, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeroIllustration } from "@/components/HeroIllustration";
import { CountUp, FadeIn, RevealWords, Stagger, staggerItem } from "@/components/motion-primitives";
import { PageWrap } from "@/components/PageWrap";
import { StatusBadge, SeverityPill } from "@/components/Badges";
import { stats, getNearbyAlerts, DEFAULT_DEMO_STATE, getLatestAlerts } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedCheck — Know if your medicine is real before you take it" },
      { name: "description", content: "MedCheck turns Nigeria's scattered NAFDAC counterfeit-drug alerts into proactive risk intelligence. Search, pre-screen, and see live alerts near you." },
      { property: "og:title", content: "MedCheck — Counterfeit Drug Intelligence for Nigeria" },
      { property: "og:description", content: "AI pre-screening, live alerts map, NAFDAC verification — all in one place." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const HOW_STEPS = [
  { icon: Search, title: "Search or Scan", desc: "Look up a drug name, batch, or NAFDAC reg number — or snap a photo of the packaging." },
  { icon: Sparkles, title: "AI Pre-Screen", desc: "Our model flags obvious packaging anomalies before you even buy." },
  { icon: Database, title: "Cross-Reference", desc: "We check NAFDAC alerts and community reports for matching risk signals." },
  { icon: ShieldCheck, title: "Clear Result", desc: "A plain-language verdict — with a link to official NAFDAC verification." },
];

function HowStep({
  index,
  icon: Icon,
  title,
  desc,
  activeIndex,
  onEnter,
}: {
  index: number;
  icon: typeof Search;
  title: string;
  desc: string;
  activeIndex: number;
  onEnter: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.55, margin: "-20% 0px -30% 0px" });
  useEffect(() => {
    if (inView) onEnter(index);
  }, [inView, index, onEnter]);

  const reached = index <= activeIndex;
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  const cardOnRight = index % 2 === 0;

  const circle = (
    <motion.div
      initial={false}
      animate={{ scale: isActive ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border transition-colors duration-500 md:h-[72px] md:w-[72px] ${
        reached ? "border-brand bg-brand text-white" : "border-light bg-white text-muted-foreground"
      } ${isActive ? "shadow-[0_0_0_6px_rgba(10,65,116,0.15)]" : ""}`}
    >
      <Icon className="h-5 w-5 md:h-6 md:w-6" />
    </motion.div>
  );

  const card = (
    <motion.div
      initial={{ opacity: 0, x: cardOnRight ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0.35, x: cardOnRight ? 12 : -12 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className={`card-surface rounded-2xl border p-5 transition-all duration-500 md:p-6 ${
        isActive
          ? "border-brand shadow-[0_10px_40px_-20px_rgba(10,65,116,0.5)]"
          : isPast
            ? "border-light opacity-60"
            : "border-light/60 opacity-50"
      }`}
    >
      <h3 className={`font-bold text-lg ${reached ? "text-navy" : "text-muted-foreground"}`}>
        {index + 1}. {title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );

  return (
    <div ref={ref} className="relative pb-12 last:pb-0">
      <div className="grid grid-cols-[56px_1fr] gap-5 md:hidden">
        {circle}
        {card}
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_72px_1fr] md:items-center md:gap-8">
        {cardOnRight ? (
          <>
            <div />
            <div className="flex items-center justify-center">
              <div
                className={`absolute left-1/2 ml-9 h-px w-8 transition-colors duration-500 ${reached ? "bg-brand" : "bg-light"}`}
              />
              {circle}
            </div>
            <div className="pl-8">{card}</div>
          </>
        ) : (
          <>
            <div className="flex justify-end pr-8">{card}</div>
            <div className="flex items-center justify-center">
              <div
                className={`absolute right-1/2 mr-9 h-px w-8 transition-colors duration-500 ${reached ? "bg-brand" : "bg-light"}`}
              />
              {circle}
            </div>
            <div />
          </>
        )}
      </div>
    </div>
  );
}

function HowStepsFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const onEnter = (i: number) => setActiveIndex((cur) => (i > cur ? i : cur));
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative mt-12 max-w-5xl mx-auto">
      <div className="absolute left-[27px] top-0 h-full w-px bg-light md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        style={{ scaleY: lineScale, transformOrigin: "top" }}
        className="absolute left-[27px] top-0 h-full w-px bg-brand md:left-1/2 md:-translate-x-1/2"
      />
      {HOW_STEPS.map((s, i) => (
        <HowStep
          key={s.title}
          index={i}
          icon={s.icon}
          title={s.title}
          desc={s.desc}
          activeIndex={activeIndex}
          onEnter={onEnter}
        />
      ))}
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const nearby = getNearbyAlerts(DEFAULT_DEMO_STATE, 30);
  const latest = getLatestAlerts(3);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q } });
  };

  return (
    <PageWrap>
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 glass-pill rounded-full px-3.5 py-1.5 text-xs font-semibold text-brand"
            >
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-verified animate-pulse-dot" /><span className="relative h-2 w-2 rounded-full bg-verified" /></span>
              Live · 14 NAFDAC alerts indexed this quarter
            </motion.div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy leading-[1.05]">
              <RevealWords text="Know if your medicine" />
              <br className="hidden sm:block" />
              <RevealWords text="is real — before you take it." delay={0.4} className="bg-gradient-to-r from-brand to-mid bg-clip-text text-transparent" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl"
            >
              MedCheck turns NAFDAC's scattered counterfeit-drug alerts into proactive risk intelligence — with AI photo pre-screening and a community alert map. Built to complement NAFDAC, never replace it.
            </motion.p>

            <motion.form
              onSubmit={onSearch}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45, duration: 0.55 }}
              className="mt-7 flex flex-col sm:flex-row gap-3 max-w-xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Check if your medication is genuine…"
                  className="h-14 pl-11 pr-4 rounded-full text-base bg-white shadow-[0_8px_24px_-12px_rgba(10,65,116,0.25)] border-light/60 focus-visible:ring-mid"
                />
              </div>
              <Button type="submit" variant="gradient" size="xl" className="shrink-0">
                Check Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/pre-screen" className="shrink-0">
                <Button type="button" variant="outline" size="xl" className="w-full sm:w-auto">
                  <Camera className="h-4 w-4" /> Scan Packaging
                </Button>
              </Link>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.6 }}
              className="mt-6 inline-flex flex-wrap items-center gap-x-5 gap-y-2 glass-pill rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium text-navy/85"
            >
              <span><CountUp to={stats.alertsIndexed} /> NAFDAC alerts indexed</span>
              <span className="text-mid">•</span>
              <span><CountUp to={stats.communityReports} /> community reports</span>
              <span className="text-mid">•</span>
              <span><CountUp to={stats.statesCovered} /> states covered</span>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "NAFDAC alerts indexed", value: stats.alertsIndexed },
              { label: "Drugs tracked", value: stats.drugsTracked },
              { label: "Community reports", value: stats.communityReports },
              { label: "States covered", value: stats.statesCovered },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="card-surface p-5 sm:p-6 hover:[box-shadow:var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-brand"><CountUp to={s.value} /></div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">How it works</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">From "is this real?" to a clear answer in seconds</h2>
          </div>
        </FadeIn>

        <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.1}>
          {[
            { icon: Search, title: "Search or Scan", desc: "Look up a drug name, batch, or NAFDAC reg number — or snap a photo of the packaging." },
            { icon: Sparkles, title: "AI Pre-Screen", desc: "Our model flags obvious packaging anomalies before you even buy." },
            { icon: Database, title: "Cross-Reference", desc: "We check NAFDAC alerts and community reports for matching risk signals." },
            { icon: ShieldCheck, title: "Clear Result", desc: "A plain-language verdict — with a link to official NAFDAC verification." },
          ].map((s, i) => (
            <motion.div key={s.title} variants={staggerItem} className="group relative card-surface p-6 hover:[box-shadow:var(--shadow-card-hover)] hover:-translate-y-1 transition-all">
              <div className="absolute -top-3 -right-3 grid place-items-center h-9 w-9 rounded-full bg-white shadow-md text-xs font-bold text-brand border border-light">{i + 1}</div>
              <div className="h-12 w-12 rounded-xl grid place-items-center [background:var(--gradient-icon)] text-white shadow-md group-hover:rotate-6 transition-transform">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-navy">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* RISK INTELLIGENCE — NEAR YOU */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <FadeIn className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Risk intelligence</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">Don't wait until you're suspicious.</h2>
            <p className="mt-4 text-muted-foreground">
              MedCheck surfaces counterfeit-drug risk near you before you have to ask. State-level signals,
              computed from NAFDAC alerts and community reports — refreshed continuously.
            </p>
            <Link to="/alerts"><Button variant="outline" className="mt-6">See all alerts <ArrowRight className="h-4 w-4" /></Button></Link>
          </FadeIn>

          <FadeIn className="lg:col-span-3" delay={0.15}>
            <div className="relative card-surface p-6 sm:p-7 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(232,80,58,0.18), transparent 70%)" }} />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5"><span className="absolute inset-0 rounded-full bg-alert animate-pulse-dot" /><span className="relative h-2.5 w-2.5 rounded-full bg-alert" /></span>
                  <span className="text-xs font-bold tracking-wider uppercase text-alert">Live · Near you</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {DEFAULT_DEMO_STATE}</span>
              </div>
              <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-navy">
                {nearby.length} counterfeit report{nearby.length === 1 ? "" : "s"} near you in the last 30 days
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">From NAFDAC alerts indexed in {DEFAULT_DEMO_STATE}.</p>

              <div className="mt-5 space-y-2.5">
                {nearby.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-white/60 px-3.5 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                    </div>
                    <SeverityPill severity={a.severity} />
                  </div>
                ))}
                {nearby.length === 0 && (
                  <p className="text-sm text-muted-foreground">No new alerts indexed in {DEFAULT_DEMO_STATE} in the last 30 days. Older alerts are still visible on the map.</p>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* LATEST ALERTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Live alerts</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">Latest flagged drugs</h2>
            </div>
            <Link to="/alerts" className="text-sm font-semibold text-brand story-link inline-flex items-center gap-1">View map <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </FadeIn>
        <Stagger className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5" stagger={0.1}>
          {latest.map((a) => (
            <motion.div key={a.id} variants={staggerItem} className="card-surface p-5 hover:[box-shadow:var(--shadow-card-hover)] hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between"><SeverityPill severity={a.severity} /><span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span></div>
              <h3 className="mt-3 font-bold text-navy line-clamp-2">{a.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{a.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-mid"><MapPin className="h-3.5 w-3.5" /> {a.state}</div>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* NAFDAC trust section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Source of truth</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">We point you to NAFDAC — not around it.</h2>
            <p className="mt-3 text-muted-foreground">MedCheck is an intelligence layer on top of NAFDAC's official verification tools. For official confirmation, always cross-check with the source.</p>
          </div>
        </FadeIn>
        <Stagger className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.08}>
          {[
            { title: "NAFDAC Green Book", desc: "The official registry of approved medicines.", href: "https://greenbook.nafdac.gov.ng" },
            { title: "Scan2Verify (NAFDAC)", desc: "Scan a Mobile Authentication Service code to verify.", href: "https://nafdac.gov.ng" },
            { title: "Med Safety App", desc: "Report adverse drug reactions to NAFDAC.", href: "https://nafdac.gov.ng" },
          ].map((c) => (
            <motion.a key={c.title} variants={staggerItem} href={c.href} target="_blank" rel="noreferrer"
              className="group gradient-border hover:gradient-border-hover p-6 card-surface hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-7 w-7 text-brand group-hover:scale-110 transition-transform" />
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
              </div>
              <h3 className="mt-4 font-bold text-navy">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
            </motion.a>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white" style={{ background: "var(--gradient-navy)" }}>
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(189,216,233,0.25), transparent 70%)" }} />
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">Saw something suspicious? Report it.</h2>
                <p className="mt-2 text-white/80 max-w-xl">Your report sharpens the risk picture for everyone in your state. It takes less than a minute.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/report"><Button variant="gradient" size="lg" className="!bg-white !text-brand hover:!brightness-100">Report a Fake</Button></Link>
                <Link to="/alerts"><Button variant="outline" size="lg" className="!border-white !text-white hover:!bg-white/10">View Map</Button></Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </PageWrap>
  );
}
