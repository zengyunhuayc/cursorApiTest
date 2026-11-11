import { useState } from "react";
import { Accounts } from "./components/Accounts";
import { Dashboard } from "./components/Dashboard";
import { Layout } from "./components/Layout";
import { Modal } from "./components/Modal";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { TransactionForm } from "./components/TransactionForm";
import { Transactions } from "./components/Transactions";
import { useFundStore } from "./hooks/useFundStore";
import type { ViewId } from "./types";

export default function App() {
  const store = useFundStore();
  const [view, setView] = useState<ViewId>("dashboard");
  const [txModal, setTxModal] = useState(false);

  const content = {
    dashboard: <Dashboard store={store} />,
    transactions: <Transactions store={store} />,
    accounts: <Accounts store={store} />,
    reports: <Reports store={store} />,
    settings: <Settings store={store} />,
  }[view];

  return (
    <>
      <Layout view={view} onNavigate={setView} onQuickAdd={() => setTxModal(true)}>
        {content}
      </Layout>
      <Modal title="记一笔" open={txModal} onClose={() => setTxModal(false)} wide>
        <TransactionForm store={store} onDone={() => setTxModal(false)} />
      </Modal>
    </>
  );
}
