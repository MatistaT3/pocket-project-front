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

interface BankApp {
  appName: string;
  scheme?: string;
  androidPackage?: string;
  iosId?: string;
  icon?: ImageSourcePropType;
  hasApp: boolean;
}

// Mapeo de bancos a sus deep links y nombres de app
const BANK_APPS: Record<string, BankApp> = {
  "Banco BCI": {
    appName: "BCI",
    scheme: "bci://",
    androidPackage: "cl.bci.app",
    iosId: "id479174717",
    hasApp: true,
  },
  "Banco BBVA": {
    appName: "BBVA",
    scheme: "bbva://",
    androidPackage: "com.bbva.bbvacontigo",
    iosId: "id1478204157",
    hasApp: true,
  },
  "Banco Bice": {
    appName: "Bice",
    scheme: "bice://",
    androidPackage: "cl.bice.mobile",
    iosId: "id1534028321",
    hasApp: true,
  },
  "Banco Estado": {
    appName: "BancoEstado",
    scheme: "bancoestado://",
    androidPackage: "cl.bancoestado.android",
    iosId: "id1070016946",
    hasApp: true,
  },
  "Banco Falabella": {
    appName: "Falabella",
    scheme: "bancofalabella://",
    androidPackage: "cl.bancofalabella.mobile",
    iosId: "id582093281",
    hasApp: true,
  },
  "Banco ITAU": {
    appName: "Itaú",
    scheme: "itau://",
    androidPackage: "cl.itau.appbanco",
    iosId: "id427752264",
    hasApp: true,
  },
  "Banco Ripley": {
    appName: "Banco Ripley",
    scheme: "bancoripley://",
    androidPackage: "com.ripley.banco.app",
    iosId: "id1522914775",
    hasApp: true,
  },
  "Banco Santander": {
    appName: "Santander",
    scheme: "santander://",
    androidPackage: "cl.santander.santanderchile",
    iosId: "id1507125753",
    hasApp: true,
  },
  "Banco Scotiabank": {
    appName: "Scotiabank",
    scheme: "scotiabank://",
    androidPackage: "cl.scotiabank.mobile",
    iosId: "id505257567",
    hasApp: true,
  },
  "Banco Security": {
    appName: "Security",
    scheme: "bancosecurity://",
    androidPackage: "cl.security.bancosecurity",
    iosId: "id1507125753",
    hasApp: true,
  },
  "Banco de Chile": {
    appName: "Banco Chile",
    scheme: "bancochile://",
    androidPackage: "cl.bancochile.mi.banco",
    iosId: "id417548114",
    hasApp: true,
  },
  Mach: {
    appName: "MACH",
    scheme: "mach://",
    androidPackage: "cl.bci.mach",
    iosId: "id1262116570",
    hasApp: true,
  },
  Tenpo: {
    appName: "Tenpo",
    scheme: "tenpo://",
    androidPackage: "com.tenpo.app",
    iosId: "id1480319695",
    hasApp: true,
  },
  "Mercado Pago": {
    appName: "Mercado Pago",
    scheme: "mercadopago://",
    androidPackage: "com.mercadopago.wallet",
    iosId: "id925436649",
    hasApp: true,
  },
  "Banco CORP Banca": {
    appName: "CORP Banca",
    hasApp: false,
  },
  "Banco Consorcio": {
    appName: "Consorcio",
    scheme: "bancoconsorcio://",
    androidPackage: "cl.consorcio.bancadigital",
    iosId: "id1475017357",
    hasApp: true,
  },
  "Banco Internacional": {
    appName: "Internacional",
    scheme: "bancointernacional://",
    androidPackage: "cl.bancointernacional.android",
    iosId: "id1551685104",
    hasApp: true,
  },
  "Banco Paris": {
    appName: "Paris",
    hasApp: false,
  },
  "Banco Edwards": {
    appName: "Edwards",
    hasApp: false,
  },
  "Banco del Desarrollo": {
    appName: "Desarrollo",
    hasApp: false,
  },
  Coopeuch: {
    appName: "Coopeuch",
    scheme: "coopeuch://",
    androidPackage: "cl.coopeuch.app",
    iosId: "id1482287498",
    hasApp: true,
  },
  Dale: {
    appName: "Dale",
    scheme: "dale://",
    androidPackage: "com.dale.app",
    iosId: "id1557887734",
    hasApp: true,
  },
  "Copec Pay": {
    appName: "Copec Pay",
    scheme: "copecpay://",
    androidPackage: "cl.copec.pay",
    iosId: "id1590337357",
    hasApp: true,
  },
  Global66: {
    appName: "Global66",
    scheme: "global66://",
    androidPackage: "com.global66",
    iosId: "id1460017375",
    hasApp: true,
  },
  "HSBC Bank": {
    appName: "HSBC",
    hasApp: false,
  },
  "La Polar Prepago": {
    appName: "La Polar",
    scheme: "lpolarprepago://",
    androidPackage: "cl.lapolar.prepago",
    iosId: "id1523626766",
    hasApp: true,
  },
  "Prepago Los Heroes": {
    appName: "Los Heroes",
    scheme: "losheroes://",
    androidPackage: "cl.losheroes.app",
    iosId: "id1479159717",
    hasApp: true,
  },
  Prex: {
    appName: "Prex",
    scheme: "prex://",
    androidPackage: "cl.prex.app",
    iosId: "id1466214524",
    hasApp: true,
  },
  "TAPP Caja los Andes": {
    appName: "TAPP",
    scheme: "tapp://",
    androidPackage: "cl.cajalosandes.tapp",
    iosId: "id1482643595",
    hasApp: true,
  },
} as const;

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
    <View className="mt-4">
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
