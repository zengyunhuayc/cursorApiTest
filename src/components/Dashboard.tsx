import { ArrowDownLeft, ArrowUpRight, TrendingUp, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  filterByMonth,
  last6MonthsTrend,
  sumExpense,
  sumIncome,
  totalAssets,
} from "../lib/calculations";
import { formatMoney } from "../lib/format";
import type { FundStore } from "../hooks/useFundStore";

interface DashboardProps {
  store: FundStore;
}

export function Dashboard({ store }: DashboardProps) {
  const month = new Date();
  const monthTx = filterByMonth(store.state.transactions, month);
  const income = sumIncome(monthTx);
  const expense = sumExpense(monthTx);
  const assets = totalAssets(store.state.accounts);
  const trend = last6MonthsTrend(store.state.transactions);
  const recent = store.sortedTransactions.slice(0, 6);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">财务总览</h2>
        <p className="text-slate-500 text-sm mt-1">本月收支与资产一览</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          label="总资产"
          value={formatMoney(assets)}
          accent="from-accent to-blue-600"
        />
        <StatCard
          icon={ArrowDownLeft}
          label="本月收入"
          value={formatMoney(income)}
          valueClass="text-income"
          accent="from-income/30 to-transparent"
        />
        <StatCard
          icon={ArrowUpRight}
          label="本月支出"
          value={formatMoney(expense)}
          valueClass="text-expense"
          accent="from-expense/30 to-transparent"
        />
        <StatCard
          icon={TrendingUp}
          label="本月结余"
          value={formatMoney(income - expense)}
          valueClass={income - expense >= 0 ? "text-income" : "text-expense"}
          accent="from-violet-500/30 to-transparent"
        />
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">近 6 个月收支趋势</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3544" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a222d",
                  border: "1px solid #2a3544",
                  borderRadius: 12,
                }}
                formatter={(value: number) => formatMoney(value)}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="收入"
                stroke="#34d399"
                fill="url(#incomeGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="支出"
                stroke="#f87171"
                fill="url(#expenseGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-slate-400 mb-4">账户余额</h3>
          <ul className="space-y-3">
            {store.state.accounts.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <AccountLabel color={a.color} name={a.name} />
                <span className="font-semibold tabular-nums">{formatMoney(a.balance)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-slate-400 mb-4">最近流水</h3>
          <ul className="space-y-3">
            {recent.map((t) => {
              const cat = store.getCategory(t.categoryId);
              const acc = store.getAccount(t.accountId);
              const label =
                t.type === "transfer"
                  ? `转账 → ${store.getAccount(t.toAccountId!)?.name}`
                  : cat?.name ?? t.type;
              return (
                <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{label}</p>
                    <p className="text-xs text-slate-500">
                      {t.date} · {acc?.name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-semibold tabular-nums ${
                      t.type === "income"
                        ? "text-income"
                        : t.type === "expense"
                          ? "text-expense"
                          : "text-accent"
                    }`}
                  >
                    {t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}
                    {formatMoney(t.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  valueClass = "text-white",
  accent,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  valueClass?: string;
  accent: string;
}) {
  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${accent}`}>
      <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className={`text-xl font-bold tabular-nums ${valueClass}`}>{value}</p>
    </div>
  );
}

function AccountLabel({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm">{name}</span>
    </div>
  );
}
