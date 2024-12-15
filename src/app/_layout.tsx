import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { AuthScreen } from "../screens/AuthScreen";
import { HomeScreen } from "../screens/HomeScreen";
import "../global.css";

function RootLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) return null;

  if (!session) {
    return <AuthScreen />;
  }

  return <HomeScreen />;
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
