import Text from "@/components/Cext";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";

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

export default function Student({ child }: { child: Child }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          height: 150,
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {/* Left side: image */}
        <View
          style={{
            flex: 1,
            height: "100%",
            position: "relative",
            maxWidth: "40%",
          }}
        >
          <Image
            source={
              child.student.photo
                ? { uri: "data:image/jpg;base64," + child.student.photo }
                : require("@/assets/images/userr.jpg")
            }
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#E0E0E0",
            }}
            contentFit="cover"
          />
        </View>

        {/* Right side: information */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#7A3588",
            height: "100%",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {/* Student Name */}
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: Platform.select({
                  android: "600",
                  ios: "700",
                }),
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              {child.student.firstName} {child.student.lastName}
            </Text>
            <Text
              style={{
                color: "#E0E0E0",
                fontSize: 13,
                fontWeight: "600",
                textAlign: "center",
                fontFamily: "MadaniArabic-Regular",
              }}
            >
              {child.student.firstNameArab} {child.student.lastNameArab}
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              marginVertical: 6,
            }}
          />

          {/* Class */}
          <View
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ color: "#E0E0E0", fontSize: 11, fontWeight: "600" }}>
              {t("class")}:
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 11,
                fontWeight: Platform.select({
                  android: "600",
                  ios: "700",
                }),
              }}
              numberOfLines={1}
            >
              {child.student.class.trim()}
            </Text>
          </View>

          {/* School Year */}
          <View
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ color: "#E0E0E0", fontSize: 11, fontWeight: "600" }}>
              {t("schoolYear")}:
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 11,
                fontWeight: Platform.select({
                  android: "600",
                  ios: "700",
                }),
              }}
            >
              {child.student.schoolYear}
            </Text>
          </View>

          {/* Last Payment */}
          <View
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#E0E0E0", fontSize: 11, fontWeight: "600" }}>
              {t("lastPayment")}:
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 11,
                fontWeight: Platform.select({
                  android: "600",
                  ios: "700",
                }),
              }}
            >
              {child.student.lastPaymentPeriod.split(" ")[0]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
