import { useAuth } from "@/src/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function MultiLayout() {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, title: "" }}>
      <Stack.Screen name="create" />
      {/* Le retour système passe par la confirmation de sortie du salon */}
      <Stack.Screen name="lobby/[gameId]" options={{ gestureEnabled: false }} />
      {/* Idem en partie : quitter vaut abandon, on confirme d'abord */}
      <Stack.Screen name="game/[gameId]" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
