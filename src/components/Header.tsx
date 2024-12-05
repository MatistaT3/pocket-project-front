import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }}>
      <View className="px-4 lg:px-6 h-14 flex items-center flex-row justify-between">
        <Text className="text-white text-2xl font-bold">Pocket Money</Text>
      </View>
    </View>
  );
}
