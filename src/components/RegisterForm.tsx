import React from "react";
import { View, TextInput, Pressable, Text } from "react-native";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onToggleMode: () => void;
}

export function RegisterForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onToggleMode,
}: RegisterFormProps) {
  return (
    <>
      <View
        className="bg-white rounded-3xl p-6 border border-veryPaleBlue/10"
        style={{
          elevation: 8,
          shadowColor: "#755bce",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        }}
      >
        <View className="space-y-4">
          <TextInput
            className="bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl mb-4"
            placeholder="Email"
            placeholderTextColor="#755bce"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            className="bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl"
            placeholder="Password"
            placeholderTextColor="#755bce"
            value={password}
            autoCapitalize="none"
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        <View className="mt-8">
          <Pressable
            className="bg-moderateBlue p-4 rounded-xl"
            disabled={loading}
            onPress={onSubmit}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? "Cargando..." : "Registrarse"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable className="mt-4" onPress={onToggleMode}>
        <Text className="text-moderateBlue text-center">
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </Pressable>
    </>
  );
}
