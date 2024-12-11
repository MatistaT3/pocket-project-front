import React, { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";

interface RegisterFormProps {
  name: string;
  setName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onToggleMode: () => void;
}

export function RegisterForm({
  name,
  setName,
  phone,
  setPhone,
  countryCode,
  setCountryCode,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onToggleMode,
}: RegisterFormProps) {
  const [show, setShow] = useState(false);

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
            placeholder="Nombre completo"
            placeholderTextColor="#755bce"
            value={name}
            autoCapitalize="words"
            onChangeText={setName}
          />
          <View className="flex-row space-x-2">
            <Pressable
              className="bg-veryPaleBlue/50 rounded-xl px-4 justify-center items-center  mb-4"
              onPress={() => setShow(true)}
            >
              <Text className="text-textPrimary">{countryCode}</Text>
            </Pressable>
            <TextInput
              className="flex-1 bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl mb-4"
              placeholder="Teléfono"
              placeholderTextColor="#755bce"
              value={phone}
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />
          </View>
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

      <CountryPicker
        show={show}
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
        onBackdropPress={() => setShow(false)}
        style={{
          modal: {
            height: 500,
            backgroundColor: "white",
          },
          textInput: {
            color: "#755bce",
            height: 48,
          },
          countryButtonStyles: {
            height: 48,
          },
          flag: {
            fontSize: 24,
          },
        }}
        inputPlaceholder="Buscar país"
        lang="es"
        enableModalAvoiding={false}
      />
    </>
  );
}
