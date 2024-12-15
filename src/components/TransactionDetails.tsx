import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ElevatedBaseModal } from "./ElevatedBaseModal";
import { DynamicIcon } from "./DynamicIcon";
import { TransactionDetailsProps } from "../types/transaction.types";

export function TransactionDetails({
  visible,
  onClose,
  date,
  transactions,
}: TransactionDetailsProps) {
  // Función para formatear números al estilo chileno
  const formatNumber = (number: number) => {
    return number.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return (
    <ElevatedBaseModal
      visible={visible}
      onClose={onClose}
      title={`Transacciones ${date}`}
    >
      <View className="space-y-4">
        {/* Totales */}
        <View className="flex-row justify-between">
          <View>
            <Text className="text-textSecondary font-medium">Ingresos</Text>
            <Text className="text-textPrimary text-lg font-bold">
              ${formatNumber(totals.income)}
            </Text>
          </View>
          <View>
            <Text className="text-textSecondary font-medium">Gastos</Text>
            <Text className="text-textPrimary text-lg font-bold">
              ${formatNumber(totals.expenses)}
            </Text>
          </View>
        </View>

        {/* Lista de transacciones */}
        <ScrollView className="space-y-2 max-h-96">
          {transactions.map((transaction) => (
            <View
              key={transaction.id}
              className="flex-row items-center justify-between bg-veryPaleBlue/5 p-4 rounded-xl"
            >
              <View className="flex-row items-center space-x-3">
                <DynamicIcon fallbackType={transaction.type} size={24} />
                <View>
                  <Text className="text-textPrimary font-medium">
                    {transaction.name}
                  </Text>
                  <Text className="text-textSecondary text-sm">
                    {transaction.paymentMethod.bank} ••••{" "}
                    {transaction.paymentMethod.lastFourDigits}
                  </Text>
                </View>
              </View>
              <Text
                className={`font-bold ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {formatNumber(transaction.amount)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ElevatedBaseModal>
  );
}
