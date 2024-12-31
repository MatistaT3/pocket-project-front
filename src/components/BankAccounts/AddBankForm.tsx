import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Building2, Plus } from "lucide-react-native";
import { AVAILABLE_BANKS } from "../../constants/banks";

interface AddBankFormProps {
  onSelectBank: (bankName: string) => void;
}

export function AddBankForm({ onSelectBank }: AddBankFormProps) {
  return (
    <View className="flex-1">
      <View className="py-4">
        <Text className="text-2xl font-bold text-textPrimary">
          Agregar Banco
        </Text>
        <Text className="text-base text-textSecondary mt-1">
          Selecciona el banco que deseas agregar
        </Text>
      </View>

      <ScrollView className="space-y-2 pb-16">
        {AVAILABLE_BANKS.map((bankName) => (
          <Pressable
            key={bankName}
            className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-between"
            onPress={() => onSelectBank(bankName)}
          >
            <View className="flex-row items-center flex-1">
              <Building2 size={24} color="#755bce" />
              <Text className="text-textPrimary ml-3 flex-1">{bankName}</Text>
            </View>
            <Plus size={20} color="#755bce" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
