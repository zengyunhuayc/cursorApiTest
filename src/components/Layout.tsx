import {
  BarChart3,
  LayoutDashboard,
  ListOrdered,
  Settings,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ViewId } from "../types";

const nav: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "总览", icon: LayoutDashboard },
  { id: "transactions", label: "流水", icon: ListOrdered },
  { id: "accounts", label: "账户", icon: Wallet },
  { id: "reports", label: "报表", icon: BarChart3 },
  { id: "settings", label: "设置", icon: Settings },
];

interface LayoutProps {
  view: ViewId;
  onNavigate: (id: ViewId) => void;
  children: ReactNode;
  onQuickAdd: () => void;
}

export function Layout({ view, onNavigate, children, onQuickAdd }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-surface-border bg-surface-elevated/50 p-4 md:min-h-screen">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-income flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-accent/20">
            资
          </div>
          <div>
            <h1 className="font-semibold text-base leading-tight">资金管理</h1>
            <p className="text-xs text-slate-500">个人 / 家庭财务</p>
          </div>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                view === id
                  ? "bg-accent-muted text-accent"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface-border/40"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={onQuickAdd}
          className="hidden md:flex mt-8 w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:brightness-110 transition"
        >
          记一笔
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
        {children}
      </main>
      <button
        type="button"
        onClick={onQuickAdd}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent text-white shadow-xl shadow-accent/30 font-semibold text-sm"
        aria-label="记一笔"
      >
        +
      </button>
    </div>
  );
}
