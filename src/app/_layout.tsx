import "../global.css";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import Auth from "../components/Auth";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return (
      <View className="flex-1 bg-oxfordBlue">
        <Auth />
      </View>
    );
  }

  return <Slot />;
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
