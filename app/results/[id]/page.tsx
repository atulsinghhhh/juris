"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ClauseCard } from "../../components/ClauseCard";
import { RiskBadge } from "../../components/RiskBadge";

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

const OVERALL_RISK_STYLES: Record<string, string> = {
  High: "bg-red-50 border-red-200 text-red-700",
  Medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
  Low: "bg-green-50 border-green-200 text-green-700",
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
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">{fetchError}</p>
          <Link href="/" className="text-indigo-600 hover:underline text-sm">
            ← Back to upload
          </Link>
        </div>
      </main>
    );
  }

  if (!doc || doc.status === "processing") {
    return (
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto" />
          <div>
            <p className="font-semibold text-gray-800">Analyzing your contract…</p>
            <p className="text-sm text-gray-500 mt-1">Claude is reviewing all clauses. This takes 20–40 seconds.</p>
          </div>
        </div>
      </main>
    );
  }

  if (doc.status === "error") {
    return (
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Analysis Failed</p>
            <p className="text-sm text-gray-500 mt-1">{doc.error_message ?? "An unexpected error occurred."}</p>
          </div>
          <Link href="/" className="inline-block text-sm text-indigo-600 hover:underline">
            ← Try another contract
          </Link>
        </div>
      </main>
    );
  }

  const redCount = countByRisk(doc.clauses, "Red");
  const yellowCount = countByRisk(doc.clauses, "Yellow");
  const greenCount = countByRisk(doc.clauses, "Green");
  const overallStyle = OVERALL_RISK_STYLES[doc.overall_risk ?? ""] ?? "bg-gray-50 border-gray-200 text-gray-700";

  return (
    <main className="flex-1 px-4 py-10 max-w-3xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href="/" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mb-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            New review
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 truncate">{doc.filename}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Contract Review Report</p>
        </div>
        {doc.overall_risk && (
          <div className={`flex-shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold ${overallStyle}`}>
            Overall: {doc.overall_risk} Risk
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{redCount}</p>
          <p className="text-xs font-medium text-red-500 mt-0.5">High Risk</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{yellowCount}</p>
          <p className="text-xs font-medium text-yellow-500 mt-0.5">Medium Risk</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{greenCount}</p>
          <p className="text-xs font-medium text-green-500 mt-0.5">Low Risk</p>
        </div>
      </div>

      {/* Summary */}
      {doc.summary && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Executive Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{doc.summary}</p>
        </div>
      )}

      {/* Clause list */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Clause Analysis ({doc.clauses.length})
        </h2>
        {doc.clauses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No clauses were identified in this document.</p>
        ) : (
          <div className="space-y-3">
            {/* High risk first */}
            {["Red", "Yellow", "Green"].map((level) =>
              doc.clauses
                .filter((c) => c.risk_level === level)
                .map((clause) => <ClauseCard key={clause.id} clause={clause} />)
            )}
          </div>
        )}
      </div>
    </main>
  );
}
