import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+56");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    // Limpiar el número de teléfono de espacios y caracteres especiales
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = `${countryCode}${cleanPhone}`;

    // Validar formato básico
    if (cleanPhone.length < 8) {
      Alert.alert("Error", "El número de teléfono es demasiado corto");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name.trim(),
            phone: formattedPhone,
          },
        },
      });

      if (error) throw error;

      Alert.alert(
        "Registro exitoso",
        "Por favor revisa tu email para confirmar tu cuenta"
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setCountryCode("+56");
    setIsLogin(!isLogin);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center px-4">
        <Text className="text-textPrimary text-4xl font-bold mb-8 text-center">
          Pocket Money
        </Text>

        {isLogin ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={signInWithEmail}
            onToggleMode={resetForm}
          />
        ) : (
          <RegisterForm
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={signUpWithEmail}
            onToggleMode={resetForm}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
