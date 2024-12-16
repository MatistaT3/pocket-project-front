import React, { useState } from "react";
import { View, Pressable, Text, TextInput, ScrollView } from "react-native";
import { Tag, ChevronRight } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  TransactionFormData,
  TransactionType,
} from "../../types/transaction.types";
import { TRANSACTION_CATEGORIES } from "../../constants/categories";
import { ModalView } from "../../types/common.types";

interface MainFormProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
  onSubmit: () => void;
  setCurrentView: (view: ModalView) => void;
}

export function MainForm({
  formData,
  setFormData,
  onSubmit,
  setCurrentView,
}: MainFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <ScrollView className="max-h-[600px]">
      <View className="space-y-4">
        {/* Tipo de transacción */}
        <View>
          <Text className="text-textSecondary mb-2">Tipo</Text>
          <View className="flex-row space-x-2">
            {["expense", "income"].map((type) => (
              <Pressable
                key={type}
                className={`flex-1 p-3 rounded-xl ${
                  formData.type === type
                    ? "bg-veryPaleBlue"
                    : "bg-veryPaleBlue/20"
                }`}
                onPress={() =>
                  setFormData({
                    ...formData,
                    type: type as TransactionType,
                  })
                }
              >
                <Text className="text-textPrimary text-center">
                  {type === "expense" ? "Gasto" : "Ingreso"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Categoría - Solo mostrar para gastos */}
        {formData.type === "expense" && (
          <View className="max-h-[100px]">
            <Text className="text-textSecondary mb-2">Categoría</Text>
            <Pressable
              className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-between"
              onPress={() => setCurrentView("categorySelection")}
            >
              <View className="flex-row items-center">
                <Tag size={20} color="#755bce" />
                <Text className="text-textPrimary ml-3">
                  {formData.category
                    ? TRANSACTION_CATEGORIES.find(
                        (c) => c.id === formData.category
                      )?.name
                    : "Seleccionar categoría"}
                </Text>
              </View>
              <ChevronRight size={20} color="#755bce" />
            </Pressable>
            {formData.subcategory && (
              <Text className="text-textSecondary mt-1 ml-2 mb-2">
                Subcategoria:{" "}
                {
                  TRANSACTION_CATEGORIES.find(
                    (c) => c.id === formData.category
                  )?.subcategories?.find((s) => s.id === formData.subcategory)
                    ?.name
                }
              </Text>
            )}
          </View>
        )}

        {/* Nombre */}
        <View>
          <Text className="text-textSecondary mb-2">Nombre</Text>
          <TextInput
            className="bg-veryPaleBlue/10 text-textPrimary p-3 rounded-xl"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Nombre de la transacción"
            placeholderTextColor="#755bce/75"
          />
        </View>

        {/* Monto */}
        <View>
          <Text className="text-textSecondary mb-2">Monto</Text>
          <TextInput
            className="bg-veryPaleBlue/10 text-textPrimary p-3 rounded-xl"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            placeholder="0"
            placeholderTextColor="#755bce/75"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Selección de banco */}
        <View>
          <Text className="text-textSecondary mb-2">Método de Pago</Text>
          <Pressable
            className="bg-veryPaleBlue/10 p-4 rounded-xl"
            onPress={() => setCurrentView("bankSelection")}
          >
            <Text className="text-textPrimary">
              {formData.selectedBank
                ? `${formData.bankName} - ${formData.accountNumber}${
                    formData.cardLastFour
                      ? ` - •••• ${formData.cardLastFour}`
                      : ""
                  }`
                : "Seleccionar cuenta"}
            </Text>
          </Pressable>
        </View>

        {/* Fecha */}
        <View>
          <Text className="text-textSecondary mb-2">Fecha</Text>
          <Pressable
            className="bg-veryPaleBlue/10 p-3 rounded-xl"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-textPrimary">
              {formData.date.toLocaleDateString()}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({
                    ...formData,
                    date: selectedDate,
                  });
                }
              }}
            />
          )}
        </View>

        {/* Botón de guardar */}
        <Pressable
          className="bg-moderateBlue p-4 rounded-xl mt-4"
          onPress={onSubmit}
        >
          <Text className="text-white text-center font-semibold">
            Guardar Transacción
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
