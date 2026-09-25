import { getMyProfileRequest } from "@/src/services/users/users.api";
import { useAuth } from "@/src/contexts/AuthContext";
import { useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export function useProfile() {
  const { user } = useAuth();

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfileRequest,
    enabled: !!user?.sub,
    refetchOnWindowFocus: false,
  });

  // Écrans d'onglets restant montés (voir ProfileScreen) : on force le
  // rafraîchissement à chaque retour sur un écran qui utilise ce hook.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return profile;
}
