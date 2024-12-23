import React from "react";
import { View } from "react-native";
import { Calendar } from "./Calendar/Calendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BankAppsLauncher } from "./BankAppsLauncher";

export function MainContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <Calendar />
        <View className="mt-4">
          <BankAppsLauncher />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
