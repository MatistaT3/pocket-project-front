import { Tabs, useRouter } from "expo-router";
import { Calendar, CreditCard } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

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
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#755bce",
          shadowOffset: {
            width: 0,
            height: -6,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: "#755bce",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
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
