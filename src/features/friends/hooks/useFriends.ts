import {
  getFriendRequestsRequest,
  getFriendsRequest,
} from "@/src/services/friends/friends.api";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

/** Liste d'amis + demandes en attente, rafraîchies à chaque retour sur l'écran */
export function useFriends() {
  const friends = useQuery({
    queryKey: ["friends"],
    queryFn: getFriendsRequest,
  });

  const requests = useQuery({
    queryKey: ["friend-requests"],
    queryFn: getFriendRequestsRequest,
  });

  const { refetch: refetchFriends } = friends;
  const { refetch: refetchRequests } = requests;

  // Écran d'onglet caché, resté monté : sans ça on reverrait les listes du
  // premier affichage (même logique que useProfile)
  useFocusEffect(
    useCallback(() => {
      refetchFriends();
      refetchRequests();
    }, [refetchFriends, refetchRequests]),
  );

  const refetchAll = useCallback(
    () => Promise.all([refetchFriends(), refetchRequests()]),
    [refetchFriends, refetchRequests],
  );

  return { friends, requests, refetchAll };
}
