import React, { useState } from "react";
import {
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
import { Building2, CreditCard, ChevronRight } from "lucide-react-native";
import { ElevatedBaseModal } from "./ElevatedBaseModal";
import {
  Transaction,
  AddTransactionModalProps,
  TransactionFormData,
  TransactionType,
  TransactionCategory,
  RecurrencyFrequency,
} from "../types/transaction.types";
import { ModalView } from "../types/common.types";

export function AddTransactionModal({
  visible,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const { addTransaction } = useTransactions();
  const { banks } = useBanks();
  const [currentView, setCurrentView] = useState<ModalView>("main");
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    category: "regular",
    name: "",
    amount: "",
    date: new Date(),
    selectedBank: null,
    selectedAccount: null,
    selectedCard: null,
    bankName: "",
    accountNumber: "",
    cardLastFour: "",
    cardType: "debit",
    isRecurrent: false,
    recurrentConfig: {
      frequency: "monthly",
      customDays: 0,
    },
  });

  // Estados para la selección de banco
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isBankListVisible, setIsBankListVisible] = useState(false);
  const [isAccountListVisible, setIsAccountListVisible] = useState(false);

  const selectedBankData = banks.find((bank) => bank.id === selectedBank);
  const selectedAccountData = selectedBankData?.accounts.find(
    (account) => account.id === selectedAccount
  );
  const selectedCardData = selectedAccountData?.cards.find(
    (card) => card.id === selectedCard
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

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
          bank: formData.bankName,
          lastFourDigits: formData.cardLastFour,
          type: formData.cardType,
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
        accountNumber: formData.accountNumber,
      });

      await onSuccess?.();
      Alert.alert("Éxito", "Transacción agregada correctamente");
      handleClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "No se pudo agregar la transacción");
    }
  };

  const handleConfirmBankSelection = () => {
    if (!selectedBankData || !selectedAccountData) return;

    if (formData.type === "expense" && !selectedCardData) {
      return;
    }

    setFormData({
      ...formData,
      selectedBank: selectedBankData.id,
      bankName: selectedBankData.name,
      selectedAccount: selectedAccountData.id,
      accountNumber: selectedAccountData.accountNumber,
      selectedCard: selectedCardData?.id || null,
      cardLastFour: selectedCardData?.lastFourDigits || "",
      cardType: selectedCardData?.type || "debit",
    });

    setCurrentView("main");
  };

  const handleClose = () => {
    setFormData({
      type: "expense",
      category: "regular",
      name: "",
      amount: "",
      date: new Date(),
      selectedBank: null,
      selectedAccount: null,
      selectedCard: null,
      bankName: "",
      accountNumber: "",
      cardLastFour: "",
      cardType: "debit",
      isRecurrent: false,
      recurrentConfig: {
        frequency: "monthly",
        customDays: 0,
      },
    });
    setSelectedBank(null);
    setSelectedAccount(null);
    setSelectedCard(null);
    setCurrentView("main");
    onClose();
  };

  const renderBankSelection = () => (
    <ScrollView className="max-h-[600px]">
      <View className="space-y-4">
        {banks.length === 0 ? (
          <View className="items-center justify-center py-8 space-y-4">
            <CreditCard size={48} color="#755bce" />
            <Text className="text-textPrimary text-center text-lg font-medium">
              No hay cuentas disponibles
            </Text>
            <Text className="text-textSecondary text-center px-4">
              Dirígete a la sección "Cuentas" en la barra de navegación para
              agregar tus cuentas y tarjetas.
            </Text>
            <Pressable
              className="bg-moderateBlue p-4 rounded-xl mt-4"
              onPress={handleClose}
            >
              <Text className="text-white text-center font-semibold">
                Entendido
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Selección de banco */}
            <View>
              <Text className="text-textSecondary mb-2">Banco</Text>
              <Pressable
                className="flex-row items-center justify-between bg-veryPaleBlue/10 p-4 rounded-xl"
                onPress={() => setIsBankListVisible(!isBankListVisible)}
              >
                <View className="flex-row items-center">
                  <Building2 size={20} color="#755bce" />
                  <Text className="text-textPrimary ml-3">
                    {selectedBankData?.name || "Selecciona un banco"}
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color="#755bce"
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
                        selectedBank === bank.id
                          ? "bg-veryPaleBlue"
                          : "bg-veryPaleBlue/20"
                      }`}
                      onPress={() => {
                        setSelectedBank(bank.id);
                        setSelectedAccount(null);
                        setSelectedCard(null);
                        setIsBankListVisible(false);
                      }}
                    >
                      <Text className="text-textPrimary">{bank.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Selección de cuenta */}
            {selectedBank && (
              <View>
                <Text className="text-textSecondary mb-2">Cuenta</Text>
                <Pressable
                  className="flex-row items-center justify-between bg-veryPaleBlue/10 p-4 rounded-xl"
                  onPress={() => setIsAccountListVisible(!isAccountListVisible)}
                >
                  <View className="flex-row items-center">
                    <CreditCard size={20} color="#755bce" />
                    <Text className="text-textPrimary ml-3">
                      {selectedAccountData
                        ? `Cuenta: ${selectedAccountData.accountNumber}`
                        : "Selecciona una cuenta"}
                    </Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color="#755bce"
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
                          selectedAccount === account.id
                            ? "bg-veryPaleBlue"
                            : "bg-veryPaleBlue/20"
                        }`}
                        onPress={() => {
                          setSelectedAccount(account.id);
                          setSelectedCard(null);
                          setIsAccountListVisible(false);
                        }}
                      >
                        <Text className="text-textPrimary">
                          Cuenta: {account.accountNumber}
                        </Text>
                        <Text className="text-textSecondary text-sm">
                          Saldo: ${account.currentBalance.toFixed(2)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Selección de tarjeta */}
            {formData.type === "expense" &&
              selectedAccount &&
              selectedAccountData?.cards.length > 0 && (
                <View>
                  <Text className="text-textSecondary mb-2">Tarjeta</Text>
                  <View className="space-y-2">
                    {selectedAccountData.cards.map((card) => (
                      <Pressable
                        key={card.id}
                        className={`p-3 rounded-xl ${
                          selectedCard === card.id
                            ? "bg-veryPaleBlue"
                            : "bg-veryPaleBlue/20"
                        }`}
                        onPress={() => setSelectedCard(card.id)}
                      >
                        <Text className="text-textPrimary">
                          •••• {card.lastFourDigits}
                        </Text>
                        <Text className="text-textSecondary capitalize">
                          {card.type}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

            {/* Botón de confirmar */}
            <Pressable
              className={`p-4 rounded-xl mt-4 ${
                selectedBank &&
                selectedAccount &&
                (formData.type !== "expense" || selectedCard)
                  ? "bg-moderateBlue"
                  : "bg-moderateBlue/50"
              }`}
              onPress={handleConfirmBankSelection}
              disabled={
                !selectedBank ||
                !selectedAccount ||
                (formData.type === "expense" && !selectedCard)
              }
            >
              <Text className="text-white text-center font-semibold">
                Confirmar Selección
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );

  const renderMainForm = () => (
    <ScrollView className="max-h-[600px]">
      <View className="space-y-4">
        {/* Tipo de transacción */}
        <View>
          <Text className="text-textSecondary mb-2">Tipo</Text>
          <View className="flex-row space-x-2">
            {["expense", "income"].map((type) => (
              <Pressable
                key={type}
                className={`flex-1 p-3 rounded-xl ${
                  formData.type === type
                    ? "bg-veryPaleBlue"
                    : "bg-veryPaleBlue/20"
                }`}
                onPress={() =>
                  setFormData({
                    ...formData,
                    type: type as TransactionType,
                  })
                }
              >
                <Text className="text-textPrimary text-center capitalize">
                  {type === "expense" ? "Gasto" : "Ingreso"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Nombre */}
        <View>
          <Text className="text-textSecondary mb-2">Nombre</Text>
          <TextInput
            className="bg-veryPaleBlue/10 text-textPrimary p-3 rounded-xl"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Nombre de la transacción"
            placeholderTextColor="#755bce/75"
          />
        </View>

        {/* Monto */}
        <View>
          <Text className="text-textSecondary mb-2">Monto</Text>
          <TextInput
            className="bg-veryPaleBlue/10 text-textPrimary p-3 rounded-xl"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            placeholder="0"
            placeholderTextColor="#755bce/75"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Selección de banco */}
        <View>
          <Text className="text-textSecondary mb-2">Método de Pago</Text>
          <Pressable
            className="bg-veryPaleBlue/10 p-4 rounded-xl"
            onPress={() => setCurrentView("bankSelection")}
          >
            <Text className="text-textPrimary">
              {formData.selectedBank
                ? `${formData.bankName} - ${formData.accountNumber}${
                    formData.cardLastFour
                      ? ` - •••• ${formData.cardLastFour}`
                      : ""
                  }`
                : "Seleccionar cuenta"}
            </Text>
          </Pressable>
        </View>

        {/* Fecha */}
        <View>
          <Text className="text-textSecondary mb-2">Fecha</Text>
          <Pressable
            className="bg-veryPaleBlue/10 p-3 rounded-xl"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-textPrimary">
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
        <View className="bg-veryPaleBlue/10 p-4 rounded-xl">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-textSecondary">Transacción Recurrente</Text>
            <View className="flex-row bg-veryPaleBlue/20 rounded-xl overflow-hidden">
              <Pressable
                className={`px-4 py-2 ${
                  formData.isRecurrent ? "bg-veryPaleBlue" : ""
                }`}
                onPress={() =>
                  setFormData({
                    ...formData,
                    isRecurrent: true,
                  })
                }
              >
                <Text className="text-textPrimary">Sí</Text>
              </Pressable>
              <Pressable
                className={`px-4 py-2 ${
                  !formData.isRecurrent ? "bg-veryPaleBlue" : ""
                }`}
                onPress={() =>
                  setFormData({
                    ...formData,
                    isRecurrent: false,
                  })
                }
              >
                <Text className="text-textPrimary">No</Text>
              </Pressable>
            </View>
          </View>

          {formData.isRecurrent && (
            <View className="space-y-4">
              <Text className="text-textSecondary">Frecuencia</Text>
              <View className="flex-row flex-wrap gap-2">
                {frequencies.map((freq) => (
                  <Pressable
                    key={freq.value}
                    className={`px-4 py-2 rounded-xl ${
                      formData.recurrentConfig.frequency === freq.value
                        ? "bg-veryPaleBlue"
                        : "bg-veryPaleBlue/20"
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
                    <Text className="text-textPrimary">{freq.label}</Text>
                  </Pressable>
                ))}
              </View>

              {formData.recurrentConfig.frequency === "custom" && (
                <View>
                  <Text className="text-textSecondary mb-2">
                    Cada cuántos días
                  </Text>
                  <TextInput
                    className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
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
                    placeholderTextColor="#755bce/75"
                  />
                </View>
              )}
            </View>
          )}
        </View>

        {/* Botón de guardar */}
        <Pressable
          className="bg-moderateBlue p-4 rounded-xl mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">
            Guardar Transacción
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  return (
    <ElevatedBaseModal
      visible={visible}
      onClose={handleClose}
      title={
        currentView === "main" ? "Nueva Transacción" : "Seleccionar Cuenta"
      }
    >
      {currentView === "main" ? renderMainForm() : renderBankSelection()}
    </ElevatedBaseModal>
  );
}
