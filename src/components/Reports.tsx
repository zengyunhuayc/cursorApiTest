import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  categoryBreakdown,
  filterByMonth,
  sumExpense,
  sumIncome,
} from "../lib/calculations";
import { formatMoney } from "../lib/format";
import type { FundStore } from "../hooks/useFundStore";

interface ReportsProps {
  store: FundStore;
}

export function Reports({ store }: ReportsProps) {
  const [monthStr, setMonthStr] = useState(() => new Date().toISOString().slice(0, 7));
  const monthDate = useMemo(() => new Date(`${monthStr}-01`), [monthStr]);
  const monthTx = filterByMonth(store.state.transactions, monthDate);
  const income = sumIncome(monthTx);
  const expense = sumExpense(monthTx);
  const expenseCats = categoryBreakdown(monthTx, store.state.categories, "expense");
  const incomeCats = categoryBreakdown(monthTx, store.state.categories, "income");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">统计报表</h2>
          <p className="text-slate-500 text-sm mt-1">按月份查看结构分析</p>
        </div>
        <input
          type="month"
          value={monthStr}
          onChange={(e) => setMonthStr(e.target.value)}
          className="text-sm"
        />
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Summary label="当月收入" amount={income} className="text-income" />
        <Summary label="当月支出" amount={expense} className="text-expense" />
        <Summary
          label="储蓄率"
          amount={income > 0 ? ((income - expense) / income) * 100 : 0}
          suffix="%"
          className="text-accent"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="支出分类">
          {expenseCats.length === 0 ? (
            <Empty />
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {expenseCats.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => formatMoney(v)}
                      contentStyle={{
                        background: "#1a222d",
                        border: "1px solid #2a3544",
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <CategoryList items={expenseCats} total={expense} />
            </>
          )}
        </ChartCard>

        <ChartCard title="收入分类">
          {incomeCats.length === 0 ? (
            <Empty />
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeCats} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={72}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(v: number) => formatMoney(v)}
                      contentStyle={{
                        background: "#1a222d",
                        border: "1px solid #2a3544",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {incomeCats.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <CategoryList items={incomeCats} total={income} />
            </>
          )}
        </ChartCard>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">收支对比（当月）</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "收入", value: income, fill: "#34d399" },
                { name: "支出", value: expense, fill: "#f87171" },
              ]}
            >
              <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip formatter={(v: number) => formatMoney(v)} />
              <Legend />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Summary({
  label,
  amount,
  suffix,
  className,
}: {
  label: string;
  amount: number;
  suffix?: string;
  className?: string;
}) {
  const display =
    suffix === "%"
      ? `${amount.toFixed(amount % 1 === 0 ? 0 : 1)}%`
      : formatMoney(amount);
  return (
    <div className="glass-card p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-xl font-bold mt-2 tabular-nums ${className}`}>{display}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      {children}
    </div>
  );
}

function CategoryList({
  items,
  total,
}: {
  items: { name: string; value: number; color: string }[];
  total: number;
}) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.name} className="flex justify-between items-center gap-2">
          <span className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="truncate">{item.name}</span>
          </span>
          <span className="text-slate-400 shrink-0">
            {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
          </span>
          <span className="font-medium tabular-nums shrink-0">{formatMoney(item.value)}</span>
        </li>
      ))}
    </ul>
  );
}

function Empty() {
  return <p className="text-center text-slate-500 py-12">该月暂无数据</p>;
}
