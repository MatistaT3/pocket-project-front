import React from "react";
import { View, Pressable, Text, TextInput } from "react-native";
import { TransactionFormData } from "../../types/transaction.types";
import { FREQUENCY_PRESETS, FrequencyType } from "../../types/recurrent.types";

interface RecurrencySelectorProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
}

const frequencies: { label: string; value: FrequencyType }[] = [
  { label: "Semanal", value: "weekly" },
  { label: "Mensual", value: "monthly" },
  { label: "Bimestral", value: "bimonthly" },
  { label: "Trimestral", value: "quarterly" },
  { label: "Semestral", value: "semiannual" },
  { label: "Anual", value: "annual" },
  { label: "Personalizado", value: "custom" },
];

export function RecurrencySelector({
  formData,
  setFormData,
}: RecurrencySelectorProps) {
  const handleFrequencyChange = (freq: FrequencyType) => {
    setFormData({
      ...formData,
      recurrentConfig: {
        frequency: freq,
        customDays:
          FREQUENCY_PRESETS[freq] || formData.recurrentConfig.customDays,
      },
    });
  };

  return (
    <View className="p-4 rounded-full">
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
                onPress={() => handleFrequencyChange(freq.value)}
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
                value={formData.recurrentConfig.customDays?.toString() || ""}
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
