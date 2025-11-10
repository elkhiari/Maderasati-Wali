import Text from "@/components/Cext";
import { useMobileLoginMutation } from "@/features/api/auth";
import useAuth from "@/hooks/useAuth";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import {
  CircleAlert,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  ScanFace,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import * as LocalAuthentication from "expo-local-authentication";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type BiometricType = "face" | "fingerprint" | "iris" | null;

export default function Login() {
  const [login, { isLoading }] = useMobileLoginMutation();
  const { handleIsAuthenticated, hasOnboarded, getCredentials } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [usePasswordMode, setUsePasswordMode] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    if (hasOnboarded) {
      loadSavedCredentials();
    }
  }, [hasOnboarded]);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        setIsBiometricAvailable(true);

        // Determine biometric type
        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType("face");
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType("fingerprint");
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.IRIS)
        ) {
          setBiometricType("iris");
        }
      }
    } catch (error) {
      console.error("Biometric check error:", error);
    }
  };

  const loadSavedCredentials = async () => {
    try {
      const credentials = await getCredentials();
      if (credentials?.username) {
        setUsername(credentials.username);
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("login.biometricPrompt"),
        fallbackLabel: t("login.usePassword"),
        cancelLabel: t("cancel"),
      });

      if (result.success) {
        const credentials = await getCredentials();

        if (credentials?.username && credentials?.password) {
          try {
            const response = await login({
              username: credentials.username,
              password: credentials.password,
            }).unwrap();
            handleIsAuthenticated(response, credentials);
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
        } else {
          showMessage({
            message: t("error"),
            description: t("login.noSavedCredentials"),
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
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      showMessage({
        message: t("error"),
        description: t("login.biometricFailed"),
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

  const getBiometricIcon = () => {
    switch (biometricType) {
      case "face":
        return <ScanFace color="white" size={24} />;
      case "fingerprint":
        return <Fingerprint size={24} color="white" />;
      case "iris":
        return "👁️";
      default:
        return <Fingerprint size={24} color="white" />;
    }
  };

  const getBiometricLabel = () => {
    switch (biometricType) {
      case "face":
        return t("login.useFaceId");
      case "fingerprint":
        return t("login.useFingerprint");
      case "iris":
        return t("login.useIris");
      default:
        return t("login.useBiometric");
    }
  };

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
      handleIsAuthenticated(response, { username, password });
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
    <KeyboardAwareScrollView
      bottomOffset={62}
      contentContainerStyle={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
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
                  editable={!isLoading && (!hasOnboarded || usePasswordMode)}
                />
              </View>
            </View>

            {/* Password Input - Show if not onboarded OR user wants to use password mode */}
            {(!hasOnboarded || usePasswordMode) && (
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
            )}

            {/* Forgot Password */}
            {(!hasOnboarded || usePasswordMode) && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  {t("login.forgotPassword")}
                </Text>
              </TouchableOpacity>
            )}

            {/* Biometric Login Button - Show if user has onboarded and not in password mode */}
            {hasOnboarded && isBiometricAvailable && !usePasswordMode && (
              <TouchableOpacity
                style={[
                  styles.biometricButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleBiometricLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={styles.biometricButtonContent}>
                    {typeof getBiometricIcon() === "string" ? (
                      <Text style={styles.biometricEmoji}>
                        {getBiometricIcon()}
                      </Text>
                    ) : (
                      getBiometricIcon()
                    )}
                    <Text style={styles.biometricButtonText}>
                      {getBiometricLabel()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            {/* Regular Login Button - Show if not onboarded OR in password mode */}
            {(!hasOnboarded || usePasswordMode) && (
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
                  <Text style={styles.loginButtonText}>
                    {t("login.signIn")}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {/* Toggle between biometric and password for onboarded users */}
            {hasOnboarded && isBiometricAvailable && (
              <TouchableOpacity
                style={styles.alternativeLoginButton}
                onPress={() => setUsePasswordMode(!usePasswordMode)}
              >
                <Text style={styles.alternativeLoginText}>
                  {usePasswordMode
                    ? getBiometricLabel()
                    : t("login.usePassword")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              Version {process.env.EXPO_PUBLIC_VERSION}
            </Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7A3588",
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: "relative",
    height: 400,
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
    fontWeight: Platform.select({ ios: "700", android: "600" }),
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
    marginTop: -30,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    color: "#2c3e50",
    marginBottom: 32,
    fontWeight: Platform.select({ ios: "700", android: "600" }),
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
  biometricButton: {
    backgroundColor: "#7A3588",
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
    marginBottom: 16,
  },
  biometricButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  biometricEmoji: {
    fontSize: 24,
  },
  biometricButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  alternativeLoginButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  alternativeLoginText: {
    color: "#7A3588",
    fontSize: 14,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  versionText: {
    fontSize: 12,
    color: "#95a5a6",
  },
});
