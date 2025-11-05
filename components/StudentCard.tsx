import Text from "@/components/Cext";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

interface StudentCardProps {
  student: {
    firstName: string;
    lastName: string;
    firstNameArab: string;
    lastNameArab: string;
    massarCode: string;
    class: string;
    photo: string;
    schoolYear: string;
  };
  school: {
    nameArab: string;
  };
  commune: {
    nameArab: string;
    province: {
      nameArab: string;
    };
  };
  contractNumber?: string;
}

export default function StudentCard({
  student,
  school,
  commune,
  contractNumber,
}: StudentCardProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <View style={styles.container}>
      {/* Left Texture */}
      <View style={styles.leftTexture}>
        <Image
          source={require("@/assets/images/texture.svg")}
          style={styles.textureImage}
          contentFit="cover"
        />
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoBlueBar} />
          <View style={styles.photoContainer}>
            {student.photo ? (
              <Image
                source={{ uri: student.photo }}
                style={styles.photo}
                contentFit="cover"
              />
            ) : (
              <Image
                source={require("@/assets/images/user.jpg")}
                style={styles.photo}
                contentFit="cover"
              />
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo.webp")}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          {/* Student Name */}
          <View style={styles.nameContainer}>
            <Text style={styles.firstNameArab}>
              {student.firstNameArab}{" "}
              <Text style={styles.lastNameArab}>{student.lastNameArab}</Text>
            </Text>
          </View>

          {/* School Year Badge */}
          <View style={styles.schoolYearBadge}>
            <Text style={styles.schoolYearText}>
              {student.schoolYear}/{parseInt(student.schoolYear) + 1}
            </Text>
            <Text style={styles.schoolYearLabel}>السنة الدراسية</Text>
          </View>

          {/* Student Details */}
          <View style={styles.detailsContainer}>
            {/* Massar Code */}
            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>
                {student.massarCode.includes("_bis")
                  ? student.massarCode.split("_bis")[0]
                  : student.massarCode}{" "}
                :
              </Text>
              <Text style={styles.detailLabel}>رقم مسار</Text>
            </View>

            {/* Contract Number */}
            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>SL202511-012992 :</Text>
              <Text style={styles.detailLabel}>الرقم</Text>
            </View>

            {/* Province */}
            <View style={styles.detailRow}>
              <Text style={styles.detailValueArab}>: سلا</Text>
              <Text style={styles.detailLabel}>عمالة</Text>
            </View>

            {/* Commune */}
            <View style={styles.detailRow}>
              <Text style={styles.detailValueArab}>: عامر سيدي بوقنادل</Text>
              <Text style={styles.detailLabel}>الجماعة</Text>
            </View>

            {/* School */}
            <View style={styles.detailRow}>
              <Text style={styles.detailValueArab}>
                : الثانوية التأهيلية احمد الناصري
              </Text>
              <Text style={styles.detailLabel}>المؤسسة</Text>
            </View>

            {/* Class Level */}
            <View style={styles.detailRow}>
              <Text style={styles.detailValueArab}>: {student.class}</Text>
              <Text style={styles.detailLabel}>المستوى</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Texture */}
      <View style={styles.rightTexture}>
        <Image
          source={require("@/assets/images/texture.svg")}
          style={styles.textureImage}
          contentFit="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Platform.select({ ios: 200, android: 250 }),
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftTexture: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 64,
    height: "100%",
    zIndex: 1,
  },
  rightTexture: {
    position: "absolute",
    right: -60,
    top: 0,
    width: 64,
    height: "100%",
    zIndex: 1,
  },
  textureImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 12,
    zIndex: 2,
  },
  photoSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  photoBlueBar: {
    width: 12,
    height: 160,
    backgroundColor: "#28B3E2",
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    position: "absolute",
    left: 0,
  },
  photoContainer: {
    width: 112,
    height: 160,
    borderWidth: 1.5,
    borderColor: "#28B3E2",
    overflow: "hidden",
    marginLeft: 12,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  infoSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 80,
    height: 28,
  },
  nameContainer: {
    alignItems: "flex-end",
    marginBottom: 4,
  },
  firstNameArab: {
    fontSize: 20,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#F97316", // orange-500
    textAlign: "right",
  },
  lastNameArab: {
    color: "#155D80",
  },
  schoolYearBadge: {
    backgroundColor: "#4ADE80", // green-400
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  schoolYearText: {
    fontSize: 12,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#F97316",
  },
  schoolYearLabel: {
    fontSize: 12,
    color: "#374151", // gray-700
    fontWeight: "600",
  },
  detailsContainer: {
    flex: 1,
    gap: Platform.select({ ios: 3, android: 1 }),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4B5563",
    minWidth: "35%",
    textAlign: "right",
  },
  detailValue: {
    fontSize: 8,
    color: "#4B5563",
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    textAlign: "right",
    flex: 1,
  },
  detailValueArab: {
    fontSize: 8,
    color: "#4B5563",
    textAlign: "right",
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    flex: 1,
  },
});
