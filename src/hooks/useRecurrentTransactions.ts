import { useState } from "react";
import { supabase } from "../lib/supabase";
import { RecurrentTransaction } from "../types/recurrent.types";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function useRecurrentTransactions() {
  const [recurrentTransactions, setRecurrentTransactions] = useState<
    RecurrentTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  // Función para transformar fecha de YYYY-MM-DD a DD/MM/YYYY
  const transformDateFormat = (dbDate: string) => {
    try {
      return format(new Date(dbDate), "dd/MM/yyyy", { locale: es });
    } catch (error) {
      console.warn("Error transforming date:", error);
      return dbDate;
    }
  };

  // Función para transformar fecha de DD/MM/YYYY a YYYY-MM-DD
  const formatDateForDB = (appDate: string) => {
    try {
      return format(new Date(appDate), "yyyy-MM-dd");
    } catch (error) {
      console.warn("Error formatting date for DB:", error);
      return appDate;
    }
  };

  const fetchRecurrentTransactions = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("recurrent_transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = data.map((item) => ({
        ...item,
        start_date: transformDateFormat(item.start_date),
        end_date: item.end_date
          ? transformDateFormat(item.end_date)
          : undefined,
        last_generated_date: item.last_generated_date
          ? transformDateFormat(item.last_generated_date)
          : undefined,
      }));

      setRecurrentTransactions(formattedData);
    } catch (error) {
      console.error("Error fetching recurrent transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRecurrentTransaction = async (
    transaction: Omit<
      RecurrentTransaction,
      "id" | "is_active" | "last_generated_date"
    >
  ) => {
    if (!session?.user) return false;

    try {
      const { data, error } = await supabase
        .from("recurrent_transactions")
        .insert([
          {
            user_id: session.user.id,
            ...transaction,
            start_date: formatDateForDB(transaction.start_date),
            end_date: transaction.end_date
              ? formatDateForDB(transaction.end_date)
              : null,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Actualizar el estado local
      setRecurrentTransactions((prev) => [
        {
          ...data,
          start_date: transformDateFormat(data.start_date),
          end_date: data.end_date
            ? transformDateFormat(data.end_date)
            : undefined,
        },
        ...prev,
      ]);

      return true;
    } catch (error) {
      console.error("Error adding recurrent transaction:", error);
      return false;
    }
  };

  const cancelRecurrentTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from("recurrent_transactions")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;

      // Actualizar el estado local
      setRecurrentTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );

      return true;
    } catch (error) {
      console.error("Error canceling recurrent transaction:", error);
      return false;
    }
  };

  return {
    recurrentTransactions,
    loading,
    fetchRecurrentTransactions,
    addRecurrentTransaction,
    cancelRecurrentTransaction,
  };
}
