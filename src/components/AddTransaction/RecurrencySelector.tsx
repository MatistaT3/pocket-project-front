import React from "react";
import { View, Pressable, Text, TextInput } from "react-native";
import {
  TransactionFormData,
  RecurrencyFrequency,
} from "../../types/transaction.types";

interface RecurrencySelectorProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
}

const frequencies: { label: string; value: RecurrencyFrequency }[] = [
  { label: "Diario", value: "daily" },
  { label: "Mensual", value: "monthly" },
  { label: "Bimestral", value: "bimonthly" },
  { label: "Trimestral", value: "quarterly" },
  { label: "Semestral", value: "semiannual" },
  { label: "Personalizado", value: "custom" },
];

export function RecurrencySelector({
  formData,
  setFormData,
}: RecurrencySelectorProps) {
  return (
    <View className=" p-4 rounded-full">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-black/60">Transacción Recurrente</Text>
        <View className="flex-row bg-black/[0.03] rounded-full overflow-hidden">
          <Pressable
            className={`px-4 py-2 ${formData.isRecurrent ? "bg-black" : ""}`}
            onPress={() =>
              setFormData({
                ...formData,
                isRecurrent: true,
              })
            }
          >
            <Text
              className={formData.isRecurrent ? "text-white" : "text-black"}
            >
              Sí
            </Text>
          </Pressable>
          <Pressable
            className={`px-4 py-2 ${!formData.isRecurrent ? "bg-black" : ""}`}
            onPress={() =>
              setFormData({
                ...formData,
                isRecurrent: false,
              })
            }
          >
            <Text
              className={!formData.isRecurrent ? "text-white" : "text-black"}
            >
              No
            </Text>
          </Pressable>
        </View>
      </View>

      {formData.isRecurrent && (
        <View className="space-y-4">
          <Text className="text-black/60 text-sm">Frecuencia</Text>
          <View className="flex-row flex-wrap gap-2">
            {frequencies.map((freq) => (
              <Pressable
                key={freq.value}
                className={`px-4 py-2 rounded-full ${
                  formData.recurrentConfig.frequency === freq.value
                    ? "bg-black"
                    : "bg-black/[0.03]"
                } active:bg-black/[0.05]`}
                onPress={() =>
                  setFormData({
                    ...formData,
                    recurrentConfig: {
                      ...formData.recurrentConfig,
                      frequency: freq.value,
                    },
                  })
                }
              >
                <Text
                  className={
                    formData.recurrentConfig.frequency === freq.value
                      ? "text-white"
                      : "text-black"
                  }
                >
                  {freq.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {formData.recurrentConfig.frequency === "custom" && (
            <View>
              <Text className="text-black/60 mb-2 text-sm">
                Cada cuántos días
              </Text>
              <TextInput
                className="bg-black/[0.03] text-black p-4 rounded-full"
                value={formData.recurrentConfig.customDays.toString()}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    recurrentConfig: {
                      ...formData.recurrentConfig,
                      customDays: parseInt(text) || 0,
                    },
                  })
                }
                keyboardType="number-pad"
                placeholder="Número de días"
                placeholderTextColor="#00000066"
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
