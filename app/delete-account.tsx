import { useAuth } from "@/src/contexts/AuthContext";
import DeleteAccountScreen from "@/src/features/settings/DeleteAccountScreen";
import { Redirect } from "expo-router";

export default function DeleteAccountPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <DeleteAccountScreen />;
}
