const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Classe d'erreur custom pour distinguer les erreurs API des erreurs réseau
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// --- Helpers ---

/**
 * Wrapper autour de fetch qui :
 * 1. Vérifie que la réponse est OK (2xx)
 * 2. Parse le JSON
 * 3. Throw une ApiError lisible si le backend renvoie une erreur
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // Si le backend répond 204 No Content (ex: logout), pas de body à parser
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? "Unknown error");
  }

  return data as T;
}
