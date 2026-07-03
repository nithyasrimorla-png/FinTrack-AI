"use client";

import { useState } from "react";
import API from "@/src/lib/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });

      setMsg("Reset link sent successfully! Check your email.");

    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error sending reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-[400px]">
        <h1 className="text-3xl font-bold text-center">
          Forgot Password
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Enter your registered email address.
        </p>

        <input
          type="email"
          className="w-full border border-gray-600 bg-slate-700 rounded-lg p-3 mt-6"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg p-3 mt-5"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {msg && (
          <p className="text-center mt-4 text-green-400">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}