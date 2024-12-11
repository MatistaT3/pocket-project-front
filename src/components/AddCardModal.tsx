import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { BaseModal } from "./BaseModal";
import { useBanks } from "../hooks/useBanks";

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  accountId: string;
  onCardAdded: (cardId: string) => void;
  onSuccess?: () => Promise<void>;
}

export function AddCardModal({
  visible,
  onClose,
  accountId,
  onCardAdded,
  onSuccess,
}: AddCardModalProps) {
  const { addCard } = useBanks();
  const [cardForm, setCardForm] = useState({
    lastFourDigits: "",
    type: "debit" as "debit" | "credit",
  });

  const handleSubmit = async () => {
    try {
      if (!cardForm.lastFourDigits.trim()) {
        Alert.alert("Error", "Por favor ingresa los últimos 4 dígitos");
        return;
      }

      if (cardForm.lastFourDigits.length !== 4) {
        Alert.alert("Error", "Debes ingresar exactamente 4 dígitos");
        return;
      }

      const newCard = await addCard(
        accountId,
        cardForm.lastFourDigits,
        cardForm.type
      );

      onCardAdded(newCard.id);
      await onSuccess?.();
      setCardForm({ lastFourDigits: "", type: "debit" });
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la tarjeta");
    }
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Agregar Nueva Tarjeta"
    >
      <View className="space-y-4">
        <View>
          <Text className="text-coral mb-2">Últimos 4 dígitos</Text>
          <TextInput
            className="bg-teal/10 text-sand p-4 rounded-xl"
            value={cardForm.lastFourDigits}
            onChangeText={(text) =>
              setCardForm({ ...cardForm, lastFourDigits: text })
            }
            placeholder="Ej: 1234"
            placeholderTextColor="#FAA968"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        <View>
          <Text className="text-coral mb-2">Tipo de tarjeta</Text>
          <View className="flex-row space-x-2">
            <Pressable
              className={`flex-1 p-4 rounded-xl ${
                cardForm.type === "debit" ? "bg-teal" : "bg-teal/20"
              }`}
              onPress={() => setCardForm({ ...cardForm, type: "debit" })}
            >
              <Text className="text-sand text-center">Débito</Text>
            </Pressable>
            <Pressable
              className={`flex-1 p-4 rounded-xl ${
                cardForm.type === "credit" ? "bg-teal" : "bg-teal/20"
              }`}
              onPress={() => setCardForm({ ...cardForm, type: "credit" })}
            >
              <Text className="text-sand text-center">Crédito</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          className="bg-orange p-4 rounded-xl mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-sand text-center font-semibold">
            Guardar Tarjeta
          </Text>
        </Pressable>
      </View>
    </BaseModal>
  );
}
