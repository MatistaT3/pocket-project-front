import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Home, Plus, CreditCard } from "lucide-react-native";
import { AddTransactionModal } from "./AddTransactionModal";
import { BankAccountsModal } from "./AddBankAccountsModal";
import { useTransactions } from "../hooks/useTransactions";

export function Navbar() {
  const [addTransactionModalVisible, setAddTransactionModalVisible] =
    useState(false);
  const [bankAccountsModalVisible, setBankAccountsModalVisible] =
    useState(false);
  const { refreshTransactions } = useTransactions();

  return (
    <>
      <View className="mt-auto w-full">
        <View className="h-4 bg-background" />
        <View
          className="w-full bg-white shadow-lg border border-veryPaleBlue/10"
          style={{
            elevation: 8,
            shadowColor: "#755bce",
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          }}
        >
          <View className="h-[56px] flex-row items-center justify-between px-8 ">
            <View className="items-center">
              <Pressable
                className="w-[48px] h-[48px] items-center justify-center"
                hitSlop={8}
              >
                <Home size={24} color="#755bce" />
                <Text className="text-textPrimary text-xs mt-1">Home</Text>
              </Pressable>
            </View>

            <View className="items-center">
              <Pressable
                className="w-[48px] h-[48px] items-center justify-center"
                hitSlop={8}
                onPress={() => setBankAccountsModalVisible(true)}
              >
                <CreditCard size={24} color="#755bce" />
                <Text className="text-textPrimary text-xs mt-1">Cuentas</Text>
              </Pressable>
            </View>
          </View>

          {/* Botón flotante */}
          <Pressable
            className="absolute left-1/2 -top-8 bg-moderateBlue w-16 h-16 rounded-full items-center justify-center shadow-xl border border-white"
            style={{
              transform: [{ translateX: -32 }],
              elevation: 12,
              shadowColor: "#755bce",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.25,
              shadowRadius: 8,
            }}
            onPress={() => setAddTransactionModalVisible(true)}
          >
            <Plus size={32} color="white" />
          </Pressable>

          <View className="h-8 bg-white" />
        </View>
      </View>

      <AddTransactionModal
        visible={addTransactionModalVisible}
        onClose={() => setAddTransactionModalVisible(false)}
        onSuccess={refreshTransactions}
      />

      <BankAccountsModal
        visible={bankAccountsModalVisible}
        onClose={() => setBankAccountsModalVisible(false)}
      />
    </>
  );
}
