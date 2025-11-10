import Text from "@/components/Cext";
import { router } from "expo-router";
import {
  AlertCircle,
  Bell,
  BellOff,
  Bus,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Info,
} from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export type NotificationType = "payment" | "bus" | "info" | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  timestamp: string;
  read: boolean;
}

// Mock data - replace with your API call
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Late Payment Alert",
    titleAr: "تنبيه تأخر الدفع",
    description:
      "Payment for October 2024 is overdue. Please pay as soon as possible to avoid service interruption.",
    descriptionAr:
      "الدفع لشهر أكتوبر 2024 متأخر. يرجى الدفع في أقرب وقت لتجنب انقطاع الخدمة.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "bus",
    title: "Bus Delay Notice",
    titleAr: "إشعار تأخير الحافلة",
    description:
      "Your child's bus will be delayed by 15 minutes due to traffic. Expected arrival: 8:15 AM.",
    descriptionAr:
      "سيتم تأخير حافلة طفلك لمدة 15 دقيقة بسبب حركة المرور. وقت الوصول المتوقع: 8:15 صباحًا.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Confirmed",
    titleAr: "تم تأكيد الدفع",
    description:
      "Your payment of 500.00 MAD for November 2024 has been successfully processed.",
    descriptionAr: "تمت معالجة دفعتك بمبلغ 500.00 درهم لشهر نوفمبر 2024 بنجاح.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Schedule Update",
    titleAr: "تحديث الجدول",
    description:
      "Bus schedule has been updated for the winter season. Please check the new timings.",
    descriptionAr:
      "تم تحديث جدول الحافلات لموسم الشتاء. يرجى التحقق من المواعيد الجديدة.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "5",
    type: "payment",
    title: "Upcoming Payment Due",
    titleAr: "موعد الدفع القادم",
    description:
      "Your payment for December 2024 is due in 5 days. Amount: 500.00 MAD.",
    descriptionAr:
      "موعد الدفع الخاص بك لشهر ديسمبر 2024 سيكون خلال 5 أيام. المبلغ: 500.00 درهم.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "6",
    type: "bus",
    title: "Bus Route Change",
    titleAr: "تغيير مسار الحافلة",
    description:
      "Temporary route change due to road construction. New pickup time: 7:45 AM.",
    descriptionAr:
      "تغيير مؤقت في المسار بسبب أعمال الطريق. وقت الالتقاط الجديد: 7:45 صباحًا.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t("notifications.justNow");
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t("notifications.minutesAgo", { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t("notifications.hoursAgo", { count: hours });
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return t("notifications.daysAgo", { count: days });
    } else {
      return date.toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", {
        day: "numeric",
        month: "short",
        year: diffInSeconds < 31536000 ? undefined : "numeric",
      });
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "payment":
        return <CreditCard size={20} color="#10B981" strokeWidth={2.5} />;
      case "bus":
        return <Bus size={20} color="#7A3588" strokeWidth={2.5} />;
      case "alert":
        return <AlertCircle size={20} color="#EF4444" strokeWidth={2.5} />;
      case "info":
        return <Info size={20} color="#3B82F6" strokeWidth={2.5} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "payment":
        return "#10B981";
      case "bus":
        return "#7A3588";
      case "alert":
        return "#EF4444";
      case "info":
        return "#3B82F6";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t("notifications.title")}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={markAllAsRead}
          style={styles.markAllButton}
          disabled={unreadCount === 0}
        >
          <CheckCircle2
            size={22}
            color={unreadCount > 0 ? "#7A3588" : "#D1D5DB"}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          onPress={() => setFilter("all")}
        >
          <Bell
            size={18}
            color={filter === "all" ? "#7A3588" : "#6B7280"}
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.filterTabText,
              filter === "all" && styles.filterTabTextActive,
            ]}
          >
            {t("notifications.all")} ({notifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "unread" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("unread")}
        >
          <BellOff
            size={18}
            color={filter === "unread" ? "#7A3588" : "#6B7280"}
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.filterTabText,
              filter === "unread" && styles.filterTabTextActive,
            ]}
          >
            {t("notifications.unread")} ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={64} color="#D1D5DB" strokeWidth={1.5} />
            <Text style={styles.emptyStateText}>
              {filter === "unread"
                ? t("notifications.noUnread")
                : t("notifications.noNotifications")}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              formatTimestamp={formatTimestamp}
              getNotificationIcon={getNotificationIcon}
              getNotificationColor={getNotificationColor}
              onPress={() => markAsRead(notification.id)}
              onDelete={() => deleteNotification(notification.id)}
              locale={locale}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// Notification Card Component
interface NotificationCardProps {
  notification: Notification;
  formatTimestamp: (timestamp: string) => string;
  getNotificationIcon: (type: NotificationType) => React.ReactNode;
  getNotificationColor: (type: NotificationType) => string;
  onPress: () => void;
  onDelete: () => void;
  locale: string;
}

function NotificationCard({
  notification,
  formatTimestamp,
  getNotificationIcon,
  getNotificationColor,
  onPress,
  onDelete,
  locale,
}: NotificationCardProps) {
  const { t } = useTranslation();
  const title = locale === "ar" ? notification.titleAr : notification.title;
  const description =
    locale === "ar" ? notification.descriptionAr : notification.description;

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.read && styles.notificationCardUnread,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          ...styles.notificationContent,
          flexDirection: locale === "ar" ? "row-reverse" : "row",
        }}
      >
        {/* Icon */}
        <View
          style={[
            styles.notificationIcon,
            {
              backgroundColor: `${getNotificationColor(notification.type)}15`,
            },
          ]}
        >
          {getNotificationIcon(notification.type)}
        </View>

        {/* Content */}
        <View style={styles.notificationTextContainer}>
          <View
            style={[
              styles.notificationHeader,
              { flexDirection: locale === "ar" ? "row-reverse" : "row" },
            ]}
          >
            <Text style={[styles.notificationTitle]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTimestamp(notification.timestamp)}
            </Text>
          </View>

          <Text style={[styles.notificationDescription]} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>

      {/* Bottom Border for Type */}
      <View
        style={[
          styles.typeBorder,
          { backgroundColor: getNotificationColor(notification.type) },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: Platform.select({ ios: "800", android: "600" }),
    color: "#1F2937",
    fontFamily: "MadaniArabic-Bold",
  },
  unreadBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  markAllButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  filterTabActive: {
    backgroundColor: "#F3E8FF",
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterTabTextActive: {
    color: "#7A3588",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationCardUnread: {
    backgroundColor: "#FEFEFE",
    shadowColor: "#7A3588",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    zIndex: 1,
  },
  notificationContent: {
    flexDirection: "row",
    padding: 14,
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationTextContainer: {
    flex: 1,
    gap: 6,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
    color: "#1F2937",
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  notificationDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  deleteButton: {
    padding: 4,
    alignSelf: "flex-start",
  },
  typeBorder: {
    height: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
