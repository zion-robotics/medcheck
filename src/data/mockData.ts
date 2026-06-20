// =====================================================================
// MedCheck — mockData.ts (Real NAFDAC alert data, June 2026)
// Frontend-only seed. Replace getX() bodies with real backend queries.
// =====================================================================

export type DrugStatus = "verified" | "flagged" | "unknown";

export interface Drug {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  nafdacRegNumber: string | null;
  status: DrugStatus;
  description: string;
}

export const mockDrugs: Drug[] = [
  { id: "1", name: "Augmentin 625mg Tablets", manufacturer: "GlaxoSmithKline (genuine) — counterfeit version unattributed", batchNumber: "AC3N", nafdacRegNumber: null, status: "flagged", description: "NAFDAC Public Alert No. 024/2026. Counterfeit batch identified nationwide. Risk: treatment failure, antimicrobial resistance, adverse reactions from unknown ingredients." },
  { id: "2", name: "Proguanil Tablet B.P 100mg (brands: Projeanil, Re-granil)", manufacturer: "Unattributed / counterfeit", batchNumber: "Unspecified", nafdacRegNumber: "04-6433", status: "flagged", description: "NAFDAC Public Alert No. 023/2026. Counterfeit brands using a fake NAFDAC registration number. Antimalarial prophylaxis drug." },
  { id: "3", name: "Avastin 400mg/16ml (Bevacizumab)", manufacturer: "F. Hoffmann-La Roche Ltd (genuine) — counterfeit version unattributed", batchNumber: "H4239A70 / H2290A34 / A3508B02 / K1830T71 / H0375B01", nafdacRegNumber: null, status: "flagged", description: "NAFDAC Public Alert No. 015/2026. Multiple confirmed counterfeit batches nationwide, identified via Roche Nigeria investigation. Used for recurrent glioblastoma treatment." },
  { id: "4", name: "Tecentriq 1200mg/20ml (Atezolizumab)", manufacturer: "F. Hoffmann-La Roche Ltd (genuine) — counterfeit version unattributed", batchNumber: "B3071A12", nafdacRegNumber: null, status: "flagged", description: "NAFDAC Public Alert No. 015/2026. Confirmed counterfeit batch circulating alongside fake Avastin." },
  { id: "5", name: "Mabthera 500mg/50ml", manufacturer: "F. Hoffmann-La Roche Ltd (genuine) — counterfeit version unattributed", batchNumber: "N2110A09", nafdacRegNumber: null, status: "flagged", description: "NAFDAC Public Alert No. 016/2026. Confirmed counterfeit batch reported in Kaduna and Gombe states, sold far below genuine price (NGN 160,000–275,000)." },
  { id: "6", name: "Herceptin 600mg", manufacturer: "F. Hoffmann-La Roche Ltd (genuine) — counterfeit version unattributed", batchNumber: "A8519B34", nafdacRegNumber: null, status: "flagged", description: "Confirmed counterfeit batch in Lagos State, reported March 2026. Cancer treatment drug (breast and stomach cancer)." },
  { id: "7", name: "Aflotin 20/120mg (Artemether/Lumefantrine)", manufacturer: "Ajanta Pharma Limited (genuine) — counterfeit version unattributed", batchNumber: "PA2128L", nafdacRegNumber: null, status: "flagged", description: "Counterfeit batch reported by genuine manufacturer Ajanta Pharma. Repackaged old/expired stock under a different brand name and pack size. Treats uncomplicated P. falciparum malaria." },
  { id: "8", name: "Colamar (Artemether/Lumefantrine 20/120mg) Oral Suspension", manufacturer: "Unattributed / falsified", batchNumber: "Unspecified", nafdacRegNumber: "B4-4065", status: "flagged", description: "NAFDAC Public Alert No. 031/2024. Substandard and falsified product passed off as Lonart Suspension, using a fake/reassigned NAFDAC registration number." },
  { id: "9", name: "Artemetrin DS (Artemether/Lumefantrine)", manufacturer: "A.C. Drugs Ltd (claimed, unregistered)", batchNumber: "Unspecified", nafdacRegNumber: null, status: "flagged", description: "Lab tests found only 59.2% artemether and 71.2% lumefantrine — far below the 90-110% potency standard. Not registered in NAFDAC database; registration number fabricated." },
  { id: "10", name: "Ciprofit 500 (Ciprofloxacin)", manufacturer: "Impact Pharmaceutical Ltd (claimed, unregistered)", batchNumber: "Unspecified", nafdacRegNumber: null, status: "flagged", description: "Lab tests found just 5.7% ciprofloxacin — critically low active ingredient. Not registered in NAFDAC database; registration number fabricated." },
  { id: "11", name: "Amoxivue (Amoxicillin) 500mg Capsules", manufacturer: "Manufacturer per NAFDAC alert", batchNumber: "Unspecified", nafdacRegNumber: null, status: "flagged", description: "NAFDAC Public Alert No. 24/2025. Recalled due to low Active Pharmaceutical Ingredient (API) content." },
  { id: "12", name: "Annmox / Jawamox (Amoxicillin Suspension 125mg/5ml)", manufacturer: "Jawa International Ltd", batchNumber: "Unspecified", nafdacRegNumber: null, status: "flagged", description: "NAFDAC Public Alert No. 35/2025. Substandard batches due to low Active Pharmaceutical Ingredient (API) content." },
  { id: "13", name: "Augmentin 625mg Tablets (Genuine reference)", manufacturer: "GlaxoSmithKline", batchNumber: "Varies by lot — verify via NAFDAC Green Book", nafdacRegNumber: "Confirm via Green Book lookup", status: "verified", description: "Reference entry for the genuine product. Always cross-check batch number against NAFDAC Green Book before relying on any single source." },
  { id: "14", name: "Lonart Suspension (Artemether/Lumefantrine)", manufacturer: "Unconfirmed", batchNumber: "Unspecified", nafdacRegNumber: null, status: "unknown", description: "Genuine product exists, but counterfeit passes have used its identity (see Colamar entry). Status unknown pending batch-specific verification — illustrates why batch-level lookup matters." },
  { id: "15", name: "Combiart Dispersible Tablets 20/120mg", manufacturer: "Strides Arcolab Limited (genuine) — counterfeit version unattributed", batchNumber: "Unspecified", nafdacRegNumber: null, status: "flagged", description: "Counterfeit version found to contain zero active pharmaceutical ingredients on lab analysis. Expired license and incorrect NAFDAC registration number on packaging. Discovered in FCT and Rivers state." },
];

