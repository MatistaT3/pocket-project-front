import React from "react";
import { View, Pressable, Text, ScrollView } from "react-native";
import { Building2, CreditCard, ChevronRight } from "lucide-react-native";
import { TransactionFormData } from "../../types/transaction.types";
import { Bank } from "../../types/bank.types";

interface BankSelectorProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
  banks: Bank[];
  selectedBank: string | null;
  setSelectedBank: (bankId: string | null) => void;
  selectedAccount: string | null;
  setSelectedAccount: (accountId: string | null) => void;
  selectedCard: string | null;
  setSelectedCard: (cardId: string | null) => void;
  isBankListVisible: boolean;
  setIsBankListVisible: (visible: boolean) => void;
  isAccountListVisible: boolean;
  setIsAccountListVisible: (visible: boolean) => void;
  onConfirm: () => void;
}

export function BankSelector({
  formData,
  setFormData,
  banks,
  selectedBank,
  setSelectedBank,
  selectedAccount,
  setSelectedAccount,
  selectedCard,
  setSelectedCard,
  isBankListVisible,
  setIsBankListVisible,
  isAccountListVisible,
  setIsAccountListVisible,
  onConfirm,
}: BankSelectorProps) {
  const selectedBankData = banks.find((bank) => bank.id === selectedBank);
  const selectedAccountData = selectedBankData?.accounts.find(
    (account) => account.id === selectedAccount
  );
  const selectedCardData = selectedAccountData?.cards.find(
    (card) => card.id === selectedCard
  );

  if (banks.length === 0) {
    return (
      <View className="items-center justify-center py-8 space-y-4">
        <CreditCard size={48} color="black" />
        <Text className="text-black text-center text-lg font-medium">
          No hay cuentas disponibles
        </Text>
        <Text className="text-black/60 text-center px-4">
          Dirígete a la sección "Cuentas" en la barra de navegación para agregar
          tus cuentas y tarjetas.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Selección de banco */}
        <View>
          <Text className="text-black/60 mb-2 text-sm">Banco</Text>
          <Pressable
            className="flex-row items-center justify-between bg-black/[0.03] p-4 rounded-full active:bg-black/[0.05]"
            onPress={() => setIsBankListVisible(!isBankListVisible)}
          >
            <View className="flex-row items-center">
              <Building2 size={20} color="black" />
              <Text className="text-black ml-3">
                {selectedBankData?.name || "Selecciona un banco"}
              </Text>
            </View>
            <ChevronRight
              size={20}
              color="black"
              style={{
                transform: [{ rotate: isBankListVisible ? "90deg" : "0deg" }],
              }}
            />
          </Pressable>

          {isBankListVisible && (
            <View className="mt-2 space-y-2">
              {banks.map((bank) => (
                <Pressable
                  key={bank.id}
                  className={`p-4 rounded-full ${
                    selectedBank === bank.id ? "bg-black" : "bg-black/[0.03]"
                  } active:bg-black/[0.05]`}
                  onPress={() => {
                    setSelectedBank(bank.id);
                    setSelectedAccount(null);
                    setSelectedCard(null);
                    setIsBankListVisible(false);
                  }}
                >
                  <Text
                    className={
                      selectedBank === bank.id ? "text-white" : "text-black"
                    }
                  >
                    {bank.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Selección de cuenta */}
        {selectedBank && (
          <View>
            <Text className="text-black/60 mb-2 text-sm">Cuenta</Text>
            <Pressable
              className="flex-row items-center justify-between bg-black/[0.03] p-4 rounded-full active:bg-black/[0.05]"
              onPress={() => setIsAccountListVisible(!isAccountListVisible)}
            >
              <View className="flex-row items-center">
                <CreditCard size={20} color="black" />
                <Text className="text-black ml-3">
                  {selectedAccountData
                    ? `Cuenta: ${selectedAccountData.accountNumber}`
                    : "Selecciona una cuenta"}
                </Text>
              </View>
              <ChevronRight
                size={20}
                color="black"
                style={{
                  transform: [
                    { rotate: isAccountListVisible ? "90deg" : "0deg" },
                  ],
                }}
              />
            </Pressable>

            {isAccountListVisible && (
              <View className="mt-2 space-y-2">
                {selectedBankData?.accounts.map((account) => (
                  <Pressable
                    key={account.id}
                    className={`p-4 rounded-full ${
                      selectedAccount === account.id
                        ? "bg-black"
                        : "bg-black/[0.03]"
                    } active:bg-black/[0.05]`}
                    onPress={() => {
                      setSelectedAccount(account.id);
                      setSelectedCard(null);
                      setIsAccountListVisible(false);
                    }}
                  >
                    <Text
                      className={
                        selectedAccount === account.id
                          ? "text-white"
                          : "text-black"
                      }
                    >
                      Cuenta: {account.accountNumber}
                    </Text>
                    <Text
                      className={`text-sm ${
                        selectedAccount === account.id
                          ? "text-white/60"
                          : "text-black/60"
                      }`}
                    >
                      Saldo: ${account.currentBalance.toLocaleString("es-CL")}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Selección de tarjeta */}
        {formData.type === "expense" &&
          selectedAccount &&
          selectedAccountData?.cards.length > 0 && (
            <View>
              <Text className="text-black/60 mb-2 text-sm">Tarjeta</Text>
              <View className="space-y-2">
                {selectedAccountData.cards.map((card) => (
                  <Pressable
                    key={card.id}
                    className={`p-4 rounded-full ${
                      selectedCard === card.id ? "bg-black" : "bg-black/[0.03]"
                    } active:bg-black/[0.05]`}
                    onPress={() => setSelectedCard(card.id)}
                  >
                    <Text
                      className={
                        selectedCard === card.id ? "text-white" : "text-black"
                      }
                    >
                      •••• {card.lastFourDigits}
                    </Text>
                    <Text
                      className={`text-sm capitalize ${
                        selectedCard === card.id
                          ? "text-white/60"
                          : "text-black/60"
                      }`}
                    >
                      {card.type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

        {/* Botón de confirmar */}
        <Pressable
          className={`p-4 rounded-full ${
            selectedBank &&
            selectedAccount &&
            (formData.type !== "expense" || selectedCard)
              ? "bg-black"
              : "bg-black/50"
          }`}
          onPress={onConfirm}
          disabled={
            !selectedBank ||
            !selectedAccount ||
            (formData.type === "expense" && !selectedCard)
          }
        >
          <Text className="text-white text-center font-medium">Confirmar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
