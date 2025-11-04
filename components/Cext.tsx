import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextProps } from "react-native";

export default function Cext(props: TextProps) {
  const { t } = useTranslation();
  const locale = t("language");
  const getFontFamily = () => {
    const style = StyleSheet.flatten(props.style);
    const fontWeight = style?.fontWeight;

    switch (fontWeight) {
      case "100":
        return "MadaniArabic-Thin";
      case "200":
        return "MadaniArabic-ExtraLight";
      case "300":
        return "MadaniArabic-Light";
      case "400":
      case "normal":
        return "MadaniArabic-Regular";
      case "500":
        return "MadaniArabic-Medium";
      case "600":
        return "MadaniArabic-SemiBold";
      case "700":
      case "bold":
        return "MadaniArabic-Bold";
      case "800":
        return "MadaniArabic-ExtraBold";
      case "900":
        return "MadaniArabic-Black";
      default:
        return "MadaniArabic-Regular";
    }
  };

  const getTextAlign = () => {
    const style = StyleSheet.flatten(props.style);

    if (style?.textAlign) {
      return style.textAlign;
    }

    return locale === "ar" ? "right" : "left";
  };

  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontFamily: getFontFamily(),
          textAlign: getTextAlign(),
        },
      ]}
    >
      {props.children}
    </Text>
  );
}
