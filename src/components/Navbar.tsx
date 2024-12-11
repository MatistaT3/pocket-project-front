import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Home, Plus, CreditCard } from "lucide-react-native";
import { AddTransactionModal } from "./AddTransactionModal";
import { BankAccountsModal } from "./BankAccountsModal";
import { useTransactions } from "../hooks/useTransactions";

export function Navbar() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [bankAccountsModalVisible, setBankAccountsModalVisible] =
    useState(false);
  const { refreshTransactions } = useTransactions();

  return (
    <>
      <View className="mt-auto">
        <View className="bg-teal rounded-t-[40px]">
          <View className="h-24 flex-row items-center justify-between px-6">
            <View className="items-center">
              <Pressable className="p-3">
                <Home size={32} color="white" />
              </Pressable>
              <Text className="text-white text-sm">Home</Text>
            </View>

            <View className="items-center">
              <Pressable
                className="p-3"
                onPress={() => setBankAccountsModalVisible(true)}
              >
                <CreditCard size={32} color="white" />
              </Pressable>
              <Text className="text-white text-sm">Cuentas</Text>
            </View>
          </View>

          <Pressable
            className="absolute left-1/2 -top-10 bg-orange w-20 h-20 rounded-full items-center justify-center shadow-xl border-4 border-oxfordBlue"
            style={{ transform: [{ translateX: -40 }] }}
            onPress={() => setAddModalVisible(true)}
          >
            <Plus size={36} color="white" />
          </Pressable>

          <View className="h-6 bg-teal" />
        </View>

        <View className="h-20 bg-teal -mt-1" style={{ marginBottom: -50 }} />
      </View>

      <AddTransactionModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={refreshTransactions}
      />

      <BankAccountsModal
        visible={bankAccountsModalVisible}
        onClose={() => setBankAccountsModalVisible(false)}
      />
    </>
  );
}
