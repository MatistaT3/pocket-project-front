import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainContent } from "@/components/MainContent";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <View className="flex flex-1 bg-oxfordBlue">
      <Header />
      <MainContent />
      <Footer />
    </View>
  );
}
