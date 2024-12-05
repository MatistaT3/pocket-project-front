import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { UserCircle } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

export function ProfileButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { signOut } = useAuth();

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <UserCircle size={32} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View className="absolute top-16 right-4 bg-oxfordBlue rounded-2xl p-4 w-64 shadow-xl">
            <TouchableOpacity className="py-3 px-4 hover:bg-gray-800 rounded-lg">
              <Text className="text-white">Mi perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 px-4 hover:bg-gray-800 rounded-lg">
              <Text className="text-white">Configuración</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 px-4 hover:bg-gray-800 rounded-lg">
              <Text className="text-white">Ayuda</Text>
            </TouchableOpacity>
            <View className="h-[1px] bg-gray-700 my-2" />
            <TouchableOpacity
              className="py-3 px-4 hover:bg-gray-800 rounded-lg"
              onPress={signOut}
            >
              <Text className="text-red-500">Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
