import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Sparkles, Database, ShieldCheck, PlayCircle } from "lucide-react";
import { PageWrap } from "@/components/PageWrap";
import { FadeIn, Stagger, staggerItem } from "@/components/motion-primitives";
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

function AboutPage() {
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

        <FadeIn delay={0.1}>
          {/* Video hero placeholder */}
          <div className="mt-10 relative overflow-hidden rounded-3xl aspect-video card-surface group cursor-pointer">
            <div className="absolute inset-0" style={{ background: "var(--gradient-navy)" }} />
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, rgba(189,216,233,0.5), transparent 60%)" }} />
            <div className="absolute inset-0 grid place-items-center">
              <motion.button
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                className="h-20 w-20 rounded-full bg-white/95 grid place-items-center shadow-2xl"
                aria-label="Play demo video"
              >
                <PlayCircle className="h-10 w-10 text-brand" />
              </motion.button>
            </div>
            <div className="absolute bottom-5 left-5 text-white">
              <p className="text-sm font-semibold">Demo · 90 seconds</p>
              <p className="text-xs text-white/70">See MedCheck in action</p>
            </div>
            {/* TODO: replace with actual <video> element pointing at hosted demo */}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className="mt-16 text-2xl sm:text-3xl font-extrabold text-navy">The path from suspicion to certainty</h2>
        </FadeIn>

        <Stagger className="mt-6 relative" stagger={0.15}>
          {/* connecting path */}
          <svg aria-hidden className="absolute left-6 top-0 bottom-0 w-px" style={{ overflow: "visible" }}>
            <motion.line
              x1="0" y1="0" x2="0" y2="100%"
              stroke="url(#g1)" strokeWidth="2" strokeDasharray="6 6"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0A4174" /><stop offset="100%" stopColor="#4E8EA2" />
              </linearGradient>
            </defs>
          </svg>

          {[
            { icon: Search, title: "Scan or search", desc: "Snap a photo or type the drug name, batch, or NAFDAC reg number." },
            { icon: Sparkles, title: "AI pre-screen", desc: "Our model flags packaging anomalies — fonts, colors, batch formats — common to counterfeits." },
            { icon: Database, title: "Cross-reference NAFDAC", desc: "We match against the NAFDAC alert index and community reports for risk signals." },
            { icon: ShieldCheck, title: "Clear result + official link", desc: "A plain-language verdict, with a direct link to NAFDAC's Green Book for definitive confirmation." },
          ].map((s, i) => (
            <motion.div key={s.title} variants={staggerItem} className="relative pl-16 pb-8">
              <div className="absolute left-0 top-0 h-12 w-12 rounded-2xl grid place-items-center [background:var(--gradient-icon)] text-white shadow-lg">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">{i + 1}. {s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">{s.desc}</p>
            </motion.div>
          ))}
        </Stagger>

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
