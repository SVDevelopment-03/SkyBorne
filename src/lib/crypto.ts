/* eslint-disable @typescript-eslint/no-explicit-any */

import CryptoJS from "crypto-js";

// Using NEXT_PUBLIC_ key (accessible in browser)
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as string;

export const encrypt = (data: any) => {
  if (!SECRET_KEY) {
    console.error("SECRET_KEY is missing");
    return "";
  }

  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (cipherText: string) => {
  try {
    if (!SECRET_KEY) return null;

    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted ? JSON.parse(decrypted) : null;
  } catch (e) {
    return null;
  }
};
