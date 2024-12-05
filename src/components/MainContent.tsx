import React from "react";
import { View } from "react-native";
import { Calendar } from "./Calendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function MainContent() {
  return (
    <GestureHandlerRootView>
      <View className="p-6">
        <Calendar />
      </View>
    </GestureHandlerRootView>
  );
}
