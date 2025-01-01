import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Animated,
} from "react-native";
import { DynamicIcon } from "../DynamicIcon";
import { Trash2, X } from "lucide-react-native";
import { TransactionDetailsProps } from "../../types/transaction.types";
import { useTransactions } from "../../hooks/useTransactions";
import { useTransactionContext } from "../../context/TransactionContext";

type Props = Omit<TransactionDetailsProps, "visible"> & {
  style?: any;
};

export function TransactionDetails({
  date,
  transactions,
  onClose,
  style,
}: Props) {
  const { deleteTransaction } = useTransactions();
  const { triggerRefresh } = useTransactionContext();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 20,
        mass: 1,
        stiffness: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        damping: 20,
        mass: 1,
        stiffness: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

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
              handleClose();
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
    <Animated.View
      className="absolute bg-white rounded-2xl shadow-sm p-4 z-10 w-[300px]"
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-black font-medium">{date}</Text>
        <Pressable
          onPress={handleClose}
          className="w-8 h-8 items-center justify-center rounded-full active:bg-black/5"
          hitSlop={8}
        >
          <X size={20} color="black" />
        </Pressable>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-sm text-black/60">Ingresos</Text>
          <Text className="text-lg font-medium text-emerald-600">
            +${formatNumber(totals.income)}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-black/60">Gastos</Text>
          <Text className="text-lg font-medium text-rose-600">
            -${formatNumber(totals.expenses)}
          </Text>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView
        className="max-h-[300px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
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
                  <Text className="text-sm text-black/60">
                    {transaction.paymentMethod.bank} ••••{" "}
                    {transaction.paymentMethod.lastFourDigits}
                  </Text>
                </View>

                <View className="items-end">
                  <Text
                    className={`text-base font-medium ${
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
        </View>
      </ScrollView>
    </Animated.View>
  );
}
