import React, { useState } from "react";
import { View, Pressable, Text, TextInput, ScrollView } from "react-native";
import { Tag, ChevronRight } from "lucide-react-native";
import { TRANSACTION_CATEGORIES } from "../../constants/categories";
import { TransactionFormData } from "../../types/transaction.types";

interface CategorySelectorProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
  onConfirm: () => void;
}

export function CategorySelector({
  formData,
  setFormData,
  onConfirm,
}: CategorySelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="space-y-6">
          {TRANSACTION_CATEGORIES.map((category) => (
            <View key={category.id}>
              <Pressable
                className={`p-4 rounded-full flex-row items-center justify-between ${
                  formData.category === category.id
                    ? "bg-black"
                    : "bg-black/[0.03]"
                } active:bg-black/[0.05]`}
                onPress={() => {
                  if (formData.category === category.id) {
                    setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    );
                  } else {
                    setFormData({
                      ...formData,
                      category: category.id,
                      subcategory: "",
                      otherCategorySuggestion: "",
                    });
                    setExpandedCategory(category.id);
                  }
                }}
              >
                <View className="flex-row items-center flex-1">
                  <Tag
                    size={20}
                    color={
                      formData.category === category.id ? "white" : "black"
                    }
                  />
                  <Text
                    className={`ml-3 font-medium ${
                      formData.category === category.id
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {category.name}
                  </Text>
                </View>
                {category.subcategories && (
                  <ChevronRight
                    size={20}
                    color={
                      formData.category === category.id ? "white" : "black"
                    }
                    style={{
                      transform: [
                        {
                          rotate:
                            expandedCategory === category.id ? "90deg" : "0deg",
                        },
                      ],
                    }}
                  />
                )}
              </Pressable>

              {expandedCategory === category.id && category.subcategories && (
                <View className="ml-4 mt-2 space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <Pressable
                      key={subcategory.id}
                      className={`p-4 rounded-full ${
                        formData.subcategory === subcategory.id
                          ? "bg-black/[0.05]"
                          : "bg-black/[0.02]"
                      } active:bg-black/[0.07]`}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          subcategory: subcategory.id,
                        })
                      }
                    >
                      <Text className="text-black">{subcategory.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {formData.category === "other" && category.id === "other" && (
                <View className="ml-4 mt-2">
                  <Text className="text-black/60 mb-2 text-sm">
                    ¿La categoría que buscas no está? Escríbela para que
                    nuestros desarrolladores la vean y la agreguen.
                  </Text>
                  <TextInput
                    className="bg-black/[0.03] text-black p-4 rounded-full"
                    value={formData.otherCategorySuggestion}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        otherCategorySuggestion: text,
                      })
                    }
                    placeholder="Escribe tu sugerencia de categoría"
                    placeholderTextColor="#00000066"
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="p-4 bg-white">
        <Pressable
          className={`bg-black p-4 rounded-full ${
            !formData.category ||
            (formData.category === "other" && !formData.otherCategorySuggestion)
              ? "opacity-50"
              : ""
          }`}
          onPress={onConfirm}
          disabled={
            !formData.category ||
            (formData.category === "other" && !formData.otherCategorySuggestion)
          }
        >
          <Text className="text-white text-center font-medium">Confirmar</Text>
        </Pressable>
      </View>
    </View>
  );
}
