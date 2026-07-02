"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import API from "@/src/lib/axios";
import AppNavbar from "@/src/components/layout/AppNavbar";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type UploadHistoryItem = {
  id: string;
  fileName: string;
  rowCount: number;
  status: "SUCCESS" | "FAILED";
  uploadedAt: string;
};

const SAMPLE_ROWS = [
  { title: "Netflix", amount: "499", type: "Expense", category: "Entertainment" },
  { title: "Salary", amount: "45000", type: "Income", category: "Salary" },
  { title: "Groceries", amount: "1200", type: "Expense", category: "Food" },
  { title: "Coffee", amount: "200", type: "Expense", category: "Food" },
];

const TIPS = [
  "CSV must include headers",
  "File should be UTF-8 encoded",
  "Maximum file size is 5 MB",
  "Duplicate rows are ignored automatically",
  "Your upload is encrypted and secure",
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) + " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchUploadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await API.get("/uploads");
      setUploadHistory(res.data || []);
    } catch (err) {
      // Fail silently for history — upload flow itself is unaffected
      setUploadHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUploadHistory();
  }, [fetchUploadHistory]);

  const resetMessages = () => {
    setStatus("idle");
    setErrorMessage("");
    setProgress(0);
  };

  const validateAndSetFile = (selected: File | null | undefined) => {
    if (!selected) return;
    resetMessages();

    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setStatus("error");
      setErrorMessage("Only .csv files are supported.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("File exceeds the 5 MB size limit.");
      return;
    }

    setFile(selected);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    validateAndSetFile(dropped);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("error");
      setErrorMessage("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("uploading");
      setProgress(0);
      setErrorMessage("");

      await API.post("/transactions/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });

      setProgress(100);
      setStatus("success");
      fetchUploadHistory();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Upload failed. Please try again.");
      fetchUploadHistory();
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    resetMessages();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <AppNavbar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8">
        {/* Page Header */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-[fadeIn_0.5s_ease]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Upload CSV
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-md">
              Import your bank transactions in seconds. Drag a file in, or browse from your
              computer — we'll handle the rest.
            </p>
          </div>

          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#14B8A6]/10 border border-[#1F2937]">
            <svg
              className="h-9 w-9 sm:h-10 sm:w-10 text-[#06B6D4]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16V4M12 4L7 9M12 4l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </section>

        {/* Main Upload Card */}
        <section
          className="group relative rounded-2xl border border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl p-6 sm:p-8 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#06B6D4]/5 hover:border-[#1F2937] animate-[fadeIn_0.6s_ease]"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Upload your file</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1F2937] bg-[#1E293B] px-3 py-1 text-xs font-medium text-[#06B6D4]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4]" />
              CSV only
            </span>
          </div>

          <label
            htmlFor="csv-upload-input"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={[
              "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 sm:py-16 text-center cursor-pointer overflow-hidden transition-all duration-300",
              isDragging
                ? "border-[#06B6D4] bg-[#06B6D4]/5 scale-[1.01]"
                : "border-[#1F2937] bg-[#0B1120]/40 hover:border-[#14B8A6]/60 hover:bg-[#14B8A6]/[0.03]",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500",
                isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-40",
              ].join(" ")}
              style={{
                background:
                  "radial-gradient(600px circle at 50% 50%, rgba(6,182,212,0.10), transparent 60%)",
              }}
            />

            <input
              id="csv-upload-input"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => validateAndSetFile(e.target.files?.[0])}
              className="hidden"
            />

            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E293B] border border-[#1F2937] text-[#06B6D4] transition-transform duration-300 group-hover:scale-105">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 16V4M12 4L7 9M12 4l5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="relative z-10 space-y-1">
              <p className="text-sm sm:text-base font-medium text-white">
                Drag & drop your CSV here
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                or{" "}
                <span className="text-[#06B6D4] underline underline-offset-2">
                  click to browse
                </span>{" "}
                from your device
              </p>
            </div>

            <p className="relative z-10 text-[11px] text-slate-500">
              Accepted format: .csv &middot; Max size 5 MB
            </p>
          </label>

          {file && (
            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-[#1F2937] bg-[#1E293B]/60 px-4 py-3 animate-[scaleIn_0.25s_ease]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#06B6D4]/10 text-[#06B6D4]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="shrink-0 text-xs font-medium text-slate-400 hover:text-[#FB7185] transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          {status === "uploading" && (
            <div className="mt-5 space-y-2 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E293B]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#14B8A6] transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E] animate-[fadeIn_0.3s_ease]">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              CSV uploaded successfully. Your transactions are being processed.
            </div>
          )}

          {status === "error" && errorMessage && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#FB7185]/30 bg-[#FB7185]/10 px-4 py-3 text-sm text-[#FB7185] animate-[fadeIn_0.3s_ease]">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#14B8A6] px-6 py-3 text-sm font-semibold text-[#0B1120] shadow-md shadow-[#06B6D4]/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#06B6D4]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Uploading…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 16V4M12 4L7 9M12 4l5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Upload File
              </>
            )}
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instruction Card */}
          <section className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#06B6D4]/5 animate-[fadeIn_0.7s_ease]">
            <h2 className="text-lg font-semibold text-white mb-1">Required CSV format</h2>
            <p className="text-sm text-slate-400 mb-4">
              Your file needs these four columns, in any order, with a header row.
            </p>

            <div className="overflow-x-auto rounded-xl border border-[#1F2937]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1E293B] text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ROWS.map((row, idx) => (
                    <tr
                      key={row.title}
                      className={[
                        "border-t border-[#1F2937] transition-colors hover:bg-[#1E293B]/50",
                        idx % 2 === 0 ? "bg-transparent" : "bg-[#0B1120]/30",
                      ].join(" ")}
                    >
                      <td className="px-4 py-2.5 text-white">{row.title}</td>
                      <td className="px-4 py-2.5 text-slate-300">{row.amount}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            row.type === "Income"
                              ? "bg-[#22C55E]/10 text-[#22C55E]"
                              : "bg-[#FB7185]/10 text-[#FB7185]",
                          ].join(" ")}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-300">{row.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tips Card */}
          <section className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#14B8A6]/5 animate-[fadeIn_0.8s_ease]">
            <h2 className="text-lg font-semibold text-white mb-1">Good to know</h2>
            <p className="text-sm text-slate-400 mb-4">
              A few things that keep your import clean and safe.
            </p>

            <ul className="space-y-3">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[#14B8A6]">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Recent Uploads */}
        <section className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 animate-[fadeIn_0.9s_ease]">
          <h2 className="text-lg font-semibold text-white mb-1">Recent uploads</h2>
          <p className="text-sm text-slate-400 mb-6">Your last few imports will appear here.</p>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="h-5 w-5 animate-spin text-slate-500" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          ) : uploadHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#1F2937] bg-[#0B1120]/30 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E293B] border border-[#1F2937] text-slate-500">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 13h6m-6 4h6M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">No uploads yet</p>
                <p className="mt-1 text-xs text-slate-500">
                  Files you upload will show up here with their status and date.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#1F2937]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1E293B] text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-3 font-medium">File</th>
                    <th className="px-4 py-3 font-medium">Uploaded</th>
                    <th className="px-4 py-3 font-medium">Rows</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadHistory.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={[
                        "border-t border-[#1F2937] transition-colors hover:bg-[#1E293B]/50",
                        idx % 2 === 0 ? "bg-transparent" : "bg-[#0B1120]/30",
                      ].join(" ")}
                    >
                      <td className="px-4 py-2.5 text-white">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg
                            className="h-4 w-4 shrink-0 text-slate-500"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                          <span className="truncate">{item.fileName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-300">
                        {formatDate(item.uploadedAt)}
                      </td>
                      <td className="px-4 py-2.5 text-slate-300">{item.rowCount}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            item.status === "SUCCESS"
                              ? "bg-[#22C55E]/10 text-[#22C55E]"
                              : "bg-[#FB7185]/10 text-[#FB7185]",
                          ].join(" ")}
                        >
                          {item.status === "SUCCESS" ? "Success" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}