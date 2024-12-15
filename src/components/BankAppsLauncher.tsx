import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Platform,
  Image,
  ImageSourcePropType,
} from "react-native";
import { useBanks } from "../hooks/useBanks";
import { ExternalLink } from "lucide-react-native";
import { BANK_APPS } from "../constants/banks";

export function BankAppsLauncher() {
  const { banks } = useBanks();

  const openAppStore = (bankName: string) => {
    const bankApp = BANK_APPS[bankName];
    if (!bankApp || !bankApp.hasApp) return;

    const storeUrl = Platform.select({
      ios: `https://apps.apple.com/cl/app/id${bankApp.iosId}`,
      android: `market://details?id=${bankApp.androidPackage}`,
      default: `https://play.google.com/store/apps/details?id=${bankApp.androidPackage}`,
    });

    Linking.openURL(storeUrl).catch(() => {
      if (Platform.OS === "android") {
        Linking.openURL(
          `https://play.google.com/store/apps/details?id=${bankApp.androidPackage}`
        ).catch((err) => {
          console.error("Error opening store:", err);
          Alert.alert("Error", "No se pudo abrir la tienda de aplicaciones");
        });
      }
    });
  };

  const handleOpenApp = async (bankName: string) => {
    const bankApp = BANK_APPS[bankName];
    if (!bankApp || !bankApp.hasApp) return;

    try {
      const canOpen = await Linking.canOpenURL(bankApp.scheme!);
      if (canOpen) {
        await Linking.openURL(bankApp.scheme!);
      } else {
        Alert.alert(
          "App no instalada",
          `La aplicación de ${bankApp.appName} no está instalada en tu dispositivo.`,
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Descargar",
              onPress: () => openAppStore(bankName),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error opening app:", error);
      Alert.alert(
        "Error",
        `No se pudo abrir la aplicación de ${bankApp.appName}`
      );
    }
  };

  // Filtrar solo los bancos que tienen app configurada
  const banksWithApps = banks.filter((bank) => BANK_APPS[bank.name]?.hasApp);

  if (banksWithApps.length === 0) return null;

  return (
    <View>
      <View className=" shadow-lg">
        <View
          className="bg-white rounded-3xl mx-4"
          style={{
            elevation: 8,
            shadowColor: "#755bce",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
        >
          <View className="p-4">
            <Text className="text-textPrimary text-lg font-medium mb-4">
              Tus Apps Bancarias
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              <View className="flex-row space-x-3">
                {banksWithApps.map((bank) => {
                  const bankApp = BANK_APPS[bank.name];
                  if (!bankApp?.hasApp) return null;

                  return (
                    <Pressable
                      key={bank.id}
                      className="bg-veryPaleBlue/10 p-4 rounded-xl items-center min-w-[80px]"
                      onPress={() => handleOpenApp(bank.name)}
                    >
                      {bankApp.icon ? (
                        <Image
                          source={bankApp.icon}
                          className="w-6 h-6"
                          resizeMode="contain"
                        />
                      ) : (
                        <ExternalLink size={24} color="#755bce" />
                      )}
                      <Text className="text-textPrimary text-center text-xs mt-2">
                        {bankApp.appName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}
