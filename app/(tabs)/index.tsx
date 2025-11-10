import useAuth from "@/hooks/useAuth";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import ChildrenCards from "@/components/ChildrenCards";
import HomeHeader, { HEADER_MAX_HEIGHT } from "@/components/Header";
import NextBusAlert from "@/components/NextBusAlert";
import RecentPayments from "@/components/RecentPayments";
import SectionTitle from "@/components/SectionTitle";
import { useGetCircuitDetailsQuery } from "@/features/api/parent";
import { router } from "expo-router";
import { CreditCard, MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  const { user, handleLogout } = useAuth();
  const parentId = user?.user_id || "";
  const { data, isLoading, refetch, isFetching } =
    useGetCircuitDetailsQuery(parentId);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (isLoading) return <ActivityIndicator />;

  if (!data) return null;

  return (
    <View style={styles.container}>
      <HomeHeader
        parentName={data?.parent.fullName || ""}
        parentNameArab={data?.parent.fullNameArab}
        notificationCount={5}
        onNotificationPress={() => router.push("/notifications")}
        onSettingsPress={() => handleLogout()}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="gray"
            progressViewOffset={HEADER_MAX_HEIGHT}
          />
        }
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <ChildrenCards
          children={data?.childrens || []}
          selectedIndex={selectedChildIndex}
          onSelectChild={setSelectedChildIndex}
          showPaymentStatus={true}
          showCheckmark={true}
        />

        <View style={{ paddingHorizontal: 16 }}>
          <SectionTitle
            title={t("home.nextBus", "Next Bus")}
            icon={<MapPin size={18} color="#7A3588" strokeWidth={2.5} />}
          />

          <NextBusAlert
            arrivalTime={
              data?.childrens[selectedChildIndex]?.student?.arrivalStart || ""
            }
            stationName={
              data?.childrens[selectedChildIndex]?.circuit?.endStation || ""
            }
            driverName={"Othmane ELKHIARI"}
            vehiclePlate={"1234-AB-56"}
            onTrackPress={() => router.push("/")}
          />

          <SectionTitle
            title={t("home.recentPayments", "Recent Payments")}
            subtitle={t("home.lastTwoPayments", "Last 2 paid transactions")}
            icon={<CreditCard size={18} color="#135b7f" strokeWidth={2.5} />}
          />
          <RecentPayments
            payments={
              data?.childrens[selectedChildIndex]?.student.paymentDetails || []
            }
          />
        </View>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT + 16,
  },
});
