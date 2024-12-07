import React from "react";
import { View, Text } from "react-native";

export function Header() {
  return (
    <View className="bg-oxfordBlue px-6 pt-14 pb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-sand text-2xl font-bold">Pocket Money</Text>
      </View>
    </View>
  );
}
