import React from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";

interface ElevatedBaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: "floating" | "bottom-sheet";
}

export function ElevatedBaseModal({
  visible,
  onClose,
  title,
  children,
  variant = "floating",
}: ElevatedBaseModalProps) {
  const isFloating = variant === "floating";

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isFloating ? "fade" : "slide"}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        {isFloating ? (
          <View className="flex-1 justify-center items-center">
            <View
              className="w-[90%] max-h-[85%] bg-white rounded-3xl p-6"
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
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-textPrimary text-xl font-bold">
                  {title}
                </Text>
                <Pressable onPress={onClose}>
                  <Text className="text-textSecondary">Cerrar</Text>
                </Pressable>
              </View>
              {children}
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-end">
            <View
              className="bg-white rounded-t-3xl"
              style={{
                elevation: 8,
                shadowColor: "#755bce",
                shadowOffset: {
                  width: 0,
                  height: -4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                maxHeight: "70%",
              }}
            >
              <View className="p-6 pb-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-textPrimary text-xl font-bold">
                    {title}
                  </Text>
                  <Pressable onPress={onClose}>
                    <Text className="text-textSecondary">Cerrar</Text>
                  </Pressable>
                </View>
              </View>
              <ScrollView className="px-6 pb-12">{children}</ScrollView>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
