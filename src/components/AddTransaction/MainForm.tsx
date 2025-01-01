import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import {
  Tag,
  ChevronRight,
  Receipt,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
} from "lucide-react-native";
import {
  TransactionFormData,
  TransactionType,
} from "../../types/transaction.types";
import { TRANSACTION_CATEGORIES } from "../../constants/categories";
import { ModalView } from "../../types/common.types";
import { SubscriptionSelector } from "./SubscriptionSelector";
import { Subscription } from "../../constants/subscriptions";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRecurrentTransactions } from "../../hooks/useRecurrentTransactions";
import { FREQUENCY_PRESETS } from "../../types/recurrent.types";

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
  const navigation = useNavigation();
  const { addRecurrentTransaction } = useRecurrentTransactions();
  const params = useLocalSearchParams<{
    selectedDate?: string;
    selectedCategory?: string;
    selectedSubcategory?: string;
    selectedBank?: string;
    selectedAccount?: string;
    selectedCard?: string;
    bankName?: string;
    accountNumber?: string;
    cardLastFour?: string;
  }>();

  // Escuchamos los cambios de parámetros para actualizar la fecha
  React.useEffect(() => {
    if (params.selectedDate) {
      setFormData({
        ...formData,
        date: new Date(params.selectedDate),
      });
    }
  }, [params.selectedDate]);

  // Escuchamos los cambios de parámetros para actualizar la categoría
  React.useEffect(() => {
    if (params.selectedCategory) {
      setFormData({
        ...formData,
        category: params.selectedCategory,
        subcategory: params.selectedSubcategory || "",
      });
    }
  }, [params.selectedCategory, params.selectedSubcategory]);

  // Escuchamos los cambios de parámetros para actualizar el banco
  React.useEffect(() => {
    if (params.selectedBank) {
      setFormData({
        ...formData,
        selectedBank: params.selectedBank,
        selectedAccount: params.selectedAccount,
        selectedCard: params.selectedCard || null,
        bankName: params.bankName as string,
        accountNumber: params.accountNumber as string,
        cardLastFour: params.cardLastFour || "",
      });
    }
  }, [params.selectedBank]);

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

  const handleSubmit = async () => {
    if (formData.isRecurrent) {
      // Si es una transacción recurrente, primero creamos la transacción recurrente
      const success = await addRecurrentTransaction({
        type: formData.type,
        category: formData.category,
        subcategory: formData.subcategory,
        name: formData.name,
        amount: parseFloat(formData.amount),
        frequency_days:
          formData.recurrentConfig.frequency === "custom"
            ? formData.recurrentConfig.customDays || 0
            : FREQUENCY_PRESETS[formData.recurrentConfig.frequency],
        start_date: formData.date.toISOString().split("T")[0],
        payment_bank: formData.bankName,
        payment_last_four: formData.cardLastFour,
        payment_type: formData.cardType,
        account_number: formData.accountNumber,
      });

      if (!success) {
        Alert.alert("Error", "No se pudo crear la transacción recurrente");
        return;
      }
    }

    // Continuamos con el submit normal
    onSubmit();
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Selector de tipo mejorado */}
        <View>
          <Text className="text-black/60 mb-2 text-sm">
            Tipo de Transacción
          </Text>
          <View className="flex-row space-x-2">
            <Pressable
              className={`flex-1 p-4 rounded-2xl border ${
                transactionMode === "expense"
                  ? "bg-black border-black"
                  : "bg-black/[0.03] border-black/10"
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
                  size={20}
                  color={transactionMode === "expense" ? "white" : "black"}
                />
                <Text
                  className={`text-center font-medium ${
                    transactionMode === "expense" ? "text-white" : "text-black"
                  }`}
                >
                  Gasto
                </Text>
              </View>
            </Pressable>

            <Pressable
              className={`flex-1 p-4 rounded-2xl border ${
                transactionMode === "subscription"
                  ? "bg-black border-black"
                  : "bg-black/[0.03] border-black/10"
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
                  size={20}
                  color={transactionMode === "subscription" ? "white" : "black"}
                />
                <Text
                  className={`text-center font-medium ${
                    transactionMode === "subscription"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Suscripción
                </Text>
              </View>
            </Pressable>

            <Pressable
              className={`flex-1 p-4 rounded-2xl border ${
                transactionMode === "income"
                  ? "bg-black border-black"
                  : "bg-black/[0.03] border-black/10"
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
                  size={20}
                  color={transactionMode === "income" ? "white" : "black"}
                />
                <Text
                  className={`text-center font-medium ${
                    transactionMode === "income" ? "text-white" : "text-black"
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
              className="h-12 rounded-2xl items-center justify-center bg-black/[0.03] active:bg-black/[0.05]"
              onPress={() => {
                setTransactionMode("expense");
                setShowSubscriptionSelector(false);
              }}
            >
              <Text className="text-black font-medium">
                No encuentro mi suscripción
              </Text>
            </Pressable>
          </View>
        )}

        {/* Monto */}
        <View>
          <Text className="text-black/60 mb-2 text-sm">Monto</Text>
          <TextInput
            className="text-black p-4 rounded-full bg-black/[0.03]"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            placeholder="0"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Fecha */}
        <View>
          <Text className="text-black/60 mb-2 text-sm">Fecha</Text>
          <Pressable
            className="bg-black/[0.03] p-4 rounded-full flex-row items-center justify-between active:bg-black/[0.05]"
            onPress={() => setShowDatePicker(true)}
          >
            <View className="flex-row items-center">
              <Calendar size={20} color="black" />
              <Text className="text-black ml-3">
                {formData.date.toLocaleDateString("es-ES", {
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
            <View className="bg-white rounded-2xl mt-2 overflow-hidden border border-black/5">
              <DateTimePicker
                value={formData.date}
                mode="date"
                display="spinner"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData({
                      ...formData,
                      date: selectedDate,
                    });
                  }
                }}
                style={{ backgroundColor: "white", height: 120 }}
              />
            </View>
          )}
        </View>

        {/* Categoría - Solo mostrar si es gasto normal */}
        {transactionMode === "expense" && (
          <View>
            <Text className="text-black/60 mb-2 text-sm">Categoría</Text>
            <Pressable
              className="bg-black/[0.03] p-4 rounded-full flex-row items-center justify-between active:bg-black/[0.05]"
              onPress={() =>
                router.push({
                  pathname: "/select-category",
                  params: { currentCategory: formData.category },
                })
              }
            >
              <View className="flex-row items-center">
                <Tag size={20} color="black" />
                <Text className="text-black ml-3">
                  {formData.category
                    ? TRANSACTION_CATEGORIES.find(
                        (c) => c.id === formData.category
                      )?.name
                    : "Seleccionar categoría"}
                </Text>
              </View>
              <ChevronRight size={20} color="black" />
            </Pressable>
            {formData.subcategory && (
              <Text className="text-black/60 mt-2 ml-2 text-sm">
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
            <Text className="text-black/60 mb-2 text-sm">Nombre</Text>
            <TextInput
              className="text-black p-4 rounded-full bg-black/[0.03]"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nombre de la transacción"
              placeholderTextColor="#9ca3af"
            />
          </View>
        )}

        {/* Cuenta */}
        <View>
          <Text className="text-black/60 mb-2 text-sm">Cuenta</Text>
          <Pressable
            className="bg-black/[0.03] p-4 rounded-full flex-row items-center justify-between active:bg-black/[0.05]"
            onPress={() => router.push("/select-bank")}
          >
            <View className="flex-row items-center">
              <CreditCard size={20} color="black" />
              <Text className="text-black ml-3">
                {formData.bankName || "Seleccionar cuenta"}
              </Text>
            </View>
            <ChevronRight size={20} color="black" />
          </Pressable>
          {formData.selectedCard && (
            <Text className="text-black/60 mt-2 ml-2 text-sm">
              Tarjeta terminada en {formData.cardLastFour}
            </Text>
          )}
        </View>

        {/* Botón de guardar */}
        <Pressable
          className="h-12 rounded-full items-center justify-center bg-black active:bg-black/90"
          onPress={handleSubmit}
        >
          <Text className="text-white font-medium">Guardar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
