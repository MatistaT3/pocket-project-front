import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Transaction } from "../types/transaction.types";
import { useAuth } from "../context/AuthContext";
import { getIconByName, getIconName } from "../utils/iconHelper";

interface TransactionWithIcon extends Transaction {
  icon_data?: {
    svg_path: string;
    name: string;
  };
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          icon:icons(svg_path, name)
        `
        )
        .order("date", { ascending: false });

      if (error) throw error;

      setTransactions(
        data.map((item) => ({
          id: item.id,
          type: item.type,
          category: item.category,
          name: item.name,
          icon_data: item.icon,
          amount: item.amount,
          date: new Date(item.date).toLocaleDateString("es-ES"),
          recurrent: item.is_recurrent
            ? {
                frequency: item.recurrent_frequency,
                startDate: new Date(
                  item.recurrent_start_date
                ).toLocaleDateString("es-ES"),
                totalSpent: item.total_spent,
              }
            : undefined,
          paymentMethod: {
            bank: item.payment_bank,
            lastFourDigits: item.payment_last_four,
            type: item.payment_type,
          },
        }))
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (
    newTransaction: Omit<Transaction, "id">,
    accountData: { accountNumber: string }
  ) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: session?.user.id,
            type: newTransaction.type,
            category: newTransaction.category,
            name: newTransaction.name,
            icon_id:
              newTransaction.type === "income"
                ? "default_income"
                : "default_expense",
            amount: newTransaction.amount,
            date: newTransaction.date,
            is_recurrent: !!newTransaction.recurrent,
            recurrent_frequency: newTransaction.recurrent?.frequency,
            recurrent_start_date: newTransaction.recurrent?.startDate,
            payment_bank: newTransaction.paymentMethod.bank,
            payment_last_four: newTransaction.paymentMethod.lastFourDigits,
            payment_type: newTransaction.paymentMethod.type,
          },
        ])
        .select();

      if (error) throw error;

      const { error: balanceError } = await supabase.rpc(
        "update_account_balance",
        {
          p_account_number: accountData.accountNumber,
          p_amount:
            newTransaction.type === "expense"
              ? -newTransaction.amount
              : newTransaction.amount,
        }
      );

      if (balanceError) throw balanceError;

      setTransactions((prev) => [...prev, data[0]]);
      return data[0];
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    refreshTransactions: fetchTransactions,
  };
}
