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
        <CreditCard size={48} color="#755bce" />
        <Text className="text-textPrimary text-center text-lg font-medium">
          No hay cuentas disponibles
        </Text>
        <Text className="text-textSecondary text-center px-4">
          Dirígete a la sección "Cuentas" en la barra de navegación para agregar
          tus cuentas y tarjetas.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="max-h-[600px]">
      <View className="space-y-4">
        {/* Selección de banco */}
        <View>
          <Text className="text-textSecondary mb-2">Banco</Text>
          <Pressable
            className="flex-row items-center justify-between bg-veryPaleBlue/10 p-4 rounded-xl"
            onPress={() => setIsBankListVisible(!isBankListVisible)}
          >
            <View className="flex-row items-center">
              <Building2 size={20} color="#755bce" />
              <Text className="text-textPrimary ml-3">
                {selectedBankData?.name || "Selecciona un banco"}
              </Text>
            </View>
            <ChevronRight
              size={20}
              color="#755bce"
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
                  className={`p-4 rounded-xl ${
                    selectedBank === bank.id
                      ? "bg-veryPaleBlue"
                      : "bg-veryPaleBlue/20"
                  }`}
                  onPress={() => {
                    setSelectedBank(bank.id);
                    setSelectedAccount(null);
                    setSelectedCard(null);
                    setIsBankListVisible(false);
                  }}
                >
                  <Text className="text-textPrimary">{bank.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Selección de cuenta */}
        {selectedBank && (
          <View>
            <Text className="text-textSecondary mb-2">Cuenta</Text>
            <Pressable
              className="flex-row items-center justify-between bg-veryPaleBlue/10 p-4 rounded-xl"
              onPress={() => setIsAccountListVisible(!isAccountListVisible)}
            >
              <View className="flex-row items-center">
                <CreditCard size={20} color="#755bce" />
                <Text className="text-textPrimary ml-3">
                  {selectedAccountData
                    ? `Cuenta: ${selectedAccountData.accountNumber}`
                    : "Selecciona una cuenta"}
                </Text>
              </View>
              <ChevronRight
                size={20}
                color="#755bce"
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
                    className={`p-4 rounded-xl ${
                      selectedAccount === account.id
                        ? "bg-veryPaleBlue"
                        : "bg-veryPaleBlue/20"
                    }`}
                    onPress={() => {
                      setSelectedAccount(account.id);
                      setSelectedCard(null);
                      setIsAccountListVisible(false);
                    }}
                  >
                    <Text className="text-textPrimary">
                      Cuenta: {account.accountNumber}
                    </Text>
                    <Text className="text-textSecondary text-sm">
                      Saldo: ${account.currentBalance.toFixed(2)}
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
              <Text className="text-textSecondary mb-2">Tarjeta</Text>
              <View className="space-y-2">
                {selectedAccountData.cards.map((card) => (
                  <Pressable
                    key={card.id}
                    className={`p-3 rounded-xl ${
                      selectedCard === card.id
                        ? "bg-veryPaleBlue"
                        : "bg-veryPaleBlue/20"
                    }`}
                    onPress={() => setSelectedCard(card.id)}
                  >
                    <Text className="text-textPrimary">
                      •••• {card.lastFourDigits}
                    </Text>
                    <Text className="text-textSecondary capitalize">
                      {card.type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

        {/* Botón de confirmar */}
        <Pressable
          className={`p-4 rounded-xl mt-4 ${
            selectedBank &&
            selectedAccount &&
            (formData.type !== "expense" || selectedCard)
              ? "bg-moderateBlue"
              : "bg-moderateBlue/50"
          }`}
          onPress={onConfirm}
          disabled={
            !selectedBank ||
            !selectedAccount ||
            (formData.type === "expense" && !selectedCard)
          }
        >
          <Text className="text-white text-center font-semibold">
            Confirmar Selección
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
