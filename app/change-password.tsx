import { useAuth } from "@/src/contexts/AuthContext";
import ChangePasswordScreen from "@/src/features/settings/ChangePasswordScreen";
import { Redirect } from "expo-router";

export default function ChangePasswordPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <ChangePasswordScreen />;
}
