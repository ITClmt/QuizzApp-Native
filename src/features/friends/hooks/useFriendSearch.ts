import { searchUsersRequest } from "@/src/services/friends/friends.api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

/**
 * Recherche de joueurs par pseudo, déclenchée 300 ms après la dernière frappe
 * (la route est limitée à 30 req/min côté serveur).
 */
export function useFriendSearch(query: string) {
  const [debounced, setDebounced] = useState(query.trim());

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  const enabled = debounced.length >= MIN_SEARCH_LENGTH;

  const search = useQuery({
    queryKey: ["friend-search", debounced],
    queryFn: () => searchUsersRequest(debounced),
    enabled,
    staleTime: 0,
  });

  return {
    results: enabled ? (search.data ?? []) : [],
    // Vrai aussi pendant le debounce, pour ne pas afficher "aucun résultat" trop tôt
    isSearching: search.isFetching || query.trim() !== debounced,
    isError: search.isError,
    refetch: search.refetch,
  };
}
