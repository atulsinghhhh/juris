"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ClauseCard } from "../../components/ClauseCard";

interface Clause {
  id: string;
  clause_type: string;
  risk_level: string;
  original_text: string;
  reason: string;
  suggested_redline: string;
  position: number;
}

interface Document {
  id: string;
  filename: string;
  status: "processing" | "done" | "error";
  overall_risk: string | null;
  summary: string | null;
  error_message: string | null;
  clauses: Clause[];
}

const RISK_STAT_STYLES = {
  Red: {
    wrap: "bg-red-50 border-red-100",
    num: "text-red-600",
    label: "text-red-500",
    title: "High Risk",
  },
  Yellow: {
    wrap: "bg-amber-50 border-amber-100",
    num: "text-amber-600",
    label: "text-amber-500",
    title: "Medium Risk",
  },
  Green: {
    wrap: "bg-emerald-50 border-emerald-100",
    num: "text-emerald-600",
    label: "text-emerald-500",
    title: "Low Risk",
  },
};

const OVERALL_CHIP: Record<string, string> = {
  High: "bg-red-50 border-red-200 text-red-700",
  Medium: "bg-amber-50 border-amber-200 text-amber-700",
  Low: "bg-emerald-50 border-emerald-200 text-emerald-700",
};

function countByRisk(clauses: Clause[], level: string) {
  return clauses.filter((c) => c.risk_level === level).length;
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<Document | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDoc = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Document not found");
      const data: Document = await res.json();
      setDoc(data);
      return data.status;
    } catch {
      setFetchError("Could not load the document. Please try again.");
      return "error";
    }
  }, [id]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const start = async () => {
      const status = await fetchDoc();
      if (status === "processing") {
        intervalId = setInterval(async () => {
          const s = await fetchDoc();
          if (s !== "processing") clearInterval(intervalId);
        }, 3000);
      }
    };
    start();
    return () => clearInterval(intervalId);
  }, [fetchDoc]);

  if (fetchError) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-semibold text-slate-900">Something went wrong</p>
          <p className="text-sm text-slate-500">{fetchError}</p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to upload
          </Link>
        </div>
      </div>
    );
  }

  if (!doc || doc.status === "processing") {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-5">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-slate-100" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-indigo-600 animate-spin" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-lg">Analyzing your contract…</p>
            <p className="text-sm text-slate-500 mt-1.5">Claude is reviewing all clauses. This takes 20–40 seconds.</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            {["Extracting clauses", "Scoring risks", "Generating redlines"].map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                {i > 0 && <span className="w-3 h-px bg-slate-300" />}
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (doc.status === "error") {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Analysis Failed</p>
            <p className="text-sm text-slate-500 mt-1">{doc.error_message ?? "An unexpected error occurred."}</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Try another contract
          </Link>
        </div>
      </div>
    );
  }

  const redCount = countByRisk(doc.clauses, "Red");
  const yellowCount = countByRisk(doc.clauses, "Yellow");
  const greenCount = countByRisk(doc.clauses, "Green");
  const overallChip = OVERALL_CHIP[doc.overall_risk ?? ""] ?? "bg-slate-50 border-slate-200 text-slate-700";

  return (
    <div className="flex-1 px-4 py-10 max-w-3xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            New review
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 truncate">{doc.filename}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Contract Review Report</p>
        </div>
        {doc.overall_risk && (
          <div className={`flex-shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold ${overallChip}`}>
            Overall: {doc.overall_risk} Risk
          </div>
        )}
      </div>

      {/* Risk stats */}
      <div className="grid grid-cols-3 gap-3">
        {(["Red", "Yellow", "Green"] as const).map((level) => {
          const s = RISK_STAT_STYLES[level];
          const count = level === "Red" ? redCount : level === "Yellow" ? yellowCount : greenCount;
          return (
            <div key={level} className={`border rounded-xl p-4 text-center ${s.wrap}`}>
              <p className={`text-3xl font-extrabold ${s.num}`}>{count}</p>
              <p className={`text-xs font-semibold mt-0.5 ${s.label}`}>{s.title}</p>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {doc.summary && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Executive Summary</h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{doc.summary}</p>
        </div>
      )}

      {/* Clause list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Clause Analysis
          </h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {doc.clauses.length} clause{doc.clauses.length !== 1 ? "s" : ""}
          </span>
        </div>

        {doc.clauses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-400">No clauses were identified in this document.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {["Red", "Yellow", "Green"].map((level) =>
              doc.clauses
                .filter((c) => c.risk_level === level)
                .map((clause) => <ClauseCard key={clause.id} clause={clause} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
