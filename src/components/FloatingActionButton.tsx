import React, { useState } from "react";
import { Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { AddTransactionModal } from "./AddTransaction";
import { useTransactionContext } from "../context/TransactionContext";

export function FloatingActionButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { triggerRefresh } = useTransactionContext();

  const handleSuccess = async () => {
    setIsModalVisible(false);
    // Pequeño delay para asegurar que la BD se actualizó
    setTimeout(() => {
      triggerRefresh();
    }, 500);
  };

  return (
    <>
      <Pressable
        className="absolute left-1/2 bottom-16 bg-moderateBlue w-16 h-16 rounded-full items-center justify-center border border-white"
        style={{
          transform: [{ translateX: -32 }],
          elevation: 12,
          shadowColor: "#755bce",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.5,
          shadowRadius: 8,
        }}
        onPress={() => setIsModalVisible(true)}
      >
        <Plus size={32} color="white" />
      </Pressable>

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
