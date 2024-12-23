import React, { useState } from "react";
import { Alert } from "react-native";
import { ElevatedBaseModal } from "../ElevatedBaseModal";
import { CategorySelector } from "./CategorySelector";
import { BankSelector } from "./BankSelector";
import { RecurrencySelector } from "./RecurrencySelector";
import { MainForm } from "./MainForm";
import { useTransactions } from "../../hooks/useTransactions";
import { useBanks } from "../../hooks/useBanks";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  Transaction,
  AddTransactionModalProps,
  TransactionFormData,
} from "../../types/transaction.types";
import { ModalView } from "../../types/common.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function AddTransactionModal({
  visible,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const { addTransaction } = useTransactions();
  const { banks, refreshBanks } = useBanks();
  const { session } = useAuth();
  const [currentView, setCurrentView] = useState<ModalView>("main");
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

  // Estados para la selección de banco
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isBankListVisible, setIsBankListVisible] = useState(false);
  const [isAccountListVisible, setIsAccountListVisible] = useState(false);

  React.useEffect(() => {
    if (visible) {
      refreshBanks();
    }
  }, [visible]);

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

      const transaction: Omit<Transaction, "id"> = {
        type: formData.type,
        category: formData.type === "income" ? null : formData.category,
        subcategory: formData.type === "income" ? null : formData.subcategory,
        name: formData.name,
        icon_data: undefined,
        amount: parseFloat(formData.amount),
        date: format(formData.date, "dd/MM/yyyy", { locale: es }),
        paymentMethod: {
          bank: formData.bankName,
          lastFourDigits: formData.cardLastFour,
          type: formData.cardType,
          accountNumber: formData.selectedAccount,
        },
        ...(formData.isRecurrent && {
          recurrent: {
            frequency: formData.recurrentConfig.frequency,
            startDate: format(formData.date, "dd/MM/yyyy", { locale: es }),
            ...(formData.recurrentConfig.frequency === "custom" && {
              customDays: formData.recurrentConfig.customDays,
            }),
          },
        }),
      };

      await addTransaction(transaction, {
        accountNumber: formData.accountNumber,
      });

      await onSuccess?.();
      Alert.alert("Éxito", "Transacción agregada correctamente");
      handleClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "No se pudo agregar la transacción");
    }
  };

  const handleConfirmBankSelection = () => {
    if (!selectedBank || !selectedAccount) return;

    if (formData.type === "expense" && !selectedCard) {
      return;
    }

    const selectedBankData = banks.find((bank) => bank.id === selectedBank);
    const selectedAccountData = selectedBankData?.accounts.find(
      (account) => account.id === selectedAccount
    );
    const selectedCardData = selectedAccountData?.cards.find(
      (card) => card.id === selectedCard
    );

    if (!selectedBankData || !selectedAccountData) return;

    setFormData({
      ...formData,
      selectedBank: selectedBankData.id,
      bankName: selectedBankData.name,
      selectedAccount: selectedAccountData.id,
      accountNumber: selectedAccountData.accountNumber,
      selectedCard: selectedCardData?.id || null,
      cardLastFour: selectedCardData?.lastFourDigits || "",
      cardType: selectedCardData?.type || "debit",
    });

    setCurrentView("main");
  };

  const handleClose = () => {
    setFormData({
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
    setSelectedBank(null);
    setSelectedAccount(null);
    setSelectedCard(null);
    setCurrentView("main");
    onClose();
  };

  const renderContent = () => {
    switch (currentView) {
      case "categorySelection":
        return (
          <CategorySelector
            formData={formData}
            setFormData={setFormData}
            setCurrentView={setCurrentView}
          />
        );
      case "bankSelection":
        return (
          <BankSelector
            formData={formData}
            setFormData={setFormData}
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
            onConfirm={handleConfirmBankSelection}
          />
        );
      default:
        return (
          <>
            <MainForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              setCurrentView={setCurrentView}
            />
            <RecurrencySelector formData={formData} setFormData={setFormData} />
          </>
        );
    }
  };

  return (
    <ElevatedBaseModal
      visible={visible}
      onClose={handleClose}
      onBack={currentView !== "main" ? () => setCurrentView("main") : undefined}
      title={
        currentView === "main"
          ? "Nueva Transacción"
          : currentView === "categorySelection"
          ? "Seleccionar Categoría"
          : "Seleccionar Cuenta"
      }
    >
      {renderContent()}
    </ElevatedBaseModal>
  );
}
