import { View, Pressable, TextInput, Text } from "react-native";
import { PencilLine, Check, X, ChevronLeft } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { CountryPicker } from "react-native-country-codes-picker";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";

export default function ProfileScreen() {
  const [editingField, setEditingField] = useState<"name" | "phone" | null>(
    null
  );
  const [editValue, setEditValue] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+56");
  const { signOut, session } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchProfileData();
    }
  }, [session?.user]);

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

      if (data?.phone_number && data.phone_number.startsWith("+")) {
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
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Mi Perfil",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center -ml-2"
            >
              <ChevronLeft size={24} color="black" />
            </Pressable>
          ),
          headerBackVisible: false,
        }}
      />

      <View className="flex-1">
        <View className="space-y-3 px-4">
          <View>
            <TextInput
              className={`text-black p-3 rounded-lg mb-1 bg-black/[0.03] ${
                editingField === "name" ? "border border-black" : ""
              }`}
              placeholder="Ingrese su nombre"
              placeholderTextColor="#9ca3af"
              value={
                editingField === "name" ? editValue : profileData?.full_name
              }
              onChangeText={editingField === "name" ? setEditValue : undefined}
              editable={editingField === "name"}
            />
            <View className="absolute right-3 top-2.5 flex-row space-x-1.5">
              {editingField === "name" ? (
                <>
                  <Pressable
                    className="w-7 h-7 items-center justify-center rounded-full active:bg-black/5"
                    onPress={handleCancel}
                  >
                    <X size={16} color="black" />
                  </Pressable>
                  <Pressable
                    className="w-7 h-7 items-center justify-center rounded-full active:bg-black/5"
                    onPress={handleSave}
                  >
                    <Check size={16} color="black" />
                  </Pressable>
                </>
              ) : (
                <Pressable
                  className="w-7 h-7 items-center justify-center rounded-full active:bg-black/5"
                  onPress={() => handleEdit("name")}
                >
                  <PencilLine size={16} color="black" />
                </Pressable>
              )}
            </View>
          </View>

          <View>
            <View className="flex-row space-x-2">
              <Pressable
                className={`rounded-lg px-3 justify-center items-center mb-1 bg-black/[0.03] ${
                  editingField === "phone" ? "" : "opacity-40"
                }`}
                onPress={() =>
                  editingField === "phone" && setShowCountryPicker(true)
                }
                disabled={editingField !== "phone"}
              >
                <Text className="text-black text-sm">{countryCode}</Text>
              </Pressable>
              <View className="flex-1">
                <TextInput
                  className={`text-black p-3 rounded-lg mb-1 bg-black/[0.03] ${
                    editingField === "phone" ? "border border-black" : ""
                  }`}
                  placeholder="Teléfono"
                  placeholderTextColor="#9ca3af"
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
                <View className="absolute right-3 top-2.5 flex-row space-x-1.5">
                  {editingField === "phone" ? (
                    <>
                      <Pressable
                        className="w-7 h-7 items-center justify-center rounded-full active:bg-black/5"
                        onPress={handleCancel}
                      >
                        <X size={16} color="black" />
                      </Pressable>
                      <Pressable
                        className="w-7 h-7 items-center justify-center rounded-full active:bg-black/5"
                        onPress={handleSave}
                      >
                        <Check size={16} color="black" />
                      </Pressable>
                    </>
                  ) : (
                    <Pressable
                      className="w-7 h-7 items-center justify-center rounded-full active:bg-black/5"
                      onPress={() => handleEdit("phone")}
                    >
                      <PencilLine size={16} color="black" />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>

          <TextInput
            className="text-black p-3 rounded-lg bg-black/[0.03]"
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={session?.user?.email}
            editable={false}
          />
        </View>

        <View className="mt-auto p-4">
          <Button variant="danger" label="Cerrar Sesión" onPress={signOut} />
        </View>
      </View>

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
          },
        }}
        enableModalAvoiding={false}
        lang="es"
        inputPlaceholder="Buscar país"
      />
    </SafeAreaView>
  );
}
