import React from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { BaseFormProps } from "../../types/common.types";
import { Button } from "../Button";

export function LoginForm({
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

        <Button
          label={loading ? "Cargando..." : "Iniciar Sesión"}
          onPress={onSubmit}
          disabled={loading}
          className="mt-4"
        />
      </View>

      <Pressable onPress={onToggleMode} className="mt-4">
        <Text className="text-black text-center">
          ¿No tienes cuenta? Regístrate
        </Text>
      </Pressable>
    </>
  );
}
