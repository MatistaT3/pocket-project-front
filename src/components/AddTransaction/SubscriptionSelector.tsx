import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  SUBSCRIPTIONS,
  Subscription,
  getSubscriptionsByServiceType,
} from "../../constants/subscriptions";

interface SubscriptionSelectorProps {
  selectedSubscription: Subscription | null;
  onSelectSubscription: (subscription: Subscription) => void;
}

export const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  selectedSubscription,
  onSelectSubscription,
}) => {
  const [selectedType, setSelectedType] = React.useState<
    Subscription["service_type"] | null
  >(null);

  const subscriptions = selectedType
    ? getSubscriptionsByServiceType(selectedType)
    : SUBSCRIPTIONS;

  const serviceTypes = ["streaming", "music", "cloud"] as const;

  return (
    <View className="space-y-4">
      {/* Filtros por tipo de servicio */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-2"
      >
        <TouchableOpacity
          onPress={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-full ${
            selectedType === null ? "bg-moderateBlue" : "bg-veryPaleBlue/20"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedType === null ? "text-white" : "text-textPrimary"
            }`}
          >
            Todos
          </Text>
        </TouchableOpacity>
        {serviceTypes.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full ${
              selectedType === type ? "bg-moderateBlue" : "bg-veryPaleBlue/20"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedType === type ? "text-white" : "text-textPrimary"
              }`}
            >
              {type === "streaming"
                ? "Streaming"
                : type === "music"
                ? "Música"
                : "Cloud"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de suscripciones */}
      <ScrollView className="space-y-2" showsVerticalScrollIndicator={false}>
        {subscriptions.map((subscription) => (
          <TouchableOpacity
            key={subscription.id}
            onPress={() => onSelectSubscription(subscription)}
            className={`p-4 rounded-lg border ${
              selectedSubscription?.id === subscription.id
                ? "border-moderateBlue bg-veryPaleBlue"
                : "border-gray-200"
            }`}
          >
            <Text className="font-medium text-base text-textPrimary">
              {subscription.name}
            </Text>
            <Text className="text-sm text-textSecondary">
              {subscription.service_type === "streaming"
                ? "Streaming"
                : subscription.service_type === "music"
                ? "Música"
                : subscription.service_type === "cloud"
                ? "Almacenamiento"
                : "Gimnasio"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
