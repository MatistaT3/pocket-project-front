import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Building2, CreditCard, Plus, Trash2 } from "lucide-react-native";
import { useBanks } from "../hooks/useBanks";
import { ElevatedBaseModal } from "./ElevatedBaseModal";
import {
  BankAccountsModalProps,
  BankFormData,
  AccountFormData,
  CardFormData,
} from "../types/bank.types";
import { ModalView } from "../types/common.types";
import { AVAILABLE_BANKS } from "../constants/banks";

export function BankAccountsModal({
  visible,
  onClose,
}: BankAccountsModalProps) {
  const {
    banks,
    refreshBanks,
    addBank,
    addAccount,
    addCard,
    deleteBank,
    deleteAccount,
    deleteCard,
  } = useBanks();
  const [currentView, setCurrentView] = useState<ModalView>("main");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Estados para los formularios
  const [bankName, setBankName] = useState<BankFormData>({ name: "" });
  const [accountForm, setAccountForm] = useState<AccountFormData>({
    accountNumber: "",
    initialBalance: "",
  });
  const [cardForm, setCardForm] = useState<CardFormData>({
    lastFourDigits: "",
    type: "debit",
  });

  const handleAddBank = async (bankName: string) => {
    try {
      // Verificar si el banco ya existe
      const existingBank = banks.find((bank) => bank.name === bankName);
      if (existingBank) {
        Alert.alert(
          "Banco ya agregado",
          "Este banco ya se encuentra en tu lista. Si deseas agregar otra cuenta, selecciona el banco y presiona 'Agregar Cuenta'.",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Ir al banco",
              onPress: () => {
                setSelectedBank(existingBank.id);
                setCurrentView("main");
              },
            },
          ]
        );
        return;
      }

      const newBank = await addBank(bankName);
      await refreshBanks();
      setBankName({ name: "" });
      setSelectedBank(newBank.id);
      setCurrentView("main");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el banco");
    }
  };

  const handleAddAccount = async () => {
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

      if (!selectedBank) return;

      const newAccount = await addAccount(
        selectedBank,
        accountForm.accountNumber,
        balance
      );

      setSelectedAccount(newAccount.id);
      await refreshBanks();
      setAccountForm({ accountNumber: "", initialBalance: "" });
      setCurrentView("main");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la cuenta");
    }
  };

  const handleAddCard = async () => {
    try {
      if (!cardForm.lastFourDigits.trim()) {
        Alert.alert("Error", "Por favor ingresa los últimos 4 dígitos");
        return;
      }

      if (cardForm.lastFourDigits.length !== 4) {
        Alert.alert("Error", "Debes ingresar exactamente 4 dígitos");
        return;
      }

      if (!selectedAccount) return;

      await addCard(selectedAccount, cardForm.lastFourDigits, cardForm.type);
      await refreshBanks();
      setCardForm({ lastFourDigits: "", type: "debit" });
      setCurrentView("main");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la tarjeta");
    }
  };

  const handleClose = () => {
    setCurrentView("main");
    setBankName({ name: "" });
    setAccountForm({ accountNumber: "", initialBalance: "" });
    setCardForm({ lastFourDigits: "", type: "debit" });
    onClose();
  };

  const handleDeleteBank = async (bankId: string, bankName: string) => {
    Alert.alert(
      "Eliminar Banco",
      `¿Estás seguro que deseas eliminar ${bankName} y todas sus cuentas y tarjetas asociadas?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBank(bankId);
              await refreshBanks();
              setSelectedBank(null);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el banco");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async (
    accountId: string,
    accountNumber: string
  ) => {
    Alert.alert(
      "Eliminar Cuenta",
      `¿Estás seguro que deseas eliminar la cuenta ${accountNumber} y todas sus tarjetas asociadas?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount(accountId);
              setSelectedAccount(null);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la cuenta");
            }
          },
        },
      ]
    );
  };

  const handleDeleteCard = async (
    cardId: string,
    accountId: string,
    lastFourDigits: string
  ) => {
    Alert.alert(
      "Eliminar Tarjeta",
      `¿Estás seguro que deseas eliminar la tarjeta terminada en ${lastFourDigits}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCard(cardId, accountId);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la tarjeta");
            }
          },
        },
      ]
    );
  };

  const renderAddBankForm = () => (
    <ScrollView className="space-y-2 pb-16">
      {AVAILABLE_BANKS.map((bankName) => (
        <Pressable
          key={bankName}
          className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-between"
          onPress={() => handleAddBank(bankName)}
        >
          <View className="flex-row items-center flex-1">
            <Building2 size={24} color="#755bce" />
            <Text className="text-textPrimary ml-3 flex-1">{bankName}</Text>
          </View>
          <Plus size={20} color="#755bce" />
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderAddAccountForm = () => (
    <View className="space-y-4">
      <View>
        <Text className="text-textSecondary mb-2 font-medium">
          Número de cuenta
        </Text>
        <TextInput
          className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
          value={accountForm.accountNumber}
          onChangeText={(text) =>
            setAccountForm({ ...accountForm, accountNumber: text })
          }
          placeholder="Ej: 1234567890"
          placeholderTextColor="#755bce/75"
          keyboardType="number-pad"
        />
      </View>

      <View>
        <Text className="text-textSecondary mb-2 font-medium">
          Saldo inicial
        </Text>
        <TextInput
          className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
          value={accountForm.initialBalance}
          onChangeText={(text) =>
            setAccountForm({ ...accountForm, initialBalance: text })
          }
          placeholder="0"
          placeholderTextColor="#755bce/75"
          keyboardType="decimal-pad"
        />
      </View>

      <Pressable
        className="bg-moderateBlue p-4 rounded-xl mt-4"
        onPress={handleAddAccount}
      >
        <Text className="text-white text-center font-semibold">
          Guardar Cuenta
        </Text>
      </Pressable>
    </View>
  );

  const renderAddCardForm = () => (
    <View className="space-y-4">
      <View>
        <Text className="text-textSecondary mb-2 font-medium">
          Últimos 4 dígitos
        </Text>
        <TextInput
          className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
          value={cardForm.lastFourDigits}
          onChangeText={(text) =>
            setCardForm({ ...cardForm, lastFourDigits: text })
          }
          placeholder="Ej: 1234"
          placeholderTextColor="#755bce/75"
          keyboardType="number-pad"
          maxLength={4}
        />
      </View>

      <View>
        <Text className="text-textSecondary mb-2 font-medium">
          Tipo de tarjeta
        </Text>
        <View className="flex-row space-x-2">
          <Pressable
            className={`flex-1 p-4 rounded-xl ${
              cardForm.type === "debit"
                ? "bg-moderateBlue"
                : "bg-veryPaleBlue/20"
            }`}
            onPress={() => setCardForm({ ...cardForm, type: "debit" })}
          >
            <Text
              className={`text-center font-medium ${
                cardForm.type === "debit" ? "text-white" : "text-textPrimary"
              }`}
            >
              Débito
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 p-4 rounded-xl ${
              cardForm.type === "credit"
                ? "bg-moderateBlue"
                : "bg-veryPaleBlue/20"
            }`}
            onPress={() => setCardForm({ ...cardForm, type: "credit" })}
          >
            <Text
              className={`text-center font-medium ${
                cardForm.type === "credit" ? "text-white" : "text-textPrimary"
              }`}
            >
              Crédito
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        className="bg-moderateBlue p-4 rounded-xl mt-4"
        onPress={handleAddCard}
      >
        <Text className="text-white text-center font-semibold">
          Guardar Tarjeta
        </Text>
      </Pressable>
    </View>
  );

  const renderMainView = () => (
    <ScrollView className="flex-1">
      <View className="flex-1 space-y-4">
        {banks.length === 0 ? (
          <View className="items-center justify-center py-8 space-y-6">
            <Building2 size={64} color="#755bce" className="opacity-50" />
            <View className="space-y-2">
              <Text className="text-textPrimary text-center text-xl font-medium">
                No tienes bancos configurados
              </Text>
              <Text className="text-textSecondary text-center px-4">
                Comienza agregando tu primer banco para poder gestionar tus
                cuentas y tarjetas.
              </Text>
            </View>
            <Pressable
              className="bg-moderateBlue p-4 rounded-xl w-full"
              onPress={() => setCurrentView("addBank")}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <Plus size={20} color="white" />
                <Text className="text-white text-center font-semibold">
                  Agregar Primer Banco
                </Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <View className="space-y-4">
            {/* Botón de agregar banco */}
            <Pressable
              className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-center space-x-2"
              onPress={() => setCurrentView("addBank")}
            >
              <Plus size={20} color="#755bce" />
              <Text className="text-textSecondary font-medium">
                Agregar Banco
              </Text>
            </Pressable>

            {/* Lista de bancos */}
            {banks.map((bank) => (
              <View key={bank.id} className="space-y-2">
                <Pressable
                  className="bg-veryPaleBlue/10 p-4 rounded-xl"
                  onPress={() =>
                    setSelectedBank(selectedBank === bank.id ? null : bank.id)
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
                        onPress={() => handleDeleteBank(bank.id, bank.name)}
                        hitSlop={8}
                      >
                        <Trash2 size={20} color="#ef4444" />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>

                {selectedBank === bank.id && (
                  <View className="pl-4 space-y-2">
                    {/* Botón de agregar cuenta */}
                    <Pressable
                      className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-center space-x-2"
                      onPress={() => setCurrentView("addAccount")}
                    >
                      <Plus size={20} color="#755bce" />
                      <Text className="text-textSecondary font-medium">
                        Agregar Cuenta
                      </Text>
                    </Pressable>

                    {/* Lista de cuentas */}
                    {bank.accounts.map((account) => (
                      <View key={account.id}>
                        <Pressable
                          className="bg-veryPaleBlue/5 p-4 rounded-xl"
                          onPress={() =>
                            setSelectedAccount(
                              selectedAccount === account.id ? null : account.id
                            )
                          }
                        >
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                              <Text className="text-textPrimary font-medium">
                                Cuenta N° {account.accountNumber}
                              </Text>
                              <Text className="text-textSecondary">
                                Saldo: $
                                {account.currentBalance.toLocaleString("es-CL")}
                              </Text>
                            </View>
                            <View className="flex-row items-center space-x-4">
                              <Text className="text-textSecondary">
                                {account.cards.length} tarjeta(s)
                              </Text>
                              <Pressable
                                onPress={() =>
                                  handleDeleteAccount(
                                    account.id,
                                    account.accountNumber
                                  )
                                }
                                hitSlop={8}
                              >
                                <Trash2 size={20} color="#ef4444" />
                              </Pressable>
                            </View>
                          </View>
                        </Pressable>

                        {selectedAccount === account.id && (
                          <View className="pl-4 mt-2 space-y-2">
                            {/* Botón de agregar tarjeta */}
                            <Pressable
                              className="bg-veryPaleBlue/10 p-4 rounded-xl flex-row items-center justify-center space-x-2"
                              onPress={() => setCurrentView("addCard")}
                            >
                              <Plus size={20} color="#755bce" />
                              <Text className="text-textSecondary font-medium">
                                Agregar Tarjeta
                              </Text>
                            </Pressable>

                            {/* Lista de tarjetas */}
                            {account.cards.map((card) => (
                              <View
                                key={card.id}
                                className="bg-veryPaleBlue/5 p-4 rounded-xl"
                              >
                                <View className="flex-row items-center justify-between">
                                  <View className="flex-row items-center flex-1">
                                    <CreditCard size={20} color="#755bce" />
                                    <View className="ml-3">
                                      <Text className="text-textPrimary font-medium">
                                        •••• {card.lastFourDigits}
                                      </Text>
                                      <Text className="text-textSecondary capitalize">
                                        {card.type}
                                      </Text>
                                    </View>
                                  </View>
                                  <Pressable
                                    onPress={() =>
                                      handleDeleteCard(
                                        card.id,
                                        account.id,
                                        card.lastFourDigits
                                      )
                                    }
                                    hitSlop={8}
                                  >
                                    <Trash2 size={20} color="#ef4444" />
                                  </Pressable>
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
        )}
      </View>
    </ScrollView>
  );

  const getModalTitle = () => {
    switch (currentView) {
      case "addBank":
        return "Agregar Nuevo Banco";
      case "addAccount":
        return "Agregar Nueva Cuenta";
      case "addCard":
        return "Agregar Nueva Tarjeta";
      default:
        return "Mis Cuentas Bancarias";
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "addBank":
        return renderAddBankForm();
      case "addAccount":
        return renderAddAccountForm();
      case "addCard":
        return renderAddCardForm();
      default:
        return renderMainView();
    }
  };

  return (
    <ElevatedBaseModal
      visible={visible}
      onClose={handleClose}
      title={getModalTitle()}
      variant="bottom-sheet"
    >
      {renderContent()}
    </ElevatedBaseModal>
  );
}
