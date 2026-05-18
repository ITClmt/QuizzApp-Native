import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const Storage = {
  getItemAsync: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return SecureStore.getItemAsync(key);
  },
  setItemAsync: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(key, value);
      } catch {
        console.warn("localStorage is not available");
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  deleteItemAsync: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(key);
      } catch {
        console.warn("localStorage is not available");
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
