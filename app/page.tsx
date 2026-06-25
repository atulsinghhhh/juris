import { UploadZone } from "./components/UploadZone";

const features = [
  { label: "Clause extraction", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Risk scoring", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Redline suggestions", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { label: "Plain-English summary", icon: "M4 6h16M4 12h16M4 18h7" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16">
      {/* Hero */}
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          AI Contract Analysis
        </div>

        <h1 className="text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
          Review contracts in{" "}
          <span className="text-indigo-600">seconds,</span>
          <br />not hours.
        </h1>

        <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed mb-10">
          Upload any contract and get a clause-by-clause risk analysis with plain-English explanations and redline suggestions — powered by Claude AI.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-tight">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Upload */}
        <UploadZone />

        <p className="mt-5 text-xs text-slate-400">
          Supports <span className="font-medium text-slate-500">PDF</span> and <span className="font-medium text-slate-500">DOCX</span> · Max 50 MB · Encrypted in transit
        </p>
      </div>

      {/* Divider */}
      <div className="w-full max-w-2xl mt-16 pt-12 border-t border-slate-100 grid grid-cols-3 gap-6 text-center">
        {[
          { stat: "< 40s", label: "Average review time" },
          { stat: "99%", label: "Clause detection accuracy" },
          { stat: "SOC 2", label: "Security compliance" },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-2xl font-bold text-slate-900">{item.stat}</p>
            <p className="text-xs text-slate-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
