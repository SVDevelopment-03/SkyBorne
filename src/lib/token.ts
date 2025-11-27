export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN as string);
};
export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN as string);
};

export const setAccessToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN as string, token);
};

export const setRefreshToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN as string, token);
};

export const removeTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN as string);
  localStorage.removeItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN as string);
   localStorage.removeItem(process.env.NEXT_PUBLIC_USER as string);
};
