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
      <View className="p-4">
        {/* Summary Cards */}
        <View className="flex-row justify-between">
          <View>
            <Text className="text-sm text-gray-500">Ingresos</Text>
            <Text className="text-lg font-bold text-emerald-600">
              +${formatNumber(totals.income)}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Gastos</Text>
            <Text className="text-lg font-bold text-rose-600">
              -${formatNumber(totals.expenses)}
            </Text>
          </View>
        </View>

        {/* Separador */}
        <View className="h-[0.5px] bg-black/10 my-4" />

        <ScrollView className="space-y-4">
          {transactions.map((transaction, index) => (
            <View key={transaction.id}>
              <View className="flex-row items-center">
                <DynamicIcon
                  fallbackType={transaction.type}
                  size={24}
                  subscriptionName={
                    transaction.category === "subscriptions"
                      ? transaction.name
                      : undefined
                  }
                  color="black"
                />

                <View className="flex-1 ml-4">
                  <Text className="text-base font-medium text-black">
                    {transaction.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {transaction.paymentMethod.bank} ••••{" "}
                    {transaction.paymentMethod.lastFourDigits}
                  </Text>
                </View>

                <View className="items-end">
                  <Text
                    className={`text-base font-bold ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {formatNumber(transaction.amount)}
                  </Text>
                  <Pressable
                    onPress={() => handleDelete(transaction)}
                    className="mt-1 w-7 h-7 rounded-full items-center justify-center active:bg-black/5"
                    hitSlop={8}
                  >
                    <Trash2 size={16} color="black" />
                  </Pressable>
                </View>
              </View>
              {transactions.length > 1 && index < transactions.length - 1 && (
                <View className="h-[0.5px] bg-black/10 my-4" />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </ElevatedBaseModal>
  );
}
