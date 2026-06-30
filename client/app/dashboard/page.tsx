"use client";

import { useEffect, useMemo, useState } from "react";
import API from "@/src/lib/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { generateInsights } from "@/src/lib/insights";
import { useRouter } from "next/navigation";
import AppNavbar from "@/src/components/layout/AppNavbar";
import {
  IndianRupee,
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Sparkles,
  Target,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShieldCheck,
  Zap,
  ListPlus,
} from "lucide-react";



interface Transaction {
  id: number;
  title: string;
  amount: number | string;
  type: "income" | "expense";
  category: string;
}

// 

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-700/80 bg-[#0B1120]/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label ?? payload[0]?.name}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="mt-1 text-sm font-semibold text-white">
          ₹{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();
  const [goal, setGoal] = useState(50000);
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
  });

  const fetchData = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data.data);
    setLoaded(true);
  };

useEffect(() => {
  fetchData();

  const token = localStorage.getItem("token");
  if (!token) router.push("/login");

  setMounted(true);
}, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTransaction = async (e: any) => {
    e.preventDefault();
    await API.post("/transactions", form);
    setForm({ title: "", amount: "", type: "expense", category: "" });
    fetchData();
  };

  const deleteTx = async (id: number) => {
    await API.delete(`/transactions/${id}`);
    fetchData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // 

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expense;
  const saved = balance > 0 ? balance : 0;
  const percentage = Math.min((saved / goal) * 100, 100);


  const monthlySaving = useMemo(() => {
  
    return saved;
  }, [saved]);

  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key = t.category?.trim() || "Other";
        map[key] = (map[key] || 0) + Number(t.amount);
      });
    return Object.entries(map)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  const healthScore = useMemo(() => {
    if (income === 0 && expense === 0) return 0;
    const ratio = income === 0 ? 0 : (income - expense) / income;
    return Math.max(0, Math.min(100, Math.round(50 + ratio * 50)));
  }, [income, expense]);

  const healthLabel =
    healthScore >= 75
      ? "Excellent"
      : healthScore >= 50
      ? "Stable"
      : healthScore >= 25
      ? "Needs attention"
      : "At risk";

  const insights = generateInsights(transactions);

  const recentTransactions = [...transactions].reverse().slice(0, 5);
  const allTransactionsReversed = [...transactions].reverse();

  const PIE_COLORS = ["#22C55E", "#FB7185"];
  const CATEGORY_COLORS = ["#06B6D4", "#14B8A6", "#22C55E", "#0EA5E9", "#34D399"];

  return (
    <div className="min-h-screen bg-[#0B1120] text-white selection:bg-cyan-500/30">
      <AppNavbar />

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
      
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">Welcome back</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Financial Overview
            </h1>
            {mounted && (
            <p className="mt-2 text-sm text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
                
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/transactions")}
              className="group flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#111827] px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/60 hover:bg-[#141e2e] hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <ListPlus className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
              View All
            </button>
            <button
              onClick={logout}
              className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/20 hover:shadow-lg hover:shadow-rose-500/10"
            >
              Logout
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Income"
            value={income}
            icon={<TrendingUp className="h-5 w-5" />}
            accent="cyan"
            sub="All-time inflow"
            loaded={loaded}
          />
          <StatCard
            label="Total Expense"
            value={expense}
            icon={<TrendingDown className="h-5 w-5" />}
            accent="rose"
            sub="All-time outflow"
            loaded={loaded}
          />
          <StatCard
            label="Balance"
            value={balance}
            icon={<Wallet className="h-5 w-5" />}
            accent="emerald"
            sub="Net position"
            loaded={loaded}
          />
          <StatCard
            label="Monthly Saving"
            value={monthlySaving}
            icon={<PiggyBank className="h-5 w-5" />}
            accent="teal"
            sub="Available to save"
            loaded={loaded}
          />
        </div>

        
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:border-slate-700">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Activity className="h-5 w-5 text-cyan-400" />
                Income vs Expense
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barCategoryGap={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94A3B8", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0E7490" />
                  </linearGradient>
                </defs>
                <Bar dataKey="value" fill="url(#barFill)" radius={[12, 12, 0, 0]} maxBarSize={90} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:border-slate-700">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Target className="h-5 w-5 text-emerald-400" />
              Distribution
            </h2>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={90}
                  innerRadius={58}
                  paddingAngle={4}
                  stroke="none"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-2 flex justify-center gap-6">
              <Legend dotClass="bg-emerald-400" label="Income" />
              <Legend dotClass="bg-rose-400" label="Expense" />
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      
          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:border-emerald-500/40">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <PiggyBank className="h-5 w-5 text-emerald-400" />
                Savings Goal
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                {percentage.toFixed(0)}%
              </span>
            </div>

            <div className="flex items-baseline justify-between text-sm">
              <span className="text-slate-400">Saved</span>
              <span className="font-semibold text-white">
                ₹{saved.toLocaleString()}{" "}
                <span className="text-slate-500">/ ₹{goal.toLocaleString()}</span>
              </span>
            </div>

            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000 ease-out"
                style={{ width: loaded ? `${percentage}%` : "0%" }}
              />
            </div>

            <p className="mt-4 text-sm text-slate-400">
              {percentage >= 100
                ? " Goal achieved — nice work."
                : `Keep going — ${(100 - percentage).toFixed(1)}% left.`}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <input
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-emerald-500"
              />
            </div>
          </div>

          {/* Financial Health Score */}
          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:border-cyan-500/40">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              Financial Health
            </h2>

            <div className="flex items-center gap-5">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1F2937" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={
                      loaded ? 2 * Math.PI * 42 * (1 - healthScore / 100) : 2 * Math.PI * 42
                    }
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-white">{healthScore}</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-cyan-400">{healthLabel}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  Based on your income-to-expense ratio across all tracked transactions.
                </p>
              </div>
            </div>
          </div>

        
          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:border-teal-500/40">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <Zap className="h-5 w-5 text-teal-400" />
              Top Categories
            </h2>

            {categoryTotals.length === 0 ? (
              <p className="text-sm text-slate-500">No expense data yet.</p>
            ) : (
              <div className="space-y-4">
                {categoryTotals.map((c, i) => {
                  const max = categoryTotals[0].value || 1;
                  const width = (c.value / max) * 100;
                  return (
                    <div key={c.category}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="text-slate-300">{c.category}</span>
                        <span className="font-medium text-white">
                          ₹{c.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: loaded ? `${width}%` : "0%",
                            backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

  
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#111827] via-[#0F1B2B] to-[#111827] p-6 shadow-lg shadow-cyan-500/5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <h2 className="relative mb-6 flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            AI Financial Assistant
          </h2>

          <div className="relative space-y-3">
            {insights.length === 0 ? (
              <p className="text-sm text-slate-500">
                Add a few transactions and your AI assistant will start surfacing insights here.
              </p>
            ) : (
              insights.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-slate-900"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                </div>
              ))
            )}
          </div>
        </div>

        
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Add Transaction */}
          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <Plus className="h-5 w-5 text-cyan-400" />
              Add Transaction
            </h2>

            <form onSubmit={addTransaction} className="space-y-4">
              <Field
                name="title"
                placeholder="Transaction title"
                value={form.title}
                onChange={handleChange}
              />
              <Field
                name="amount"
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                icon={<IndianRupee className="h-4 w-4 text-slate-500" />}
              />
              <Field
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3 font-semibold text-[#0B1120] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-[0.98]"
              >
                <span className="relative z-10">Add Transaction</span>
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </form>
          </div>

          
          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Activity className="h-5 w-5 text-teal-400" />
                Recent Activity
              </h2>
              <button
                onClick={() => router.push("/transactions")}
                className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline"
              >
                View all
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          t.type === "income"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {t.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                        <p className="text-xs text-slate-500">{t.category}</p>
                      </div>
                    </div>

                    <p
                      className={`text-sm font-bold ${
                        t.type === "income" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
            🧾 All Transactions
          </h2>

          {allTransactionsReversed.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No transactions yet.</div>
          ) : (
            <div className="grid max-h-[480px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {allTransactionsReversed.map((t) => (
                <div
                  key={t.id}
                  className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  <div>
                    <h3 className="font-semibold text-white">{t.title}</h3>
                    <p className="text-sm text-slate-500">{t.category}</p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        t.type === "income"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {t.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        t.type === "income" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                    </p>
                    <button
                      onClick={() => deleteTx(t.id)}
                      className="mt-2 flex items-center gap-1 text-sm text-rose-400/80 opacity-70 transition-all duration-300 hover:text-rose-300 hover:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
  loaded,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: "cyan" | "rose" | "emerald" | "teal";
  sub: string;
  loaded: boolean;
}) {
  const accents: Record<string, { text: string; ring: string; glow: string; bg: string }> = {
    cyan: {
      text: "text-cyan-400",
      ring: "hover:border-cyan-500/50",
      glow: "hover:shadow-cyan-500/10",
      bg: "bg-cyan-500/10",
    },
    rose: {
      text: "text-rose-400",
      ring: "hover:border-rose-500/50",
      glow: "hover:shadow-rose-500/10",
      bg: "bg-rose-500/10",
    },
    emerald: {
      text: "text-emerald-400",
      ring: "hover:border-emerald-500/50",
      glow: "hover:shadow-emerald-500/10",
      bg: "bg-emerald-500/10",
    },
    teal: {
      text: "text-teal-400",
      ring: "hover:border-teal-500/50",
      glow: "hover:shadow-teal-500/10",
      bg: "bg-teal-500/10",
    },
  };
  const a = accents[accent];

  return (
    <div
      className={`group rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${a.ring} ${a.glow}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.bg} ${a.text} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      <h2 className={`mt-4 text-3xl font-bold tracking-tight text-white transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
        ₹{value.toLocaleString()}
      </h2>

      <p className={`mt-3 text-xs font-medium ${a.text}`}>{sub}</p>
    </div>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  );
}

function Field({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 ${
          icon ? "pl-9" : ""
        }`}
      />
    </div>
  );
}
