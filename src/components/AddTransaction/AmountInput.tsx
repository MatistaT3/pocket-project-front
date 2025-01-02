import React from "react";
import { View, TextInput, Text } from "react-native";
import { TransactionFormData } from "../../types/transaction.types";

interface AmountInputProps {
  amount: string;
  setFormData: (
    data:
      | TransactionFormData
      | ((prev: TransactionFormData) => TransactionFormData)
  ) => void;
}

export function AmountInput({ amount, setFormData }: AmountInputProps) {
  return (
    <View>
      <Text className="text-black/60 mb-2 text-sm">Monto</Text>
      <TextInput
        className="text-black p-4 rounded-full bg-black/[0.03]"
        value={amount}
        onChangeText={(text) =>
          setFormData(
            (prev: TransactionFormData): TransactionFormData => ({
              ...prev,
              amount: text,
            })
          )
        }
        placeholder="0"
        placeholderTextColor="#9ca3af"
        keyboardType="decimal-pad"
      />
    </View>
  );
}
