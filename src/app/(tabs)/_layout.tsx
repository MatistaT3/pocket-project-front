import { Tabs, useRouter } from "expo-router";
import { CalendarDays, CreditCard, Plus } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { Pressable, View } from "react-native";

export default function TabsLayout() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/auth");
    }
  }, [session, isLoading]);

  if (isLoading || !session) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          paddingBottom: 24,
          backgroundColor: "white",
          borderTopWidth: 0.5,
          borderTopColor: "#00000008",
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#00000066",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color, size }) => (
            <CalendarDays size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <View className="relative -top-4">
              <Pressable
                onPress={() => router.navigate("add")}
                className="w-14 h-14 bg-black rounded-full items-center justify-center shadow-sm shadow-black/20"
              >
                <Plus size={24} color="white" />
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: "Cuentas",
          tabBarIcon: ({ color, size }) => (
            <CreditCard size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
