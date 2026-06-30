"use client";

import { useRouter } from "next/navigation";

export default function AppNavbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT - Brand */}
        <h1 className="text-xl font-bold text-white tracking-wide">
          FinPilot <span className="text-cyan-400">AI</span>
        </h1>

        {/* CENTER - Links */}
        <div className="hidden md:flex gap-8 text-sm text-slate-400">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-white transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/transactions")}
            className="hover:text-white transition"
          >
            Transactions
          </button>

          <button
            onClick={() => router.push("/upload")}
            className="hover:text-white transition"
          >
            Upload CSV
          </button>
        </div>

        {/* RIGHT - Logout */}
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200
                     hover:bg-slate-700 hover:text-white transition
                     border border-slate-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}