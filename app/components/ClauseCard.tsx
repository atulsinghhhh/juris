"use client";

import { useState } from "react";
import { RiskBadge } from "./RiskBadge";

interface Clause {
  id: string;
  clause_type: string;
  risk_level: string;
  original_text: string;
  reason: string;
  suggested_redline: string;
}

const leftBorder: Record<string, string> = {
  Red: "border-l-red-500",
  Yellow: "border-l-amber-400",
  Green: "border-l-emerald-500",
};

export function ClauseCard({ clause }: { clause: Clause }) {
  const [expanded, setExpanded] = useState(clause.risk_level === "Red");
  const border = leftBorder[clause.risk_level] ?? "border-l-slate-300";

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${border} shadow-sm overflow-hidden hover:shadow-md transition-shadow`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <RiskBadge level={clause.risk_level} />
          <span className="font-semibold text-slate-900 capitalize truncate">{clause.clause_type.replace(/_/g, " ")}</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Original Text</p>
            <blockquote className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3.5 italic border-l-2 border-slate-300">
              &ldquo;{clause.original_text}&rdquo;
            </blockquote>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Risk Analysis</p>
            <p className="text-sm text-slate-700 leading-relaxed">{clause.reason}</p>
          </div>

          {clause.suggested_redline && clause.suggested_redline !== "No changes needed." ? (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Suggested Redline</p>
              <div className="text-sm text-emerald-800 leading-relaxed bg-emerald-50 rounded-lg p-3.5 border border-emerald-200">
                {clause.suggested_redline}
              </div>
            </div>
          ) : clause.suggested_redline === "No changes needed." ? (
            <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No changes needed — clause is standard and acceptable.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
