import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
};

const LANGUAGE_KEY = "userLanguage";

async function getInitialLanguage() {
  const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (savedLang && ["ar", "fr"].includes(savedLang)) return savedLang;

  const deviceLang = Localization.getLocales()[0].languageCode ?? "fr";
  return ["ar", "fr"].includes(deviceLang) ? deviceLang : "ar";
}

(async () => {
  const initialLang = await getInitialLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: initialLang,
    fallbackLng: "ar",
    supportedLngs: ["ar", "fr"],
    interpolation: { escapeValue: false },
    ns: ["translation"],
    defaultNS: "translation",
    compatibilityJSON: "v4",
  });
})();

export async function changeLanguage(lang: string) {
  if (!["ar", "fr"].includes(lang)) return;
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
}

export default i18n;
