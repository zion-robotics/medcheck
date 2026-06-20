import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, BookOpen, Smartphone } from "lucide-react";
import { PageWrap } from "@/components/PageWrap";
import { FadeIn, Stagger, staggerItem } from "@/components/motion-primitives";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify Officially with NAFDAC — MedCheck" },
      { name: "description", content: "Direct links to NAFDAC's official verification tools: Green Book, Scan2Verify, and the Med Safety App." },
      { property: "og:title", content: "Verify Officially with NAFDAC" },
      { property: "og:description", content: "Direct links to NAFDAC's official verification tools." },
      { property: "og:url", content: "/verify" },
    ],
    links: [{ rel: "canonical", href: "/verify" }],
  }),
  component: VerifyPage,
});

const TOOLS = [
  { icon: BookOpen, title: "NAFDAC Green Book", desc: "The official registry of all NAFDAC-approved medicines. Search by product, manufacturer, or registration number.", href: "https://greenbook.nafdac.gov.ng", cta: "Open Green Book" },
  { icon: ShieldCheck, title: "Scan2Verify (MAS)", desc: "Scratch the panel on the packaging, SMS the code to NAFDAC, and get an instant authenticity reply.", href: "https://nafdac.gov.ng", cta: "Learn more" },
  { icon: Smartphone, title: "Med Safety App", desc: "Report adverse drug reactions directly to NAFDAC's pharmacovigilance team.", href: "https://nafdac.gov.ng", cta: "Get the app" },
];

function VerifyPage() {
  return (
    <PageWrap>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Source of truth</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">Verify with NAFDAC.</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            We're an intelligence layer — for definitive confirmation, always use NAFDAC's official tools. Each
            link opens on nafdac.gov.ng.
          </p>
        </FadeIn>

        <Stagger className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5" stagger={0.1}>
          {TOOLS.map((t) => (
            <motion.a key={t.title} variants={staggerItem} href={t.href} target="_blank" rel="noreferrer"
              className="group gradient-border hover:gradient-border-hover card-surface p-6 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <motion.div className="h-12 w-12 rounded-xl grid place-items-center [background:var(--gradient-icon)] text-white shadow-md" whileHover={{ rotate: 8, scale: 1.05 }}>
                  <t.icon className="h-5 w-5" />
                </motion.div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
              </div>
              <h3 className="mt-4 font-bold text-navy">{t.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand story-link">{t.cta}</span>
            </motion.a>
          ))}
        </Stagger>

        <FadeIn delay={0.2}>
          <div className="mt-12 rounded-2xl bg-light/30 border border-light/60 p-6">
            <h3 className="font-bold text-navy">Why we link out instead of replacing NAFDAC</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              NAFDAC owns the authoritative database for Nigerian medicines. Building a parallel "verifier"
              would fragment trust. MedCheck's role is to make NAFDAC's existing intelligence more findable,
              proactive, and community-aware.
            </p>
          </div>
        </FadeIn>
      </section>
    </PageWrap>
  );
}
