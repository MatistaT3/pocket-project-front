import React from "react";
import { View, Text, Pressable } from "react-native";
import { CreditCard, Plus, Trash2, ChevronLeft } from "lucide-react-native";
import { Bank } from "../../types/bank.types";

interface AccountListProps {
  bank: Bank;
  selectedAccount: string | null;
  onBack: () => void;
  onSelectAccount: (accountId: string | null) => void;
  onAddAccount: () => void;
  onAddCard: (accountId: string, accountNumber: string) => void;
  onDeleteAccount: (accountId: string, accountNumber: string) => void;
  onDeleteCard: (
    cardId: string,
    accountId: string,
    lastFourDigits: string
  ) => void;
}

export function AccountList({
  bank,
  selectedAccount,
  onBack,
  onSelectAccount,
  onAddAccount,
  onAddCard,
  onDeleteAccount,
  onDeleteCard,
}: AccountListProps) {
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center space-x-3 py-4">
        <Pressable
          onPress={onBack}
          className="w-8 h-8 items-center justify-center"
          hitSlop={8}
        >
          <ChevronLeft size={24} color="#755bce" />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-textPrimary">
            {bank.name}
          </Text>
          <Text className="text-base text-textSecondary">
            {bank.accounts.length} cuenta(s)
          </Text>
        </View>
      </View>

      <View className="space-y-4 mt-4">
        {/* Botón de agregar cuenta */}
        <Pressable
          className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-center space-x-2"
          onPress={onAddAccount}
        >
          <Plus size={20} color="#755bce" />
          <Text className="text-textSecondary font-medium">Agregar Cuenta</Text>
        </Pressable>

        {/* Lista de cuentas */}
        {bank.accounts.map((account) => (
          <View key={account.id}>
            <Pressable
              className={`p-4 rounded-xl ${
                selectedAccount === account.id
                  ? "bg-moderateBlue"
                  : "bg-veryPaleBlue/10"
              }`}
              onPress={() =>
                onSelectAccount(
                  selectedAccount === account.id ? null : account.id
                )
              }
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    className={`font-medium ${
                      selectedAccount === account.id
                        ? "text-white"
                        : "text-textPrimary"
                    }`}
                  >
                    Cuenta N° {account.accountNumber}
                  </Text>
                  <Text
                    className={
                      selectedAccount === account.id
                        ? "text-white/80"
                        : "text-textSecondary"
                    }
                  >
                    Saldo: ${account.currentBalance.toLocaleString("es-CL")}
                  </Text>
                </View>
                <View className="flex-row items-center space-x-4">
                  <Text
                    className={
                      selectedAccount === account.id
                        ? "text-white/80"
                        : "text-textSecondary"
                    }
                  >
                    {account.cards.length} tarjeta(s)
                  </Text>
                  <Pressable
                    onPress={() =>
                      onDeleteAccount(account.id, account.accountNumber)
                    }
                    hitSlop={8}
                  >
                    <Trash2
                      size={20}
                      color={
                        selectedAccount === account.id ? "white" : "#ef4444"
                      }
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>

            {selectedAccount === account.id && (
              <View className="pl-4 mt-2 space-y-2">
                {/* Botón de agregar tarjeta */}
                <Pressable
                  className="bg-white/10 p-4 rounded-xl flex-row items-center justify-center space-x-2"
                  onPress={() => onAddCard(account.id, account.accountNumber)}
                >
                  <Plus size={20} color="#755bce" />
                  <Text className="text-textSecondary font-medium">
                    Agregar Tarjeta
                  </Text>
                </Pressable>

                {/* Lista de tarjetas */}
                {account.cards.map((card) => (
                  <View
                    key={card.id}
                    className="bg-veryPaleBlue/5 p-4 rounded-xl"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <CreditCard size={20} color="#755bce" />
                        <View className="ml-3">
                          <Text className="text-textPrimary font-medium">
                            •••• {card.lastFourDigits}
                          </Text>
                          <Text className="text-textSecondary capitalize">
                            {card.type}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() =>
                          onDeleteCard(card.id, account.id, card.lastFourDigits)
                        }
                        hitSlop={8}
                      >
                        <Trash2 size={20} color="#ef4444" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
