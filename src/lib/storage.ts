"use client";
import { encrypt, decrypt } from "./crypto"; // adjust import path

export const storage = {
  set<T>(key: string, value: T) {
    try {
      const encrypted = encrypt(value);
      if (encrypted) localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  get<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);

      if (!encrypted) return null;

      return decrypt<T>(encrypted);
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  },

  exists(key: string) {
    return localStorage.getItem(key) !== null;
  },
};
