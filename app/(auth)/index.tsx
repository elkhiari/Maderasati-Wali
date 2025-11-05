import Text from "@/components/Cext";
import { changeLanguage } from "@/locales";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function OnBoardingScreen() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/onBoarding.webp")}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Image
            source={require("@/assets/images/logo.webp")}
            style={styles.logo}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeHeader}>{t("onboarding.welcome")}</Text>
            <Text style={styles.subtitle}>
              {t("onboarding.followUrChildren")}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.contentContainer, { paddingBottom: bottom + 30 }]}>
        {/* Language Selection */}
        <Text style={styles.languageTitle}>
          {t("onboarding.selectLanguage")}
        </Text>
        <View style={styles.languageSelector}>
          <View
            style={{
              ...styles.languageButtons,
            }}
          >
            <TouchableOpacity
              style={[
                styles.languageButton,
                locale === "fr" && styles.languageButtonActive,
                {
                  flexDirection: locale === "ar" ? "row" : "row-reverse",
                },
              ]}
              onPress={() => changeLanguage("fr")}
            >
              <View style={styles.flagContainer}>
                <Image
                  source={{ uri: "https://flagcdn.com/h240/fr.webp" }}
                  style={styles.Flag}
                />
              </View>
              <Text
                style={[
                  styles.languageButtonText,
                  locale === "fr" && styles.languageButtonTextActive,
                ]}
              >
                {t("onboarding.fr")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                locale === "ar" && styles.languageButtonActive,
                {
                  flexDirection: locale === "ar" ? "row" : "row-reverse",
                },
              ]}
              onPress={() => changeLanguage("ar")}
            >
              <View style={styles.flagContainer}>
                <Image
                  source={{ uri: "https://flagcdn.com/h240/ma.webp" }}
                  style={styles.Flag}
                />
              </View>
              <Text
                style={[
                  styles.languageButtonText,
                  locale === "ar" && styles.languageButtonTextActive,
                ]}
              >
                {t("onboarding.ar")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.continueButtonText}>
                {t("onboarding.continue")}
              </Text>
              <ChevronRight
                style={{ position: "absolute", right: 16 }}
                color={"white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7A3588",
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    position: "relative",
    height: "70%",
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
    tintColor: "white",
  },
  headerTextContainer: {
    alignItems: "center",
  },
  welcomeHeader: {
    fontSize: 20,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0",
    textAlign: "center",
    // paddingHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: "white",
    height: "50%",
    marginTop: "-40%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 32,
    paddingTop: 32,
    justifyContent: "space-between",
  },
  languageSelector: {
    marginBottom: 30,
  },
  languageTitle: {
    fontSize: 18,
    color: "#2c3e50",
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  languageButtons: {
    gap: 16,
  },
  languageButton: {
    backgroundColor: "rgba(233, 233, 233, 0.9)",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: "#7A3588",
  },
  flagContainer: {
    flexDirection: "row",
  },

  Flag: {
    width: 40,
    height: 40,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  languageButtonText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "600",
    width: "50%",
  },
  languageButtonTextActive: {
    color: "white",
  },
  continueButton: {
    backgroundColor: "#135B7F",
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
});
