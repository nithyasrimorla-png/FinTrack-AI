"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/src/lib/axios";
import AppNavbar from "@/src/components/layout/AppNavbar";
import {
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  X,
  ListFilter,
  ArrowDownWideNarrow,
  Calendar,
  Tag,
  Receipt,
  Download,
  Plus,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Heart,
  Briefcase,
  Film,
  Gift,
  Zap,
  GraduationCap,
  PiggyBank,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ---------- Types ----------

interface Transaction {
  id: number;
  title: string;
  amount: number | string;
  type: "income" | "expense";
  category: string;
  date?: string;
  createdAt?: string;
}

type SortKey = "newest" | "oldest" | "amount-high" | "amount-low" | "category";

// ---------- Category icon mapping ----------

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  food: Utensils,
  dining: Utensils,
  groceries: ShoppingBag,
  shopping: ShoppingBag,
  rent: Home,
  housing: Home,
  transport: Car,
  travel: Car,
  health: Heart,
  medical: Heart,
  salary: Briefcase,
  income: Briefcase,
  entertainment: Film,
  gift: Gift,
  utilities: Zap,
  bills: Zap,
  education: GraduationCap,
  savings: PiggyBank,
};

function getCategoryIcon(category: string) {
  const key = category?.toLowerCase().trim() || "";
  for (const k of Object.keys(CATEGORY_ICONS)) {
    if (key.includes(k)) return CATEGORY_ICONS[k];
  }
  return Tag;
}

// ---------- Confirm Delete Dialog ----------

