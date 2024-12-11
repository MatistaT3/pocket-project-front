import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Transaction } from "../types/transaction.types";
import { useAuth } from "../context/AuthContext";
import { getIconByName, getIconName } from "../utils/iconHelper";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

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

  const fetchTransactions = async (month?: Date) => {
    try {
      let query = supabase.from("transactions").select(`
        *,
        icon:icons(svg_path, name)
      `);

      if (month) {
        const startOfMonth = format(
          new Date(month.getFullYear(), month.getMonth(), 1),
          "yyyy-MM-dd"
        );
        const endOfMonth = format(
          new Date(month.getFullYear(), month.getMonth() + 1, 0),
          "yyyy-MM-dd"
        );
        query = query.gte("date", startOfMonth).lte("date", endOfMonth);
      }

      const { data, error } = await query.order("date", { ascending: false });

      if (error) throw error;

      const transformedData = data.map((item) => ({
        id: item.id,
        type: item.type,
        category: item.category,
        name: item.name,
        icon_data: item.icon,
        amount: item.amount,
        date: transformDateFormat(item.date),
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
        },
      }));

      setTransactions(transformedData);
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
          // No lanzamos el error para que la transacción aún se complete
        }
      } catch (balanceError) {
        console.warn("Error calling update_account_balance:", balanceError);
      }

      if (data) {
        const transformedTransaction = {
          ...data[0],
          date: transformDateFormat(data[0].date),
          recurrent: data[0].is_recurrent
            ? {
                frequency: data[0].recurrent_frequency,
                startDate: data[0].recurrent_start_date
                  ? transformDateFormat(data[0].recurrent_start_date)
                  : undefined,
                totalSpent: data[0].total_spent,
              }
            : undefined,
        };
        setTransactions((prev) => [...prev, transformedTransaction]);
      }

      return data?.[0];
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    fetchTransactions,
    refreshTransactions: fetchTransactions,
  };
}
