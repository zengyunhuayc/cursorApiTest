import { useState } from "react";
import type { FundStore } from "../hooks/useFundStore";

interface SettingsProps {
  store: FundStore;
}

export function Settings({ store }: SettingsProps) {
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState<"income" | "expense">("expense");
  const [icon, setIcon] = useState("📌");

  const addCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    store.addCategory({
      name: catName.trim(),
      type: catType,
      icon: icon || "📌",
      color: catType === "income" ? "#34d399" : "#f87171",
    });
    setCatName("");
  };

  return (
    <div className="space-y-6 max-w-xl">
      <header>
        <h2 className="text-2xl font-bold">设置</h2>
        <p className="text-slate-500 text-sm mt-1">分类与数据管理</p>
      </header>

      <section className="glass-card p-5 space-y-4">
        <h3 className="font-medium">新增分类</h3>
        <form onSubmit={addCat} className="space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1"
              placeholder="分类名称"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            <input
              className="w-16 text-center"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={2}
              title="图标 emoji"
            />
          </div>
          <select value={catType} onChange={(e) => setCatType(e.target.value as "income" | "expense")}>
            <option value="expense">支出分类</option>
            <option value="income">收入分类</option>
          </select>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-surface-border font-medium text-sm">
            添加分类
          </button>
        </form>
        <ul className="text-sm text-slate-400 divide-y divide-surface-border max-h-48 overflow-y-auto">
          {store.state.categories.map((c) => (
            <li key={c.id} className="py-2 flex justify-between">
              <span>
                {c.icon} {c.name}
              </span>
              <span>{c.type === "income" ? "收入" : "支出"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass-card p-5 space-y-3">
        <h3 className="font-medium">数据</h3>
        <p className="text-sm text-slate-500">
          所有数据保存在浏览器本地（localStorage），刷新后仍会保留。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm("将恢复演示数据，当前数据会被覆盖。继续？")) {
                store.restoreDemo();
              }
            }}
            className="px-4 py-2 rounded-xl border border-surface-border text-sm hover:bg-surface-border/30"
          >
            恢复演示数据
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("确定清空并重置为初始演示数据？")) {
                store.clearAll();
              }
            }}
            className="px-4 py-2 rounded-xl border border-expense/40 text-expense text-sm hover:bg-expense/10"
          >
            重置全部
          </button>
        </div>
      </section>

      <section className="glass-card p-5 text-sm text-slate-500 space-y-2">
        <h3 className="font-medium text-slate-300">使用说明</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>记一笔：支持收入、支出与账户间转账</li>
          <li>删除流水会自动校正对应账户余额</li>
          <li>有关联流水的账户无法直接删除</li>
        </ul>
      </section>
    </div>
  );
}