function ConfirmDialog({
  open,
  title,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-2xl shadow-black/40 transition-all duration-300">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-center text-lg font-semibold text-white">
          Delete transaction?
        </h3>
        <p className="mt-2 text-center text-sm text-slate-400">
          This will permanently remove{" "}
          <span className="font-medium text-slate-200">&ldquo;{title}&rdquo;</span>. This action
          cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800 active:scale-[0.97]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-500/90 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/30 active:scale-[0.97]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [loaded, setLoaded] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const router = useRouter();

  const fetchTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data.data);
    setLoaded(true);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const deleteTransaction = async (id: number) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  // ---------- Derived stats ----------

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const netBalance = totalIncome - totalExpense;

  const avgTransaction =
    transactions.length === 0
      ? 0
      : transactions.reduce((a, b) => a + Number(b.amount), 0) / transactions.length;

  const highestExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((max, t) => Math.max(max, Number(t.amount)), 0);

  const highestIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((max, t) => Math.max(max, Number(t.amount)), 0);

  // ---------- Filtering + search + sort ----------

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchesFilter = filter === "all" ? true : t.type === filter;
      const matchesSearch =
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    switch (sortKey) {
      case "newest":
        result = [...result].reverse();
        break;
      case "oldest":
        result = [...result];
        break;
      case "amount-high":
        result = [...result].sort((a, b) => Number(b.amount) - Number(a.amount));
        break;
      case "amount-low":
        result = [...result].sort((a, b) => Number(a.amount) - Number(b.amount));
        break;
      case "category":
        result = [...result].sort((a, b) =>
          (a.category || "").localeCompare(b.category || "")
        );
        break;
    }

    return result;
  }, [transactions, filter, search, sortKey]);

  const hasActiveFilters = filter !== "all" || search.trim().length > 0;

  const clearFilters = () => {
    setFilter("all");
    setSearch("");
  };

  const handleExport = () => {
    const headers = ["Title", "Category", "Type", "Amount"];
    const rows = filteredTransactions.map((t) => [
      t.title,
      t.category,
      t.type,
      String(t.amount),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white selection:bg-cyan-500/30">
      <AppNavbar />

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">Manage</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {transactions.length} total transaction{transactions.length === 1 ? "" : "s"}{" "}
              tracked
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="group flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#111827] px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-[#141e2e] hover:shadow-lg hover:shadow-black/20 active:scale-[0.97]"
            >
              <Download className="h-4 w-4 text-teal-400 transition-transform duration-300 group-hover:translate-y-0.5" />
              Export
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-[#0B1120] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <StatCard
            label="Total Transactions"
            value={transactions.length.toString()}
            icon={<Layers className="h-4.5 w-4.5" />}
            accent="cyan"
            sub="All records"
            loaded={loaded}
          />
          <StatCard
            label="Total Income"
            value={`₹${totalIncome.toLocaleString()}`}
            icon={<TrendingUp className="h-4.5 w-4.5" />}
            accent="emerald"
            sub="All-time inflow"
            loaded={loaded}
          />
          <StatCard
            label="Total Expense"
            value={`₹${totalExpense.toLocaleString()}`}
            icon={<TrendingDown className="h-4.5 w-4.5" />}
            accent="rose"
            sub="All-time outflow"
            loaded={loaded}
          />
          <StatCard
            label="Net Balance"
            value={`₹${netBalance.toLocaleString()}`}
            icon={<Wallet className="h-4.5 w-4.5" />}
            accent="cyan"
            sub="Current position"
            loaded={loaded}
          />
          <StatCard
            label="Avg Transaction"
            value={`₹${Math.round(avgTransaction).toLocaleString()}`}
            icon={<Receipt className="h-4.5 w-4.5" />}
            accent="teal"
            sub="Per transaction"
            loaded={loaded}
          />
          <StatCard
            label="Highest Expense"
            value={`₹${highestExpense.toLocaleString()}`}
            icon={<ArrowDown className="h-4.5 w-4.5" />}
            accent="rose"
            sub="Largest outflow"
            loaded={loaded}
          />
          <StatCard
            label="Highest Income"
            value={`₹${highestIncome.toLocaleString()}`}
            icon={<ArrowUp className="h-4.5 w-4.5" />}
            accent="emerald"
            sub="Largest inflow"
            loaded={loaded}
          />
        </div>

        {/* ================= SEARCH + FILTERS ================= */}
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-5 shadow-lg shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Search by title or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <FilterPill
                active={filter === "all"}
                onClick={() => setFilter("all")}
                icon={<ListFilter className="h-3.5 w-3.5" />}
                label="All"
                color="cyan"
              />
              <FilterPill
                active={filter === "income"}
                onClick={() => setFilter("income")}
                icon={<ArrowUpRight className="h-3.5 w-3.5" />}
                label="Income"
                color="emerald"
              />
              <FilterPill
                active={filter === "expense"}
                onClick={() => setFilter("expense")}
                icon={<ArrowDownRight className="h-3.5 w-3.5" />}
                label="Expense"
                color="rose"
              />

              <div className="mx-1 hidden h-6 w-px bg-slate-800 sm:block" />

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="appearance-none rounded-full border border-slate-800 bg-slate-900 py-2 pl-8 pr-8 text-sm font-medium text-slate-300 outline-none transition-all duration-300 hover:border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                  <option value="category">Category</option>
                </select>
                <ArrowDownWideNarrow className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-400 transition-all duration-300 hover:border-rose-500/40 hover:text-rose-300 active:scale-95"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
              <span className="text-xs font-medium text-slate-500">Active filters:</span>
              {filter !== "all" && (
                <Chip label={filter === "income" ? "Income" : "Expense"} onClear={() => setFilter("all")} />
              )}
              {search.trim() && <Chip label={`"${search}"`} onClear={() => setSearch("")} />}
              <span className="ml-auto text-xs text-slate-500">
                {filteredTransactions.length} result{filteredTransactions.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>

        {/* ================= TRANSACTION LIST ================= */}
        {filteredTransactions.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClear={clearFilters}
            onAdd={() => router.push("/dashboard")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredTransactions.map((t) => {
              const Icon = getCategoryIcon(t.category);
              return (
                <div
                  key={t.id}
                  className="group flex items-center justify-between rounded-3xl border border-slate-800 bg-[#111827] p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-slate-700 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                        t.type === "income"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-white">{t.title}</h2>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                        <Tag className="h-3.5 w-3.5" />
                        {t.category}
                        {(t.date || t.createdAt) && (
                          <>
                            <span className="text-slate-700">•</span>
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(t.date || t.createdAt || "").toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </>
                        )}
                      </p>

                      <span
                        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 group-hover:shadow-sm ${
                          t.type === "income"
                            ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:shadow-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 group-hover:shadow-rose-500/20"
                        }`}
                      >
                        {t.type === "income" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {t.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <h2
                      className={`text-xl font-bold ${
                        t.type === "income" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                    </h2>

                    <button
                      onClick={() => setPendingDelete(t)}
                      aria-label="Delete transaction"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-rose-400/80 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-300 active:scale-90"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title={pendingDelete?.title || ""}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteTransaction(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

// ---------- Subcomponents ----------

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
  loaded,
}: {
  label: string;
  value: string;
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
      className={`group rounded-3xl border border-slate-800 bg-[#111827] p-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl ${a.ring} ${a.glow}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 leading-tight">{label}</p>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.text} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      <h2
        className={`mt-3 text-xl font-bold tracking-tight text-white transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {value}
      </h2>

      <p className={`mt-1.5 text-[11px] font-medium ${a.text}`}>{sub}</p>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: "cyan" | "emerald" | "rose";
}) {
  const activeStyles: Record<string, string> = {
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/50 shadow-rose-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95 ${
        active
          ? `${activeStyles[color]} shadow-lg`
          : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
      {label}
      <button
        onClick={onClear}
        className="rounded-full p-0.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function EmptyState({
  hasFilters,
  onClear,
  onAdd,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-[#111827] px-6 py-20 text-center shadow-lg shadow-black/20">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10">
        <div className="absolute inset-0 rounded-3xl bg-cyan-500/5 blur-xl" />
        <Receipt className="relative h-9 w-9 text-cyan-400" />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-white">
        {hasFilters ? "No matching transactions" : "No transactions yet"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Start tracking your money — add your first transaction to see it show up here."}
      </p>

      {hasFilters ? (
        <button
          onClick={onClear}
          className="mt-6 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800 active:scale-95"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </button>
      ) : (
        <button
          onClick={onAdd}
          className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-[#0B1120] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Your First Transaction
        </button>
      )}
    </div>
  );
}
