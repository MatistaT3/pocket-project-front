import React from "react";
import { View } from "react-native";
import { Header } from "../components/Header";
import { Navbar } from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { CalendarScreen } from "./CalendarScreen";

export function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <Header />
        <View className="flex-1 mt-4">
          <CalendarScreen />
        </View>
      </SafeAreaView>
      <View className="mt-auto">
        <Navbar />
      </View>
      <FloatingActionButton />
    </View>
  );
}
