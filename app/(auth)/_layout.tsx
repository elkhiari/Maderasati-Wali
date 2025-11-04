import useAuth from "@/hooks/useAuth";
import { Stack } from "expo-router";
import { Protected } from "expo-router/build/views/Protected";

export default function Layout() {
  const { hasOnboarded } = useAuth();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Protected guard={!hasOnboarded}>
        <Stack.Screen name="index" />
      </Protected>
      <Stack.Screen name="login" />
    </Stack>
  );
}