export interface AlertReport {
  id: string;
  title: string;
  description: string;
  drugName: string;
  state: string;
  latitude: number;
  longitude: number;
  severity: "low" | "medium" | "high";
  createdAt: string;
}

function daysAgoToISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const mockAlerts: AlertReport[] = [
  { id: "a1", title: "Counterfeit Augmentin 625mg Tablets (Batch AC3N)", description: "NAFDAC Public Alert No. 024/2026. Nationwide alert — risk of antimicrobial resistance and treatment failure.", drugName: "Augmentin 625mg Tablets", state: "Lagos", latitude: 6.5244, longitude: 3.3792, severity: "high", createdAt: daysAgoToISO(5) },
  { id: "a2", title: "Counterfeit Proguanil — Projeanil & Re-granil", description: "NAFDAC Public Alert No. 023/2026. Fake NAFDAC registration number 04-6433 found on packaging.", drugName: "Proguanil Tablet B.P 100mg (brands: Projeanil, Re-granil)", state: "FCT", latitude: 9.0765, longitude: 7.3986, severity: "high", createdAt: daysAgoToISO(8) },
  { id: "a3", title: "Confirmed Counterfeit Avastin & Tecentriq", description: "NAFDAC Public Alert No. 015/2026. Multiple batches confirmed fake by Roche Nigeria investigation.", drugName: "Avastin 400mg/16ml (Bevacizumab)", state: "Lagos", latitude: 6.5244, longitude: 3.3792, severity: "high", createdAt: daysAgoToISO(95) },
  { id: "a3b", title: "Confirmed Counterfeit Tecentriq 1200mg/20ml", description: "NAFDAC Public Alert No. 015/2026. Confirmed counterfeit batch circulating alongside fake Avastin.", drugName: "Tecentriq 1200mg/20ml (Atezolizumab)", state: "Lagos", latitude: 6.5244, longitude: 3.3792, severity: "high", createdAt: daysAgoToISO(95) },
  { id: "a4", title: "Confirmed Counterfeit Mabthera 500mg/50ml", description: "NAFDAC Public Alert No. 016/2026. Batch N2110A09 — reported in Kaduna and Gombe.", drugName: "Mabthera 500mg/50ml", state: "Kaduna", latitude: 10.5105, longitude: 7.4165, severity: "high", createdAt: daysAgoToISO(90) },
  { id: "a5", title: "Confirmed Counterfeit Mabthera 500mg/50ml (Gombe report)", description: "Same alert as Kaduna — second location reported for batch N2110A09.", drugName: "Mabthera 500mg/50ml", state: "Gombe", latitude: 10.2897, longitude: 11.1673, severity: "high", createdAt: daysAgoToISO(90) },
  { id: "a6", title: "Counterfeit Herceptin 600mg (Batch A8519B34)", description: "Confirmed counterfeit cancer drug batch reported in Lagos State.", drugName: "Herceptin 600mg", state: "Lagos", latitude: 6.5244, longitude: 3.3792, severity: "high", createdAt: daysAgoToISO(85) },
  { id: "a7", title: "Counterfeit Aflotin 20/120mg Antimalarial", description: "Repackaged/relabeled expired stock sold under a different brand name and pack size.", drugName: "Aflotin 20/120mg (Artemether/Lumefantrine)", state: "Lagos", latitude: 6.5244, longitude: 3.3792, severity: "medium", createdAt: daysAgoToISO(420) },
  { id: "a8", title: "Counterfeit Combiart Dispersible Tablets 20/120mg", description: "Zero active pharmaceutical ingredients found on lab analysis. Expired license, wrong registration number.", drugName: "Combiart Dispersible Tablets 20/120mg", state: "Rivers", latitude: 4.8156, longitude: 7.0498, severity: "high", createdAt: daysAgoToISO(570) },
  { id: "a9", title: "Counterfeit Combiart — FCT report", description: "Same Combiart alert — also discovered in the Federal Capital Territory.", drugName: "Combiart Dispersible Tablets 20/120mg", state: "FCT", latitude: 9.0765, longitude: 7.3986, severity: "high", createdAt: daysAgoToISO(570) },
  { id: "a10", title: "Fake Artemetrin DS & Ciprofit 500 in circulation", description: "Lab-confirmed critically low active ingredient levels. Neither product registered with NAFDAC.", drugName: "Artemetrin DS (Artemether/Lumefantrine)", state: "Enugu", latitude: 6.5244, longitude: 7.5139, severity: "high", createdAt: daysAgoToISO(275) },
  { id: "a10b", title: "Fake Ciprofit 500 in circulation", description: "Lab-confirmed critically low active ingredient (5.7% ciprofloxacin). Not registered with NAFDAC.", drugName: "Ciprofit 500 (Ciprofloxacin)", state: "Enugu", latitude: 6.5244, longitude: 7.5139, severity: "high", createdAt: daysAgoToISO(275) },
  { id: "a11", title: "Counterfeit medicines seized — Tyre Village, Trade Fair Complex", description: "Raid uncovered fake amoxicillin 500mg, ampiclox capsules 500mg, and counterfeit Augmentin packaging materials, valued over NGN 300 million.", drugName: "Augmentin 625mg Tablets", state: "Lagos", latitude: 6.5244, longitude: 3.3792, severity: "high", createdAt: daysAgoToISO(570) },
  { id: "a12", title: "Substandard Amoxivue 500mg Capsules recalled", description: "NAFDAC Public Alert No. 24/2025. Recalled for low API content.", drugName: "Amoxivue (Amoxicillin) 500mg Capsules", state: "FCT", latitude: 9.0765, longitude: 7.3986, severity: "medium", createdAt: daysAgoToISO(320) },
  { id: "a13", title: "Substandard Annmox / Jawamox Amoxicillin Suspensions", description: "NAFDAC Public Alert No. 35/2025. Low API content identified in both brands.", drugName: "Annmox / Jawamox (Amoxicillin Suspension 125mg/5ml)", state: "Kano", latitude: 12.0022, longitude: 8.592, severity: "medium", createdAt: daysAgoToISO(260) },
];

