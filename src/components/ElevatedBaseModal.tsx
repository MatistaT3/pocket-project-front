import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

interface ElevatedBaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function ElevatedBaseModal({
  visible,
  onClose,
  title,
  children,
}: ElevatedBaseModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-white/50"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="w-[90%]">
          <View className="shadow-lg">
            <View
              className="bg-white rounded-3xl p-6"
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}
