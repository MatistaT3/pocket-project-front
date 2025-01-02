import React from "react";
import { View, Pressable, Text } from "react-native";
import { Calendar, ChevronRight } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionFormData } from "../../types/transaction.types";

interface DateSelectorProps {
  date: Date;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  setFormData: (
    data:
      | TransactionFormData
      | ((prev: TransactionFormData) => TransactionFormData)
  ) => void;
}

export function DateSelector({
  date,
  showDatePicker,
  setShowDatePicker,
  setFormData,
}: DateSelectorProps) {
  return (
    <View>
      <Text className="text-black/60 mb-2 text-sm">Fecha</Text>
      <Pressable
        className="bg-black/[0.03] p-4 rounded-full flex-row items-center justify-between active:bg-black/[0.05]"
        onPress={() => setShowDatePicker(true)}
      >
        <View className="flex-row items-center">
          <Calendar size={20} color="black" />
          <Text className="text-black ml-3">
            {date.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <ChevronRight size={20} color="black" />
      </Pressable>
      {showDatePicker && (
        <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-black/5">
          <View className="flex-row justify-between items-center px-4 py-2 border-b border-black/5">
            <Pressable
              onPress={() => setShowDatePicker(false)}
              className="py-2"
            >
              <Text className="text-black/60">Cancelar</Text>
            </Pressable>
            <Text className="font-medium text-black">Seleccionar fecha</Text>
            <Pressable
              onPress={() => {
                setShowDatePicker(false);
              }}
              className="py-2"
            >
              <Text className="text-black font-medium">Aceptar</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                setFormData(
                  (prev: TransactionFormData): TransactionFormData => ({
                    ...prev,
                    date: selectedDate,
                  })
                );
              }
            }}
            textColor="black"
            themeVariant="light"
            style={{ backgroundColor: "white", height: 120 }}
          />
        </View>
      )}
    </View>
  );
}
