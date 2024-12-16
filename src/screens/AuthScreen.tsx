import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth } from "../components/Auth/Auth";

export function AuthScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <Auth />
      </SafeAreaView>
    </View>
  );
}
