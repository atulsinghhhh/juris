type RiskLevel = "Red" | "Yellow" | "Green";

const styles: Record<RiskLevel, string> = {
  Red: "bg-red-100 text-red-700 border border-red-200",
  Yellow: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Green: "bg-green-100 text-green-700 border border-green-200",
};

const labels: Record<RiskLevel, string> = {
  Red: "High Risk",
  Yellow: "Medium Risk",
  Green: "Low Risk",
};

const dots: Record<RiskLevel, string> = {
  Red: "bg-red-500",
  Yellow: "bg-yellow-500",
  Green: "bg-green-500",
};

export function RiskBadge({ level }: { level: string }) {
  const risk = level as RiskLevel;
  const style = styles[risk] ?? "bg-gray-100 text-gray-700 border border-gray-200";
  const label = labels[risk] ?? level;
  const dot = dots[risk] ?? "bg-gray-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
