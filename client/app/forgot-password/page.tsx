"use client";

import { useState } from "react";
import API from "@/src/lib/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMsg("Reset token generated (check backend console)");
      console.log(res.data.resetToken);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Forgot Password</h1>

      <input
        className="border p-2 mt-4"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        onClick={handleSubmit}
      >
        Send Reset Link
      </button>

      <p className="mt-4">{msg}</p>
    </div>
  );
}