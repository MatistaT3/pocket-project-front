import React, { createContext, useContext, useState } from "react";

interface TransactionContextType {
  triggerRefresh: () => void;
  refreshCount: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshCount, setRefreshCount] = useState(0);

  const triggerRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <TransactionContext.Provider value={{ triggerRefresh, refreshCount }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
}
