import React from "react";
import { View, Text, ScrollView } from "react-native";
import { BaseModal } from "./BaseModal";
import { DynamicIcon } from "./DynamicIcon";
import { Transaction } from "../types/transaction.types";

interface TransactionDetailsProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  transactions: Transaction[];
}

export function TransactionDetails({
  visible,
  onClose,
  date,
  transactions,
}: TransactionDetailsProps) {
  // Calcular el total de ingresos y gastos
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
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={`Transacciones del ${date}`}
    >
      <View className="space-y-4">
        {/* Totales */}
        <View className="flex-row justify-between">
          <View>
            <Text className="text-textSecondary">Ingresos</Text>
            <Text className="text-textPrimary text-lg font-bold">
              ${totals.income.toFixed(2)}
            </Text>
          </View>
          <View>
            <Text className="text-textSecondary">Gastos</Text>
            <Text className="text-textPrimary text-lg font-bold">
              ${totals.expenses.toFixed(2)}
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
                {transaction.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </BaseModal>
  );
}
