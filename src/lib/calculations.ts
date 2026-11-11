import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { AppState, Transaction } from "../types";

export function totalAssets(accounts: AppState["accounts"]): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

export function monthBounds(date: Date): { start: string; end: string } {
  const start = format(startOfMonth(date), "yyyy-MM-dd");
  const end = format(endOfMonth(date), "yyyy-MM-dd");
  return { start, end };
}

export function filterByMonth(transactions: Transaction[], month: Date): Transaction[] {
  const { start, end } = monthBounds(month);
  return transactions.filter((t) => t.date >= start && t.date <= end);
}

export function sumIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
}

export function sumExpense(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
}

export function categoryBreakdown(
  transactions: Transaction[],
  categories: AppState["categories"],
  type: "income" | "expense"
): { name: string; value: number; color: string }[] {
  const map = new Map<string, number>();
  for (const t of transactions.filter((x) => x.type === type && x.categoryId)) {
    const id = t.categoryId!;
    map.set(id, (map.get(id) ?? 0) + t.amount);
  }
  return [...map.entries()]
    .map(([id, value]) => {
      const cat = categories.find((c) => c.id === id);
      return {
        name: cat?.name ?? "未分类",
        value,
        color: cat?.color ?? "#94a3b8",
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function last6MonthsTrend(transactions: Transaction[]): {
  month: string;
  income: number;
  expense: number;
}[] {
  const now = new Date();
  const result: { month: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = subMonths(now, i);
    const list = filterByMonth(transactions, m);
    result.push({
      month: format(m, "M月", { locale: zhCN }),
      income: sumIncome(list),
      expense: sumExpense(list),
    });
  }
  return result;
}

export function applyTransactionBalances(
  accounts: AppState["accounts"],
  tx: Transaction,
  reverse = false
): AppState["accounts"] {
  const sign = reverse ? -1 : 1;
  return accounts.map((acc) => {
    if (tx.type === "income" && acc.id === tx.accountId) {
      return { ...acc, balance: acc.balance + sign * tx.amount };
    }
    if (tx.type === "expense" && acc.id === tx.accountId) {
      return { ...acc, balance: acc.balance - sign * tx.amount };
    }
    if (tx.type === "transfer") {
      if (acc.id === tx.accountId) {
        return { ...acc, balance: acc.balance - sign * tx.amount };
      }
      if (acc.id === tx.toAccountId) {
        return { ...acc, balance: acc.balance + sign * tx.amount };
      }
    }
    return acc;
  });
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function sortTransactionsDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    const d = b.date.localeCompare(a.date);
    if (d !== 0) return d;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function accountTypeLabel(type: AppState["accounts"][0]["type"]): string {
  const labels: Record<AppState["accounts"][0]["type"], string> = {
    cash: "现金",
    bank: "银行账户",
    card: "电子钱包",
    investment: "投资",
    other: "其他",
  };
  return labels[type];
}
