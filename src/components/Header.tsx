import React from "react";
import { View, Text } from "react-native";
import { ProfileButton } from "./ProfileButton";

export function Header() {
  return (
    <View className="px-4 py-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-black text-xl">Pocket Money</Text>
        <ProfileButton />
      </View>
    </View>
  );
}
