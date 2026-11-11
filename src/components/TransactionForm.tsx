import { useState } from "react";
import type { FundStore } from "../hooks/useFundStore";
import type { TransactionType } from "../types";

interface TransactionFormProps {
  store: FundStore;
  onDone: () => void;
}

const types: { id: TransactionType; label: string }[] = [
  { id: "expense", label: "支出" },
  { id: "income", label: "收入" },
  { id: "transfer", label: "转账" },
];

export function TransactionForm({ store, onDone }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(store.state.accounts[0]?.id ?? "");
  const [toAccountId, setToAccountId] = useState(
    store.state.accounts[1]?.id ?? store.state.accounts[0]?.id ?? ""
  );
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const categories = store.state.categories.filter((c) =>
    type === "transfer" ? false : c.type === type
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError("请输入有效金额");
      return;
    }
    if (!accountId) {
      setError("请选择账户");
      return;
    }
    if (type === "transfer" && accountId === toAccountId) {
      setError("转出与转入账户不能相同");
      return;
    }
    if (type !== "transfer" && !categoryId) {
      setError("请选择分类");
      return;
    }
    store.addTransaction({
      type,
      amount: num,
      accountId,
      toAccountId: type === "transfer" ? toAccountId : undefined,
      categoryId: type === "transfer" ? null : categoryId,
      note: note.trim(),
      date,
    });
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-surface border border-surface-border">
        {types.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setType(t.id);
              setCategoryId("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              type === t.id
                ? t.id === "income"
                  ? "bg-income/20 text-income"
                  : t.id === "expense"
                    ? "bg-expense/20 text-expense"
                    : "bg-accent-muted text-accent"
                : "text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1.5">金额（元）</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="w-full text-2xl font-semibold"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1.5">
            {type === "transfer" ? "转出账户" : "账户"}
          </label>
          <select className="w-full" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {store.state.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        {type === "transfer" ? (
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">转入账户</label>
            <select
              className="w-full"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
            >
              {store.state.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">分类</label>
            <select
              className="w-full"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">请选择</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1.5">日期</label>
          <input
            type="date"
            className="w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1.5">备注</label>
          <input
            type="text"
            className="w-full"
            placeholder="可选"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-expense">{error}</p>}

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-accent font-semibold text-white hover:brightness-110"
      >
        保存
      </button>
    </form>
  );
}
