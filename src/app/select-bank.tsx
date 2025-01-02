import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BankSelector } from "../components/AddTransaction/BankSelector";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { TransactionFormData } from "../types/transaction.types";
import { ChevronLeft } from "lucide-react-native";
import { useBanks } from "../hooks/useBanks";

export default function SelectBankScreen() {
  const params = useLocalSearchParams<{
    type: string;
    amount: string;
    date: string;
    category: string;
    subcategory: string;
  }>();

  const { banks } = useBanks();
  const [selectedFormData, setSelectedFormData] = useState<TransactionFormData>(
    {
      type: params.type as "expense" | "income",
      amount: params.amount || "",
      date: params.date ? new Date(params.date) : new Date(),
      category: params.category || "",
      subcategory: params.subcategory || "",
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

  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isBankListVisible, setIsBankListVisible] = useState(false);
  const [isAccountListVisible, setIsAccountListVisible] = useState(false);

  const handleConfirmSelection = () => {
    if (!selectedBank || !selectedAccount) return;

    const selectedBankData = banks.find((bank) => bank.id === selectedBank);
    const selectedAccountData = selectedBankData?.accounts.find(
      (account) => account.id === selectedAccount
    );
    const selectedCardData = selectedAccountData?.cards.find(
      (card) => card.id === selectedCard
    );

    if (!selectedBankData || !selectedAccountData) return;

    router.back();
    router.setParams({
      selectedBank: selectedBankData.id,
      selectedAccount: selectedAccountData.id,
      selectedCard: selectedCardData?.id || null,
      bankName: selectedBankData.name,
      accountNumber: selectedAccountData.accountNumber,
      cardLastFour: selectedCardData?.lastFourDigits || "",
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Seleccionar Cuenta",
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
            <BankSelector
              formData={selectedFormData}
              setFormData={setSelectedFormData}
              banks={banks}
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              isBankListVisible={isBankListVisible}
              setIsBankListVisible={setIsBankListVisible}
              isAccountListVisible={isAccountListVisible}
              setIsAccountListVisible={setIsAccountListVisible}
              onConfirm={handleConfirmSelection}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
