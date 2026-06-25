"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type UploadState = "idle" | "dragging" | "uploading" | "error";

export function UploadZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("Uploading…");

  const processFile = useCallback(
    async (file: File) => {
      const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const allowedExts = [".pdf", ".docx"];
      const ext = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowed.includes(file.type) && !allowedExts.includes(ext)) {
        setError("Only PDF and DOCX files are accepted.");
        setState("error");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError("File must be under 50 MB.");
        setState("error");
        return;
      }

      setState("uploading");
      setError(null);
      setProgress("Uploading file…");

      const form = new FormData();
      form.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail ?? `Upload failed (${res.status})`);
        }
        const { document_id } = await res.json();
        setProgress("Analyzing contract…");
        router.push(`/results/${document_id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        setState("error");
      }
    },
    [router]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const isUploading = state === "uploading";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setState("dragging"); }}
        onDragLeave={() => setState("idle")}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-4
          rounded-2xl border-2 border-dashed px-8 py-16 transition-all cursor-pointer
          ${state === "dragging" ? "border-indigo-500 bg-indigo-50" : ""}
          ${state === "error" ? "border-red-300 bg-red-50" : ""}
          ${state === "idle" ? "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/40" : ""}
          ${isUploading ? "border-indigo-300 bg-indigo-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={onFileChange}
          className="sr-only"
          disabled={isUploading}
        />

        {isUploading ? (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            <div className="text-center">
              <p className="font-semibold text-indigo-700">{progress}</p>
              <p className="text-sm text-gray-500 mt-1">This usually takes 20–40 seconds</p>
            </div>
          </>
        ) : (
          <>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${state === "error" ? "bg-red-100" : "bg-indigo-100"}`}>
              {state === "error" ? (
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>

            <div className="text-center">
              <p className="font-semibold text-gray-800">
                {state === "dragging" ? "Drop your contract here" : "Upload your contract"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
              <p className="text-xs text-gray-400 mt-0.5">PDF or DOCX · Max 50 MB</p>
            </div>

            {state === "error" && error && (
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
