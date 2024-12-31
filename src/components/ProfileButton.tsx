import { Pressable } from "react-native";
import { User } from "lucide-react-native";
import { router } from "expo-router";

export function ProfileButton() {
  return (
    <Pressable
      onPress={() => router.push("/profile")}
      className="w-8 h-8 rounded-full items-center justify-center active:bg-black/5"
    >
      <User size={20} color="black" />
    </Pressable>
  );
}
