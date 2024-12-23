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
      <View className="space-y-4">
        <View className="flex-row justify-between bg-veryPaleBlue/10 p-4 rounded-xl">
          <View className="items-center flex-1">
            <Text className="text-textSecondary font-medium mb-1">
              Ingresos
            </Text>
            <Text className="text-green-500 text-lg font-bold">
              +${formatNumber(totals.income)}
            </Text>
          </View>
          <View className="w-[1px] bg-veryPaleBlue/20" />
          <View className="items-center flex-1">
            <Text className="text-textSecondary font-medium mb-1">Gastos</Text>
            <Text className="text-red-500 text-lg font-bold">
              -${formatNumber(totals.expenses)}
            </Text>
          </View>
        </View>

        <ScrollView className="space-y-2 max-h-96">
          {transactions.map((transaction) => (
            <View
              key={transaction.id}
              className="flex-row items-center justify-between bg-veryPaleBlue/5 p-4 rounded-xl"
            >
              <View className="flex-row items-center space-x-3 flex-1">
                <View
                  className={`rounded-full p-1 ${
                    transaction.type === "income"
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  <DynamicIcon fallbackType={transaction.type} size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-textPrimary font-medium">
                    {transaction.name}
                  </Text>
                  <Text className="text-textSecondary text-sm">
                    {transaction.paymentMethod.bank} ••••{" "}
                    {transaction.paymentMethod.lastFourDigits}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center space-x-3">
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
                <Pressable
                  onPress={() => handleDelete(transaction)}
                  className="w-8 h-8 rounded-full items-center justify-center active:bg-red-500/10"
                  hitSlop={8}
                >
                  <Trash2 size={20} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ElevatedBaseModal>
  );
}
