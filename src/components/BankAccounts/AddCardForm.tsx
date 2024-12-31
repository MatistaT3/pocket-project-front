import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface AddCardFormProps {
  bankName: string;
  accountNumber: string;
  onBack: () => void;
  onAddCard: (
    lastFourDigits: string,
    type: "debit" | "credit"
  ) => Promise<void>;
}

export function AddCardForm({
  bankName,
  accountNumber,
  onBack,
  onAddCard,
}: AddCardFormProps) {
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [type, setType] = useState<"debit" | "credit">("debit");

  const handleSubmit = () => {
    if (lastFourDigits.length !== 4) {
      return;
    }
    onAddCard(lastFourDigits, type);
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
            Agregar Tarjeta
          </Text>
          <Text className="text-base text-textSecondary">
            {bankName} - Cuenta N° {accountNumber}
          </Text>
        </View>
      </View>

      <View className="space-y-4 mt-4">
        <View>
          <Text className="text-textSecondary mb-2 font-medium">
            Últimos 4 dígitos
          </Text>
          <TextInput
            className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
            value={lastFourDigits}
            onChangeText={(text) => {
              // Solo permitir números y máximo 4 dígitos
              if (/^\d{0,4}$/.test(text)) {
                setLastFourDigits(text);
              }
            }}
            placeholder="1234"
            placeholderTextColor="#755bce75"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        <View>
          <Text className="text-textSecondary mb-2 font-medium">
            Tipo de tarjeta
          </Text>
          <View className="flex-row space-x-2">
            <Pressable
              className={`flex-1 p-4 rounded-xl ${
                type === "debit" ? "bg-moderateBlue" : "bg-veryPaleBlue/20"
              }`}
              onPress={() => setType("debit")}
            >
              <Text
                className={`text-center font-medium ${
                  type === "debit" ? "text-white" : "text-textPrimary"
                }`}
              >
                Débito
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 p-4 rounded-xl ${
                type === "credit" ? "bg-moderateBlue" : "bg-veryPaleBlue/20"
              }`}
              onPress={() => setType("credit")}
            >
              <Text
                className={`text-center font-medium ${
                  type === "credit" ? "text-white" : "text-textPrimary"
                }`}
              >
                Crédito
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          className={`p-4 rounded-xl mt-4 ${
            lastFourDigits.length === 4
              ? "bg-moderateBlue"
              : "bg-moderateBlue/50"
          }`}
          onPress={handleSubmit}
          disabled={lastFourDigits.length !== 4}
        >
          <Text className="text-white text-center font-semibold">
            Guardar Tarjeta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
