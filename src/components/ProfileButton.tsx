import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { User } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

export function ProfileButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { signOut } = useAuth();

  return (
    <>
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className="bg-teal/20 p-2 rounded-full"
      >
        <User size={24} color="#F6DCAC" />
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-oxfordBlue/50"
          onPress={() => setIsModalVisible(false)}
        >
          <View className="absolute top-16 right-4 bg-oxfordBlue rounded-2xl p-4 w-64 shadow-xl">
            <Pressable className="py-3 px-4 bg-teal/10 rounded-lg">
              <Text className="text-sand">Mi perfil</Text>
            </Pressable>
            <Pressable className="py-3 px-4 bg-teal/10 rounded-lg mt-2">
              <Text className="text-sand">Configuración</Text>
            </Pressable>
            <Pressable className="py-3 px-4 bg-teal/10 rounded-lg mt-2">
              <Text className="text-sand">Ayuda</Text>
            </Pressable>
            <View className="h-[1px] bg-teal/20 my-2" />
            <Pressable
              className="py-3 px-4 bg-orange/20 rounded-lg"
              onPress={signOut}
            >
              <Text className="text-orange">Cerrar sesión</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
