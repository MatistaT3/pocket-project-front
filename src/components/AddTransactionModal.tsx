import React, { useState } from "react";
import {
  Modal,
  View,
  Pressable,
  Text,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTransactions } from "../hooks/useTransactions";
import { useBanks } from "../hooks/useBanks";
import {
  Transaction,
  TransactionType,
  TransactionCategory,
  RecurrencyFrequency,
} from "../types/transaction.types";
import { Building2, CreditCard, ChevronRight } from "lucide-react-native";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

export function AddTransactionModal({
  visible,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const { addTransaction } = useTransactions();
  const { banks } = useBanks();
  const [formData, setFormData] = useState({
    type: "expense" as TransactionType,
    category: "regular" as TransactionCategory,
    name: "",
    amount: "",
    date: new Date(),
    selectedBank: null as string | null,
    selectedAccount: null as string | null,
    selectedCard: null as string | null,
    isRecurrent: false,
    recurrentConfig: {
      frequency: "monthly" as
        | "daily"
        | "monthly"
        | "bimonthly"
        | "quarterly"
        | "semiannual"
        | "custom",
      customDays: 0,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isBankListVisible, setIsBankListVisible] = useState(false);
  const [isAccountListVisible, setIsAccountListVisible] = useState(false);

  const selectedBankData = banks.find(
    (bank) => bank.id === formData.selectedBank
  );
  const selectedAccountData = selectedBankData?.accounts.find(
    (account) => account.id === formData.selectedAccount
  );

  const frequencies: { label: string; value: RecurrencyFrequency }[] = [
    { label: "Diario", value: "daily" },
    { label: "Mensual", value: "monthly" },
    { label: "Bimestral", value: "bimonthly" },
    { label: "Trimestral", value: "quarterly" },
    { label: "Semestral", value: "semiannual" },
    { label: "Personalizado", value: "custom" },
  ];

  const handleSubmit = async () => {
    try {
      if (
        !formData.name ||
        !formData.amount ||
        !formData.selectedBank ||
        !formData.selectedAccount ||
        (formData.type === "expense" && !formData.selectedCard)
      ) {
        Alert.alert("Error", "Por favor completa todos los campos requeridos");
        return;
      }

      const transaction: Omit<Transaction, "id"> = {
        type: formData.type,
        category: formData.category,
        name: formData.name,
        icon_data: undefined,
        amount: parseFloat(formData.amount),
        date: formData.date.toLocaleDateString("es-ES"),
        paymentMethod: {
          bank: selectedBankData!.name,
          lastFourDigits:
            selectedAccountData!.cards.find(
              (card) => card.id === formData.selectedCard
            )?.lastFourDigits || "",
          type:
            selectedAccountData!.cards.find(
              (card) => card.id === formData.selectedCard
            )?.type || "debit",
        },
        ...(formData.isRecurrent && {
          recurrent: {
            frequency: formData.recurrentConfig.frequency,
            startDate: formData.date.toLocaleDateString("es-ES"),
            ...(formData.recurrentConfig.frequency === "custom" && {
              customDays: formData.recurrentConfig.customDays,
            }),
          },
        }),
      };

      await addTransaction(transaction, {
        accountNumber: selectedAccountData!.accountNumber,
      });

      await onSuccess?.();
      Alert.alert("Éxito", "Transacción agregada correctamente");
      onClose();
      setFormData({
        type: "expense",
        category: "regular",
        name: "",
        amount: "",
        date: new Date(),
        selectedBank: null,
        selectedAccount: null,
        selectedCard: null,
        isRecurrent: false,
        recurrentConfig: {
          frequency: "monthly",
          customDays: 0,
        },
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "No se pudo agregar la transacción");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end">
        <View className="bg-oxfordBlue rounded-t-3xl p-6 h-4/5">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-sand text-xl font-bold">
              Nueva Transacción
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-coral">Cancelar</Text>
            </Pressable>
          </View>

          <ScrollView className="flex-1">
            <View className="space-y-4">
              {/* Tipo de transacción */}
              <View>
                <Text className="text-coral mb-2">Tipo</Text>
                <View className="flex-row space-x-2">
                  {["expense", "income"].map((type) => (
                    <Pressable
                      key={type}
                      className={`flex-1 p-3 rounded-xl ${
                        formData.type === type ? "bg-teal" : "bg-teal/20"
                      }`}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          type: type as TransactionType,
                        })
                      }
                    >
                      <Text className="text-sand text-center capitalize">
                        {type === "expense" ? "Gasto" : "Ingreso"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Nombre */}
              <View>
                <Text className="text-coral mb-2">Nombre</Text>
                <TextInput
                  className="bg-teal/10 text-sand p-3 rounded-xl"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="Nombre de la transacción"
                  placeholderTextColor="#FAA968"
                />
              </View>

              {/* Monto */}
              <View>
                <Text className="text-coral mb-2">Monto</Text>
                <TextInput
                  className="bg-teal/10 text-sand p-3 rounded-xl"
                  value={formData.amount}
                  onChangeText={(text) =>
                    setFormData({ ...formData, amount: text })
                  }
                  placeholder="0.00"
                  placeholderTextColor="#FAA968"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Selección de banco */}
              <View>
                <Text className="text-coral mb-2">Banco</Text>
                <Pressable
                  className="flex-row items-center justify-between bg-teal/10 p-4 rounded-xl"
                  onPress={() => setIsBankListVisible(!isBankListVisible)}
                >
                  <View className="flex-row items-center">
                    <Building2 size={20} color="#F6DCAC" />
                    <Text className="text-sand ml-3">
                      {selectedBankData?.name || "Selecciona un banco"}
                    </Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color="#F6DCAC"
                    style={{
                      transform: [
                        { rotate: isBankListVisible ? "90deg" : "0deg" },
                      ],
                    }}
                  />
                </Pressable>

                {isBankListVisible && (
                  <View className="mt-2 space-y-2">
                    {banks.map((bank) => (
                      <Pressable
                        key={bank.id}
                        className={`p-4 rounded-xl ${
                          formData.selectedBank === bank.id
                            ? "bg-teal"
                            : "bg-teal/20"
                        }`}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            selectedBank: bank.id,
                            selectedAccount: null,
                            selectedCard: null,
                          })
                        }
                      >
                        <Text className="text-sand">{bank.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Selección de cuenta */}
              {formData.selectedBank && (
                <View>
                  <Text className="text-coral mb-2">Cuenta</Text>
                  <Pressable
                    className="flex-row items-center justify-between bg-teal/10 p-4 rounded-xl"
                    onPress={() =>
                      setIsAccountListVisible(!isAccountListVisible)
                    }
                  >
                    <View className="flex-row items-center">
                      <CreditCard size={20} color="#F6DCAC" />
                      <Text className="text-sand ml-3">
                        {selectedAccountData
                          ? `Cuenta: ${selectedAccountData.accountNumber}`
                          : "Selecciona una cuenta"}
                      </Text>
                    </View>
                    <ChevronRight
                      size={20}
                      color="#F6DCAC"
                      style={{
                        transform: [
                          { rotate: isAccountListVisible ? "90deg" : "0deg" },
                        ],
                      }}
                    />
                  </Pressable>

                  {isAccountListVisible && (
                    <View className="mt-2 space-y-2">
                      {selectedBankData?.accounts.map((account) => (
                        <Pressable
                          key={account.id}
                          className={`p-4 rounded-xl ${
                            formData.selectedAccount === account.id
                              ? "bg-teal"
                              : "bg-teal/20"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              selectedAccount: account.id,
                              selectedCard: null,
                            })
                          }
                        >
                          <Text className="text-sand">
                            Cuenta: {account.accountNumber}
                          </Text>
                          <Text className="text-coral text-sm">
                            Saldo: ${account.currentBalance.toFixed(2)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Selección de tarjeta (solo para gastos) */}
              {formData.type === "expense" &&
                formData.selectedAccount &&
                selectedAccountData?.cards.length > 0 && (
                  <View>
                    <Text className="text-coral mb-2">Tarjeta</Text>
                    <View className="space-y-2">
                      {selectedAccountData.cards.map((card) => (
                        <Pressable
                          key={card.id}
                          className={`p-3 rounded-xl ${
                            formData.selectedCard === card.id
                              ? "bg-teal"
                              : "bg-teal/20"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              selectedCard: card.id,
                            })
                          }
                        >
                          <Text className="text-sand">
                            •••• {card.lastFourDigits}
                          </Text>
                          <Text className="text-coral capitalize">
                            {card.type}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

              {/* Fecha */}
              <View>
                <Text className="text-coral mb-2">Fecha</Text>
                <Pressable
                  className="bg-teal/10 p-3 rounded-xl"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-sand">
                    {formData.date.toLocaleDateString()}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.date}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setFormData({ ...formData, date: selectedDate });
                      }
                    }}
                  />
                )}
              </View>

              {/* Recurrencia */}
              <View className="bg-teal/10 p-4 rounded-xl">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-coral">Transacción Recurrente</Text>
                  <View className="flex-row bg-teal/20 rounded-xl overflow-hidden">
                    <Pressable
                      className={`px-4 py-2 ${
                        formData.isRecurrent ? "bg-teal" : ""
                      }`}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          isRecurrent: true,
                        })
                      }
                    >
                      <Text className="text-sand">Sí</Text>
                    </Pressable>
                    <Pressable
                      className={`px-4 py-2 ${
                        !formData.isRecurrent ? "bg-teal" : ""
                      }`}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          isRecurrent: false,
                        })
                      }
                    >
                      <Text className="text-sand">No</Text>
                    </Pressable>
                  </View>
                </View>

                {formData.isRecurrent && (
                  <View className="space-y-4">
                    <Text className="text-coral">Frecuencia</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {frequencies.map((freq) => (
                        <Pressable
                          key={freq.value}
                          className={`px-4 py-2 rounded-xl ${
                            formData.recurrentConfig.frequency === freq.value
                              ? "bg-teal"
                              : "bg-teal/20"
                          }`}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              recurrentConfig: {
                                ...formData.recurrentConfig,
                                frequency: freq.value,
                              },
                            })
                          }
                        >
                          <Text className="text-sand">{freq.label}</Text>
                        </Pressable>
                      ))}
                    </View>

                    {formData.recurrentConfig.frequency === "custom" && (
                      <View>
                        <Text className="text-coral mb-2">
                          Cada cuántos días
                        </Text>
                        <TextInput
                          className="bg-teal/10 text-sand p-4 rounded-xl"
                          value={formData.recurrentConfig.customDays.toString()}
                          onChangeText={(text) =>
                            setFormData({
                              ...formData,
                              recurrentConfig: {
                                ...formData.recurrentConfig,
                                customDays: parseInt(text) || 0,
                              },
                            })
                          }
                          keyboardType="number-pad"
                          placeholder="Número de días"
                          placeholderTextColor="#FAA968"
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Botón de guardar */}
              <Pressable
                className="bg-orange p-4 rounded-xl mt-4"
                onPress={handleSubmit}
              >
                <Text className="text-sand text-center font-semibold">
                  Guardar Transacción
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
