import { createFileRoute } from "@tanstack/react-router";
import { User, MapPin } from "lucide-react";
import { PageWrap } from "@/components/PageWrap";
import { FadeIn, Stagger, staggerItem } from "@/components/motion-primitives";
import { SeverityPill } from "@/components/Badges";
import { mockCrowdReports } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — MedCheck" },
      { name: "description", content: "Your MedCheck account: submitted reports and profile." },
      { property: "og:url", content: "/account" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  // TODO: gate this route behind real auth, replace mock data with backend query
  const reports = mockCrowdReports;

  return (
    <PageWrap>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <div className="card-surface p-6 sm:p-7 flex items-center gap-4 sm:gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl grid place-items-center text-white text-2xl font-extrabold" style={{ background: "var(--gradient-navy)" }}>
              <User className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold text-navy">Demo User</h1>
              <p className="text-sm text-muted-foreground truncate">demo@medcheck.ng · Lagos, Nigeria</p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-verified/10 text-verified text-[11px] font-semibold px-2.5 py-1 border border-verified/20">Verified contributor</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="mt-10 text-xl font-extrabold text-navy">Your submitted reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">Reports under review or already published to the alert index.</p>
        </FadeIn>

        <Stagger className="mt-5 space-y-3" stagger={0.08}>
          {reports.map((r) => (
            <motion.div key={r.id} variants={staggerItem} className="card-surface p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <SeverityPill severity="medium" />
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</span>
              </div>
              <h3 className="mt-2 font-bold text-navy">{r.drugName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-mid font-semibold"><MapPin className="h-3.5 w-3.5" /> {r.state}</div>
            </motion.div>
          ))}
        </Stagger>
      </section>
    </PageWrap>
  );
}
