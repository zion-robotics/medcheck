import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ShieldAlert, X } from "lucide-react";
import { PageWrap } from "@/components/PageWrap";
import { FadeIn } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAvailableStates } from "@/data/mockData";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Fake Drug — MedCheck" },
      { name: "description", content: "Spotted a suspicious medicine? Help your community by reporting it. Anonymous, takes under a minute." },
      { property: "og:title", content: "Report a Fake Drug — MedCheck" },
      { property: "og:description", content: "Anonymously report counterfeit drugs in Nigeria." },
      { property: "og:url", content: "/report" },
    ],
    links: [{ rel: "canonical", href: "/report" }],
  }),
  component: ReportPage,
});

function ReportPage() {
  const [form, setForm] = useState({ drugName: "", batchNumber: "", state: "Lagos", description: "" });
  const [photo, setPhoto] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const states = getAvailableStates();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthOpen(true);
  };

  const fakeSignIn = () => {
    setAuthOpen(false);
    setTimeout(() => setSuccess(true), 300);
    // TODO: wire modal to real auth, wire submit to backend insert
  };

  if (success) {
    return (
      <PageWrap>
        <section className="mx-auto max-w-xl px-4 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
            className="mx-auto h-20 w-20 rounded-full bg-verified/15 text-verified grid place-items-center"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M5 12 L10 17 L19 7"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
            </svg>
          </motion.div>
          <h1 className="mt-6 text-3xl font-extrabold text-navy">Report submitted</h1>
          <p className="mt-2 text-muted-foreground">Thank you. Our team will review it and add it to the alert index if confirmed.</p>
        </section>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">Crowdsource</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">Report a fake drug</h1>
          <p className="mt-2 text-muted-foreground">Your report sharpens the risk picture for everyone. We'll cross-check before publishing.</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form onSubmit={onSubmit} className="mt-8 card-surface p-6 space-y-5">
            <div>
              <Label htmlFor="drug">Drug name</Label>
              <Input id="drug" required value={form.drugName} onChange={(e) => setForm({ ...form, drugName: e.target.value })} placeholder="e.g. Augmentin 625mg" className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batch">Batch number</Label>
                <Input id="batch" value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} placeholder="e.g. AC3N" className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <select id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-mid"
                >
                  {states.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="desc">What looked suspicious?</Label>
              <Textarea id="desc" required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell us where you got it, what looked off…" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>Photo (optional)</Label>
              {!photo ? (
                <label className="mt-1.5 flex items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed border-light bg-light/10 py-6 text-sm text-muted-foreground hover:bg-light/20 transition-colors">
                  <Upload className="h-4 w-4" /> Click to upload
                  <input type="file" accept="image/*" hidden onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    const r = new FileReader(); r.onload = (ev) => setPhoto(ev.target?.result as string); r.readAsDataURL(f);
                  }} />
                </label>
              ) : (
                <div className="mt-1.5 relative inline-block">
                  <img src={photo} alt="Report" className="max-h-40 rounded-xl" />
                  <button type="button" onClick={() => setPhoto(null)} className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white shadow grid place-items-center"><X className="h-3.5 w-3.5" /></button>
                </div>
              )}
            </div>
            <div className="pt-2">
              <Button type="submit" variant="gradient" size="lg" className="w-full">Submit report</Button>
              <p className="mt-3 text-xs text-muted-foreground text-center inline-flex items-center gap-1.5 w-full justify-center">
                <ShieldAlert className="h-3.5 w-3.5" /> You'll be asked to sign in to confirm — your data stays in the form.
              </p>
            </div>
          </form>
        </FadeIn>
      </section>

      {/* Glass modal */}
      <AnimatePresence>
        {authOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: "rgba(0,29,57,0.35)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
              onClick={() => setAuthOpen(false)}
            />
            <div className="fixed inset-0 z-50 grid place-items-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                className="pointer-events-auto w-full max-w-sm rounded-3xl bg-white shadow-2xl p-7"
              >
                <div className="flex items-center gap-2.5">
                  <img src="/medcheck-icon.svg" alt="" className="h-9 w-9 rounded-lg" />
                  <span className="font-bold text-navy">Sign in to MedCheck</span>
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-navy">One last step</h2>
                <p className="mt-1 text-sm text-muted-foreground">We just need a quick sign-in so we can credit (or anonymize) your report.</p>
                <div className="mt-5 space-y-3">
                  <Input placeholder="Email" type="email" className="h-11 rounded-xl" />
                  <Input placeholder="Password" type="password" className="h-11 rounded-xl" />
                  <Button onClick={fakeSignIn} variant="gradient" size="lg" className="w-full">Continue</Button>
                  <button onClick={fakeSignIn} className="block w-full text-center text-xs text-muted-foreground hover:text-brand">Continue as anonymous</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}
