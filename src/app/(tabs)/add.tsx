import React, { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecurrencySelector } from "../../components/AddTransaction/RecurrencySelector";
import { MainForm } from "../../components/AddTransaction/MainForm";
import { useTransactions } from "../../hooks/useTransactions";
import { useBanks } from "../../hooks/useBanks";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { TransactionFormData } from "../../types/transaction.types";
import { toDisplayDate } from "../../utils/dateFormat";
import { router } from "expo-router";
import { addTransaction } from "../../services";
import { useTransactionContext } from "../../context/TransactionContext";

export default function AddTransactionTab() {
  const { fetchTransactions } = useTransactions();
  const { banks, refreshBanks } = useBanks();
  const { session } = useAuth();
  const { triggerRefresh } = useTransactionContext();
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    category: "",
    subcategory: "",
    name: "",
    amount: "",
    date: new Date(),
    selectedBank: null,
    selectedAccount: null,
    selectedCard: null,
    bankName: "",
    accountNumber: "",
    cardLastFour: "",
    cardType: "debit",
    isRecurrent: false,
    recurrentConfig: {
      frequency: "monthly",
      customDays: 0,
    },
    otherCategorySuggestion: "",
  });

  React.useEffect(() => {
    refreshBanks();
  }, []);

  const handleSubmit = async () => {
    try {
      // Validación base para ambos tipos
      if (
        !formData.name ||
        !formData.amount ||
        !formData.selectedBank ||
        !formData.selectedAccount
      ) {
        Alert.alert(
          "Error",
          "Por favor completa el nombre, monto y cuenta bancaria"
        );
        return;
      }

      // Validación adicional solo para gastos
      if (formData.type === "expense") {
        if (!formData.category || !formData.selectedCard) {
          Alert.alert(
            "Error",
            "Para gastos, debes seleccionar una categoría y tarjeta"
          );
          return;
        }
      }

      // Si es categoría "other" y hay sugerencia, guardarla
      if (formData.category === "other" && formData.otherCategorySuggestion) {
        try {
          await supabase.from("category_suggestions").insert({
            user_id: session?.user.id,
            suggested_category: formData.otherCategorySuggestion,
            status: "pending",
          });
        } catch (error) {
          console.error("Error saving category suggestion:", error);
        }
      }

      await addTransaction(
        {
          user_id: session?.user.id,
          type: formData.type,
          category: formData.type === "income" ? null : formData.category,
          subcategory: formData.type === "income" ? null : formData.subcategory,
          name: formData.name,
          icon_id:
            formData.type === "income" ? "default_income" : "default_expense",
          amount: parseFloat(formData.amount),
          date: toDisplayDate(formData.date),
          payment_bank: formData.bankName,
          payment_last_four: formData.cardLastFour,
          payment_type: formData.cardType,
          account_number: formData.accountNumber,
          is_recurrent: formData.isRecurrent,
          total_spent: null,
          recurrent_transaction_id: null,
        },
        {
          accountNumber: formData.accountNumber,
        }
      );

      Alert.alert("Éxito", "Transacción agregada correctamente");
      await fetchTransactions(new Date());
      triggerRefresh();
      router.push("/");
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "No se pudo agregar la transacción");
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-1 px-6">
        <MainForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onSuccess={async () => {
            await fetchTransactions(new Date());
            triggerRefresh();
          }}
        />
        <RecurrencySelector formData={formData} setFormData={setFormData} />
      </View>
    </SafeAreaView>
  );
}
