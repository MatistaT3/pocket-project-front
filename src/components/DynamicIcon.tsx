import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { CircleDollarSign } from "lucide-react-native";
import { IconProps } from "../types/common.types";

export function DynamicIcon({
  svgPath,
  size = 24,
  color = "white",
  fallbackType = "expense",
}: IconProps) {
  if (!svgPath) {
    return (
      <View style={{ width: size, height: size }}>
        <CircleDollarSign
          size={size}
          color={fallbackType === "income" ? "#4CAF50" : "#F44336"}
        />
      </View>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={svgPath} fill={color} />
    </Svg>
  );
}
