"use client";

import { useState } from "react";
import API from "@/src/lib/axios";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Brain,
  Wallet,
  BarChart3,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);

    
    setSuccessMessage("Login successful 🚀");

    
    setTimeout(() => {
      setSuccessMessage(null);
      router.push("/dashboard");
    }, 1500);

  } catch (err: any) {
    setSuccessMessage(err.response?.data?.message || "Login Failed");

    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">

    

      <div className="hidden lg:flex w-1/2 items-center justify-center p-16">

        <div className="max-w-lg">

          <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-8">

            <Brain size={48} className="text-cyan-400" />

          </div>

          <h1 className="text-5xl font-bold leading-tight">

            Welcome Back

          </h1>

          <p className="mt-6 text-slate-400 text-lg leading-8">

            Continue managing your finances with AI-powered insights,
            analytics and smart budgeting.

          </p>

          <div className="mt-12 space-y-5">

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500 transition hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">

              <div className="flex items-center gap-4">

                <Wallet className="text-cyan-400" />

                <div>

                  <h3 className="font-semibold">

                    Expense Tracking

                  </h3>

                  <p className="text-slate-400 text-sm">

                    Monitor every transaction effortlessly.

                  </p>

                </div>

              </div>

            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 hover:border-teal-500 transition hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]">

              <div className="flex items-center gap-4">

                <BarChart3 className="text-teal-400" />

                <div>

                  <h3 className="font-semibold">

                    Smart Analytics

                  </h3>

                  <p className="text-slate-400 text-sm">

                    Beautiful reports and interactive charts.

                  </p>

                </div>

              </div>

            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500 transition hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">

              <div className="flex items-center gap-4">

                <Brain className="text-cyan-400" />

                <div>

                  <h3 className="font-semibold">

                    AI Insights

                  </h3>

                  <p className="text-slate-400 text-sm">

                    Personalized financial recommendations.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    

      <div className="flex flex-1 items-center justify-center px-6">

        <div className="w-full max-w-md bg-[#111827]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-4xl font-bold">

            Login

          </h2>

          <p className="text-slate-400 mt-2 mb-8">

            Welcome back to FinPilot AI

          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="relative">

              <Mail
                className="absolute left-4 top-4 text-slate-500"
                size={20}
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

            </div>

            <div className="relative">

              <Lock
                className="absolute left-4 top-4 text-slate-500"
                size={20}
              />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
                        <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-slate-400">

                <input
                  type="checkbox"
                  className="accent-cyan-500 w-4 h-4"
                />

                Remember Me

              </label>

              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition"
              >
                Forgot Password?
              </button>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          

          <div className="flex items-center gap-4 my-8">

            <div className="flex-1 h-px bg-slate-700"></div>

            <span className="text-slate-500 text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-slate-700"></div>

          </div>

        

          <button
            onClick={() => router.push("/register")}
            className="w-full border border-cyan-500/40 text-cyan-400 py-3 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
          >
            Create New Account
          </button>

          <p className="text-center text-slate-500 text-sm mt-8">

            Secure authentication powered by JWT

          </p>

        </div>

      </div>

    </div>
  );
}