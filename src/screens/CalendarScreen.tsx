import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Calendar } from "../components/Calendar/Calendar";

export function CalendarScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <Calendar />
      </View>
    </GestureHandlerRootView>
  );
}
