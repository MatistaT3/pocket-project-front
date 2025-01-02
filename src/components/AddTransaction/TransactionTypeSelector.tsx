import React from "react";
import { View, Pressable, Text } from "react-native";
import { ArrowUpCircle, ArrowDownCircle, Receipt } from "lucide-react-native";
import { TransactionFormData } from "../../types/transaction.types";

type TransactionMode = "expense" | "income" | "subscription";

interface TransactionTypeSelectorProps {
  transactionMode: TransactionMode;
  setTransactionMode: (mode: TransactionMode) => void;
  setShowSubscriptionSelector: (show: boolean) => void;
  setSelectedSubscription: (subscription: null) => void;
  setFormData: (
    data:
      | TransactionFormData
      | ((prev: TransactionFormData) => TransactionFormData)
  ) => void;
}

export function TransactionTypeSelector({
  transactionMode,
  setTransactionMode,
  setShowSubscriptionSelector,
  setSelectedSubscription,
  setFormData,
}: TransactionTypeSelectorProps) {
  return (
    <View>
      <Text className="text-black/60 mb-2 text-sm">Tipo de Transacción</Text>
      <View className="flex-row space-x-2">
        <Pressable
          className={`flex-1 p-4 rounded-2xl border ${
            transactionMode === "expense"
              ? "bg-black border-black"
              : "bg-black/[0.03] border-black/10"
          }`}
          onPress={() => {
            setTransactionMode("expense");
            setShowSubscriptionSelector(false);
            setSelectedSubscription(null);
            setFormData(
              (prev: TransactionFormData): TransactionFormData => ({
                ...prev,
                type: "expense",
                category: "",
                subcategory: "",
              })
            );
          }}
        >
          <View className="items-center space-y-2">
            <ArrowUpCircle
              size={20}
              color={transactionMode === "expense" ? "white" : "black"}
            />
            <Text
              className={`text-center font-medium ${
                transactionMode === "expense" ? "text-white" : "text-black"
              }`}
            >
              Gasto
            </Text>
          </View>
        </Pressable>

        <Pressable
          className={`flex-1 p-4 rounded-2xl border ${
            transactionMode === "subscription"
              ? "bg-black border-black"
              : "bg-black/[0.03] border-black/10"
          }`}
          onPress={() => {
            setTransactionMode("subscription");
            setShowSubscriptionSelector(true);
            setFormData(
              (prev: TransactionFormData): TransactionFormData => ({
                ...prev,
                type: "expense",
              })
            );
          }}
        >
          <View className="items-center space-y-2">
            <Receipt
              size={20}
              color={transactionMode === "subscription" ? "white" : "black"}
            />
            <Text
              className={`text-center font-medium ${
                transactionMode === "subscription" ? "text-white" : "text-black"
              }`}
            >
              Suscripción
            </Text>
          </View>
        </Pressable>

        <Pressable
          className={`flex-1 p-4 rounded-2xl border ${
            transactionMode === "income"
              ? "bg-black border-black"
              : "bg-black/[0.03] border-black/10"
          }`}
          onPress={() => {
            setTransactionMode("income");
            setShowSubscriptionSelector(false);
            setSelectedSubscription(null);
            setFormData(
              (prev: TransactionFormData): TransactionFormData => ({
                ...prev,
                type: "income",
                category: "",
                subcategory: "",
              })
            );
          }}
        >
          <View className="items-center space-y-2">
            <ArrowDownCircle
              size={20}
              color={transactionMode === "income" ? "white" : "black"}
            />
            <Text
              className={`text-center font-medium ${
                transactionMode === "income" ? "text-white" : "text-black"
              }`}
            >
              Ingreso
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
