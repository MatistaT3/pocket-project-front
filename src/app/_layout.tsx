import { View } from "react-native";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Auth } from "../components/Auth";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ProfileButton } from "../components/ProfileButton";
import { Navbar } from "../components/Navbar";
import "../global.css";

function RootLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) return null;

  if (!session) {
    return (
      <View className="flex-1 bg-oxfordBlue">
        <SafeAreaView edges={["top"]} className="flex-1">
          <Auth />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-oxfordBlue">
      <SafeAreaView edges={["top"]} className="flex-1">
        <View className="flex-1">
          <View className="absolute right-4 top-4 z-10">
            <ProfileButton />
          </View>
          <View className="flex-1">
            <Slot />
          </View>
        </View>
      </SafeAreaView>
      <SafeAreaView edges={["bottom"]} className="bg-transparent">
        <Navbar />
      </SafeAreaView>
    </View>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
