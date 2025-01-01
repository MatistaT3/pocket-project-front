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
  if (bank.accounts.length === 0) {
    return (
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center space-x-3 mb-16">
          <Pressable
            onPress={onBack}
            className="w-10 h-10 items-center justify-center rounded-full active:bg-black/5"
            hitSlop={8}
          >
            <ChevronLeft size={24} color="black" />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold text-black">{bank.name}</Text>
            <Text className="text-base text-black/60">
              Sin cuentas configuradas
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <CreditCard size={48} color="black" className="opacity-50 mb-6" />
          <Text className="text-2xl font-bold text-black mb-2 text-center">
            Sin cuentas configuradas
          </Text>
          <Text className="text-base text-black/60 text-center mb-8 px-8">
            Comienza agregando tu primera cuenta bancaria
          </Text>
          <Pressable
            className="bg-black px-6 py-3.5 rounded-full active:bg-black/90"
            onPress={onAddAccount}
          >
            <View className="flex-row items-center space-x-2">
              <Plus size={20} color="white" />
              <Text className="text-white font-medium">
                Agregar Primera Cuenta
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center space-x-3 mb-6">
        <Pressable
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-black/5"
          hitSlop={8}
        >
          <ChevronLeft size={24} color="black" />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-black">{bank.name}</Text>
          <Text className="text-base text-black/60">
            {bank.accounts.length}{" "}
            {bank.accounts.length === 1 ? "cuenta" : "cuentas"}
          </Text>
        </View>
      </View>

      <View className="space-y-6">
        {/* Botón de agregar cuenta */}
        <Pressable
          className="flex-row items-center justify-center py-3.5 rounded-2xl bg-black/[0.03] active:bg-black/[0.05]"
          onPress={onAddAccount}
        >
          <Plus size={20} color="black" />
          <Text className="text-black font-medium ml-2">Agregar Cuenta</Text>
        </Pressable>

        {/* Lista de cuentas */}
        <View className="space-y-3">
          {bank.accounts.map((account) => (
            <View key={account.id}>
              <Pressable
                className={`p-4 rounded-2xl ${
                  selectedAccount === account.id
                    ? "bg-black"
                    : "bg-black/[0.03]"
                } active:bg-black/[0.05]`}
                onPress={() =>
                  onSelectAccount(
                    selectedAccount === account.id ? null : account.id
                  )
                }
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-medium ${
                        selectedAccount === account.id
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      Cuenta N° {account.accountNumber}
                    </Text>
                    <Text
                      className={
                        selectedAccount === account.id
                          ? "text-white/60"
                          : "text-black/60"
                      }
                    >
                      ${account.currentBalance.toLocaleString("es-CL")}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-2">
                    <Text
                      className={
                        selectedAccount === account.id
                          ? "text-white/60"
                          : "text-black/60"
                      }
                    >
                      {account.cards.length}{" "}
                      {account.cards.length === 1 ? "tarjeta" : "tarjetas"}
                    </Text>
                    <Pressable
                      onPress={() =>
                        onDeleteAccount(account.id, account.accountNumber)
                      }
                      className="p-2 rounded-full active:bg-black/10"
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
                <View className="mt-3 space-y-3">
                  {/* Botón de agregar tarjeta */}
                  <Pressable
                    className="flex-row items-center justify-center py-3.5 rounded-2xl bg-white/10 active:bg-white/20"
                    onPress={() => onAddCard(account.id, account.accountNumber)}
                  >
                    <Plus size={20} color="black" />
                    <Text className="text-black font-medium ml-2">
                      Agregar Tarjeta
                    </Text>
                  </Pressable>

                  {/* Lista de tarjetas */}
                  {account.cards.map((card) => (
                    <View
                      key={card.id}
                      className="bg-black/[0.02] p-4 rounded-2xl"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <CreditCard size={20} color="black" />
                          <View className="ml-3">
                            <Text className="text-black font-medium">
                              •••• {card.lastFourDigits}
                            </Text>
                            <Text className="text-black/60 capitalize text-sm">
                              {card.type}
                            </Text>
                          </View>
                        </View>
                        <Pressable
                          onPress={() =>
                            onDeleteCard(
                              card.id,
                              account.id,
                              card.lastFourDigits
                            )
                          }
                          className="p-2 rounded-full active:bg-black/10"
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
    </View>
  );
}
