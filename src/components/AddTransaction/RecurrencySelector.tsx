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
    <View className="bg-veryPaleBlue/10 p-4 rounded-xl">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-textSecondary">Transacción Recurrente</Text>
        <View className="flex-row bg-veryPaleBlue/20 rounded-xl overflow-hidden">
          <Pressable
            className={`px-4 py-2 ${
              formData.isRecurrent ? "bg-veryPaleBlue" : ""
            }`}
            onPress={() =>
              setFormData({
                ...formData,
                isRecurrent: true,
              })
            }
          >
            <Text className="text-textPrimary">Sí</Text>
          </Pressable>
          <Pressable
            className={`px-4 py-2 ${
              !formData.isRecurrent ? "bg-veryPaleBlue" : ""
            }`}
            onPress={() =>
              setFormData({
                ...formData,
                isRecurrent: false,
              })
            }
          >
            <Text className="text-textPrimary">No</Text>
          </Pressable>
        </View>
      </View>

      {formData.isRecurrent && (
        <View className="space-y-4">
          <Text className="text-textSecondary">Frecuencia</Text>
          <View className="flex-row flex-wrap gap-2">
            {frequencies.map((freq) => (
              <Pressable
                key={freq.value}
                className={`px-4 py-2 rounded-xl ${
                  formData.recurrentConfig.frequency === freq.value
                    ? "bg-veryPaleBlue"
                    : "bg-veryPaleBlue/20"
                }`}
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
                <Text className="text-textPrimary">{freq.label}</Text>
              </Pressable>
            ))}
          </View>

          {formData.recurrentConfig.frequency === "custom" && (
            <View>
              <Text className="text-textSecondary mb-2">Cada cuántos días</Text>
              <TextInput
                className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
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
                placeholderTextColor="#755bce/75"
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
