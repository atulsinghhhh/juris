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

const borderColors: Record<string, string> = {
  Red: "border-l-red-500",
  Yellow: "border-l-yellow-400",
  Green: "border-l-green-500",
};

export function ClauseCard({ clause }: { clause: Clause }) {
  const [expanded, setExpanded] = useState(clause.risk_level === "Red");
  const border = borderColors[clause.risk_level] ?? "border-l-gray-300";

  return (
    <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${border} shadow-sm overflow-hidden`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <RiskBadge level={clause.risk_level} />
          <span className="font-semibold text-gray-800 capitalize truncate">{clause.clause_type}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Original Text</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 italic">
              &ldquo;{clause.original_text}&rdquo;
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Risk Analysis</p>
            <p className="text-sm text-gray-700 leading-relaxed">{clause.reason}</p>
          </div>

          {clause.suggested_redline && clause.suggested_redline !== "No changes needed." && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Suggested Redline</p>
              <p className="text-sm text-green-800 leading-relaxed bg-green-50 rounded-lg p-3 border border-green-100">
                {clause.suggested_redline}
              </p>
            </div>
          )}

          {clause.suggested_redline === "No changes needed." && (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No changes needed — clause is standard and acceptable.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
