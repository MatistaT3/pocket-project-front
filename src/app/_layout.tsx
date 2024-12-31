import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "../global.css";
import { StatusBar } from "react-native";
import { TransactionProvider } from "../context/TransactionContext";
import { Stack } from "expo-router";
import { BankAccountsProvider } from "../context/BankAccountsContext";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <AuthProvider>
        <BankAccountsProvider>
          <TransactionProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
          </TransactionProvider>
        </BankAccountsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
