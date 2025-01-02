import React from "react";
import { View, Pressable, Text } from "react-native";
import { CreditCard, ChevronRight } from "lucide-react-native";

interface AccountSelectorProps {
  bankName: string;
  cardLastFour: string;
  selectedCard: string | null;
  navigateToSelectBank: () => void;
}

export function AccountSelector({
  bankName,
  cardLastFour,
  selectedCard,
  navigateToSelectBank,
}: AccountSelectorProps) {
  return (
    <View>
      <Text className="text-black/60 mb-2 text-sm">Cuenta</Text>
      <Pressable
        className="bg-black/[0.03] p-4 rounded-full flex-row items-center justify-between active:bg-black/[0.05]"
        onPress={navigateToSelectBank}
      >
        <View className="flex-row items-center">
          <CreditCard size={20} color="black" />
          <Text className="text-black ml-3">
            {bankName || "Seleccionar cuenta"}
          </Text>
        </View>
        <ChevronRight size={20} color="black" />
      </Pressable>
      {selectedCard && (
        <Text className="text-black/60 mt-2 ml-2 text-sm">
          Tarjeta terminada en {cardLastFour}
        </Text>
      )}
    </View>
  );
}
