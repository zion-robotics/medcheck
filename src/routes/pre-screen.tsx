import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageWrap } from "@/components/PageWrap";
import { FadeIn } from "@/components/motion-primitives";

export const Route = createFileRoute("/pre-screen")({
  head: () => ({
    meta: [
      { title: "AI Pre-Screen — MedCheck" },
      { name: "description", content: "Snap a photo of medication packaging. Our AI flags obvious red flags — before you verify officially with NAFDAC." },
      { property: "og:title", content: "AI Pre-Screen — MedCheck" },
      { property: "og:description", content: "AI photo pre-screen for suspicious medication packaging." },
      { property: "og:url", content: "/pre-screen" },
    ],
    links: [{ rel: "canonical", href: "/pre-screen" }],
  }),
  component: PreScreenPage,
});

type Phase = "idle" | "analyzing" | "result";

function PreScreenPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [drag, setDrag] = useState(false);

  const onFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { setImage(e.target?.result as string); setPhase("idle"); };
    reader.readAsDataURL(file);
  };

  const analyze = () => {
    setPhase("analyzing");
    // TODO: wire Analyze button to backend AI analysis call
    setTimeout(() => setPhase("result"), 2400);
  };

  const reset = () => { setImage(null); setPhase("idle"); };

  return (
    <PageWrap>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-mid">AI Pre-Screen</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy">Snap a photo. Catch obvious red flags.</h1>
          <p className="mt-2 text-muted-foreground">
            Pre-screen is a fast first check — not an official verification. Always confirm with NAFDAC.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files?.[0] ?? null); }}
            className={`relative mt-8 card-surface overflow-hidden transition-all ${drag ? "ring-2 ring-mid scale-[1.01]" : ""}`}
          >
            {!image ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full p-10 sm:p-16 grid place-items-center text-center cursor-pointer hover:bg-light/10 transition-colors"
              >
                <motion.div
                  className="h-20 w-20 rounded-2xl grid place-items-center [background:var(--gradient-icon)] text-white shadow-lg"
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Upload className="h-8 w-8" />
                </motion.div>
                <h3 className="mt-5 text-lg font-bold text-navy">Drop a photo here, or click to upload</h3>
                <p className="mt-1 text-sm text-muted-foreground">PNG or JPG, packaging clearly visible.</p>
                <div className="mt-5 flex gap-2 flex-wrap justify-center">
                  <span className="inline-flex items-center gap-2 text-xs text-mid font-medium"><Camera className="h-3.5 w-3.5" /> Camera supported on mobile</span>
                </div>
                <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
              </button>
            ) : (
              <div className="relative">
                <img src={image} alt="Medication preview" className="w-full max-h-[480px] object-contain bg-navy/5" />
                {phase === "analyzing" && (
                  <>
                    <div className="absolute inset-0 glass-dark grid place-items-center">
                      <div className="text-center">
                        <motion.div
                          className="mx-auto h-12 w-12 rounded-full border-4 border-white/30 border-t-white"
                          animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="mt-4 text-sm font-semibold tracking-wide">Analyzing packaging…</p>
                        <p className="mt-1 text-xs text-white/70">Checking colors, fonts, batch, and known counterfeit patterns.</p>
                      </div>
                    </div>
                    <motion.div
                      className="pointer-events-none absolute left-0 right-0 h-24"
                      style={{ background: "linear-gradient(to bottom, transparent, rgba(46,158,91,0.55), transparent)" }}
                      animate={{ top: ["-10%", "110%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </>
                )}
                <button onClick={reset} aria-label="Remove image" className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/90 shadow hover:bg-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {image && phase === "idle" && (
            <div className="mt-5 flex gap-3 justify-end">
              <Button variant="outline" onClick={reset}>Cancel</Button>
              <Button variant="gradient" size="lg" onClick={analyze}><Camera className="h-4 w-4" /> Analyze</Button>
            </div>
          )}

          <AnimatePresence>
            {phase === "result" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-6 card-surface p-6 border-l-4 border-verified"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-verified/15 text-verified grid place-items-center"><ShieldCheck className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy">No obvious red flags detected</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Our model didn't spot common counterfeit packaging anomalies. This is a pre-screen, not an official verification — confirm with NAFDAC before relying on it.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link to="/verify"><Button variant="gradient">Verify with NAFDAC <ArrowRight className="h-4 w-4" /></Button></Link>
                      <Button variant="outline" onClick={reset}>Scan another</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              <strong>Pre-screen, not diagnosis.</strong> AI can miss things. For a definitive answer, scan with NAFDAC's official Scan2Verify tool.
            </p>
          </div>
        </FadeIn>
      </section>
    </PageWrap>
  );
}
