import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    else Alert.alert("Revisa tu email para confirmar tu cuenta");
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-oxfordBlue"
    >
      <View className="flex-1 justify-center px-4">
        <Text className="text-sand text-4xl font-bold mb-8 text-center">
          Pocket Money
        </Text>
        <View className="space-y-4">
          <TextInput
            className="bg-teal/10 text-sand p-4 rounded-xl"
            placeholder="Email"
            placeholderTextColor="#FAA968"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            className="bg-teal/10 text-sand p-4 rounded-xl"
            placeholder="Password"
            placeholderTextColor="#FAA968"
            value={password}
            autoCapitalize="none"
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        <View className="flex-row justify-between mt-8 space-x-4">
          <Pressable
            className="flex-1 bg-teal p-4 rounded-xl"
            disabled={loading}
            onPress={() => signInWithEmail()}
          >
            <Text className="text-sand text-center font-semibold">
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-orange p-4 rounded-xl"
            disabled={loading}
            onPress={() => signUpWithEmail()}
          >
            <Text className="text-sand text-center font-semibold">
              {loading ? "Cargando..." : "Registrarse"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
