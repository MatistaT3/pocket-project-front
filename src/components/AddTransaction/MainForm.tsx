import React, { useState } from "react";
import { View, Pressable, Text, TextInput, ScrollView } from "react-native";
import {
  Tag,
  ChevronRight,
  Receipt,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  TransactionFormData,
  TransactionType,
} from "../../types/transaction.types";
import { TRANSACTION_CATEGORIES } from "../../constants/categories";
import { ModalView } from "../../types/common.types";
import { SubscriptionSelector } from "./SubscriptionSelector";
import { Subscription } from "../../constants/subscriptions";

interface MainFormProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
  onSubmit: () => void;
  setCurrentView: (view: ModalView) => void;
}

type TransactionMode = "expense" | "income" | "subscription";

export function MainForm({
  formData,
  setFormData,
  onSubmit,
  setCurrentView,
}: MainFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [transactionMode, setTransactionMode] =
    useState<TransactionMode>("expense");
  const [showSubscriptionSelector, setShowSubscriptionSelector] =
    useState(false);

  const handleSubscriptionSelect = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      ...formData,
      type: "expense",
      name: subscription.name,
      category: "subscriptions",
      subcategory: subscription.subcategory,
    });
    setShowSubscriptionSelector(false);
  };

  return (
    <ScrollView className="max-h-[600px]">
      <View className="space-y-4">
        {/* Selector de tipo mejorado */}
        <View>
          <Text className="text-textSecondary mb-2">Tipo de Transacción</Text>
          <View className="flex-row space-x-2">
            <Pressable
              className={`flex-1 p-4 rounded-xl ${
                transactionMode === "expense"
                  ? "bg-moderateBlue"
                  : "bg-veryPaleBlue/20"
              }`}
              onPress={() => {
                setTransactionMode("expense");
                setShowSubscriptionSelector(false);
                setSelectedSubscription(null);
                setFormData({
                  ...formData,
                  type: "expense",
                  category: "",
                  subcategory: "",
                });
              }}
            >
              <View className="items-center space-y-2">
                <ArrowUpCircle
                  size={24}
                  color={transactionMode === "expense" ? "white" : "#755bce"}
                />
                <Text
                  className={`text-center font-medium ${
                    transactionMode === "expense"
                      ? "text-white"
                      : "text-textPrimary"
                  }`}
                >
                  Gasto
                </Text>
              </View>
            </Pressable>

            <Pressable
              className={`flex-1 p-4 rounded-xl ${
                transactionMode === "subscription"
                  ? "bg-moderateBlue"
                  : "bg-veryPaleBlue/20"
              }`}
              onPress={() => {
                setTransactionMode("subscription");
                setShowSubscriptionSelector(true);
                setFormData({
                  ...formData,
                  type: "expense",
                });
              }}
            >
              <View className="items-center space-y-2">
                <Receipt
                  size={24}
                  color={
                    transactionMode === "subscription" ? "white" : "#755bce"
                  }
                />
                <Text
                  className={`text-center font-medium ${
                    transactionMode === "subscription"
                      ? "text-white"
                      : "text-textPrimary"
                  }`}
                >
                  Suscripción
                </Text>
              </View>
            </Pressable>

            <Pressable
              className={`flex-1 p-4 rounded-xl ${
                transactionMode === "income"
                  ? "bg-moderateBlue"
                  : "bg-veryPaleBlue/20"
              }`}
              onPress={() => {
                setTransactionMode("income");
                setShowSubscriptionSelector(false);
                setSelectedSubscription(null);
                setFormData({
                  ...formData,
                  type: "income",
                  category: "",
                  subcategory: "",
                });
              }}
            >
              <View className="items-center space-y-2">
                <ArrowDownCircle
                  size={24}
                  color={transactionMode === "income" ? "white" : "#755bce"}
                />
                <Text
                  className={`text-center font-medium ${
                    transactionMode === "income"
                      ? "text-white"
                      : "text-textPrimary"
                  }`}
                >
                  Ingreso
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Selector de Suscripción */}
        {transactionMode === "subscription" && showSubscriptionSelector && (
          <View className="space-y-2">
            <SubscriptionSelector
              selectedSubscription={selectedSubscription}
              onSelectSubscription={handleSubscriptionSelect}
            />
            <Pressable
              className="bg-veryPaleBlue/20 p-3 rounded-xl mt-2"
              onPress={() => {
                setTransactionMode("expense");
                setShowSubscriptionSelector(false);
              }}
            >
              <Text className="text-textPrimary text-center">
                No encuentro mi suscripción
              </Text>
            </Pressable>
          </View>
        )}

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

        {/* Categoría - Solo mostrar si es gasto normal */}
        {transactionMode === "expense" && (
          <View>
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
              <Text className="text-textSecondary mt-1 ml-2">
                Subcategoría:{" "}
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

        {/* Nombre - Solo mostrar si NO es modo suscripción */}
        {transactionMode !== "subscription" && (
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
        )}

        {/* Método de Pago */}
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
