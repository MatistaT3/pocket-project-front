import React from "react";
import { View } from "react-native";
import { Calendar } from "./Calendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function MainContent() {
  return (
    <GestureHandlerRootView>
      <View className="p-4">
        <Calendar />
      </View>
    </GestureHandlerRootView>
  );
}
