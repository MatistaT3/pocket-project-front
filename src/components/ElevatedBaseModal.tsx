import React from "react";
import {
  View,
  Modal,
  Pressable,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import { BaseModalProps } from "../types/common.types";

export function ElevatedBaseModal({
  visible,
  onClose,
  onBack,
  children,
  title,
  variant = "center",
}: BaseModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onBack || onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <Pressable className="flex-1 bg-black/50" onPress={onClose}>
          <View
            className={`flex-1 ${
              variant === "bottom-sheet" ? "justify-end" : "justify-center"
            }`}
          >
            <View
              className={`bg-white ${
                variant === "bottom-sheet"
                  ? "rounded-t-3xl pt-2"
                  : "mx-4 rounded-3xl"
              }`}
            >
              <Pressable>
                <View className="flex-row items-center justify-between px-4 py-2">
                  <Text className="text-black text-lg flex-1">{title}</Text>
                  <Pressable
                    onPress={onBack || onClose}
                    hitSlop={8}
                    className="p-2 -mr-2"
                  >
                    <X size={24} color="black" />
                  </Pressable>
                </View>

                <ScrollView
                  className="px-4"
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    paddingBottom: variant === "bottom-sheet" ? 56 : 16,
                  }}
                >
                  {children}
                </ScrollView>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
