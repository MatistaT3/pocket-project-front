import React from "react";
import { View, Text } from "react-native";
import { ProfileButton } from "./ProfileButton";

export function Header() {
  return (
    <View className="bg-background px-6 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-textPrimary text-2xl font-bold">
          Pocket Money
        </Text>
        <ProfileButton />
      </View>
    </View>
  );
}
