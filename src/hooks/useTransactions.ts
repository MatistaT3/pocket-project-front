import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Transaction } from "../types/transaction.types";
import { useAuth } from "../context/AuthContext";
import { toAPIDate, toDisplayDate } from "../utils/dateFormat";
import { addMonths, isSameMonth } from "date-fns";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const shouldShowRecurrentTransaction = (
    startDate: string,
    currentDate: Date,
    frequencyName: string
  ) => {
    // Convertir ambas fechas a UTC para evitar problemas de zona horaria
    const start = new Date(startDate + "T12:00:00Z");
    const current = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      12,
      0,
      0
    );

    // Si la fecha actual es anterior a la fecha de inicio, no mostrar
    if (current < start) return false;

    // Obtener el día del mes de la fecha de inicio
    const dayOfMonth = start.getUTCDate();

    switch (frequencyName) {
      case "monthly":
        return current.getUTCDate() === dayOfMonth;
      case "bimonthly":
        const monthDiff =
          (current.getUTCFullYear() - start.getUTCFullYear()) * 12 +
          (current.getUTCMonth() - start.getUTCMonth());
        return monthDiff % 2 === 0 && current.getUTCDate() === dayOfMonth;
      case "quarterly":
        const quarterDiff =
          (current.getUTCFullYear() - start.getUTCFullYear()) * 12 +
          (current.getUTCMonth() - start.getUTCMonth());
        return quarterDiff % 3 === 0 && current.getUTCDate() === dayOfMonth;
      case "semiannual":
        const semiAnnualDiff =
          (current.getUTCFullYear() - start.getUTCFullYear()) * 12 +
          (current.getUTCMonth() - start.getUTCMonth());
        return semiAnnualDiff % 6 === 0 && current.getUTCDate() === dayOfMonth;
      case "annual":
        return (
          current.getUTCMonth() === start.getUTCMonth() &&
          current.getUTCDate() === dayOfMonth
        );
      case "weekly":
        const dayDiff = Math.floor(
          (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        return dayDiff % 7 === 0;
      case "custom":
        // Para custom, necesitaríamos frequency_days
        return false;
      default:
        return false;
    }
  };

  const fetchTransactionsByPeriod = async (startDate: Date, endDate: Date) => {
    if (!session?.user) return [];

    try {
      const formattedStartDate = toAPIDate(startDate);
      const formattedEndDate = toAPIDate(endDate);

      // Obtener transacciones normales del período
      const { data: normalTransactions, error: normalError } = await supabase
        .from("transactions")
        .select(
          `
          *,
          icon:icons(svg_path, name),
          recurrent_transaction:recurrent_transactions!transactions_recurrent_transaction_id_fkey(*)
        `
        )
        .eq("user_id", session.user.id)
        .gte("date", formattedStartDate)
        .lte("date", formattedEndDate);

      if (normalError) throw normalError;

      // Obtener transacciones recurrentes que no son del período actual
      const { data: recurrentTransactions, error: recurrentError } =
        await supabase
          .from("transactions")
          .select(
            `
          *,
          icon:icons(svg_path, name),
          recurrent_transaction:recurrent_transactions!transactions_recurrent_transaction_id_fkey(*)
        `
          )
          .eq("user_id", session.user.id)
          .eq("is_recurrent", true)
          .lt("date", formattedStartDate);

      if (recurrentError) throw recurrentError;

      // Procesar transacciones normales
      const processedNormal = normalTransactions.map((t) => ({
        ...t,
        date: toDisplayDate(t.date),
      }));

      // Procesar transacciones recurrentes
      const processedRecurrent = [];
      let currentDate = new Date(startDate);
      const endDateTime = endDate.getTime();

      while (currentDate.getTime() <= endDateTime) {
        for (const transaction of recurrentTransactions) {
          if (
            transaction.recurrent_transaction &&
            shouldShowRecurrentTransaction(
              transaction.date,
              currentDate,
              transaction.recurrent_transaction.frequency_name
            )
          ) {
            // Crear una "instancia virtual" de la transacción recurrente
            processedRecurrent.push({
              ...transaction,
              id: `${transaction.id}_${toAPIDate(currentDate)}`,
              date: toDisplayDate(currentDate),
              is_virtual_recurrent: true, // Flag para identificar instancias virtuales
              original_transaction: transaction, // Mantener referencia a la transacción original
            });
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return [...processedNormal, ...processedRecurrent];
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
