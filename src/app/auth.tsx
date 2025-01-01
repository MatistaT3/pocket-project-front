import React, { useState } from "react";
import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import { AuthUI } from "../components/Auth/AuthUI";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Error", "Hubo un problema al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert(
        "Registro exitoso",
        "Por favor revisa tu email para confirmar tu cuenta"
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setIsLogin(!isLogin);
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <AuthUI
            isLogin={isLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSignIn={signInWithEmail}
            onSignUp={signUpWithEmail}
            onToggleMode={resetForm}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
