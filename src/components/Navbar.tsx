import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Home, CreditCard } from "lucide-react-native";
import { BankAccountsModal } from "./AddBankAccountsModal";

export function Navbar() {
  const [bankAccountsModalVisible, setBankAccountsModalVisible] =
    useState(false);

  return (
    <>
      <View className="mt-auto w-full">
        <View className="shadow-lg">
          <View
            className="w-full bg-white"
            style={{
              elevation: 8,
              shadowColor: "#755bce",
              shadowOffset: {
                width: 0,
                height: -6,
              },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            }}
          >
            <View className="h-[56px] flex-row items-center justify-between px-8">
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

            <View className="h-8 bg-white" />
          </View>
        </View>
      </View>

      <BankAccountsModal
        visible={bankAccountsModalVisible}
        onClose={() => setBankAccountsModalVisible(false)}
      />
    </>
  );
}
