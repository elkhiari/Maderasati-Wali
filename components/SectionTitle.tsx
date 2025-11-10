import Text from "@/components/Cext";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function SectionTitle({
  title,
  subtitle,
  icon,
}: SectionTitleProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.titleRow,
          { flexDirection: locale === "ar" ? "row-reverse" : "row" },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { textAlign: locale === "ar" ? "right" : "left" },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { textAlign: locale === "ar" ? "right" : "left" },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: Platform.select({ ios: "800", android: "600" }),
    color: "#1F2937",
    fontFamily: "MadaniArabic-Bold",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
});
