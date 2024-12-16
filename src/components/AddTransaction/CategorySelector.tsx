import React, { useState } from "react";
import { View, Pressable, Text, TextInput, ScrollView } from "react-native";
import { Tag, ChevronRight } from "lucide-react-native";
import { TRANSACTION_CATEGORIES } from "../../constants/categories";
import { TransactionFormData } from "../../types/transaction.types";
import { ModalView } from "../../types/common.types";

interface CategorySelectorProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
  setCurrentView: (view: ModalView) => void;
}

export function CategorySelector({
  formData,
  setFormData,
  setCurrentView,
}: CategorySelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <View className="flex-1">
      <ScrollView className="max-h-[600px] mb-[80px]">
        <View className="space-y-4">
          {TRANSACTION_CATEGORIES.map((category) => (
            <View key={category.id}>
              <Pressable
                className={`p-4 rounded-xl ${
                  formData.category === category.id ||
                  expandedCategory === category.id
                    ? "bg-veryPaleBlue"
                    : "bg-veryPaleBlue/20"
                } flex-row items-center justify-between`}
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
                  <Tag size={20} color="#755bce" />
                  <Text className="text-textPrimary ml-3">{category.name}</Text>
                </View>
                {category.subcategories && (
                  <ChevronRight
                    size={20}
                    color="#755bce"
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
                <View className="pl-4 mt-2 space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <Pressable
                      key={subcategory.id}
                      className={`p-4 rounded-xl ${
                        formData.subcategory === subcategory.id
                          ? "bg-veryPaleBlue"
                          : "bg-veryPaleBlue/20"
                      }`}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          subcategory: subcategory.id,
                        })
                      }
                    >
                      <Text className="text-textPrimary">
                        {subcategory.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {formData.category === "other" && category.id === "other" && (
                <View className="pl-4 mt-2">
                  <Text className="text-textSecondary mb-2 text-sm">
                    ¿La categoría que buscas no está? Escríbela para que
                    nuestros desarrolladores la vean y la agreguen. ¡Ayúdanos a
                    mejorar!
                  </Text>
                  <TextInput
                    className="bg-veryPaleBlue/10 text-textPrimary p-4 rounded-xl"
                    value={formData.otherCategorySuggestion}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        otherCategorySuggestion: text,
                      })
                    }
                    placeholder="Escribe tu sugerencia de categoría"
                    placeholderTextColor="#755bce/75"
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white">
        <Pressable
          className={`bg-moderateBlue p-4 rounded-xl ${
            !formData.category ||
            (formData.category === "other" && !formData.otherCategorySuggestion)
              ? "opacity-50"
              : ""
          }`}
          onPress={() => setCurrentView("main")}
          disabled={
            !formData.category ||
            (formData.category === "other" && !formData.otherCategorySuggestion)
          }
        >
          <Text className="text-white text-center font-semibold">
            Confirmar Selección
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
