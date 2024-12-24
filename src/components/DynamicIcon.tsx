import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { CircleDollarSign } from "lucide-react-native";
import { IconProps } from "../types/common.types";
import { getSubscriptionByName } from "../constants/subscriptions";
import NetflixLogo from "./Logo/NetflixLogo";
import DisneyPlusLogo from "./Logo/DisneyPlusLogo";
import AmazonPrimeLogo from "./Logo/AmazonPrimeLogo";
import HboMaxLogo from "./Logo/HboMaxLogo";
import AppleTvLogo from "./Logo/AppleTvLogo";
import ParamountPlusLogo from "./Logo/ParamountPlusLogo";
import CrunchyrollLogo from "./Logo/CrunchyrollLogo";
import YoutubePremiumLogo from "./Logo/YoutubePremiumLogo";
import SpotifyLogo from "./Logo/SpotifyLogo";
import AppleMusicLogo from "./Logo/AppleMusicLogo";
import AmazonMusicLogo from "./Logo/AmazonMusicLogo";
import YoutubeMusicLogo from "./Logo/YoutubeMusicLogo";
import GoogleOneLogo from "./Logo/GoogleOneLogo";
import ICloudLogo from "./Logo/ICloudLogo";
import SmartFitLogo from "./Logo/SmartFitLogo";
const subscriptionLogos: {
  [key: string]: React.ComponentType<{ width: number; height: number }>;
} = {
  // Mapear los logos aquí
  netflix: NetflixLogo,
  disney_plus: DisneyPlusLogo,
  amazon_prime: AmazonPrimeLogo,
  hbo_max: HboMaxLogo,
  apple_tv: AppleTvLogo,
  paramount_plus: ParamountPlusLogo,
  crunchyroll: CrunchyrollLogo,
  youtube_premium: YoutubePremiumLogo,
  spotify: SpotifyLogo,
  apple_music: AppleMusicLogo,
  amazon_music: AmazonMusicLogo,
  youtube_music: YoutubeMusicLogo,
  google_one: GoogleOneLogo,
  icloud: ICloudLogo,
  smartfit: SmartFitLogo,
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
