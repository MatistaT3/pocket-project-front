import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface AddAccountFormProps {
  bankName: string;
  onBack: () => void;
  onAddAccount: (
    accountNumber: string,
    initialBalance: number
  ) => Promise<void>;
}

export function AddAccountForm({
  bankName,
  onBack,
  onAddAccount,
}: AddAccountFormProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  const handleSubmit = () => {
    const balance = parseFloat(initialBalance);
    if (!accountNumber.trim()) {
      return;
    }
    if (isNaN(balance)) {
      return;
    }
    onAddAccount(accountNumber, balance);
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center space-x-3 py-4">
        <Pressable
          onPress={onBack}
          className="w-8 h-8 items-center justify-center"
          hitSlop={8}
        >
          <ChevronLeft size={24} color="#755bce" />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-textPrimary">
            Agregar Cuenta
          </Text>
          <Text className="text-base text-textSecondary">{bankName}</Text>
        </View>
      </View>

      <View className="space-y-4 mt-4">
        <View>
          <Text className="text-textSecondary mb-2 font-medium">
            Número de cuenta
          </Text>
          <TextInput
            className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Ej: 1234567890"
            placeholderTextColor="#755bce75"
            keyboardType="number-pad"
          />
        </View>

        <View>
          <Text className="text-textSecondary mb-2 font-medium">
            Saldo inicial
          </Text>
          <TextInput
            className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
            value={initialBalance}
            onChangeText={setInitialBalance}
            placeholder="0"
            placeholderTextColor="#755bce75"
            keyboardType="decimal-pad"
          />
        </View>

        <Pressable
          className="bg-moderateBlue p-4 rounded-xl mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">
            Guardar Cuenta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
