import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Home, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Navbar() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0"
      style={{ paddingBottom: bottom }}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={20}
          className="absolute inset-0"
          style={{ bottom: -bottom }}
        />
      ) : (
        <View
          className="absolute inset-0 bg-oxfordBlue/90"
          style={{ bottom: -bottom }}
        />
      )}

      <View className="h-16">
        <View className="flex-row justify-between items-center h-full px-4 relative">
          <TouchableOpacity className="p-3" onPress={() => router.push("/")}>
            <Home size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 bg-turquoise rounded-full items-center justify-center shadow-lg"
            style={{ transform: [{ translateX: -28 }] }}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>

          <View className="w-10 h-10" />
        </View>
      </View>
    </View>
  );
}
