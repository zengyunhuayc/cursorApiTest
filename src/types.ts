export type TransactionType = "income" | "expense" | "transfer";

export interface Account {
  id: string;
  name: string;
  type: "cash" | "bank" | "card" | "investment" | "other";
  balance: number;
  currency: string;
  color: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string | null;
  accountId: string;
  toAccountId?: string;
  note: string;
  date: string;
  createdAt: string;
}

export interface AppState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
}

export type ViewId = "dashboard" | "transactions" | "accounts" | "reports" | "settings";
