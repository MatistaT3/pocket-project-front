import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { CircleDollarSign } from "lucide-react-native";
import { IconProps } from "../types/common.types";
import { getSubscriptionByName } from "../constants/subscriptions";

// Importar los logos aquí
import NetflixLogo from "./Logo/NetflixLogo";
// import SpotifyLogo from "./Logo/spotify";
// etc...

const subscriptionLogos: {
  [key: string]: React.ComponentType<{ width: number; height: number }>;
} = {
  // Mapear los logos aquí
  netflix: NetflixLogo,
  // spotify: SpotifyLogo,
  // etc...
};

interface DynamicIconProps extends IconProps {
  subscriptionName?: string;
}

export function DynamicIcon({
  svgPath,
  size = 24,
  color = "white",
  fallbackType = "expense",
  subscriptionName,
}: DynamicIconProps) {
  // Si hay un subscriptionName, intentar obtener el logo de suscripción
  if (subscriptionName) {
    const subscription = getSubscriptionByName(subscriptionName);
    if (subscription && subscription.iconName in subscriptionLogos) {
      const LogoComponent = subscriptionLogos[subscription.iconName];
      return <LogoComponent width={size} height={size} />;
    }
  }

  // Si hay un svgPath personalizado, usarlo
  if (svgPath) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={svgPath} fill={color} />
      </Svg>
    );
  }

  // Fallback al ícono por defecto
  return (
    <View style={{ width: size, height: size }}>
      <CircleDollarSign
        size={size}
        color={fallbackType === "income" ? "#4CAF50" : "#F44336"}
      />
    </View>
  );
}
