import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BaseModal({
  visible,
  onClose,
  title,
  children,
}: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-white/50">
        <View className="bg-white w-[90%] rounded-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-textPrimary text-xl font-bold">{title}</Text>
            <Pressable onPress={onClose}>
              <Text className="text-textSecondary">Cerrar</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
