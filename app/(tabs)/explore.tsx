import Text from "@/components/Cext";
import ChildrenCards from "@/components/ChildrenCards";
import type { Payment } from "@/features/api/parent";
import { useGetCircuitDetailsQuery } from "@/features/api/parent";
import useAuth from "@/hooks/useAuth";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentsPage() {
  const { t, i18n } = useTranslation();
  const { top } = useSafeAreaInsets();
  const locale = i18n.language;
  const { user } = useAuth();
  const parentId = user?.user_id || "";
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const { data, isLoading } = useGetCircuitDetailsQuery(parentId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7A3588" />
      </View>
    );
  }

  if (!data || !data.childrens || data.childrens.length === 0) {
    return null;
  }

  const allPayments =
    data.childrens[selectedChildIndex]?.student.paymentDetails || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} ${t("payments.currency")}`;
  };

  const isLate = (payment: Payment) => {
    if (payment.status === "PAID") return false;
    const dueDate = new Date(payment.duetDate);
    const today = new Date();
    return today > dueDate;
  };

  const getNextPayment = () => {
    const unpaidPayments = allPayments
      .filter((p) => p.status === "INIT" && !isLate(p))
      .sort(
        (a, b) =>
          new Date(a.duetDate).getTime() - new Date(b.duetDate).getTime()
      );
    return unpaidPayments[0] || null;
  };

  const latePayments = allPayments.filter((p) => isLate(p));
  const paidPayments = allPayments
    .filter((p) => p.status === "PAID")
    .sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  const upcomingPayments = allPayments
    .filter((p) => p.status === "INIT" && !isLate(p))
    .sort(
      (a, b) => new Date(a.duetDate).getTime() - new Date(b.duetDate).getTime()
    );

  const nextPayment = getNextPayment();

  const totalPaid = paidPayments.reduce(
    (sum, payment) => sum + payment.monthAmount,
    0
  );
  const totalLate = latePayments.reduce(
    (sum, payment) => sum + payment.monthAmount,
    0
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          // flex: 1,
          width: "100%",
          position: "relative",
          backgroundColor: "#135b7f",
        }}
      >
        <Image
          source={require("@/assets/images/08.webp")}
          style={styles.bgImage}
        />
        <View
          style={{
            paddingTop: top + 15,
            paddingBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              ...styles.headerTitle,
              textAlign: locale === "ar" ? "right" : "left",
            }}
          >
            {t("payments.title")}
          </Text>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {data.childrens.length > 1 && (
          <ChildrenCards
            children={data?.childrens || []}
            selectedIndex={selectedChildIndex}
            onSelectChild={setSelectedChildIndex}
            showPaymentStatus={true}
            showCheckmark={true}
            color="#135b7f"
          />
        )}
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.paidCard]}>
            <CheckCircle2 size={24} color="#135b7f" strokeWidth={2.5} />
            <Text style={styles.summaryLabel}>{t("payments.totalPaid")}</Text>
            <Text style={[styles.summaryAmount, { color: "#135b7f" }]}>
              {formatAmount(totalPaid)}
            </Text>
          </View>

          {totalLate > 0 && (
            <View style={[styles.summaryCard, styles.lateCard]}>
              <AlertCircle size={24} color="#EF4444" strokeWidth={2.5} />
              <Text style={styles.summaryLabel}>{t("payments.totalLate")}</Text>
              <Text style={[styles.summaryAmount, { color: "#EF4444" }]}>
                {formatAmount(totalLate)}
              </Text>
            </View>
          )}
        </View>

        {/* Next Payment Alert */}
        {nextPayment && (
          <View style={styles.section}>
            <View
              style={{
                ...styles.sectionHeader,
                flexDirection: locale === "ar" ? "row-reverse" : "row",
              }}
            >
              <Calendar size={20} color="#0eaa00ff" strokeWidth={2.5} />
              <Text style={[styles.sectionTitle, { color: "#000000ff" }]}>
                {t("payments.nextPayment")}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.nextPaymentCard}
              onPress={() => {
                /* Handle payment action */
              }}
              activeOpacity={0.8}
            >
              <View style={styles.nextPaymentHeader}>
                <View style={styles.nextPaymentIcon}>
                  <Calendar size={24} color="#7A3588" strokeWidth={2.5} />
                </View>
                <View style={styles.nextPaymentInfo}>
                  <Text style={styles.nextPaymentCode}>
                    {nextPayment.paymentCode}
                  </Text>
                  <Text style={styles.nextPaymentDue}>
                    {t("payments.dueDate")}: {formatDate(nextPayment.duetDate)}
                  </Text>
                </View>
                <Text style={styles.nextPaymentAmount}>
                  {formatAmount(nextPayment.monthAmount)}
                </Text>
              </View>
              {nextPayment.details && (
                <Text style={styles.nextPaymentDetails}>
                  {nextPayment.details}
                </Text>
              )}
              {/* https://maderasati.ma/fr/agences */}
              <TouchableOpacity
                style={styles.payNowButton}
                onPress={() =>
                  Linking.openURL(`https://maderasati.ma/${locale}/agences`)
                }
              >
                <Text style={styles.payNowText}>{t("payments.payNow")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* Late Payments */}
        {latePayments.length > 0 && (
          <View style={styles.section}>
            <View
              style={{
                ...styles.sectionHeader,
                flexDirection: locale === "ar" ? "row-reverse" : "row",
              }}
            >
              <AlertCircle size={20} color="#EF4444" strokeWidth={2.5} />
              <Text style={[styles.sectionTitle, { color: "#EF4444" }]}>
                {t("payments.latePayments")} ({latePayments.length})
              </Text>
            </View>
            {latePayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                formatDate={formatDate}
                formatAmount={formatAmount}
                isLate={true}
                t={t}
              />
            ))}
          </View>
        )}

        {/* Upcoming Payments */}
        {upcomingPayments.length > 1 && (
          <View style={styles.section}>
            <View
              style={{
                ...styles.sectionHeader,
                flexDirection: locale === "ar" ? "row-reverse" : "row",
              }}
            >
              <Clock size={20} color="#F59E0B" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>
                {t("payments.upcomingPayments")} ({upcomingPayments.length - 1})
              </Text>
            </View>
            {upcomingPayments.slice(1).map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                formatDate={formatDate}
                formatAmount={formatAmount}
                isLate={false}
                t={t}
              />
            ))}
          </View>
        )}

        {/* Payment History */}
        <View style={styles.section}>
          <View
            style={{
              ...styles.sectionHeader,
              flexDirection: locale === "ar" ? "row-reverse" : "row",
            }}
          >
            <CheckCircle2 size={20} color="#135b7f" strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>
              {t("payments.paymentHistory")} ({paidPayments.length})
            </Text>
          </View>
          {paidPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              formatDate={formatDate}
              formatAmount={formatAmount}
              isPaid={true}
              t={t}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// Payment Card Component
interface PaymentCardProps {
  payment: Payment;
  formatDate: (date: string) => string;
  formatAmount: (amount: number) => string;
  isLate?: boolean;
  isPaid?: boolean;
  t: any;
}

function PaymentCard({
  payment,
  formatDate,
  formatAmount,
  isLate = false,
  isPaid = false,
  t,
}: PaymentCardProps) {
  const getStatusColor = () => {
    if (isPaid) return "#135b7f";
    if (isLate) return "#EF4444";
    return "#F59E0B";
  };

  const getStatusIcon = () => {
    if (isPaid)
      return <CheckCircle2 size={20} color="white" strokeWidth={2.5} />;
    if (isLate) return <XCircle size={20} color="white" strokeWidth={2.5} />;
    return <Clock size={20} color="white" strokeWidth={2.5} />;
  };

  const getStatusText = () => {
    if (isPaid) return t("payments.paid");
    if (isLate) return t("payments.late");
    return t("payments.pending");
  };

  return (
    <View style={[styles.paymentCard]}>
      <View style={styles.paymentCardHeader}>
        <View
          style={[
            styles.paymentCardIcon,
            { backgroundColor: getStatusColor() },
          ]}
        >
          {getStatusIcon()}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 14,
          }}
        >
          <View style={styles.paymentCardInfo}>
            <Text style={styles.paymentCardCode}>{payment.paymentCode}</Text>
            <View style={styles.paymentCardMeta}>
              <Text style={styles.paymentCardMetaText}>
                {isPaid
                  ? `${t("payments.paidOn")}: ${formatDate(
                      payment.paymentDate
                    )}`
                  : `${t("payments.dueDate")}: ${formatDate(payment.duetDate)}`}
              </Text>
            </View>
            {payment.details && (
              <Text style={styles.paymentCardDetails}>{payment.details}</Text>
            )}
          </View>
          <View style={styles.paymentCardRight}>
            <Text
              style={[styles.paymentCardAmount, { color: getStatusColor() }]}
            >
              {formatAmount(payment.monthAmount)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor()}15` },
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  bgImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.2,
    // borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: Platform.select({ ios: "800", android: "600" }),
    fontFamily: "MadaniArabic-Bold",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  paidCard: {
    borderTopWidth: 3,
    borderTopColor: "#135b7f",
  },
  lateCard: {
    borderTopWidth: 3,
    borderTopColor: "#EF4444",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: Platform.select({ ios: "800", android: "600" }),
    marginTop: 4,
    fontFamily: "MadaniArabic-Bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#1F2937",
  },
  nextPaymentCard: {
    backgroundColor: "#F8F4FF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#7A3588",
    shadowColor: "#7A3588",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nextPaymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  nextPaymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  nextPaymentInfo: {
    flex: 1,
  },
  nextPaymentCode: {
    fontSize: 15,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#1F2937",
    marginBottom: 2,
  },
  nextPaymentDue: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  nextPaymentAmount: {
    fontSize: 18,
    fontWeight: Platform.select({ ios: "800", android: "600" }),
    color: "#7A3588",
    fontFamily: "MadaniArabic-Bold",
  },
  nextPaymentDetails: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 12,
    lineHeight: 18,
  },
  payNowButton: {
    backgroundColor: "#7A3588",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  payNowText: {
    fontSize: 15,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "white",
  },
  paymentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  paymentCardHeader: {
    overflow: "hidden",
    position: "relative",
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
  },
  paymentCardIcon: {
    maxWidth: 40,
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentCardInfo: {
    flex: 1,
  },
  paymentCardCode: {
    fontSize: 14,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#1F2937",
    marginBottom: 4,
    textAlign: "left",
  },
  paymentCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paymentCardMetaText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  paymentCardDetails: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    fontStyle: "italic",
  },
  paymentCardRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  paymentCardAmount: {
    fontSize: 15,
    fontWeight: Platform.select({ ios: "800", android: "600" }),
    fontFamily: "MadaniArabic-Bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    width: "100%",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
