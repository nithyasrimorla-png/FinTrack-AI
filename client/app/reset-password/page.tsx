"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/src/lib/axios";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) {
      setMsg("Invalid or missing reset token.");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMsg("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-[400px] text-white">
        <h1 className="text-3xl font-bold text-center">
          Reset Password
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Enter your new password.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-6 p-3 rounded-lg bg-slate-700 border border-slate-600"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full mt-5 bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg font-semibold"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {msg && (
          <p className="mt-4 text-center text-green-400">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}