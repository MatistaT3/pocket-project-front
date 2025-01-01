import React from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { BaseFormProps } from "../../types/common.types";

export function RegisterForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onToggleMode,
}: BaseFormProps) {
  return (
    <>
      <View className="space-y-6">
        <View className="space-y-6">
          <TextInput
            className="text-black p-4 rounded-full bg-black/[0.03]"
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            className="text-black p-4 mt-4 rounded-full bg-black/[0.03]"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            autoCapitalize="none"
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        <Pressable
          className={`h-12 rounded-full items-center justify-center ${
            loading ? "bg-black/20" : "bg-black active:bg-black/90"
          }`}
          onPress={onSubmit}
          disabled={loading}
        >
          <Text
            className={`font-medium ${
              loading ? "text-black/40" : "text-white"
            }`}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onToggleMode}
        className="mt-4 py-2 active:bg-black/5 rounded-full"
      >
        <Text className="text-black text-center">
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </Pressable>
    </>
  );
}
