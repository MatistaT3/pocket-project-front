import { CalendarScreen } from "../../screens/CalendarScreen";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingActionButton } from "../../components/FloatingActionButton";

export default function TabCalendarScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <Header />
        <View className="flex-1 mt-4">
          <CalendarScreen />
        </View>
      </SafeAreaView>
      <FloatingActionButton />
    </View>
  );
}
