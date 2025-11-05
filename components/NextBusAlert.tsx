import Text from "@/components/Cext";
import { Image } from "expo-image";
import { Bus, Car, ChevronRight, MapPin, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface NextBusAlertProps {
  arrivalTime: string;
  stationName: string;
  driverName?: string;
  vehiclePlate?: string;
  onTrackPress: () => void;
}

export default function NextBusAlertCompact({
  arrivalTime,
  stationName,
  driverName,
  vehiclePlate,
  onTrackPress,
}: NextBusAlertProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const arrival = new Date(arrivalTime);
      const diff = arrival.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);
      setTimeRemaining(minutes > 0 ? minutes : 0);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [arrivalTime]);

  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [timeRemaining]);

  const getAlertColor = () => {
    if (timeRemaining <= 5) return "#EF4444";
    if (timeRemaining <= 10) return "#F59E0B";
    return "#7A3588";
  };

  return (
    <TouchableOpacity
      style={styles.compactContainer}
      onPress={onTrackPress}
      activeOpacity={0.9}
    >
      {/* Purple Header Section */}
      <View
        style={[styles.headerSection, { backgroundColor: getAlertColor() }]}
      >
        <Image
          source={require("@/assets/images/onBoarding.webp")}
          style={styles.bgImage}
        />
        <View style={styles.headerOverlay}>
          <Animated.View
            style={[styles.busIcon, { transform: [{ scale: pulseAnim }] }]}
          >
            <Bus size={28} color="white" strokeWidth={2.5} />
          </Animated.View>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>{t("home.nextBusArriving")}</Text>
            <Animated.Text
              style={[
                styles.timeValue,
                { transform: [{ scale: pulseAnim }] },
                {
                  textAlign: locale === "ar" ? "right" : "left",
                },
              ]}
            >
              {timeRemaining} {t("home.minutes")}
            </Animated.Text>
          </View>
          <ChevronRight size={24} color="white" strokeWidth={2.5} />
        </View>
      </View>

      {/* White Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MapPin size={16} color="#7A3588" strokeWidth={2} />
          <Text style={styles.infoText} numberOfLines={1}>
            {stationName}
          </Text>
        </View>

        {driverName && (
          <View style={styles.infoRow}>
            <User size={16} color="#7F8C8D" strokeWidth={2} />
            <Text style={styles.infoTextSecondary} numberOfLines={1}>
              {driverName}
            </Text>
          </View>
        )}

        {vehiclePlate && (
          <View style={styles.infoRow}>
            <Car size={16} color="#7F8C8D" strokeWidth={2} />
            <Text style={styles.infoTextSecondary} numberOfLines={1}>
              {vehiclePlate}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#7A3588",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerSection: {
    position: "relative",
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  headerOverlay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  busIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 12,
    color: "#E0E0E0",
    marginBottom: 2,
    fontWeight: "500",
  },
  timeValue: {
    fontSize: 24,
    fontWeight: Platform.select({ ios: "900", android: "600" }),
    color: "white",
    fontFamily: "MadaniArabic-Bold",
  },
  infoSection: {
    padding: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 15,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#2C3E50",
    flex: 1,
  },
  infoTextSecondary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F8C8D",
    flex: 1,
  },
});
