import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Transaction } from "../types/transaction.types";
import { useAuth } from "../context/AuthContext";
import { toAPIDate, toDisplayDate } from "../utils/dateFormat";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchTransactionsByPeriod = async (startDate: Date, endDate: Date) => {
    if (!session?.user) return [];

    try {
      const formattedStartDate = toAPIDate(startDate);
      const formattedEndDate = toAPIDate(endDate);

      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          icon:icons(svg_path, name)
        `
        )
        .eq("user_id", session.user.id)
        .gte("date", formattedStartDate)
        .lte("date", formattedEndDate)
        .order("date", { ascending: false });

      if (error) throw error;

      return data.map((item) => ({
        ...item,
        date: toDisplayDate(item.date),
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  // Función para obtener transacciones de un mes específico
  const fetchTransactionsByMonth = async (month: Date) => {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return fetchTransactionsByPeriod(startOfMonth, endOfMonth);
  };

  // Función principal que obtiene las transacciones del mes actual y el anterior
  const fetchTransactions = async (selectedMonth: Date) => {
    setLoading(true);
    try {
      // Obtener transacciones del mes anterior
      const startOfPreviousMonth = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() - 1,
        1
      );
      const endOfPreviousMonth = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        0
      );
      const previousMonthTransactions = await fetchTransactionsByPeriod(
        startOfPreviousMonth,
        endOfPreviousMonth
      );

      // Obtener transacciones del mes actual
      const startOfCurrentMonth = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        1
      );
      const endOfCurrentMonth = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1,
        0
      );
      const currentMonthTransactions = await fetchTransactionsByPeriod(
        startOfCurrentMonth,
        endOfCurrentMonth
      );

      // Combinar las transacciones
      setTransactions([
        ...previousMonthTransactions,
        ...currentMonthTransactions,
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (
    transactionId: number,
    accountData: {
      accountNumber: string;
      amount: number;
      type: "expense" | "income";
    }
  ) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);

      if (error) throw error;

      // Actualizar el saldo de la cuenta (revertir el efecto de la transacción)
      try {
        const { error: balanceError } = await supabase.rpc(
          "update_account_balance",
          {
            p_account_number: accountData.accountNumber,
            p_amount:
              accountData.type === "expense"
                ? accountData.amount
                : -accountData.amount,
          }
        );

        if (balanceError) {
          console.warn("Error updating account balance:", balanceError);
        }
      } catch (balanceError) {
        console.warn("Error calling update_account_balance:", balanceError);
      }

      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return false;
    }
  };

  return {
    transactions,
    loading,
    fetchTransactions,
    fetchTransactionsByMonth,
    deleteTransaction,
  };
}
