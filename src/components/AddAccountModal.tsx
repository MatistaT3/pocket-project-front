import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { BaseModal } from "./BaseModal";
import { useBanks } from "../hooks/useBanks";

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  bankId: string;
  onAccountAdded: (accountId: string) => void;
  onSuccess?: () => Promise<void>;
}

export function AddAccountModal({
  visible,
  onClose,
  bankId,
  onAccountAdded,
  onSuccess,
}: AddAccountModalProps) {
  const { addAccount } = useBanks();
  const [accountForm, setAccountForm] = useState({
    accountNumber: "",
    initialBalance: "",
  });

  const handleSubmit = async () => {
    try {
      if (!accountForm.accountNumber.trim()) {
        Alert.alert("Error", "Por favor ingresa el número de cuenta");
        return;
      }

      const balance = parseFloat(accountForm.initialBalance);
      if (isNaN(balance)) {
        Alert.alert("Error", "Por favor ingresa un saldo válido");
        return;
      }

      const newAccount = await addAccount(
        bankId,
        accountForm.accountNumber,
        balance
      );

      onAccountAdded(newAccount.id);
      await onSuccess?.();
      setAccountForm({ accountNumber: "", initialBalance: "" });
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la cuenta");
    }
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Agregar Nueva Cuenta">
      <View className="space-y-4">
        <View>
          <Text className="text-coral mb-2">Número de cuenta</Text>
          <TextInput
            className="bg-teal/10 text-sand p-4 rounded-xl"
            value={accountForm.accountNumber}
            onChangeText={(text) =>
              setAccountForm({ ...accountForm, accountNumber: text })
            }
            placeholder="Ej: 1234567890"
            placeholderTextColor="#FAA968"
            keyboardType="number-pad"
          />
        </View>

        <View>
          <Text className="text-coral mb-2">Saldo inicial</Text>
          <TextInput
            className="bg-teal/10 text-sand p-4 rounded-xl"
            value={accountForm.initialBalance}
            onChangeText={(text) =>
              setAccountForm({ ...accountForm, initialBalance: text })
            }
            placeholder="0.00"
            placeholderTextColor="#FAA968"
            keyboardType="decimal-pad"
          />
        </View>

        <Pressable
          className="bg-orange p-4 rounded-xl mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-sand text-center font-semibold">
            Guardar Cuenta
          </Text>
        </Pressable>
      </View>
    </BaseModal>
  );
}
