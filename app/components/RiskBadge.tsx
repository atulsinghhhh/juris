type RiskLevel = "Red" | "Yellow" | "Green";

const styles: Record<RiskLevel, string> = {
  Red: "bg-red-50 text-red-700 border border-red-200",
  Yellow: "bg-amber-50 text-amber-700 border border-amber-200",
  Green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const labels: Record<RiskLevel, string> = {
  Red: "High Risk",
  Yellow: "Medium Risk",
  Green: "Low Risk",
};

const dots: Record<RiskLevel, string> = {
  Red: "bg-red-500",
  Yellow: "bg-amber-500",
  Green: "bg-emerald-500",
};

export function RiskBadge({ level }: { level: string }) {
  const risk = level as RiskLevel;
  const style = styles[risk] ?? "bg-slate-100 text-slate-700 border border-slate-200";
  const label = labels[risk] ?? level;
  const dot = dots[risk] ?? "bg-slate-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
