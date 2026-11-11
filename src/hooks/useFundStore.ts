import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyTransactionBalances,
  newId,
  sortTransactionsDesc,
} from "../lib/calculations";
import { defaultState, loadState, resetState, saveState } from "../lib/storage";
import type { Account, AppState, Category, Transaction } from "../types";

export function useFundStore() {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState((prev) => fn(prev));
  }, []);

  const addTransaction = useCallback(
    (input: Omit<Transaction, "id" | "createdAt">) => {
      const tx: Transaction = {
        ...input,
        id: newId("tx"),
        createdAt: new Date().toISOString(),
      };
      update((prev) => ({
        ...prev,
        transactions: [...prev.transactions, tx],
        accounts: applyTransactionBalances(prev.accounts, tx),
      }));
    },
    [update]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      update((prev) => {
        const tx = prev.transactions.find((t) => t.id === id);
        if (!tx) return prev;
        return {
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id),
          accounts: applyTransactionBalances(prev.accounts, tx, true),
        };
      });
    },
    [update]
  );

  const addAccount = useCallback(
    (input: Omit<Account, "id" | "createdAt">) => {
      const account: Account = {
        ...input,
        id: newId("acc"),
        createdAt: new Date().toISOString(),
      };
      update((prev) => ({ ...prev, accounts: [...prev.accounts, account] }));
    },
    [update]
  );

  const updateAccount = useCallback(
    (id: string, patch: Partial<Pick<Account, "name" | "type" | "color">>) => {
      update((prev) => ({
        ...prev,
        accounts: prev.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      }));
    },
    [update]
  );

  const deleteAccount = useCallback(
    (id: string) => {
      let blocked = false;
      update((prev) => {
        const hasTx = prev.transactions.some(
          (t) => t.accountId === id || t.toAccountId === id
        );
        if (hasTx) {
          blocked = true;
          return prev;
        }
        return { ...prev, accounts: prev.accounts.filter((a) => a.id !== id) };
      });
      return blocked;
    },
    [update]
  );

  const addCategory = useCallback(
    (input: Omit<Category, "id">) => {
      update((prev) => ({
        ...prev,
        categories: [...prev.categories, { ...input, id: newId("cat") }],
      }));
    },
    [update]
  );

  const restoreDemo = useCallback(() => {
    setState(defaultState());
  }, []);

  const clearAll = useCallback(() => {
    setState(resetState());
  }, []);

  const sortedTransactions = useMemo(
    () => sortTransactionsDesc(state.transactions),
    [state.transactions]
  );

  const getCategory = useCallback(
    (id: string | null) => state.categories.find((c) => c.id === id),
    [state.categories]
  );

  const getAccount = useCallback(
    (id: string) => state.accounts.find((a) => a.id === id),
    [state.accounts]
  );

  return {
    state,
    sortedTransactions,
    addTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addCategory,
    restoreDemo,
    clearAll,
    getCategory,
    getAccount,
  };
}

export type FundStore = ReturnType<typeof useFundStore>;
