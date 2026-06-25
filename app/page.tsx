import { UploadZone } from "./components/UploadZone";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Juris</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            AI-Powered Contract Review
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-lg mx-auto">
            Upload a contract and get instant clause-by-clause risk analysis with redline suggestions — powered by Claude AI.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-sm">
          {["Clause extraction", "Risk scoring", "Redline suggestions", "Plain-English summary"].map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {f}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <UploadZone />
        </div>

        <p className="text-xs text-gray-400">
          Supports PDF and DOCX · Files are stored securely and never shared
        </p>
      </div>
    </main>
  );
}
