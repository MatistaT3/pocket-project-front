import { View, Pressable, TextInput, Text } from "react-native";
import { User, PencilLine, Check, X } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { ElevatedBaseModal } from "./ElevatedBaseModal";
import { CountryPicker } from "react-native-country-codes-picker";

export function ProfileButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<"name" | "phone" | null>(
    null
  );
  const [editValue, setEditValue] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+56");
  const { signOut, session } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (isModalVisible && session?.user) {
      fetchProfileData();
    }
  }, [isModalVisible, session?.user]);

  const fetchProfileData = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile data:", error);
        return;
      }

      // Extraer el código de país del número de teléfono si existe
      if (data?.phone_number && data.phone_number.startsWith("+")) {
        // Buscar el código de país en el número (asumiendo que siempre empieza con +)
        const matches = data.phone_number.match(/^\+\d{2}/);
        if (matches) {
          setCountryCode(matches[0]);
        }
      }

      setProfileData(data);
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
    }
  };

  const handleEdit = (field: "name" | "phone") => {
    if (field === "name") {
      setEditValue(profileData?.full_name || "");
    } else {
      // Para teléfono, remover el código de país
      const phoneNumber = profileData?.phone_number || "";
      const numberWithoutCode = phoneNumber.replace(countryCode, "");
      setEditValue(numberWithoutCode);
    }
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSave = async () => {
    if (!editingField || !session?.user?.id) return;

    try {
      const updates = {
        id: session.user.id,
        [editingField === "name" ? "full_name" : "phone_number"]:
          editingField === "phone" ? `${countryCode}${editValue}` : editValue,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) {
        console.error("Error updating profile:", error);
        return;
      }

      setProfileData((prev) => ({
        ...prev,
        [editingField === "name" ? "full_name" : "phone_number"]:
          editingField === "phone" ? `${countryCode}${editValue}` : editValue,
      }));
      setEditingField(null);
      setEditValue("");
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
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

      <ElevatedBaseModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingField(null);
        }}
        title="Mi Perfil"
      >
        <View className="space-y-4">
          <View>
            <TextInput
              className={`bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl mb-2 ${
                editingField === "name" ? "border-2 border-moderateBlue" : ""
              }`}
              placeholder="Ingrese su nombre"
              placeholderTextColor="#755bce"
              value={
                editingField === "name" ? editValue : profileData?.full_name
              }
              onChangeText={editingField === "name" ? setEditValue : undefined}
              editable={editingField === "name"}
            />
            <View className="absolute right-4 top-4 flex-row space-x-2">
              {editingField === "name" ? (
                <>
                  <Pressable
                    className="w-8 h-8 items-center justify-center rounded-full bg-veryPaleBlue/10"
                    onPress={handleCancel}
                  >
                    <X size={20} color="#755bce" />
                  </Pressable>
                  <Pressable
                    className="w-8 h-8 items-center justify-center rounded-full bg-veryPaleBlue/10"
                    onPress={handleSave}
                  >
                    <Check size={20} color="#755bce" />
                  </Pressable>
                </>
              ) : (
                <Pressable
                  className="w-8 h-8 items-center justify-center rounded-full bg-veryPaleBlue/10"
                  onPress={() => handleEdit("name")}
                >
                  <PencilLine size={20} color="#755bce" />
                </Pressable>
              )}
            </View>
          </View>

          <View>
            <View className="flex-row space-x-2">
              <Pressable
                className="bg-veryPaleBlue/50 rounded-xl px-4 justify-center items-center mb-2"
                onPress={() =>
                  editingField === "phone" && setShowCountryPicker(true)
                }
                disabled={editingField !== "phone"}
              >
                <Text
                  className={`text-textPrimary ${
                    editingField !== "phone" ? "opacity-50" : ""
                  }`}
                >
                  {countryCode}
                </Text>
              </Pressable>
              <View className="flex-1">
                <TextInput
                  className={`bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl mb-2 ${
                    editingField === "phone"
                      ? "border-2 border-moderateBlue"
                      : ""
                  }`}
                  placeholder="Teléfono"
                  placeholderTextColor="#755bce"
                  value={
                    editingField === "phone"
                      ? editValue
                      : profileData?.phone_number
                          ?.replace(countryCode, "")
                          .trim()
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
                      <Pressable
                        className="w-8 h-8 items-center justify-center rounded-full bg-veryPaleBlue/10"
                        onPress={handleCancel}
                      >
                        <X size={20} color="#755bce" />
                      </Pressable>
                      <Pressable
                        className="w-8 h-8 items-center justify-center rounded-full bg-veryPaleBlue/10"
                        onPress={handleSave}
                      >
                        <Check size={20} color="#755bce" />
                      </Pressable>
                    </>
                  ) : (
                    <Pressable
                      className="w-8 h-8 items-center justify-center rounded-full bg-veryPaleBlue/10"
                      onPress={() => handleEdit("phone")}
                    >
                      <PencilLine size={20} color="#755bce" />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>

          <TextInput
            className="bg-veryPaleBlue/50 text-textPrimary p-4 rounded-xl"
            placeholder="Email"
            placeholderTextColor="#755bce"
            value={session?.user?.email}
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
      </ElevatedBaseModal>

      <CountryPicker
        show={showCountryPicker}
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShowCountryPicker(false);
        }}
        onBackdropPress={() => setShowCountryPicker(false)}
        style={{
          modal: {
            height: 500,
            backgroundColor: "white",
          },
          textInput: {
            color: "#755bce",
            height: 48,
          },
          countryButtonStyles: {
            height: 48,
          },
          flag: {
            fontSize: 24,
          },
        }}
        inputPlaceholder="Buscar país"
        lang="es"
        enableModalAvoiding={false}
      />
    </>
  );
}