export interface CrowdReport {
  id: string;
  drugName: string;
  state: string;
  description: string;
  reporter: string;
  createdAt: string;
}

export const mockCrowdReports: CrowdReport[] = [
  { id: "c1", drugName: "Augmentin 625mg Tablets", state: "Lagos", description: "Pack didn't match the usual GSK foil texture — bought at an open-air market.", reporter: "Anonymous pharmacist", createdAt: daysAgoToISO(3) },
  { id: "c2", drugName: "Mabthera 500mg/50ml", state: "Kaduna", description: "Vial label printing was blurry; cap seal was already loose.", reporter: "Hospital procurement officer", createdAt: daysAgoToISO(12) },
  { id: "c3", drugName: "Combiart Dispersible Tablets 20/120mg", state: "FCT", description: "Tablets dissolved oddly, no bitter taste — patient's malaria didn't improve.", reporter: "Community health worker", createdAt: daysAgoToISO(40) },
];

// ===== Wrapper API — swap bodies for real backend queries =====

// TODO: replace with Supabase / backend query
export function getDrugs(): Drug[] { return mockDrugs; }

// TODO: replace with Supabase / backend query
export function getAlerts(): AlertReport[] { return mockAlerts; }

// TODO: replace with Supabase / backend query
export function getDrugById(id: string): Drug | undefined {
  return mockDrugs.find((d) => d.id === id);
}

