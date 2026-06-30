"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppNavbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LEFT LINKS */}
        <div className="flex items-center gap-2 sm:gap-6">

          <Link
            href="/dashboard"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-cyan-400"
          >
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Transactions
          </Link>

          <Link
            href="/upload"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Upload CSV
          </Link>
        </div>

        {/* RIGHT - LOGOUT */}
        <button
          onClick={logout}
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/20 hover:shadow-lg hover:shadow-rose-500/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}