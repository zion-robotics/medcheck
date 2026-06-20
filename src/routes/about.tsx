import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Search, Sparkles, Database, ShieldCheck } from "lucide-react";
import { PageWrap } from "@/components/PageWrap";
import { FadeIn } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MedCheck — How it works" },
      { name: "description", content: "How MedCheck turns scattered NAFDAC counterfeit-drug alerts into proactive risk intelligence for Nigeria." },
      { property: "og:title", content: "About MedCheck — How it works" },
      { property: "og:description", content: "How MedCheck pre-screens, cross-references, and surfaces drug risk before you ask." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const NODES = [
  { x: 80, y: 200, label: "Scan or search", Icon: Search },
  { x: 280, y: 90, label: "AI Pre-Screen", Icon: Sparkles },
  { x: 520, y: 90, label: "NAFDAC Database", Icon: Database },
  { x: 720, y: 200, label: "Result", Icon: ShieldCheck },
];

const PATH_D = "M 80 200 Q 180 60, 280 90 T 520 90 Q 620 90, 720 200";

const STEPS = [
  { title: "Scan or search", desc: "Snap a photo or type the drug name, batch, or NAFDAC reg number." },
  { title: "AI pre-screen", desc: "Our model flags packaging anomalies — fonts, colors, batch formats — common to counterfeits." },
  { title: "Cross-reference NAFDAC", desc: "We match against the NAFDAC alert index and community reports for risk signals." },
  { title: "Clear result + official link", desc: "A plain-language verdict, with a direct link to NAFDAC's Green Book for definitive confirmation." },
];

function HowStep({
  index,
  title,
  desc,
  activeIndex,
  onEnter,
}: {
  index: number;
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
      className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border font-mono text-sm transition-colors duration-500 md:h-[72px] md:w-[72px] md:text-base ${
        reached ? "border-[#0A4174] bg-[#0A4174] text-white" : "border-[#BDD8E9] bg-white text-muted-foreground"
      } ${isActive ? "shadow-[0_0_0_6px_rgba(10,65,116,0.15)]" : ""}`}
    >
      0{index + 1}
    </motion.div>
  );

  const card = (
    <motion.div
      initial={{ opacity: 0, x: cardOnRight ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0.35, x: cardOnRight ? 12 : -12 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className={`card-surface rounded-2xl border p-5 transition-all duration-500 md:p-6 ${
        isActive
          ? "border-[#0A4174] shadow-[0_10px_40px_-20px_rgba(10,65,116,0.5)]"
          : isPast
            ? "border-[#BDD8E9] opacity-60"
            : "border-[#BDD8E9]/60 opacity-50"
      }`}
    >
      <h3 className={`font-bold text-lg ${reached ? "text-navy" : "text-muted-foreground"}`}>
        {index + 1}. {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-xl">{desc}</p>
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
                className={`absolute left-1/2 ml-9 h-px w-8 transition-colors duration-500 ${reached ? "bg-[#0A4174]" : "bg-[#BDD8E9]"}`}
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
                className={`absolute right-1/2 mr-9 h-px w-8 transition-colors duration-500 ${reached ? "bg-[#0A4174]" : "bg-[#BDD8E9]"}`}
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
    <div ref={containerRef} className="relative mt-10">
      <div className="absolute left-[27px] top-0 h-full w-px bg-[#BDD8E9] md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        style={{ scaleY: lineScale, transformOrigin: "top" }}
        className="absolute left-[27px] top-0 h-full w-px bg-[#0A4174] md:left-1/2 md:-translate-x-1/2"
      />
      {STEPS.map((s, i) => (
        <HowStep
          key={s.title}
          index={i}
          title={s.title}
          desc={s.desc}
          activeIndex={activeIndex}
          onEnter={onEnter}
        />
      ))}
    </div>
  );
}

function AboutPage() {
  const [loop, setLoop] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLoop((l) => l + 1), 4000);
    return () => clearInterval(id);
  }, []);
  const isGenuine = loop % 2 === 0;

  return (
    <PageWrap>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">About</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-navy leading-tight">
            A risk intelligence layer for Nigerian medicine.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            NAFDAC's counterfeit-drug alerts exist — but they're scattered across PDFs, press releases, and
            social posts. MedCheck pulls them into one searchable, mappable, proactive layer that surfaces
            risk before you have to ask.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className="mt-16 text-2xl sm:text-3xl font-extrabold text-navy">The path from suspicion to certainty</h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 card-surface p-6 md:p-10 -mx-2 overflow-x-auto">
            <svg viewBox="0 0 800 280" className="w-full min-w-[720px] h-auto">
              <path d={PATH_D} stroke="#BDD8E9" strokeWidth="2" fill="none" strokeDasharray="4 6" />
              {NODES.map((n, i) => {
                const flash = i === 3;
                const flashColor = flash ? (isGenuine ? "#2E9E5B" : "#E8503A") : "#0A4174";
                return (
                  <g key={i} transform={`translate(${n.x} ${n.y})`}>
                    <motion.circle
                      r="28"
                      fill={flashColor}
                      animate={flash ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.6, repeat: flash ? Infinity : 0, repeatDelay: 3.4 }}
                    />
                    <foreignObject x="-12" y="-12" width="24" height="24">
                      <div className="flex items-center justify-center text-white">
                        <n.Icon size={20} />
                      </div>
                    </foreignObject>
                    <text y="58" textAnchor="middle" className="fill-navy" style={{ font: "600 13px Inter" }}>
                      {n.label}
                    </text>
                  </g>
                );
              })}
              <motion.g
                animate={{ offsetDistance: ["0%", "100%"] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ offsetPath: `path("${PATH_D}")`, offsetRotate: "0deg" } as any}
              >
                <circle r="10" fill="#fff" stroke="#4E8EA2" strokeWidth="3" />
              </motion.g>
            </svg>
          </div>
        </FadeIn>

        <HowStepsFlow />

        <FadeIn delay={0.1}>
          <div className="mt-12 card-surface p-7">
            <h3 className="font-bold text-navy">A word on what MedCheck is — and isn't</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              MedCheck is <strong>not</strong> a medical device or a replacement for NAFDAC. It's a community
              intelligence layer that helps everyday Nigerians spot patterns NAFDAC has already flagged, and
              pushes you toward official verification. For any treatment-critical decision, always confirm
              with NAFDAC and your pharmacist.
            </p>
            <Link to="/verify"><Button variant="gradient" className="mt-5">Open NAFDAC tools</Button></Link>
          </div>
        </FadeIn>
      </section>
    </PageWrap>
  );
}
