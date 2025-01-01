import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Building2, Plus, ChevronLeft } from "lucide-react-native";
import { AVAILABLE_BANKS } from "../../constants/banks";

interface AddBankFormProps {
  onSelectBank: (bankName: string) => void;
  onBack: () => void;
}

export function AddBankForm({ onSelectBank, onBack }: AddBankFormProps) {
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
          <Text className="text-2xl font-bold text-black">Agregar Banco</Text>
          <Text className="text-base text-black/60">
            Selecciona el banco que deseas agregar
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="space-y-3">
          {AVAILABLE_BANKS.map((bankName) => (
            <Pressable
              key={bankName}
              className="bg-black/[0.03] p-4 rounded-2xl active:bg-black/[0.05]"
              onPress={() => onSelectBank(bankName)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Building2 size={24} color="black" />
                  <Text className="text-lg font-medium text-black ml-3 flex-1">
                    {bankName}
                  </Text>
                </View>
                <Plus size={20} color="black" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
