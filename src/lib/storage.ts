"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { encrypt, decrypt } from "./crypto"; // adjust import path

export const storage = {
  set(key: string, value: any) {
    try {
      const encrypted = encrypt(value);
      if (encrypted) localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  get(key: string) {
    try {
      const encrypted = localStorage.getItem(key);

      if (!encrypted) return null;

      return decrypt(encrypted);
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
