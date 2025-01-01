import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Calendar } from "../../components/Calendar/Calendar";
import { FinancialInsights } from "../../components/Calendar/FinancialInsights";
import { useTransactions } from "../../hooks/useTransactions";
import { useTransactionContext } from "../../context/TransactionContext";
import { Transaction } from "../../types/transaction.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/Header";

export default function TabCalendarScreen() {
  const { fetchTransactionsByMonth } = useTransactions();
  const { refreshCount } = useTransactionContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<
    Transaction[]
  >([]);
  const [previousMonthTransactions, setPreviousMonthTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener transacciones del mes actual
        const currentTransactions = await fetchTransactionsByMonth(
          selectedMonth
        );
        setCurrentMonthTransactions(currentTransactions);

        // Obtener transacciones del mes anterior
        const previousMonth = new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth() - 1
        );
        const previousTransactions = await fetchTransactionsByMonth(
          previousMonth
        );
        setPreviousMonthTransactions(previousTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, refreshCount]);

  // Calcular total mensual actual
  const monthlyTotal = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular total del mes anterior
  const previousMonthTotal = previousMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Verificar si hay datos históricos (transacciones en el mes anterior)
  const hasHistoricalData = previousMonthTransactions.length > 0;

  // Calcular gastos por categoría
  const categoryTotals = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      percentage: (total / monthlyTotal) * 100,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // Encontrar el día con mayor gasto
  const dailyTotals = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const [day, month, year] = transaction.date.split("/");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const dateStr = date.toISOString().split("T")[0];

      if (!acc[dateStr]) {
        acc[dateStr] = {
          date,
          total: 0,
          transactions: 0,
        };
      }
      acc[dateStr].total += transaction.amount;
      acc[dateStr].transactions += 1;
      return acc;
    }, {} as Record<string, { date: Date; total: number; transactions: number }>);

  const highestSpendingDay = Object.values(dailyTotals).sort(
    (a, b) => b.total - a.total
  )[0] || {
    date: new Date(),
    total: 0,
    transactions: 0,
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <Header />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView className="flex-1">
            <View className="mb-4">
              <Calendar onMonthChange={setSelectedMonth} />
            </View>
            <View className="px-4">
              <FinancialInsights
                monthlyTotal={monthlyTotal}
                previousMonthTotal={previousMonthTotal}
                topCategories={topCategories}
                highestSpendingDay={highestSpendingDay}
                currentDate={selectedMonth}
                hasHistoricalData={hasHistoricalData}
              />
            </View>
          </ScrollView>
        </GestureHandlerRootView>
      </SafeAreaView>
    </View>
  );
}
