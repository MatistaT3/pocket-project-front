import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { BaseModal } from "./BaseModal";
import { useBanks } from "../hooks/useBanks";

interface AddBankModalProps {
  visible: boolean;
  onClose: () => void;
  onBankAdded: (bankId: string) => void;
}

export function AddBankModal({
  visible,
  onClose,
  onBankAdded,
}: AddBankModalProps) {
  const { addBank } = useBanks();
  const [bankName, setBankName] = useState("");

  const handleSubmit = async () => {
    try {
      if (!bankName.trim()) {
        Alert.alert("Error", "Por favor ingresa el nombre del banco");
        return;
      }

      const newBank = await addBank(bankName);
      onBankAdded(newBank.id);
      setBankName("");
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el banco");
    }
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Agregar Nuevo Banco">
      <View className="space-y-4">
        <View>
          <Text className="text-coral mb-2">Nombre del banco</Text>
          <TextInput
            className="bg-teal/10 text-sand p-4 rounded-xl"
            value={bankName}
            onChangeText={setBankName}
            placeholder="Ej: BBVA"
            placeholderTextColor="#FAA968"
          />
        </View>

        <Pressable
          className="bg-orange p-4 rounded-xl mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-sand text-center font-semibold">
            Guardar Banco
          </Text>
        </Pressable>
      </View>
    </BaseModal>
  );
}
