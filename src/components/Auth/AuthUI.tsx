import React from "react";
import { View, Text } from "react-native";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthUIProps {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onToggleMode: () => void;
}

export function AuthUI({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSignIn,
  onSignUp,
  onToggleMode,
}: AuthUIProps) {
  return (
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
          onSubmit={onSignIn}
          onToggleMode={onToggleMode}
        />
      ) : (
        <RegisterForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={onSignUp}
          onToggleMode={onToggleMode}
        />
      )}
    </View>
  );
}
