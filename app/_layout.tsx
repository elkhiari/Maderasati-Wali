import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FlashMessage from "react-native-flash-message";
import "react-native-reanimated";

import store from "@/features/store";
import useAuth from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider } from "react-redux";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack.Protected>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayoutWrapper() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [loaded] = useFonts({
    "Gucina-Regular": require("@/assets/fonts/Gucina-Regular.ttf"),
    "Gucina-Medium": require("@/assets/fonts/Gucina-Medium.ttf"),
    "Gucina-SemiBold": require("@/assets/fonts/Gucina-SemiBold.ttf"),
    "Gucina-Bold": require("@/assets/fonts/Gucina-Bold.ttf"),
    "MadaniArabic-Thin": require("@/assets/fonts/Madani Arabic Thin.ttf"),
    "MadaniArabic-ExtraLight": require("@/assets/fonts/Madani Arabic Extra Light.ttf"),
    "MadaniArabic-Light": require("@/assets/fonts/Madani Arabic Light.ttf"),
    "MadaniArabic-Regular": require("@/assets/fonts/Madani Arabic Regular.ttf"),
    "MadaniArabic-Medium": require("@/assets/fonts/Madani Arabic Medium.ttf"),
    "MadaniArabic-SemiBold": require("@/assets/fonts/Madani Arabic Semi Bold.ttf"),
    "MadaniArabic-Bold": require("@/assets/fonts/Madani Arabic Bold.ttf"),
    "MadaniArabic-ExtraBold": require("@/assets/fonts/Madani Arabic Extra Bold.ttf"),
    "MadaniArabic-Black": require("@/assets/fonts/Madani Arabic Black.ttf"),
  });

  const colorScheme = useColorScheme();
  return (
    <KeyboardProvider>
      <Provider store={store}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <FlashMessage
            position="top"
            titleStyle={{
              fontFamily: "MadaniArabic-SemiBold",
              fontSize: 20,
              textAlign: locale == "ar" ? "right" : "left",
            }}
            textStyle={{
              fontFamily: "MadaniArabic-Regular",
              textAlign: locale == "ar" ? "right" : "left",
            }}
          />
          <RootLayout />
          <StatusBar style="auto" />
        </ThemeProvider>
      </Provider>
    </KeyboardProvider>
  );
}
