import Text from "@/components/Cext";
import { ImageBackground } from "expo-image";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Student from "./Stu";

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
  color?: string;
}

export default function ChildrenCards({
  children,
  selectedIndex,
  onSelectChild,
  showPaymentStatus = true,
  showCheckmark = true,
  color = "#7A3588",
}: ChildrenCardsProps) {
  const { i18n } = useTranslation();

  const renderChildrenCardBigProfile = (child: Child, index: number) => {
    const isSelected = selectedIndex === index;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => onSelectChild(index)}
        activeOpacity={0.7}
      >
        <ImageBackground
          source={
            child.student.photo
              ? { uri: "data:image/jpg;base64," + child.student.photo }
              : require("@/assets/images/userr.jpg")
          }
          style={[
            {
              width: 200,
              height: 200,
              borderRadius: 16,
              overflow: "hidden",
              justifyContent: "flex-end",
              borderWidth: 4,
              marginHorizontal: 4,
              borderColor: isSelected ? color : "#8d838fff",
            },
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              isSelected ? "#7a35883a" : "rgba(0,0,0,0.2)",
              isSelected ? color : "rgba(0,0,0,0.6)",
            ]}
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "flex-end",
              padding: 12,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              <Text style={{ textTransform: "capitalize" }}>
                {child.student.firstName}
              </Text>{" "}
              {child.student.lastName.toUpperCase()}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  if (children.length === 1) {
    return <Student child={children[0]} />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      snapToInterval={152}
      decelerationRate="fast"
    >
      {children.map((child, index) => {
        return renderChildrenCardBigProfile(child, index);
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    // gap: 12,
    padding: 2,
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
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 6,
    // transform: [{ scale: 1.02 }],
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
