import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { DrugStatus } from "@/data/mockData";

export function StatusBadge({ status }: { status: DrugStatus }) {
  if (status === "verified")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-verified/10 text-verified px-3 py-1 text-xs font-semibold border border-verified/20">
        <ShieldCheck className="h-3.5 w-3.5" /> Verified
      </span>
    );
  if (status === "flagged")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-alert/10 text-alert px-3 py-1 text-xs font-semibold border border-alert/20">
        <ShieldAlert className="h-3.5 w-3.5" /> Flagged by NAFDAC
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-semibold border border-border">
      <ShieldQuestion className="h-3.5 w-3.5" /> Unknown
    </span>
  );
}

export function RiskBadge({ count, severity }: { count: number; severity: "low" | "medium" | "high" | null }) {
  if (count === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-verified/30 text-verified bg-verified/5">
        0 alerts · last 6 months
      </span>
    );
  const color =
    severity === "high"
      ? "border-alert/40 text-alert bg-alert/5"
      : severity === "medium"
        ? "border-amber-500/40 text-amber-700 bg-amber-50"
        : "border-brand/40 text-brand bg-brand/5";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${color}`}>
      {count} alert{count === 1 ? "" : "s"} · last 6 months
    </span>
  );
}

export function SeverityPill({ severity }: { severity: "low" | "medium" | "high" }) {
  const map = {
    high: "bg-alert/10 text-alert border-alert/30",
    medium: "bg-amber-50 text-amber-700 border-amber-500/30",
    low: "bg-brand/10 text-brand border-brand/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[severity]}`}>
      {severity}
    </span>
  );
}
