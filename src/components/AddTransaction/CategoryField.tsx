import React from "react";
import { View, Pressable, Text } from "react-native";
import { Tag, ChevronRight } from "lucide-react-native";
import { TRANSACTION_CATEGORIES } from "../../constants/categories";

interface CategoryFieldProps {
  category: string;
  subcategory: string;
  navigateToSelectCategory: () => void;
}

export function CategoryField({
  category,
  subcategory,
  navigateToSelectCategory,
}: CategoryFieldProps) {
  return (
    <View>
      <Text className="text-black/60 mb-2 text-sm">Categoría</Text>
      <Pressable
        className="bg-black/[0.03] p-4 rounded-full flex-row items-center justify-between active:bg-black/[0.05]"
        onPress={navigateToSelectCategory}
      >
        <View className="flex-row items-center">
          <Tag size={20} color="black" />
          <Text className="text-black ml-3">
            {category
              ? TRANSACTION_CATEGORIES.find((c) => c.id === category)?.name
              : "Seleccionar categoría"}
          </Text>
        </View>
        <ChevronRight size={20} color="black" />
      </Pressable>
      {subcategory && (
        <Text className="text-black/60 mt-2 ml-2 text-sm">
          Subcategoría:{" "}
          {
            TRANSACTION_CATEGORIES.find(
              (c) => c.id === category
            )?.subcategories?.find((s) => s.id === subcategory)?.name
          }
        </Text>
      )}
    </View>
  );
}
