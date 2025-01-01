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

  const isValid = accountNumber.trim() && !isNaN(parseFloat(initialBalance));

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center space-x-3 mb-6">
        <Pressable
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-black/5"
          hitSlop={8}
        >
          <ChevronLeft size={24} color="black" />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-black">Agregar Cuenta</Text>
          <Text className="text-base text-black/60">{bankName}</Text>
        </View>
      </View>

      <View className="space-y-6">
        {/* Número de cuenta */}
        <View>
          <Text className="text-base text-black/60 mb-2">Número de cuenta</Text>
          <TextInput
            className="bg-black/[0.03] text-black px-4 h-12 rounded-2xl"
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Ej: 1234567890"
            placeholderTextColor="#00000040"
            keyboardType="number-pad"
          />
        </View>

        {/* Saldo inicial */}
        <View>
          <Text className="text-base text-black/60 mb-2">Saldo inicial</Text>
          <TextInput
            className="bg-black/[0.03] text-black px-4 h-12 rounded-2xl"
            value={initialBalance}
            onChangeText={setInitialBalance}
            placeholder="0"
            placeholderTextColor="#00000040"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Botón de guardar */}
        <View className="mt-4">
          <Pressable
            className={`h-12 rounded-full items-center justify-center ${
              isValid ? "bg-black active:bg-black/90" : "bg-black/20"
            }`}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text
              className={`font-medium ${
                isValid ? "text-white" : "text-black/40"
              }`}
            >
              Guardar Cuenta
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
