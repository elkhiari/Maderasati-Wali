import Text from "@/components/Cext";
import { useMobileLoginMutation } from "@/features/api/auth";
import useAuth from "@/hooks/useAuth";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CircleAlert, Eye, EyeOff, Lock, User } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

export default function Login() {
  const [login, { isLoading }] = useMobileLoginMutation();
  const { handleIsAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      showMessage({
        message: t("warn"),
        description: t("login.fillAllFields"),
        type: "warning",
        icon: () => (
          <CircleAlert
            color="white"
            size={30}
            stroke={"white"}
            strokeWidth={3}
          />
        ),
      });
      return;
    }

    try {
      const response = await login({
        username,
        password,
      }).unwrap();
      handleIsAuthenticated(response);
    } catch (error) {
      showMessage({
        message: t("error"),
        description: t("login.invalidCredentials"),
        type: "danger",
        icon: () => (
          <CircleAlert
            color="white"
            size={30}
            stroke={"white"}
            strokeWidth={3}
          />
        ),
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/onBoarding.webp")}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Image
            source={require("@/assets/images/logo.webp")}
            style={styles.logo}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeHeader}>{t("login.welcome")}</Text>
            <Text style={styles.subtitle}>{t("login.signInToContinue")}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{t("login.title")}</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color="#7A3588" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t("login.username")}
                placeholderTextColor="#95a5a6"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#7A3588" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t("login.password")}
                placeholderTextColor="#95a5a6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#95a5a6" />
                ) : (
                  <Eye size={20} color="#95a5a6" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              {t("login.forgotPassword")}
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>{t("login.signIn")}</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>{t("login.dontHaveAccount")} </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)")}>
              <Text style={styles.signUpLink}>{t("login.signUp")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7A3588",
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    position: "relative",
    height: "45%",
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: 16,
    resizeMode: "contain",
    tintColor: "white",
  },
  headerTextContainer: {
    alignItems: "center",
  },
  welcomeHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#E0E0E0",
    textAlign: "center",
  },
  contentContainer: {
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 32,
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    color: "#2c3e50",
    marginBottom: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    paddingVertical: 12,
    fontFamily: "MadaniArabic-Regular",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#7A3588",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#135B7F",
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  signUpText: {
    color: "#7f8c8d",
    fontSize: 15,
  },
  signUpLink: {
    color: "#7A3588",
    fontSize: 15,
    fontWeight: "600",
  },
});
