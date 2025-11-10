import Constants from "expo-constants";
import { LogLevel, OneSignal } from "react-native-onesignal";

export function initOneSignal() {
  const appId = Constants.expoConfig?.extra?.oneSignalAppId as string;
  if (!appId) return;

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(appId);
}
