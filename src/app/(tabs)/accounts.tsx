import { BankAccountsScreen } from "../../screens/BankAccountsScreen";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabBankAccountsScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <Header />
        <View className="flex-1 mt-4">
          <BankAccountsScreen />
        </View>
      </SafeAreaView>
    </View>
  );
}
