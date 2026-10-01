import { useAuth } from "@/src/contexts/AuthContext";
import FriendsScreen from "@/src/features/friends/screens/FriendsScreen";
import { Redirect } from "expo-router";

export default function FriendsPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <FriendsScreen />;
}
