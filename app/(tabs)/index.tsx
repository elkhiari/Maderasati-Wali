import useAuth from "@/hooks/useAuth";
import { Button } from "@react-navigation/elements";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { user, handleLogout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {user?.username}!</Text>

      <Button onPress={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </View>
  );
}
