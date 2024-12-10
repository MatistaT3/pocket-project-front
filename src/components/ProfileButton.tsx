import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { User, X } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

export function ProfileButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { signOut } = useAuth();

  return (
    <>
      <View className="shadow-lg">
        <Pressable
          onPress={() => setIsModalVisible(true)}
          className="bg-white w-12 h-12 rounded-full items-center justify-center shadow-inner border border-veryPaleBlue/10"
          style={{
            elevation: 8, // Para Android
            shadowColor: "#755bce",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
        >
          <User size={24} color="#755bce" />
        </Pressable>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-background/50"
          onPress={() => setIsModalVisible(false)}
        >
          <View
            className="absolute top-16 right-4 bg-white rounded-2xl p-4 w-64 border border-veryPaleBlue/10"
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
            <Pressable
              onPress={() => setIsModalVisible(false)}
              className="absolute -top-0 -right-0 bg-white w-8 h-8 rounded-full items-center justify-center shadow-lg border border-veryPaleBlue/10"
              style={{
                elevation: 4,
                shadowColor: "#755bce",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <X size={16} color="#755bce" />
            </Pressable>

            <Pressable className="py-3 px-4 bg-veryPaleBlue/5 rounded-xl active:bg-veryPaleBlue/10">
              <Text className="text-textPrimary">Mi perfil</Text>
            </Pressable>
            <Pressable className="py-3 px-4 bg-veryPaleBlue/5 rounded-xl mt-2 active:bg-veryPaleBlue/10">
              <Text className="text-textPrimary">Configuración</Text>
            </Pressable>
            <Pressable className="py-3 px-4 bg-veryPaleBlue/5 rounded-xl mt-2 active:bg-veryPaleBlue/10">
              <Text className="text-textPrimary">Ayuda</Text>
            </Pressable>
            <View className="h-[1px] bg-veryPaleBlue/10 my-2" />
            <Pressable
              className="py-3 px-4 bg-moderateBlue/10 rounded-xl active:bg-moderateBlue/20"
              onPress={signOut}
            >
              <Text className="text-textSecondary">Cerrar sesión</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
