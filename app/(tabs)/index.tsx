import useAuth from "@/hooks/useAuth";
import { useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet, View } from "react-native";

import ChildrenCards from "@/components/ChildrenCards";
import HomeHeader, { HEADER_MAX_HEIGHT } from "@/components/Header";
import NextBusAlert from "@/components/NextBusAlert";
import { useGetCircuitDetailsQuery } from "@/features/api/parent";
import { router } from "expo-router";

export default function HomePage() {
  const { user } = useAuth();
  const parentId = user?.user_id || "";
  const { data, isLoading } = useGetCircuitDetailsQuery(parentId);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (isLoading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <HomeHeader
        parentName={data?.parent.fullName || ""}
        parentNameArab={data?.parent.fullNameArab}
        notificationCount={5}
        onNotificationPress={() => router.push("/(auth)/login")}
        onSettingsPress={() => router.push("/")}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        style={styles.scrollView}
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
        <NextBusAlert
          arrivalTime={
            data?.childrens[selectedChildIndex].student.arrivalStart || ""
          }
          stationName={
            data?.childrens[selectedChildIndex].circuit.endStation || ""
          }
          driverName={"Othmane ELKHIARI"}
          vehiclePlate={"1234-AB-56"}
          onTrackPress={() => router.push("/")}
        />
        <View style={{ height: 1000 }} />
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
    padding: 16,
  },
});
