import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Transaction } from "../types/transaction.types";
import { useAuth } from "../context/AuthContext";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  // Función para transformar fecha de YYYY-MM-DD a DD/MM/YYYY
  const transformDateFormat = (dbDate: string) => {
    try {
      const date = parse(dbDate, "yyyy-MM-dd", new Date());
      return format(date, "dd/MM/yyyy", { locale: es });
    } catch (error) {
      console.warn("Error transforming date:", error);
      return dbDate;
    }
  };

  // Función para transformar fecha de DD/MM/YYYY a YYYY-MM-DD
  const formatDateForDB = (appDate: string) => {
    try {
      const date = parse(appDate, "dd/MM/yyyy", new Date());
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.warn("Error formatting date for DB:", error);
      return appDate;
    }
  };

  // Función base para obtener transacciones de un período específico
  const fetchTransactionsByPeriod = async (startDate: Date, endDate: Date) => {
    if (!session?.user) return [];

    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          icon:icons(svg_path, name)
        `
        )
        .gte("date", formattedStartDate)
        .lte("date", formattedEndDate)
        .order("date", { ascending: false });

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        type: item.type,
        category: item.category,
        subcategory: item.subcategory,
        name: item.name,
        icon_data: item.icon,
        amount: item.amount,
        date: transformDateFormat(item.date),
        is_recurrent: item.is_recurrent,
        recurrent: item.is_recurrent
          ? {
              frequency: item.recurrent_frequency,
              startDate: item.recurrent_start_date
                ? transformDateFormat(item.recurrent_start_date)
                : undefined,
              totalSpent: item.total_spent,
            }
          : undefined,
        paymentMethod: {
          bank: item.payment_bank,
          lastFourDigits: item.payment_last_four,
          type: item.payment_type,
          accountNumber: item.account_number,
        },
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

  const addTransaction = async (
    newTransaction: Omit<Transaction, "id">,
    accountData: { accountNumber: string }
  ) => {
    try {
      const dbDate = formatDateForDB(newTransaction.date);

      const { data, error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: session?.user.id,
            type: newTransaction.type,
            category: newTransaction.category,
            subcategory: newTransaction.subcategory,
            name: newTransaction.name,
            icon_id:
              newTransaction.type === "income"
                ? "default_income"
                : "default_expense",
            amount: newTransaction.amount,
            date: dbDate,
            is_recurrent: !!newTransaction.recurrent,
            recurrent_frequency: newTransaction.recurrent?.frequency,
            recurrent_start_date: newTransaction.recurrent?.startDate
              ? formatDateForDB(newTransaction.recurrent.startDate)
              : null,
            payment_bank: newTransaction.paymentMethod.bank,
            payment_last_four: newTransaction.paymentMethod.lastFourDigits,
            payment_type: newTransaction.paymentMethod.type,
            account_number: accountData.accountNumber,
          },
        ])
        .select();

      if (transactionError) throw transactionError;

      // Intentamos actualizar el saldo de la cuenta
      try {
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

        if (balanceError) {
          console.warn("Error updating account balance:", balanceError);
        }
      } catch (balanceError) {
        console.warn("Error calling update_account_balance:", balanceError);
      }

      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return false;
    }
  };

  const deleteTransaction = async (
    transactionId: string,
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
    addTransaction,
    fetchTransactions,
    fetchTransactionsByMonth, // Exportamos la función para uso específico
    deleteTransaction,
  };
}
