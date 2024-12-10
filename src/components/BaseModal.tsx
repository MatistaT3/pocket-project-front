import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
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
      <View className="flex-1 justify-center items-center bg-oxfordBlue/50">
        <View className="bg-oxfordBlue w-[90%] rounded-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-sand text-xl font-bold">{title}</Text>
            <Pressable onPress={onClose}>
              <Text className="text-coral">Cerrar</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
