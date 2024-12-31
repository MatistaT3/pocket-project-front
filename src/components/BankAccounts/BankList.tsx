import React from "react";
import { View, Text, Pressable } from "react-native";
import { Building2, Plus, Trash2 } from "lucide-react-native";
import { Bank } from "../../types/bank.types";

interface BankListProps {
  banks: Bank[];
  selectedBank: string | null;
  onSelectBank: (bankId: string | null) => void;
  onAddBank: () => void;
  onDeleteBank: (bankId: string, bankName: string) => void;
}

export function BankList({
  banks,
  selectedBank,
  onSelectBank,
  onAddBank,
  onDeleteBank,
}: BankListProps) {
  if (banks.length === 0) {
    return (
      <View className="items-center justify-center py-8 space-y-6">
        <Building2 size={64} color="#755bce" className="opacity-50" />
        <View className="space-y-2">
          <Text className="text-textPrimary text-center text-xl font-medium">
            No tienes bancos configurados
          </Text>
          <Text className="text-textSecondary text-center px-4">
            Comienza agregando tu primer banco para poder gestionar tus cuentas
            y tarjetas.
          </Text>
        </View>
        <Pressable
          className="bg-moderateBlue p-4 rounded-xl w-full"
          onPress={onAddBank}
        >
          <View className="flex-row items-center justify-center space-x-2">
            <Plus size={20} color="white" />
            <Text className="text-white text-center font-semibold">
              Agregar Primer Banco
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {/* Botón de agregar banco */}
      <Pressable
        className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-center space-x-2"
        onPress={onAddBank}
      >
        <Plus size={20} color="#755bce" />
        <Text className="text-textSecondary font-medium">Agregar Banco</Text>
      </Pressable>

      {/* Lista de bancos */}
      {banks.map((bank) => (
        <View key={bank.id} className="space-y-2">
          <Pressable
            className="bg-veryPaleBlue/10 p-4 rounded-xl"
            onPress={() =>
              onSelectBank(selectedBank === bank.id ? null : bank.id)
            }
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Building2 size={24} color="#755bce" />
                <Text className="text-textPrimary ml-3 flex-1 font-medium">
                  {bank.name}
                </Text>
              </View>
              <View className="flex-row items-center space-x-4">
                <Text className="text-textSecondary">
                  {bank.accounts.length} cuenta(s)
                </Text>
                <Pressable
                  onPress={() => onDeleteBank(bank.id, bank.name)}
                  hitSlop={8}
                >
                  <Trash2 size={20} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
