import React from "react";
import { View, Pressable, Text, Modal, ScrollView } from "react-native";
import { DATE_FORMAT, formatDate } from "../utils/dateFormat";
import { X } from "lucide-react-native";
import { Transaction } from "../types/transaction.types";
import { DynamicIcon } from "./DynamicIcon";

interface TransactionDetailsProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string | null;
  transactions: Transaction[];
}

export function TransactionDetails({
  visible,
  onClose,
  selectedDate,
  transactions,
}: TransactionDetailsProps) {
  if (!visible || !selectedDate) return null;

  const selectedDateObj = (() => {
    try {
      const [day, month, year] = selectedDate.split("/");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } catch (error) {
      console.error("Error parsing selectedDate:", error);
      return new Date();
    }
  })();

  const dateTransactions = transactions.filter((transaction) => {
    try {
      const [day, month, year] = transaction.date.split("/");
      const transactionDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      return (
        transactionDate.getDate() === selectedDateObj.getDate() &&
        transactionDate.getMonth() === selectedDateObj.getMonth() &&
        transactionDate.getFullYear() === selectedDateObj.getFullYear()
      );
    } catch (error) {
      console.error("Error comparing dates:", error);
      return false;
    }
  });

  const totalExpenses = dateTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = dateTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center p-4 bg-oxfordBlue/50">
        <View className="bg-oxfordBlue w-full max-w-sm rounded-3xl p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sand text-lg font-semibold">
              {formatDate(selectedDateObj, DATE_FORMAT.FULL_DATE)}
            </Text>
            <Pressable
              onPress={onClose}
              className="p-2 rounded-full bg-teal/20"
            >
              <X size={16} color="#F6DCAC" />
            </Pressable>
          </View>

          {/* Totales */}
          <View className="flex-row justify-between mb-4 bg-teal/10 p-3 rounded-2xl">
            <View>
              <Text className="text-coral text-sm">Balance del día</Text>
              <Text
                className={`text-xl font-bold ${
                  totalIncome - totalExpenses >= 0 ? "text-teal" : "text-orange"
                }`}
              >
                ${(totalIncome - totalExpenses).toFixed(2)}
              </Text>
            </View>
            <View className="items-end space-y-1">
              <View>
                <Text className="text-coral text-sm">Gastos</Text>
                <Text className="text-orange font-semibold">
                  -${totalExpenses.toFixed(2)}
                </Text>
              </View>
              <View>
                <Text className="text-coral text-sm">Ingresos</Text>
                <Text className="text-teal font-semibold">
                  +${totalIncome.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Lista de transacciones */}
          <ScrollView className="max-h-96">
            <View className="space-y-3">
              {dateTransactions.length > 0 ? (
                dateTransactions.map((transaction) => (
                  <View
                    key={transaction.id}
                    className="bg-teal/10 p-3 rounded-xl"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 bg-teal/20 rounded-lg items-center justify-center mr-3">
                          <DynamicIcon
                            svgPath={transaction.icon_data?.svg_path}
                            fallbackType={transaction.type}
                            size={16}
                          />
                        </View>
                        <View>
                          <Text className="text-sand font-medium">
                            {transaction.name}
                          </Text>
                          <Text className="text-coral text-sm">
                            {transaction.category}
                            {transaction.recurrent && " • Recurrente"}
                          </Text>
                        </View>
                      </View>
                      <Text
                        className={`font-semibold ${
                          transaction.type === "expense"
                            ? "text-orange"
                            : "text-teal"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}$
                        {transaction.amount.toFixed(2)}
                      </Text>
                    </View>

                    <View className="mt-2 bg-teal/5 p-2 rounded-lg">
                      <Text className="text-coral text-sm">
                        {transaction.paymentMethod.bank} ••••{" "}
                        {transaction.paymentMethod.lastFourDigits}
                        {" • "}
                        <Text className="capitalize">
                          {transaction.paymentMethod.type}
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-coral text-center py-4">
                  No hay transacciones para este día
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
