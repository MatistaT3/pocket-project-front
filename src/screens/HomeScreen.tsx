import React from "react";
import { View } from "react-native";
import { MainContent } from "../components/MainContent";
import { Header } from "../components/Header";
import { Navbar } from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";

export function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <Header />
        <View className="flex-1">
          <MainContent />
        </View>
      </SafeAreaView>
      <Navbar />
    </View>
  );
}
