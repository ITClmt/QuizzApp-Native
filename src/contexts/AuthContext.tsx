import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ApiError,
  loginRequest,
  logoutRequest,
  refreshTokensRequest,
  registerRequest,
} from "../services/auth/api";

// --- Types ---

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// --- Helpers ---

function decodeJwtPayload(token: string): User {
  const base64Url = token.split(".")[1];

  // base64url → base64 standard (remplace les caractères spéciaux)
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  const jsonPayload = atob(base64);

  const { iat, exp, ...user } = JSON.parse(jsonPayload);

  return user as User;
}

/**
 * Vérifie si un JWT est expiré en comparant le champ `exp` à la date actuelle.
 */
function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64));

    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Stocke les tokens dans le SecureStore ET retourne le user décodé.
 */
async function saveTokensAndDecodeUser(
  accessToken: string,
  refreshToken: string,
): Promise<User> {
  await SecureStore.setItemAsync("access_token", accessToken);
  await SecureStore.setItemAsync("refresh_token", refreshToken);

  return decodeJwtPayload(accessToken);
}

// --- Context ---

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au lancement de l'app, on vérifie si un token existe déjà en mémoire.
  // Si oui, on restaure la session sans demander le mot de passe.
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await SecureStore.getItemAsync("access_token");

        if (!token) return;

        if (!isTokenExpired(token)) {
          setUser(decodeJwtPayload(token));
          return;
        }

        // Token expiré → on tente un refresh silencieux
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const newTokens = await refreshTokensRequest(refreshToken);
        const decoded = await saveTokensAndDecodeUser(
          newTokens.access_token,
          newTokens.refresh_token,
        );
        setUser(decoded);
      } catch {
        // Tout a échoué → nettoyage, l'user devra se reconnecter
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function signIn(email: string, password: string) {
    // loginRequest throw une ApiError si le backend répond 401
    const tokens = await loginRequest(email, password);
    const decoded = await saveTokensAndDecodeUser(
      tokens.access_token,
      tokens.refresh_token,
    );
    setUser(decoded);
  }

  async function signUp(email: string, password: string, username: string) {
    const tokens = await registerRequest(email, password, username);
    const decoded = await saveTokensAndDecodeUser(
      tokens.access_token,
      tokens.refresh_token,
    );
    setUser(decoded);
  }

  async function signOut() {
    try {
      // On appelle le backend pour révoquer le refresh token en BDD
      await logoutRequest();
    } catch {
      // Si le logout backend échoue (token déjà expiré, etc.),
      // on continue quand même le nettoyage local
    }

    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Re-export pour que les écrans puissent catch les erreurs API proprement
export { ApiError };
