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
    <View className="space-y-6">
      {/* Filtros por tipo de servicio */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-2"
      >
        <TouchableOpacity
          onPress={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-full ${
            selectedType === null ? "bg-black" : "bg-black/[0.03]"
          } active:bg-black/[0.05]`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedType === null ? "text-white" : "text-black"
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
              selectedType === type ? "bg-black" : "bg-black/[0.03]"
            } active:bg-black/[0.05]`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedType === type ? "text-white" : "text-black"
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
            className={`p-4 rounded-full ${
              selectedSubscription?.id === subscription.id
                ? "bg-black"
                : "bg-black/[0.03]"
            } active:bg-black/[0.05]`}
          >
            <Text
              className={`font-medium ${
                selectedSubscription?.id === subscription.id
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {subscription.name}
            </Text>
            <Text
              className={`text-sm ${
                selectedSubscription?.id === subscription.id
                  ? "text-white/60"
                  : "text-black/60"
              }`}
            >
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
