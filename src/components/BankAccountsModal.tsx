import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Plus, CreditCard, Building2, ChevronRight } from "lucide-react-native";
import { useBanks } from "../hooks/useBanks";

interface BankAccountsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function BankAccountsModal({
  visible,
  onClose,
}: BankAccountsModalProps) {
  const { banks, loading, addBank, addAccount, addCard } = useBanks();
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [newCardForm, setNewCardForm] = useState({
    lastFourDigits: "",
    type: "debit" as "credit" | "debit",
  });

  const [newBankForm, setNewBankForm] = useState({
    name: "",
  });

  const [newAccountForm, setNewAccountForm] = useState({
    accountNumber: "",
    initialBalance: "0",
  });

  const handleAddBank = async () => {
    try {
      if (!newBankForm.name) {
        Alert.alert("Error", "Por favor ingresa el nombre del banco");
        return;
      }

      await addBank(newBankForm.name);
      setNewBankForm({ name: "" });
      setIsAddingBank(false);
      Alert.alert("Éxito", "Banco agregado correctamente");
    } catch (error) {
      console.error("Error adding bank:", error);
      Alert.alert("Error", "No se pudo agregar el banco");
    }
  };

  const handleAddAccount = async (bankId: string) => {
    try {
      if (!newAccountForm.accountNumber) {
        Alert.alert("Error", "Por favor ingresa el número de cuenta");
        return;
      }

      await addAccount(
        bankId,
        newAccountForm.accountNumber,
        parseFloat(newAccountForm.initialBalance) || 0
      );
      setNewAccountForm({ accountNumber: "", initialBalance: "0" });
      setSelectedBank(null);
      Alert.alert("Éxito", "Cuenta agregada correctamente");
    } catch (error) {
      console.error("Error adding account:", error);
      Alert.alert("Error", "No se pudo agregar la cuenta");
    }
  };

  const handleAddCard = async (accountId: string) => {
    try {
      if (!newCardForm.lastFourDigits) {
        Alert.alert("Error", "Por favor ingresa los últimos 4 dígitos");
        return;
      }

      await addCard(accountId, newCardForm.lastFourDigits, newCardForm.type);
      setNewCardForm({ lastFourDigits: "", type: "debit" });
      setSelectedAccount(null);
      Alert.alert("Éxito", "Tarjeta agregada correctamente");
    } catch (error) {
      console.error("Error adding card:", error);
      Alert.alert("Error", "No se pudo agregar la tarjeta");
    }
  };

  return (
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
              {/* Agregar Banco */}
              <Pressable
                className="flex-row items-center justify-between bg-teal/10 p-4 rounded-xl"
                onPress={() => setIsAddingBank(!isAddingBank)}
              >
                <View className="flex-row items-center">
                  <Building2 size={24} color="#F6DCAC" />
                  <Text className="text-sand ml-3">Agregar Banco</Text>
                </View>
                <ChevronRight
                  size={20}
                  color="#F6DCAC"
                  style={{
                    transform: [{ rotate: isAddingBank ? "90deg" : "0deg" }],
                  }}
                />
              </Pressable>

              {isAddingBank && (
                <View className="bg-teal/5 p-4 rounded-xl">
                  <Text className="text-coral mb-2">Nombre del banco</Text>
                  <TextInput
                    className="bg-teal/10 text-sand p-3 rounded-xl mb-3"
                    value={newBankForm.name}
                    onChangeText={(text) =>
                      setNewBankForm({ ...newBankForm, name: text })
                    }
                  />
                  <Pressable
                    className="bg-orange p-3 rounded-xl"
                    onPress={handleAddBank}
                  >
                    <Text className="text-sand text-center">Guardar Banco</Text>
                  </Pressable>
                </View>
              )}

              {/* Lista de bancos */}
              {banks.map((bank) => (
                <View key={bank.id} className="space-y-2">
                  <Pressable
                    className="flex-row items-center justify-between bg-teal/10 p-4 rounded-xl"
                    onPress={() =>
                      setSelectedBank(selectedBank === bank.id ? null : bank.id)
                    }
                  >
                    <View className="flex-row items-center">
                      <Building2 size={24} color="#F6DCAC" />
                      <Text className="text-sand ml-3">{bank.name}</Text>
                    </View>
                    <ChevronRight
                      size={20}
                      color="#F6DCAC"
                      style={{
                        transform: [
                          {
                            rotate: selectedBank === bank.id ? "90deg" : "0deg",
                          },
                        ],
                      }}
                    />
                  </Pressable>

                  {selectedBank === bank.id && (
                    <View className="pl-4 space-y-2">
                      {/* Lista de cuentas existentes primero */}
                      {bank.accounts.map((account) => (
                        <View key={account.id} className="space-y-2">
                          <Pressable
                            className="bg-teal/5 p-3 rounded-xl"
                            onPress={() =>
                              setSelectedAccount(
                                selectedAccount === account.id
                                  ? null
                                  : account.id
                              )
                            }
                          >
                            <Text className="text-sand text-lg">
                              Cuenta: {account.accountNumber}
                            </Text>
                            <Text className="text-coral">
                              Saldo: ${account.currentBalance.toFixed(2)}
                            </Text>
                            <View className="flex-row items-center mt-2">
                              <CreditCard size={16} color="#F6DCAC" />
                              <Text className="text-sand ml-2">
                                {account.cards.length} tarjeta(s)
                              </Text>
                            </View>
                          </Pressable>

                          {selectedAccount === account.id && (
                            <View className="pl-4 space-y-4">
                              {/* Lista de tarjetas existentes */}
                              {account.cards.length > 0 && (
                                <View className="space-y-3">
                                  <Text className="text-sand text-lg">
                                    Tarjetas asociadas a esta cuenta
                                  </Text>
                                  {account.cards.map((card) => (
                                    <View
                                      key={card.id}
                                      className="bg-teal/10 p-4 rounded-xl flex-row justify-between items-center"
                                    >
                                      <View className="flex-row items-center">
                                        <CreditCard size={20} color="#F6DCAC" />
                                        <View className="ml-3">
                                          <Text className="text-sand">
                                            •••• {card.lastFourDigits}
                                          </Text>
                                          <Text className="text-coral capitalize">
                                            {card.type}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              )}

                              {/* Botón para añadir tarjeta */}
                              <Pressable
                                className="flex-row items-center justify-between bg-teal/10 p-4 rounded-xl mt-4"
                                onPress={() => setIsAddingCard(!isAddingCard)}
                              >
                                <View className="flex-row items-center">
                                  <CreditCard size={20} color="#F6DCAC" />
                                  <Text className="text-sand ml-3">
                                    Añade una nueva tarjeta
                                  </Text>
                                </View>
                                <ChevronRight
                                  size={20}
                                  color="#F6DCAC"
                                  style={{
                                    transform: [
                                      {
                                        rotate: isAddingCard ? "90deg" : "0deg",
                                      },
                                    ],
                                  }}
                                />
                              </Pressable>

                              {/* Formulario para añadir tarjeta */}
                              {isAddingCard && (
                                <View className="bg-teal/5 p-4 rounded-xl space-y-4">
                                  <Text className="text-coral">
                                    Últimos 4 dígitos de la tarjeta
                                  </Text>
                                  <TextInput
                                    className="bg-teal/10 text-sand p-4 rounded-xl"
                                    value={newCardForm.lastFourDigits}
                                    onChangeText={(text) =>
                                      setNewCardForm({
                                        ...newCardForm,
                                        lastFourDigits: text,
                                      })
                                    }
                                    maxLength={4}
                                    keyboardType="number-pad"
                                  />

                                  <Text className="text-coral mt-4">
                                    Selecciona el tipo de tarjeta
                                  </Text>
                                  <View className="flex-row space-x-3">
                                    <Pressable
                                      className={`flex-1 p-4 rounded-xl ${
                                        newCardForm.type === "debit"
                                          ? "bg-teal"
                                          : "bg-teal/20"
                                      }`}
                                      onPress={() =>
                                        setNewCardForm({
                                          ...newCardForm,
                                          type: "debit",
                                        })
                                      }
                                    >
                                      <Text className="text-sand text-center">
                                        Débito
                                      </Text>
                                    </Pressable>
                                    <Pressable
                                      className={`flex-1 p-4 rounded-xl ${
                                        newCardForm.type === "credit"
                                          ? "bg-teal"
                                          : "bg-teal/20"
                                      }`}
                                      onPress={() =>
                                        setNewCardForm({
                                          ...newCardForm,
                                          type: "credit",
                                        })
                                      }
                                    >
                                      <Text className="text-sand text-center">
                                        Crédito
                                      </Text>
                                    </Pressable>
                                  </View>

                                  <Pressable
                                    className="bg-orange p-4 rounded-xl mt-4"
                                    onPress={() => handleAddCard(account.id)}
                                  >
                                    <Text className="text-sand text-center font-medium">
                                      Agregar Tarjeta
                                    </Text>
                                  </Pressable>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      ))}

                      {/* Agregar cuenta al final y ocultable */}
                      <Pressable
                        className="flex-row items-center justify-between bg-teal/10 p-4 rounded-xl"
                        onPress={() => setIsAddingAccount(!isAddingAccount)}
                      >
                        <View className="flex-row items-center">
                          <CreditCard size={20} color="#F6DCAC" />
                          <Text className="text-sand ml-3">
                            Añade una nueva cuenta
                          </Text>
                        </View>
                        <ChevronRight
                          size={20}
                          color="#F6DCAC"
                          style={{
                            transform: [
                              { rotate: isAddingAccount ? "90deg" : "0deg" },
                            ],
                          }}
                        />
                      </Pressable>

                      {isAddingAccount && (
                        <View className="bg-teal/5 p-3 rounded-xl">
                          <Text className="text-coral mb-2">
                            Número de cuenta
                          </Text>
                          <TextInput
                            className="bg-teal/10 text-sand p-3 rounded-xl mb-4"
                            value={newAccountForm.accountNumber}
                            onChangeText={(text) =>
                              setNewAccountForm({
                                ...newAccountForm,
                                accountNumber: text,
                              })
                            }
                          />
                          <Text className="text-coral mb-2">Saldo inicial</Text>
                          <TextInput
                            className="bg-teal/10 text-sand p-3 rounded-xl mb-4"
                            value={newAccountForm.initialBalance}
                            onChangeText={(text) =>
                              setNewAccountForm({
                                ...newAccountForm,
                                initialBalance: text,
                              })
                            }
                            keyboardType="decimal-pad"
                          />
                          <Pressable
                            className="bg-orange p-3 rounded-xl"
                            onPress={() => handleAddAccount(bank.id)}
                          >
                            <Text className="text-sand text-center">
                              Agregar Cuenta
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
