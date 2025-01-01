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
      <View className="flex-1 items-center justify-center py-16">
        <Building2 size={48} color="black" className="opacity-50 mb-6" />
        <Text className="text-2xl font-bold text-black mb-2">
          Sin bancos configurados
        </Text>
        <Text className="text-base text-black/60 text-center mb-8 px-8">
          Comienza agregando tu primer banco para gestionar tus cuentas y
          tarjetas
        </Text>
        <Pressable
          className="bg-black px-6 py-3.5 rounded-full active:bg-black/90"
          onPress={onAddBank}
        >
          <View className="flex-row items-center space-x-2">
            <Plus size={20} color="white" />
            <Text className="text-white font-medium">Agregar Primer Banco</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="space-y-6">
      {/* Header */}
      <View>
        <Text className="text-2xl font-bold text-black">Mis Bancos</Text>
        <Text className="text-base text-black/60 mt-1">
          Gestiona tus cuentas bancarias y tarjetas
        </Text>
      </View>

      {/* Botón de agregar banco */}
      <Pressable
        className="flex-row items-center justify-center py-3.5 rounded-2xl bg-black/[0.03] active:bg-black/[0.05]"
        onPress={onAddBank}
      >
        <Plus size={20} color="black" />
        <Text className="text-black font-medium ml-2">Agregar Banco</Text>
      </Pressable>

      {/* Lista de bancos */}
      <View className="space-y-3">
        {banks.map((bank) => (
          <Pressable
            key={bank.id}
            className="bg-black/[0.03] rounded-2xl overflow-hidden active:bg-black/[0.05]"
            onPress={() =>
              onSelectBank(selectedBank === bank.id ? null : bank.id)
            }
          >
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Building2 size={24} color="black" />
                  <View className="ml-3 flex-1">
                    <Text className="text-lg font-medium text-black">
                      {bank.name}
                    </Text>
                    <Text className="text-sm text-black/60">
                      {bank.accounts.length}{" "}
                      {bank.accounts.length === 1 ? "cuenta" : "cuentas"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => onDeleteBank(bank.id, bank.name)}
                    className="p-2 rounded-full active:bg-black/10"
                    hitSlop={8}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
