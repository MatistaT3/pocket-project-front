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

  const isValid = lastFourDigits.length === 4;

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
          <Text className="text-2xl font-bold text-black">Agregar Tarjeta</Text>
          <Text className="text-base text-black/60">
            {bankName} · Cuenta N° {accountNumber}
          </Text>
        </View>
      </View>

      <View className="space-y-6">
        {/* Últimos 4 dígitos */}
        <View>
          <Text className="text-base text-black/60 mb-2">
            Últimos 4 dígitos
          </Text>
          <TextInput
            className="bg-black/[0.03] text-black px-4 h-12 rounded-2xl"
            value={lastFourDigits}
            onChangeText={(text) => {
              // Solo permitir números y máximo 4 dígitos
              if (/^\d{0,4}$/.test(text)) {
                setLastFourDigits(text);
              }
            }}
            placeholder="1234"
            placeholderTextColor="#00000040"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        {/* Tipo de tarjeta */}
        <View>
          <Text className="text-base text-black/60 mb-2">Tipo de tarjeta</Text>
          <View className="flex-row space-x-2">
            <Pressable
              className={`flex-1 h-12 rounded-2xl items-center justify-center ${
                type === "debit" ? "bg-black" : "bg-black/[0.03]"
              } active:bg-black/90`}
              onPress={() => setType("debit")}
            >
              <Text
                className={`font-medium ${
                  type === "debit" ? "text-white" : "text-black"
                }`}
              >
                Débito
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 h-12 rounded-2xl items-center justify-center ${
                type === "credit" ? "bg-black" : "bg-black/[0.03]"
              } active:bg-black/90`}
              onPress={() => setType("credit")}
            >
              <Text
                className={`font-medium ${
                  type === "credit" ? "text-white" : "text-black"
                }`}
              >
                Crédito
              </Text>
            </Pressable>
          </View>
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
              Guardar Tarjeta
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
