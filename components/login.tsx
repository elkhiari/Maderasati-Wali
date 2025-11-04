import { useMobileLoginMutation } from "@/features/api/auth";
import { Button } from "@react-navigation/elements";
import { Text, View } from "react-native";

export default function Login() {
  const [login, { isLoading, isError }] = useMobileLoginMutation();

  const handleLogin = async () => {
    try {
      const response = await login({
        username: "AD108565",
        password: "AD108565",
      }).unwrap();
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Component</Text>
      <Button
        onPress={handleLogin}
        style={{ marginTop: 20, width: 200, padding: 10 }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </View>
  );
}
