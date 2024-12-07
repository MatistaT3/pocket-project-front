import React from "react";
import { View } from "react-native";
import { Calendar } from "./Calendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function MainContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <Calendar />
      </View>
    </GestureHandlerRootView>
  );
}
