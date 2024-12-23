import React from "react";
import { Pressable, View, Text } from "react-native";
import { TRANSACTION_CATEGORIES } from "../../constants/categories";
import { DynamicIcon } from "../DynamicIcon";
import { Transaction } from "../../types/transaction.types";
import { getSubscriptionByName } from "../../constants/subscriptions";

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
  const category = TRANSACTION_CATEGORIES.find(
    (cat) => cat.id === transaction.category
  );

  const isSubscription = transaction.category === "subscriptions";

  return (
    <Pressable
      className="flex-row items-center p-4 bg-white rounded-xl mb-2"
      onPress={() => onPress(transaction)}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          transaction.type === "income" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <DynamicIcon
          svgPath={transaction.icon_data?.svg_path}
          size={20}
          fallbackType={transaction.type}
          subscriptionName={isSubscription ? transaction.name : undefined}
        />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-textPrimary font-medium">{transaction.name}</Text>
        <Text className="text-textSecondary text-sm">
          {category?.name}
          {transaction.subcategory &&
            ` - ${
              category?.subcategories?.find(
                (sub) => sub.id === transaction.subcategory
              )?.name
            }`}
        </Text>
      </View>
      <Text
        className={`font-bold ${
          transaction.type === "income" ? "text-green-500" : "text-red-500"
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}${transaction.amount}
      </Text>
    </Pressable>
  );
}
