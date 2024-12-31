import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useBanks } from "../hooks/useBanks";
import { SafeAreaView } from "react-native-safe-area-context";
import { BankList } from "../components/BankAccounts/BankList";
import { AddBankForm } from "../components/BankAccounts/AddBankForm";
import { AccountList } from "../components/BankAccounts/AccountList";
import { AddAccountForm } from "../components/BankAccounts/AddAccountForm";
import { AddCardForm } from "../components/BankAccounts/AddCardForm";

type ScreenView = "main" | "addBank" | "bankDetail" | "addAccount" | "addCard";

export function BankAccountsScreen() {
  const {
    banks,
    refreshBanks,
    addBank,
    deleteBank,
    addAccount,
    deleteAccount,
    addCard,
    deleteCard,
  } = useBanks();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ScreenView>("main");

  const handleAddBank = async (bankName: string) => {
    try {
      // Verificar si el banco ya existe
      const existingBank = banks.find((bank) => bank.name === bankName);
      if (existingBank) {
        Alert.alert(
          "Banco ya agregado",
          "Este banco ya se encuentra en tu lista. Si deseas agregar otra cuenta, selecciona el banco existente.",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Ir al banco",
              onPress: () => {
                setSelectedBank(existingBank.id);
                setCurrentView("bankDetail");
              },
            },
          ]
        );
        return;
      }

      const newBank = await addBank(bankName);
      await refreshBanks();
      setSelectedBank(newBank.id);
      setCurrentView("bankDetail");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el banco");
    }
  };

  const handleDeleteBank = async (bankId: string, bankName: string) => {
    Alert.alert(
      "Eliminar Banco",
      `¿Estás seguro que deseas eliminar ${bankName} y todas sus cuentas y tarjetas asociadas?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBank(bankId);
              await refreshBanks();
              setSelectedBank(null);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el banco");
            }
          },
        },
      ]
    );
  };

  const handleAddAccount = async (
    accountNumber: string,
    initialBalance: number
  ) => {
    try {
      if (!selectedBank) return;
      await addAccount(selectedBank, accountNumber, initialBalance);
      await refreshBanks();
      setCurrentView("bankDetail");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la cuenta");
    }
  };

  const handleDeleteAccount = async (
    accountId: string,
    accountNumber: string
  ) => {
    Alert.alert(
      "Eliminar Cuenta",
      `¿Estás seguro que deseas eliminar la cuenta ${accountNumber} y todas sus tarjetas asociadas?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount(accountId);
              await refreshBanks();
              setSelectedAccount(null);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la cuenta");
            }
          },
        },
      ]
    );
  };

  const handleAddCard = async (
    lastFourDigits: string,
    type: "debit" | "credit"
  ) => {
    try {
      if (!selectedAccount) return;
      await addCard(selectedAccount, lastFourDigits, type);
      await refreshBanks();
      setCurrentView("bankDetail");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la tarjeta");
    }
  };

  const handleDeleteCard = async (
    cardId: string,
    accountId: string,
    lastFourDigits: string
  ) => {
    Alert.alert(
      "Eliminar Tarjeta",
      `¿Estás seguro que deseas eliminar la tarjeta terminada en ${lastFourDigits}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCard(cardId, accountId);
              await refreshBanks();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la tarjeta");
            }
          },
        },
      ]
    );
  };

  const handleBankSelect = (bankId: string | null) => {
    setSelectedBank(bankId);
    if (bankId) {
      setCurrentView("bankDetail");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "addBank":
        return <AddBankForm onSelectBank={handleAddBank} />;
      case "bankDetail": {
        const bank = banks.find((b) => b.id === selectedBank);
        if (!bank) return null;
        return (
          <AccountList
            bank={bank}
            selectedAccount={selectedAccount}
            onBack={() => {
              setSelectedBank(null);
              setCurrentView("main");
            }}
            onSelectAccount={setSelectedAccount}
            onAddAccount={() => setCurrentView("addAccount")}
            onAddCard={(accountId, accountNumber) => {
              setSelectedAccount(accountId);
              setCurrentView("addCard");
            }}
            onDeleteAccount={handleDeleteAccount}
            onDeleteCard={handleDeleteCard}
          />
        );
      }
      case "addAccount": {
        const bank = banks.find((b) => b.id === selectedBank);
        if (!bank) return null;
        return (
          <AddAccountForm
            bankName={bank.name}
            onBack={() => setCurrentView("bankDetail")}
            onAddAccount={handleAddAccount}
          />
        );
      }
      case "addCard": {
        const bank = banks.find((b) => b.id === selectedBank);
        const account = bank?.accounts.find((a) => a.id === selectedAccount);
        if (!bank || !account) return null;
        return (
          <AddCardForm
            bankName={bank.name}
            accountNumber={account.accountNumber}
            onBack={() => setCurrentView("bankDetail")}
            onAddCard={handleAddCard}
          />
        );
      }
      default:
        return (
          <BankList
            banks={banks}
            selectedBank={selectedBank}
            onSelectBank={handleBankSelect}
            onAddBank={() => setCurrentView("addBank")}
            onDeleteBank={handleDeleteBank}
          />
        );
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-1 px-4">
        <ScrollView className="flex-1">{renderContent()}</ScrollView>
      </View>
    </SafeAreaView>
  );
}
