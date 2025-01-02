import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategorySelector } from "../components/AddTransaction/CategorySelector";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { TransactionFormData } from "../types/transaction.types";
import { ChevronLeft } from "lucide-react-native";

export default function SelectCategoryScreen() {
  const params = useLocalSearchParams<{
    type: string;
    amount: string;
    date: string;
  }>();

  const [selectedFormData, setSelectedFormData] = useState<TransactionFormData>(
    {
      type: params.type as "expense" | "income",
      amount: params.amount || "",
      date: params.date ? new Date(params.date) : new Date(),
      category: "",
      subcategory: "",
      name: "",
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
    }
  );

  const handleCategorySelect = (formData: TransactionFormData) => {
    setSelectedFormData(formData);
  };

  const handleConfirm = () => {
    // Solo retornamos cuando se confirme la selección
    router.back();
    router.setParams({
      selectedCategory: selectedFormData.category,
      selectedSubcategory: selectedFormData.subcategory || "",
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Seleccionar Categoría",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center -ml-2"
            >
              <ChevronLeft size={28} color="black" />
            </Pressable>
          ),
          headerBackVisible: false,
        }}
      />
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
        <View className="flex-1">
          <View className="flex-1 px-6">
            <CategorySelector
              formData={selectedFormData}
              setFormData={handleCategorySelect}
              onConfirm={handleConfirm}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
