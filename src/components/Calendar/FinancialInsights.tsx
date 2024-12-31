import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Clock,
} from "lucide-react-native";

interface DailySpending {
  date: Date;
  total: number;
  transactions: number;
}

interface CategorySpending {
  category: string;
  total: number;
  percentage: number;
}

interface FinancialInsightsProps {
  monthlyTotal: number;
  previousMonthTotal: number;
  topCategories: CategorySpending[];
  highestSpendingDay: DailySpending;
  currentDate: Date;
  hasHistoricalData: boolean;
}

export function FinancialInsights({
  monthlyTotal,
  previousMonthTotal,
  topCategories,
  highestSpendingDay,
  currentDate,
  hasHistoricalData,
}: FinancialInsightsProps) {
  const spendingChange =
    hasHistoricalData && previousMonthTotal > 0
      ? ((monthlyTotal - previousMonthTotal) / previousMonthTotal) * 100
      : 0;
  const isSpendingUp = spendingChange > 0;

  return (
    <View className="space-y-4">
      {/* Resumen General */}
      <View className="bg-white p-4 rounded-3xl border border-veryPaleBlue/10">
        <Text className="text-textPrimary text-lg font-semibold mb-4">
          Resumen de {format(currentDate, "MMMM", { locale: es })}
        </Text>

        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-textSecondary">Gasto Total</Text>
            <Text className="text-textPrimary text-2xl font-bold">
              ${monthlyTotal.toLocaleString()}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-textSecondary">vs. Mes Anterior</Text>
            {hasHistoricalData && previousMonthTotal > 0 ? (
              <View className="flex-row items-center">
                {isSpendingUp ? (
                  <ArrowUpCircle size={20} color="#ef4444" />
                ) : (
                  <ArrowDownCircle size={20} color="#22c55e" />
                )}
                <Text
                  className={`ml-1 font-semibold ${
                    isSpendingUp ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {Math.abs(spendingChange).toFixed(1)}%
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Clock size={20} color="#64748b" />
                <Text className="ml-1 text-textSecondary">
                  {hasHistoricalData
                    ? "Sin datos del mes anterior"
                    : "Sin datos previos"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Día de Mayor Gasto */}
        {highestSpendingDay.total > 0 ? (
          <View className="bg-veryPaleBlue/10 p-3 rounded-xl mb-4">
            <Text className="text-textSecondary mb-1">Día de Mayor Gasto</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-textPrimary font-medium">
                {format(highestSpendingDay.date, "d 'de' MMMM", { locale: es })}
              </Text>
              <View className="items-end">
                <Text className="text-textPrimary font-semibold">
                  ${highestSpendingDay.total.toLocaleString()}
                </Text>
                <Text className="text-textSecondary text-sm">
                  {highestSpendingDay.transactions} transacciones
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-veryPaleBlue/10 p-3 rounded-xl mb-4">
            <Text className="text-textSecondary text-center">
              Aún no hay transacciones registradas este mes
            </Text>
          </View>
        )}

        {/* Top Categorías */}
        <Text className="text-textSecondary mb-2">Principales Categorías</Text>
        {topCategories.length > 0 ? (
          topCategories.map((category) => (
            <View key={category.category} className="mb-2">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-textPrimary">{category.category}</Text>
                <View className="flex-row items-center">
                  <Text className="text-textPrimary font-medium">
                    ${category.total.toLocaleString()}
                  </Text>
                  <Text className="text-textSecondary ml-1 text-sm">
                    ({category.percentage.toFixed(1)}%)
                  </Text>
                </View>
              </View>
              <View className="h-2 bg-veryPaleBlue/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-moderateBlue rounded-full"
                  style={{ width: `${category.percentage}%` }}
                />
              </View>
            </View>
          ))
        ) : (
          <Text className="text-textSecondary text-center py-2">
            Registra tus gastos para ver las categorías principales
          </Text>
        )}
      </View>
    </View>
  );
}
