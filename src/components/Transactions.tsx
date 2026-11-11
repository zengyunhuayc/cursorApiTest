import { Trash2 } from "lucide-react";
import { formatMoney } from "../lib/format";
import type { FundStore } from "../hooks/useFundStore";

interface TransactionsProps {
  store: FundStore;
}

const typeLabels = {
  income: "收入",
  expense: "支出",
  transfer: "转账",
} as const;

export function Transactions({ store }: TransactionsProps) {
  const list = store.sortedTransactions;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">收支流水</h2>
        <p className="text-slate-500 text-sm mt-1">共 {list.length} 笔记录</p>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-surface-border">
                <th className="p-4 font-medium">日期</th>
                <th className="p-4 font-medium">类型</th>
                <th className="p-4 font-medium">分类 / 说明</th>
                <th className="p-4 font-medium">账户</th>
                <th className="p-4 font-medium text-right">金额</th>
                <th className="p-4 w-12" />
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    暂无流水，点击「记一笔」开始记录
                  </td>
                </tr>
              ) : (
                list.map((t) => {
                  const cat = store.getCategory(t.categoryId);
                  const acc = store.getAccount(t.accountId);
                  const detail =
                    t.type === "transfer"
                      ? `${acc?.name} → ${store.getAccount(t.toAccountId!)?.name}`
                      : [cat?.icon, cat?.name, t.note].filter(Boolean).join(" ");
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-surface-border/60 hover:bg-surface-border/20 transition"
                    >
                      <td className="p-4 text-slate-300 whitespace-nowrap">{t.date}</td>
                      <td className="p-4">
                        <TypeBadge type={t.type} />
                      </td>
                      <td className="p-4 max-w-[200px] truncate">{detail || "—"}</td>
                      <td className="p-4 text-slate-400">{acc?.name}</td>
                      <td
                        className={`p-4 text-right font-semibold tabular-nums ${
                          t.type === "income"
                            ? "text-income"
                            : t.type === "expense"
                              ? "text-expense"
                              : "text-accent"
                        }`}
                      >
                        {t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}
                        {formatMoney(t.amount)}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("确定删除该笔流水？账户余额将回滚。")) {
                              store.deleteTransaction(t.id);
                            }
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:text-expense hover:bg-expense/10"
                          aria-label="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: keyof typeof typeLabels }) {
  const styles = {
    income: "bg-income/15 text-income",
    expense: "bg-expense/15 text-expense",
    transfer: "bg-accent-muted text-accent",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${styles[type]}`}>
      {typeLabels[type]}
    </span>
  );
}
