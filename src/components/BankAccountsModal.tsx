import React, { useState } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { Building2, CreditCard, Plus } from "lucide-react-native";
import { useBanks } from "../hooks/useBanks";
import { AddBankModal } from "./AddBankModal";
import { AddAccountModal } from "./AddAccountModal";
import { AddCardModal } from "./AddCardModal";

interface BankAccountsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function BankAccountsModal({
  visible,
  onClose,
}: BankAccountsModalProps) {
  const { banks } = useBanks();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Modales de agregar
  const [addBankVisible, setAddBankVisible] = useState(false);
  const [addAccountVisible, setAddAccountVisible] = useState(false);
  const [addCardVisible, setAddCardVisible] = useState(false);

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 justify-end">
          <View className="bg-oxfordBlue rounded-t-3xl p-6 h-4/5">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-sand text-xl font-bold">
                Mis Cuentas Bancarias
              </Text>
              <Pressable onPress={onClose}>
                <Text className="text-coral">Cerrar</Text>
              </Pressable>
            </View>

            <ScrollView className="flex-1">
              <View className="space-y-4">
                {/* Botón de agregar banco */}
                <Pressable
                  className="bg-teal/10 p-4 rounded-xl flex-row items-center justify-center"
                  onPress={() => setAddBankVisible(true)}
                >
                  <Plus size={20} color="#F6DCAC" />
                  <Text className="text-sand ml-2">Agregar Banco</Text>
                </Pressable>

                {/* Lista de bancos */}
                {banks.map((bank) => (
                  <View key={bank.id} className="space-y-2">
                    <Pressable
                      className="bg-teal/10 p-4 rounded-xl"
                      onPress={() =>
                        setSelectedBank(
                          selectedBank === bank.id ? null : bank.id
                        )
                      }
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Building2 size={24} color="#F6DCAC" />
                          <Text className="text-sand ml-3">{bank.name}</Text>
                        </View>
                        <Text className="text-coral">
                          {bank.accounts.length} cuenta(s)
                        </Text>
                      </View>
                    </Pressable>

                    {selectedBank === bank.id && (
                      <View className="pl-4 space-y-2">
                        {/* Botón de agregar cuenta */}
                        <Pressable
                          className="bg-teal/10 p-4 rounded-xl flex-row items-center justify-center"
                          onPress={() => setAddAccountVisible(true)}
                        >
                          <Plus size={20} color="#F6DCAC" />
                          <Text className="text-sand ml-2">Agregar Cuenta</Text>
                        </Pressable>

                        {/* Lista de cuentas */}
                        {bank.accounts.map((account) => (
                          <View key={account.id}>
                            <Pressable
                              className="bg-teal/5 p-4 rounded-xl"
                              onPress={() =>
                                setSelectedAccount(
                                  selectedAccount === account.id
                                    ? null
                                    : account.id
                                )
                              }
                            >
                              <View className="flex-row items-center justify-between">
                                <View>
                                  <Text className="text-sand">
                                    {account.accountNumber}
                                  </Text>
                                  <Text className="text-coral text-sm">
                                    Saldo: ${account.currentBalance.toFixed(2)}
                                  </Text>
                                </View>
                                <Text className="text-coral">
                                  {account.cards.length} tarjeta(s)
                                </Text>
                              </View>
                            </Pressable>

                            {selectedAccount === account.id && (
                              <View className="pl-4 mt-2">
                                {/* Botón de agregar tarjeta */}
                                <Pressable
                                  className="bg-teal/10 p-4 rounded-xl flex-row items-center justify-center"
                                  onPress={() => setAddCardVisible(true)}
                                >
                                  <Plus size={20} color="#F6DCAC" />
                                  <Text className="text-sand ml-2">
                                    Agregar Tarjeta
                                  </Text>
                                </Pressable>

                                {/* Lista de tarjetas */}
                                {account.cards.map((card) => (
                                  <View
                                    key={card.id}
                                    className="bg-teal/5 p-4 rounded-xl mt-2"
                                  >
                                    <View className="flex-row items-center">
                                      <CreditCard size={20} color="#F6DCAC" />
                                      <View className="ml-3">
                                        <Text className="text-sand">
                                          •••• {card.lastFourDigits}
                                        </Text>
                                        <Text className="text-coral text-sm capitalize">
                                          {card.type}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modales de agregar */}
      <AddBankModal
        visible={addBankVisible}
        onClose={() => setAddBankVisible(false)}
        onBankAdded={(bankId) => {
          setSelectedBank(bankId);
          setAddBankVisible(false);
        }}
      />

      {selectedBank && (
        <AddAccountModal
          visible={addAccountVisible}
          onClose={() => setAddAccountVisible(false)}
          bankId={selectedBank}
          onAccountAdded={(accountId) => {
            setSelectedAccount(accountId);
            setAddAccountVisible(false);
          }}
        />
      )}

      {selectedAccount && (
        <AddCardModal
          visible={addCardVisible}
          onClose={() => setAddCardVisible(false)}
          accountId={selectedAccount}
          onCardAdded={() => {
            setAddCardVisible(false);
          }}
        />
      )}
    </>
  );
}
