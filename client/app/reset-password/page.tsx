"use client";

import { useState } from "react";
import API from "@/src/lib/axios";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async () => {
    try {
      await API.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMsg("Password reset successful!");
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Reset Password</h1>

      <input
        className="border p-2 mt-4"
        placeholder="Enter token"
        onChange={(e) => setToken(e.target.value)}
      />

      <input
        className="border p-2 mt-4"
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-green-500 text-white px-4 py-2 mt-4"
        onClick={handleReset}
      >
        Reset Password
      </button>

      <p className="mt-4">{msg}</p>
    </div>
  );
}