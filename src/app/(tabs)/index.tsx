import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/Header";
import { useBankAccounts } from "../../context/BankAccountsContext";
import { useEffect } from "react";
import { CalendarScreen } from "../../screens/CalendarScreen";
import { FloatingActionButton } from "../../components/FloatingActionButton";

export default function TabCalendarScreen() {
  const { fetchBankAccounts } = useBankAccounts();

  useEffect(() => {
    fetchBankAccounts();
  }, []);

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
