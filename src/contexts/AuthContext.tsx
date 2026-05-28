import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { ApiError } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { Storage } from "../lib/storage";
import {
  loginRequest,
  logoutRequest,
  refreshTokensRequest,
  registerRequest,
} from "../services/auth/auth.api";
import type { User } from "@/src/types";

// --- Types ---

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    lang?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

// --- Helpers ---

function decodeJwtPayload(token: string): User {
  const { iat, exp, ...user } = jwtDecode<User & { iat: number; exp: number }>(token);
  return user;
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

async function saveTokensAndDecodeUser(
  accessToken: string,
  refreshToken: string,
): Promise<User> {
  await Storage.setItemAsync("access_token", accessToken);
  await Storage.setItemAsync("refresh_token", refreshToken);
  return decodeJwtPayload(accessToken);
}

// --- Context ---

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await Storage.getItemAsync("access_token");

        if (!token) return;

        if (!isTokenExpired(token)) {
          setUser(decodeJwtPayload(token));
          return;
        }

        const refreshToken = await Storage.getItemAsync("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const newTokens = await refreshTokensRequest(refreshToken);
        const decoded = await saveTokensAndDecodeUser(
          newTokens.access_token,
          newTokens.refresh_token,
        );
        setUser(decoded);
      } catch {
        await Storage.deleteItemAsync("access_token");
        await Storage.deleteItemAsync("refresh_token");
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function signIn(email: string, password: string) {
    const tokens = await loginRequest(email, password);
    const decoded = await saveTokensAndDecodeUser(
      tokens.access_token,
      tokens.refresh_token,
    );
    setUser(decoded);
  }

  async function signUp(
    email: string,
    password: string,
    username: string,
    lang: string = "en",
  ) {
    const tokens = await registerRequest(email, password, username, lang);
    const decoded = await saveTokensAndDecodeUser(
      tokens.access_token,
      tokens.refresh_token,
    );
    setUser(decoded);
  }

  async function signOut() {
    try {
      await logoutRequest();
    } catch {
      // Backend logout failure (token already expired, etc.) is non-fatal
    }

    await Storage.deleteItemAsync("access_token");
    await Storage.deleteItemAsync("refresh_token");
    queryClient.clear();
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

export { ApiError };
