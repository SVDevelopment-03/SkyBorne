"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";
import useGetUser from "@/hooks/useGetUser";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const {user} = useGetUser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    // if (!user?.onboardingCompleted) {
    if(!token){
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    } else {
      setTimeout(() => {
        setChecking(false);
      }, 0);
    }
  }, []);

  if (checking) return null;

  return <>{children}</>;
}