// TODO: replace with Supabase / backend query
export function getCrowdReportsForDrug(drugName: string): CrowdReport[] {
  return mockCrowdReports.filter((r) => r.drugName === drugName);
}

// TODO: replace with Supabase / backend query
export function getAlertsForDrug(drugName: string): AlertReport[] {
  return mockAlerts
    .filter((a) => a.drugName === drugName)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface RiskScore {
  drugName: string;
  alertCount: number;
  windowMonths: number;
  highestSeverity: "low" | "medium" | "high" | null;
  mostRecentAlert: AlertReport | null;
}

// TODO: replace with backend aggregation query
export function getRiskScore(drugName: string, windowMonths: number = 6): RiskScore {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - windowMonths);
  const matches = mockAlerts
    .filter((a) => a.drugName === drugName && new Date(a.createdAt) >= cutoff)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const rank = { high: 3, medium: 2, low: 1 } as const;
  const highest = matches.reduce<"low" | "medium" | "high" | null>(
    (h, a) => (!h ? a.severity : rank[a.severity] > rank[h] ? a.severity : h),
    null,
  );
  return { drugName, alertCount: matches.length, windowMonths, highestSeverity: highest, mostRecentAlert: matches[0] ?? null };
}

// TODO: replace with backend query filtered by user state
export function getNearbyAlerts(state: string, windowDays: number = 30): AlertReport[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  return mockAlerts
    .filter((a) => a.state === state && new Date(a.createdAt) >= cutoff)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// TODO: replace with user-saved state / geolocation lookup
export const DEFAULT_DEMO_STATE = "Lagos";

export function getAvailableStates(): string[] {
  return Array.from(new Set(mockAlerts.map((a) => a.state))).sort();
}

export function getLatestAlerts(limit: number = 3): AlertReport[] {
  return [...mockAlerts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export const stats = {
  alertsIndexed: mockAlerts.length,
  communityReports: mockCrowdReports.length,
  statesCovered: getAvailableStates().length,
  drugsTracked: mockDrugs.length,
};
