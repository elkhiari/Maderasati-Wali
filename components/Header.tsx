import Text from "@/components/Cext";
import { Image } from "expo-image";
import { Bell, Settings } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeHeaderProps {
  parentName: string;
  parentNameArab?: string;
  notificationCount?: number;
  onNotificationPress: () => void;
  onSettingsPress: () => void;
  scrollY: Animated.Value;
}

export const HEADER_MAX_HEIGHT = 200;
export const HEADER_MIN_HEIGHT = 110;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeHeader({
  parentName,
  parentNameArab,
  notificationCount = 0,
  onNotificationPress,
  onSettingsPress,
  scrollY,
}: HomeHeaderProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isArabic = locale === "ar";
  const insets = useSafeAreaInsets();

  // Calculate top padding
  const topPadding =
    insets.top + (Platform.select({ ios: -10, android: 10 }) || 0);

  // Animate header translation
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  // Animate welcome message opacity
  const welcomeOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Animate welcome message translateY (move it up as it fades)
  const welcomeTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View style={[styles.fixedTopBar, { paddingTop: topPadding }]}>
        <View style={styles.topBarContent}>
          <Image
            source={require("@/assets/images/logo.webp")}
            style={styles.logo}
          />

          <View style={styles.actionsContainer}>
            {/* Notification Bell */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
            >
              <Bell size={24} color="white" strokeWidth={2} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Settings Icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSettingsPress}
            >
              <Settings size={24} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Animated Header with Background */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/team.webp")}
            style={styles.image}
          />

          {/* Welcome Message - Animated */}
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: welcomeOpacity,
                transform: [{ translateY: welcomeTranslateY }],
              },
            ]}
          >
            <Text style={styles.greeting}>{t("home.greeting")}</Text>
            <Text style={styles.parentName}>
              {isArabic && parentNameArab ? parentNameArab : parentName}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    zIndex: 1000,
  },
  fixedTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  topBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    zIndex: 1,
    backgroundColor: "#7A3588",
  },
  header: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  image: {
    position: "absolute",
    width: "100%",
    height: HEADER_MAX_HEIGHT,
    opacity: 0.3,
    objectFit: "contain",
  },
  logo: {
    width: 80,
    height: 50,
    resizeMode: "contain",
    tintColor: "white",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#7A3588",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
  },
  welcomeContainer: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#E0E0E0",
    marginBottom: 4,
    textAlign: "center",
  },
  parentName: {
    fontSize: 24,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#FFFFFF",
    textAlign: "center",
  },
});
