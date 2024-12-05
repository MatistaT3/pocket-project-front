import React, { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) Alert.alert("Error", error.message);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            created_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else if (!session) {
        Alert.alert(
          "Verifica tu correo",
          "Te hemos enviado un enlace de confirmación a tu correo electrónico"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6">
      <View className="bg-oxfordBlue rounded-3xl p-8 shadow-xl">
        <Text className="text-white text-2xl font-bold mb-8 text-center">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </Text>

        <View className="space-y-4">
          {!isLogin && (
            <View>
              <Text className="text-gray-400 mb-2 text-sm">
                Nombre completo
              </Text>
              <TextInput
                className="bg-gray-700 text-white px-4 py-3 rounded-xl"
                onChangeText={setFullName}
                value={fullName}
                placeholder="Nombre completo"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                textContentType="name"
              />
            </View>
          )}

          <View>
            <Text className="text-gray-400 mb-2 text-sm">Correo</Text>
            <TextInput
              className="bg-gray-700 text-white px-4 py-3 rounded-xl"
              onChangeText={setEmail}
              value={email}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          </View>

          <View>
            <Text className="text-gray-400 mb-2 text-sm">Contraseña</Text>
            <TextInput
              className="bg-gray-700 text-white px-4 py-3 rounded-xl"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              placeholder="Contraseña"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              textContentType="password"
            />
          </View>

          <TouchableOpacity
            className={`bg-turquoise p-4 rounded-xl mt-4 ${
              loading ? "opacity-50" : ""
            }`}
            onPress={() => (isLogin ? signInWithEmail() : signUpWithEmail())}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-400">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            </Text>
            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              className="ml-2"
            >
              <Text className="text-turquoise">
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
