import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, TextInput, Alert } from "react-native";
import { User, X, Phone, Mail, PencilLine, Check } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export function ProfileButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { signOut, session } = useAuth();
  const [editingField, setEditingField] = useState<"name" | "phone" | null>(
    null
  );
  const [editValue, setEditValue] = useState("");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (isModalVisible) {
      refreshUserData();
    }
  }, [isModalVisible]);

  const refreshUserData = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEdit = (field: "name" | "phone") => {
    const currentValue =
      field === "name" ? userData?.user_metadata?.full_name : userData?.phone;
    setEditValue(currentValue || "");
    setEditingField(field);
  };

  const handleSave = async () => {
    if (!editingField || !session?.user) return;

    try {
      let updateData = {};
      if (editingField === "name") {
        updateData = { data: { full_name: editValue } };
      } else {
        updateData = { phone: editValue };
      }

      const { error } = await supabase.auth.updateUser(updateData);

      if (error) throw error;

      refreshUserData();
      Alert.alert("Éxito", "Información actualizada correctamente");
      setEditingField(null);
    } catch (error: any) {
      console.error("Error updating user:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleCancel = (field: "name" | "phone") => {
    setEditingField(null);
    setEditValue("");
  };

  return (
    <>
      <View className="shadow-lg">
        <Pressable
          onPress={() => setIsModalVisible(true)}
          className="bg-white w-12 h-12 rounded-full items-center justify-center shadow-inner border border-veryPaleBlue/10"
          style={{
            elevation: 8,
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
        onRequestClose={() => {
          setIsModalVisible(false);
          setEditingField(null);
        }}
      >
        <View className="shadow-lg">
          <Pressable
            className="flex-1 bg-background/50"
            onPress={() => {
              setIsModalVisible(false);
              setEditingField(null);
            }}
          >
            <View
              className="absolute top-16 right-4 bg-white rounded-3xl p-6 w-80 border border-veryPaleBlue/10 shadow-inner"
              style={{
                elevation: 8,
                shadowColor: "#755bce",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 8,
              }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-textPrimary">
                  Mi Perfil
                </Text>
                <Pressable
                  onPress={() => {
                    setIsModalVisible(false);
                    setEditingField(null);
                  }}
                  className="w-8 h-8 items-center justify-center rounded-full bg-veryPaleBlue/5"
                >
                  <X size={24} color="#755bce" />
                </Pressable>
              </View>

              <View className="space-y-4">
                <View>
                  <TextInput
                    className={`bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl mb-2 ${
                      editingField === "name"
                        ? "border-2 border-moderateBlue"
                        : ""
                    }`}
                    placeholder="Nombre completo"
                    placeholderTextColor="#755bce"
                    value={
                      editingField === "name"
                        ? editValue
                        : userData?.user_metadata?.full_name
                    }
                    onChangeText={
                      editingField === "name" ? setEditValue : undefined
                    }
                    editable={editingField === "name"}
                  />
                  <View className="absolute right-4 top-4 flex-row space-x-2">
                    {editingField === "name" ? (
                      <>
                        <Pressable onPress={() => handleCancel("name")}>
                          <X size={20} color="#755bce" />
                        </Pressable>
                        <Pressable onPress={handleSave}>
                          <Check size={20} color="#755bce" />
                        </Pressable>
                      </>
                    ) : (
                      <Pressable onPress={() => handleEdit("name")}>
                        <PencilLine size={20} color="#755bce" />
                      </Pressable>
                    )}
                  </View>
                </View>

                <View>
                  <TextInput
                    className={`bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl mb-2 ${
                      editingField === "phone"
                        ? "border-2 border-moderateBlue"
                        : ""
                    }`}
                    placeholder="Teléfono"
                    placeholderTextColor="#755bce"
                    value={
                      editingField === "phone" ? editValue : userData?.phone
                    }
                    onChangeText={
                      editingField === "phone" ? setEditValue : undefined
                    }
                    editable={editingField === "phone"}
                    keyboardType="phone-pad"
                  />
                  <View className="absolute right-4 top-4 flex-row space-x-2">
                    {editingField === "phone" ? (
                      <>
                        <Pressable onPress={() => handleCancel("phone")}>
                          <X size={20} color="#755bce" />
                        </Pressable>
                        <Pressable onPress={handleSave}>
                          <Check size={20} color="#755bce" />
                        </Pressable>
                      </>
                    ) : (
                      <Pressable onPress={() => handleEdit("phone")}>
                        <PencilLine size={20} color="#755bce" />
                      </Pressable>
                    )}
                  </View>
                </View>

                <TextInput
                  className="bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl"
                  placeholder="Email"
                  placeholderTextColor="#755bce"
                  value={userData?.email}
                  editable={false}
                />

                <View className="mt-2">
                  <Pressable
                    className="bg-moderateBlue p-4 rounded-xl"
                    onPress={signOut}
                  >
                    <Text className="text-white text-center font-semibold">
                      Cerrar Sesión
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}
