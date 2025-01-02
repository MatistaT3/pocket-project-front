import React from "react";
import { View, TextInput, Text } from "react-native";
import { TransactionFormData } from "../../types/transaction.types";

interface TransactionNameInputProps {
  name: string;
  setFormData: (
    data:
      | TransactionFormData
      | ((prev: TransactionFormData) => TransactionFormData)
  ) => void;
}

export function TransactionNameInput({
  name,
  setFormData,
}: TransactionNameInputProps) {
  return (
    <View>
      <Text className="text-black/60 mb-2 text-sm">Nombre</Text>
      <TextInput
        className="text-black p-4 rounded-full bg-black/[0.03]"
        value={name}
        onChangeText={(text) =>
          setFormData(
            (prev: TransactionFormData): TransactionFormData => ({
              ...prev,
              name: text,
            })
          )
        }
        placeholder="Nombre de la transacción"
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}
