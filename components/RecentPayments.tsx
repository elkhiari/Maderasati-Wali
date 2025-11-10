import Text from "@/components/Cext";
import type { Payment } from "@/features/api/parent";
import { CheckCircle2, Clock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

interface RecentPaymentsProps {
  payments: Payment[];
}

export default function RecentPayments({ payments }: RecentPaymentsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  // Get last 2 PAID payments
  const paidPayments = payments
    .filter((payment) => payment.status === "PAID")
    .sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    )
    .slice(0, 2);

  if (paidPayments.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} ${t("payments.currency", "MAD")}`;
  };

  return (
    <View style={styles.container}>
      {paidPayments.map((payment) => (
        <View key={payment.id} style={styles.paymentCard}>
          {/* Status Icon */}
          <View style={styles.iconContainer}>
            <CheckCircle2 size={24} color="#135b7f" strokeWidth={2.5} />
          </View>

          {/* Payment Info */}
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentCode} numberOfLines={1}>
              {payment.paymentCode}
            </Text>
            <View style={styles.dateRow}>
              <Clock size={14} color="#7F8C8D" strokeWidth={2} />
              <Text style={styles.dateText}>
                {formatDate(payment.paymentDate)}
              </Text>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
              {formatAmount(payment.monthAmount)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 12,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#135b7f",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentInfo: {
    flex: 1,
    gap: 4,
  },
  paymentCode: {
    fontSize: 15,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#2C3E50",
    textAlign: "left",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: Platform.select({ ios: "800", android: "600" }),
    color: "#135b7f",
    fontFamily: "MadaniArabic-Bold",
  },
});
