"use client";
import { useRouter } from "next/navigation";

const useRedirectUser = () => {
  const router = useRouter();
  const redirectUser = (path: string) => {
    router.push(path);
  };
  return { redirectUser };
};

export default useRedirectUser;
