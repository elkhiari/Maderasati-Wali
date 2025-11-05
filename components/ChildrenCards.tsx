import Text from "@/components/Cext";
import { Image } from "expo-image";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Child {
  student: {
    firstName: string;
    lastName: string;
    firstNameArab: string;
    lastNameArab: string;
    photo: string;
    class: string;
    lastPaymentPeriod: string;
    schoolYear: string;
    status: string; // "active", "inactive", etc.
  };
  circuit: {
    name: string;
    color: string;
  };
}

interface ChildrenCardsProps {
  children: Child[];
  selectedIndex: number;
  onSelectChild: (index: number) => void;
  showPaymentStatus?: boolean;
  showCheckmark?: boolean;
}

export default function ChildrenCards({
  children,
  selectedIndex,
  onSelectChild,
  showPaymentStatus = true,
  showCheckmark = true,
}: ChildrenCardsProps) {
  const { i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const isPaymentValid = (lastPaymentPeriod: string) => {
    if (!lastPaymentPeriod) return false;

    // Check if payment is current (you can customize this logic)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Example: lastPaymentPeriod format could be "2024-11" or similar
    // Adjust based on your actual format
    return !!lastPaymentPeriod;
  };

  const renderChildrenCards = (child: Child, index: number) => {
    const isSelected = selectedIndex === index;
    const isPaid = isPaymentValid(child.student.lastPaymentPeriod);

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onSelectChild(index)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.card,
            isSelected && styles.cardSelected,
            {
              ...(children.length === 1 && { width: "100%" }),
            },
          ]}
        >
          {/* Selected Checkmark Badge */}
          {showCheckmark && isSelected && (
            <View style={styles.checkmarkBadge}>
              <Check size={14} color="white" strokeWidth={3} />
            </View>
          )}

          {/* Photo Container with Payment Status */}
          <View style={styles.photoContainer}>
            <Image
              source={
                child.student.photo
                  ? { uri: "data:image/jpg;base64," + child.student.photo }
                  : require("@/assets/images/user.jpg")
              }
              style={[styles.photo, isSelected && styles.photoSelected]}
              contentFit="cover"
            />

            {/* Payment Status Indicator */}
            {showPaymentStatus && (
              <View
                style={[
                  styles.paymentIndicator,
                  {
                    backgroundColor: isPaid ? "#4ADE80" : "#EF4444",
                  },
                ]}
              >
                {/* Optional: Add icon inside indicator */}
                {isPaid ? (
                  <Check size={10} color="white" strokeWidth={3} />
                ) : (
                  <Text style={styles.paymentIndicatorText}>!</Text>
                )}
              </View>
            )}

            {/* Student Status Badge (optional) */}
            {child.student.status && child.student.status !== "active" && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {child.student.status}
                </Text>
              </View>
            )}
          </View>

          {/* Student Name */}
          <Text style={styles.name} numberOfLines={1}>
            {isArabic ? child.student.firstNameArab : child.student.firstName}{" "}
            {children.length === 1 &&
              (isArabic ? child.student.lastNameArab : child.student.lastName)}
          </Text>

          {/* Last Name (smaller) */}
          {children.length !== 1 && (
            <Text style={styles.lastName} numberOfLines={1}>
              {isArabic ? child.student.lastNameArab : child.student.lastName}
            </Text>
          )}

          {/* Student Class */}
          <View style={styles.classContainer}>
            <Text style={styles.class}>{child.student.class}</Text>
          </View>

          {/* School Year */}
          <Text style={styles.schoolYear}>
            {child.student.schoolYear}/{parseInt(child.student.schoolYear) + 1}
          </Text>

          {/* Circuit Badge */}
          <View
            style={[
              styles.circuitBadge,
              {
                backgroundColor: child.circuit.color + "20",
                borderColor: child.circuit.color + "40",
              },
            ]}
          >
            <View
              style={[
                styles.circuitDot,
                { backgroundColor: child.circuit.color },
              ]}
            />
            <Text
              style={[styles.circuitText, { color: child.circuit.color }]}
              numberOfLines={1}
            >
              {child.circuit.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (children.length === 1) {
    return renderChildrenCards(children[0], 0);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      snapToInterval={152} // 140 card width + 12 gap
      decelerationRate="fast"
    >
      {children.map((child, index) => {
        return renderChildrenCards(child, index);
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 12,
  },
  card: {
    width: 240,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  cardSelected: {
    borderColor: "#7A3588",
    backgroundColor: "#F9F5FF",
    shadowColor: "#7A3588",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  checkmarkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#7A3588",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#7A3588",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#E0E0E0",
  },
  photoSelected: {
    borderColor: "#7A3588",
  },
  paymentIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentIndicatorText: {
    color: "white",
    fontSize: 12,
    fontWeight: Platform.select({ ios: "900", android: "600" }),
  },
  statusBadge: {
    position: "absolute",
    top: -4,
    left: -4,
    backgroundColor: "#F59E0B",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  statusBadgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    textTransform: "uppercase",
  },
  name: {
    fontSize: 15,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 2,
  },
  lastName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 6,
  },
  classContainer: {
    backgroundColor: "#E8F4F8",
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  class: {
    fontSize: 12,
    color: "#135B7F",
    fontWeight: "600",
  },
  schoolYear: {
    fontSize: 11,
    color: "#95A5A6",
    marginBottom: 8,
    fontWeight: "600",
  },
  circuitBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    maxWidth: "100%",
    borderWidth: 1,
  },
  circuitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  circuitText: {
    fontSize: 11,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    flex: 1,
  },
});
