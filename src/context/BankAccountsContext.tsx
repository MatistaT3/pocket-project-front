import React, { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";

interface BankAccount {
  id: string;
  created_at: string;
  name: string;
  balance: number;
  user_id: string;
}

interface BankAccountsContextType {
  bankAccounts: BankAccount[];
  fetchBankAccounts: () => Promise<void>;
  isLoading: boolean;
}

const BankAccountsContext = createContext<BankAccountsContextType | undefined>(
  undefined
);

export function BankAccountsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchBankAccounts() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      setBankAccounts(data || []);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <BankAccountsContext.Provider
      value={{
        bankAccounts,
        fetchBankAccounts,
        isLoading,
      }}
    >
      {children}
    </BankAccountsContext.Provider>
  );
}

export function useBankAccounts() {
  const context = useContext(BankAccountsContext);
  if (context === undefined) {
    throw new Error(
      "useBankAccounts must be used within a BankAccountsProvider"
    );
  }
  return context;
}
