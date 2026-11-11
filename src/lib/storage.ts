import type { AppState } from "../types";

const STORAGE_KEY = "fund-management-v1";

const defaultCategories: AppState["categories"] = [
  { id: "c-salary", name: "工资", type: "income", icon: "💼", color: "#34d399" },
  { id: "c-bonus", name: "奖金", type: "income", icon: "🎁", color: "#2dd4bf" },
  { id: "c-invest", name: "投资收益", type: "income", icon: "📈", color: "#38bdf8" },
  { id: "c-other-in", name: "其他收入", type: "income", icon: "💰", color: "#a78bfa" },
  { id: "c-food", name: "餐饮", type: "expense", icon: "🍜", color: "#fb923c" },
  { id: "c-transport", name: "交通", type: "expense", icon: "🚗", color: "#60a5fa" },
  { id: "c-shopping", name: "购物", type: "expense", icon: "🛒", color: "#f472b6" },
  { id: "c-housing", name: "住房", type: "expense", icon: "🏠", color: "#fbbf24" },
  { id: "c-medical", name: "医疗", type: "expense", icon: "🏥", color: "#ef4444" },
  { id: "c-edu", name: "教育", type: "expense", icon: "📚", color: "#818cf8" },
  { id: "c-other-out", name: "其他支出", type: "expense", icon: "📤", color: "#94a3b8" },
];

const defaultAccounts: AppState["accounts"] = [
  {
    id: "acc-cash",
    name: "现金",
    type: "cash",
    balance: 5000,
    currency: "CNY",
    color: "#34d399",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc-bank",
    name: "工商银行",
    type: "bank",
    balance: 125800,
    currency: "CNY",
    color: "#3b9eff",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc-alipay",
    name: "支付宝",
    type: "card",
    balance: 8600,
    currency: "CNY",
    color: "#1677ff",
    createdAt: new Date().toISOString(),
  },
];

function seedTransactions(): AppState["transactions"] {
  const now = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };
  return [
    {
      id: "t1",
      type: "income",
      amount: 18000,
      categoryId: "c-salary",
      accountId: "acc-bank",
      note: "十一月工资",
      date: daysAgo(2),
      createdAt: new Date().toISOString(),
    },
    {
      id: "t2",
      type: "expense",
      amount: 45,
      categoryId: "c-food",
      accountId: "acc-alipay",
      note: "午餐",
      date: daysAgo(0),
      createdAt: new Date().toISOString(),
    },
    {
      id: "t3",
      type: "expense",
      amount: 3200,
      categoryId: "c-housing",
      accountId: "acc-bank",
      note: "房租",
      date: daysAgo(5),
      createdAt: new Date().toISOString(),
    },
    {
      id: "t4",
      type: "expense",
      amount: 128,
      categoryId: "c-transport",
      accountId: "acc-alipay",
      note: "地铁月卡",
      date: daysAgo(7),
      createdAt: new Date().toISOString(),
    },
    {
      id: "t5",
      type: "transfer",
      amount: 2000,
      categoryId: null,
      accountId: "acc-bank",
      toAccountId: "acc-alipay",
      note: "日常备用",
      date: daysAgo(10),
      createdAt: new Date().toISOString(),
    },
  ];
}

export function defaultState(): AppState {
  return {
    accounts: defaultAccounts,
    categories: defaultCategories,
    transactions: seedTransactions(),
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.accounts?.length) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState();
}
