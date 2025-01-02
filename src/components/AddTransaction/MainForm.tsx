import React, { useState } from "react";
import { View, Pressable, Text, ScrollView, Alert } from "react-native";
import { TransactionFormData } from "../../types/transaction.types";
import { SubscriptionSelector } from "./SubscriptionSelector";
import { Subscription } from "../../constants/subscriptions";
import { router, useLocalSearchParams } from "expo-router";
import { useRecurrentTransactions } from "../../hooks/useRecurrentTransactions";
import { FREQUENCY_PRESETS } from "../../types/recurrent.types";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { AmountInput } from "./AmountInput";
import { DateSelector } from "./DateSelector";
import { CategoryField } from "./CategoryField";
import { TransactionNameInput } from "./TransactionNameInput";
import { AccountSelector } from "./AccountSelector";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { addTransaction } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { toAPIDate } from "../../utils/dateFormat";

interface MainFormProps {
  formData: TransactionFormData;
  setFormData: (
    data:
      | TransactionFormData
      | ((prev: TransactionFormData) => TransactionFormData)
  ) => void;
  onSubmit: () => void;
  onSuccess?: () => Promise<void>;
}

type TransactionMode = "expense" | "income" | "subscription";

export function MainForm({
  formData,
  setFormData,
  onSubmit,
  onSuccess,
}: MainFormProps) {
  const { addRecurrentTransaction } = useRecurrentTransactions();
  const { session } = useAuth();
  const params = useLocalSearchParams<{
    selectedCategory?: string;
    selectedSubcategory?: string;
    selectedBank?: string;
    selectedAccount?: string;
    selectedCard?: string;
    bankName?: string;
    accountNumber?: string;
    cardLastFour?: string;
  }>();

  // Escuchamos los cambios de parámetros para actualizar la categoría
  React.useEffect(() => {
    if (params.selectedCategory) {
      setFormData(
        (prev: TransactionFormData): TransactionFormData => ({
          ...prev,
          category: params.selectedCategory,
          subcategory: params.selectedSubcategory || "",
        })
      );
    }
  }, [params.selectedCategory, params.selectedSubcategory]);

  // Escuchamos los cambios de parámetros para actualizar el banco
  React.useEffect(() => {
    if (params.selectedBank) {
      setFormData(
        (prev: TransactionFormData): TransactionFormData => ({
          ...prev,
          selectedBank: params.selectedBank,
          selectedAccount: params.selectedAccount,
          selectedCard: params.selectedCard || null,
          bankName: params.bankName as string,
          accountNumber: params.accountNumber as string,
          cardLastFour: params.cardLastFour || "",
        })
      );
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
    setFormData(
      (prev: TransactionFormData): TransactionFormData => ({
        ...prev,
        type: "expense",
        name: subscription.name,
        category: "subscriptions",
        subcategory: subscription.subcategory,
      })
    );
    setShowSubscriptionSelector(false);
  };

  const navigateToSelectCategory = () => {
    router.push({
      pathname: "/select-category",
      params: {
        type: formData.type,
        amount: formData.amount,
        date: formData.date.toISOString(),
      },
    });
  };

  const navigateToSelectBank = () => {
    router.push({
      pathname: "/select-bank",
      params: {
        type: formData.type,
        amount: formData.amount,
        date: formData.date.toISOString(),
        category: formData.category,
        subcategory: formData.subcategory,
      },
    });
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      Alert.alert("Error", "Debes iniciar sesión para agregar transacciones");
      return;
    }

    try {
      // Si es una transacción recurrente, primero creamos la transacción recurrente
      let recurrentTransactionId = null;
      if (formData.isRecurrent) {
        const success = await addRecurrentTransaction({
          user_id: session.user.id,
          type: formData.type,
          category: formData.category,
          subcategory: formData.subcategory,
          name: formData.name,
          amount: parseFloat(formData.amount),
          frequency_days:
            formData.recurrentConfig.frequency === "custom"
              ? formData.recurrentConfig.customDays || 0
              : null,
          frequency_name: formData.recurrentConfig.frequency,
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
        recurrentTransactionId = success;
      }

      // Luego creamos la transacción normal
      await addTransaction(
        {
          user_id: session.user.id,
          type: formData.type,
          category: formData.type === "income" ? null : formData.category,
          subcategory: formData.type === "income" ? null : formData.subcategory,
          name: formData.name,
          icon_id:
            formData.type === "income" ? "default_income" : "default_expense",
          amount: parseFloat(formData.amount),
          date: toAPIDate(formData.date),
          payment_bank: formData.bankName,
          payment_last_four: formData.cardLastFour,
          payment_type: formData.cardType,
          account_number: formData.accountNumber,
          is_recurrent: formData.isRecurrent,
          total_spent: null,
          recurrent_transaction_id: recurrentTransactionId,
        },
        {
          accountNumber: formData.accountNumber,
        }
      );

      Alert.alert("Éxito", "Transacción agregada correctamente");
      await onSuccess?.();
      router.push("/");
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "No se pudo agregar la transacción");
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="space-y-6 pt-14">
        {/* Título */}
        <View>
          <Text className="text-2xl font-semibold text-black">
            Añade tus transacciones
          </Text>
        </View>

        {/* Selector de tipo */}
        <TransactionTypeSelector
          transactionMode={transactionMode}
          setTransactionMode={setTransactionMode}
          setShowSubscriptionSelector={setShowSubscriptionSelector}
          setSelectedSubscription={setSelectedSubscription}
          setFormData={setFormData}
        />

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
        <AmountInput amount={formData.amount} setFormData={setFormData} />

        {/* Fecha */}
        <DateSelector
          date={formData.date}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          setFormData={setFormData}
        />

        {/* Categoría */}
        {transactionMode === "expense" && (
          <CategoryField
            category={formData.category}
            subcategory={formData.subcategory}
            navigateToSelectCategory={navigateToSelectCategory}
          />
        )}

        {/* Nombre */}
        {transactionMode !== "subscription" && (
          <TransactionNameInput
            name={formData.name}
            setFormData={setFormData}
          />
        )}

        {/* Cuenta */}
        <AccountSelector
          bankName={formData.bankName}
          cardLastFour={formData.cardLastFour}
          selectedCard={formData.selectedCard}
          navigateToSelectBank={navigateToSelectBank}
        />

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
