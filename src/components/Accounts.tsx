import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { accountTypeLabel, totalAssets } from "../lib/calculations";
import { formatMoney } from "../lib/format";
import type { FundStore } from "../hooks/useFundStore";
import type { Account } from "../types";
import { Modal } from "./Modal";

interface AccountsProps {
  store: FundStore;
}

const accountTypes: Account["type"][] = ["cash", "bank", "card", "investment", "other"];

const palette = ["#3b9eff", "#34d399", "#f472b6", "#fbbf24", "#a78bfa", "#1677ff"];

export function Accounts({ store }: AccountsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<Account["type"]>("bank");
  const [balance, setBalance] = useState("");
  const [color, setColor] = useState(palette[0]);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setType("bank");
    setBalance("0");
    setColor(palette[Math.floor(Math.random() * palette.length)]);
    setModalOpen(true);
  };

  const openEdit = (acc: Account) => {
    setEditing(acc);
    setName(acc.name);
    setType(acc.type);
    setBalance(String(acc.balance));
    setColor(acc.color);
    setModalOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editing) {
      store.updateAccount(editing.id, { name: name.trim(), type, color });
      setModalOpen(false);
      return;
    }
    const bal = parseFloat(balance) || 0;
    store.addAccount({
      name: name.trim(),
      type,
      balance: bal,
      currency: "CNY",
      color,
    });
    setModalOpen(false);
  };

  const tryDelete = (id: string) => {
    const blocked = store.deleteAccount(id);
    if (blocked) {
      alert("该账户仍有关联流水，无法删除。");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">账户管理</h2>
          <p className="text-slate-500 text-sm mt-1">
            合计 {formatMoney(totalAssets(store.state.accounts))}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-sm font-semibold text-white"
        >
          <Plus className="w-4 h-4" />
          新建账户
        </button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.state.accounts.map((acc) => (
          <article key={acc.id} className="glass-card p-5 relative group">
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ backgroundColor: acc.color }}
            />
            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => openEdit(acc)}
                className="p-2 rounded-lg hover:bg-surface-border text-slate-400"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`删除账户「${acc.name}」？`)) tryDelete(acc.id);
                }}
                className="p-2 rounded-lg hover:bg-expense/10 text-slate-400 hover:text-expense"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">{accountTypeLabel(acc.type)}</p>
            <h3 className="text-lg font-semibold mt-1">{acc.name}</h3>
            <p className="text-2xl font-bold tabular-nums mt-3">{formatMoney(acc.balance)}</p>
          </article>
        ))}
      </div>

      <Modal
        title={editing ? "编辑账户" : "新建账户"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">账户名称</label>
            <input
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：招商银行"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">类型</label>
            <select className="w-full" value={type} onChange={(e) => setType(e.target.value as Account["type"])}>
              {accountTypes.map((t) => (
                <option key={t} value={t}>
                  {accountTypeLabel(t)}
                </option>
              ))}
            </select>
          </div>
          {!editing && (
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">初始余额</label>
              <input
                type="number"
                step="0.01"
                className="w-full"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">标识色</label>
            <div className="flex gap-2 flex-wrap">
              {palette.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-white" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-accent font-semibold text-white">
            保存
          </button>
        </form>
      </Modal>
    </div>
  );
}
