import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { ElevatedBaseModal } from "../ElevatedBaseModal";
import { DynamicIcon } from "../DynamicIcon";
import { Trash2 } from "lucide-react-native";
import { TransactionDetailsProps } from "../../types/transaction.types";
import { useTransactions } from "../../hooks/useTransactions";
import { useTransactionContext } from "../../context/TransactionContext";

export function TransactionDetails({
  visible,
  onClose,
  date,
  transactions,
}: TransactionDetailsProps) {
  const { deleteTransaction } = useTransactions();
  const { triggerRefresh } = useTransactionContext();

  const handleDelete = async (transaction: any) => {
    Alert.alert(
      "Eliminar Transacción",
      "¿Estás seguro que deseas eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const success = await deleteTransaction(transaction.id, {
              accountNumber: transaction.paymentMethod.accountNumber,
              amount: transaction.amount,
              type: transaction.type,
            });

            if (success) {
              triggerRefresh();
              Alert.alert("Éxito", "Transacción eliminada correctamente");
            } else {
              Alert.alert("Error", "No se pudo eliminar la transacción");
            }
          },
        },
      ]
    );
  };

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
      <View className="p-4 space-y-4">
        {/* Summary Cards */}
        <View className="flex-row space-x-4">
          <View className="flex-1 bg-green-50 py-2 px-4 rounded-xl">
            <Text className="text-sm text-green-700">Ingresos</Text>
            <Text className="text-lg font-bold text-green-600">
              +${formatNumber(totals.income)}
            </Text>
          </View>
          <View className="flex-1 bg-red-50 py-2 px-4 rounded-xl">
            <Text className="text-sm text-red-700">Gastos</Text>
            <Text className="text-lg font-bold text-red-600">
              -${formatNumber(totals.expenses)}
            </Text>
          </View>
        </View>

        <ScrollView className="space-y-2 max-h-96">
          {transactions.map((transaction, index) => (
            <View key={transaction.id} className="w-full">
              <View className="bg-background p-4 rounded-xl">
                <View className="flex-row items-center space-x-4">
                  <View className="p-2 rounded-lg">
                    <DynamicIcon
                      fallbackType={transaction.type}
                      size={24}
                      subscriptionName={
                        transaction.category === "subscriptions"
                          ? transaction.name
                          : undefined
                      }
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-medium text-textPrimary mb-0.5">
                      {transaction.name}
                    </Text>
                    <Text className="text-sm text-textSecondary">
                      {transaction.paymentMethod.bank} ••••{" "}
                      {transaction.paymentMethod.lastFourDigits}
                    </Text>
                  </View>

                  <View className="items-end space-y-1">
                    <Text
                      className={`text-base font-bold ${
                        transaction.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {formatNumber(transaction.amount)}
                    </Text>
                    <Pressable
                      onPress={() => handleDelete(transaction)}
                      className="w-7 h-7 rounded-full items-center justify-center active:bg-red-50"
                      hitSlop={8}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
              </View>
              {transactions.length > 1 && index < transactions.length - 1 && (
                <View className="h-[1px] bg-gray-100 mx-1 my-2" />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </ElevatedBaseModal>
  );
}
