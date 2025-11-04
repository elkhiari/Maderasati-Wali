import {
  LoginResponse,
  logout,
  selectCurrentToken,
  selectCurrentUser,
  selectHasOnboarded,
  selectIsAuthenticated,
  setCredentials,
} from "@/features/slices/userSlice";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";

export default function useAuth() {
  const { t } = useTranslation();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasOnboarded = useSelector(selectHasOnboarded);
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleIsAuthenticated = (user: LoginResponse) => {
    dispatch(setCredentials(user));
    router.replace("/(tabs)");
    showMessage({
      message: t("success"),
      description: t("login.successMessage", { name: user.username }),
      type: "success",
    });
  };

  return {
    user,
    isAuthenticated,
    token,
    handleLogout,
    handleIsAuthenticated,
    hasOnboarded,
  };
}
