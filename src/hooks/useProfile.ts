import { getProfileRequest } from "@/src/services/auth/auth.api";
import { useAuth } from "@/src/contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export function useProfile() {
  const { user } = useAuth();

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileRequest,
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
