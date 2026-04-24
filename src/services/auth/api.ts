import SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

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
async function apiFetch<T>(
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
    throw new ApiError(response.status, data.message ?? "Erreur inconnue");
  }

  return data as T;
}

// --- Endpoints ---

export function loginRequest(email: string, password: string) {
  return apiFetch<AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerRequest(
  email: string,
  password: string,
  username: string,
) {
  return apiFetch<AuthTokens>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });
}

export function refreshTokensRequest(refreshToken: string) {
  return apiFetch<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutRequest() {
  const refreshToken = await SecureStore.getItemAsync("refresh_token");
  if (!refreshToken) return;

  return apiFetch<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
