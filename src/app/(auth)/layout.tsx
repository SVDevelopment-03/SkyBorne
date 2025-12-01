"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";
import { storage } from "@/lib/storage";
import useGetUser from "@/hooks/useGetUser";
import { log } from "node:console";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const {user} = useGetUser();
  console.log("user", user);
  

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? getAccessToken()
      : null;

      console.log("token",getAccessToken());
      

    // if (token && user?.onboardingCompleted) {

    if (token) {
      router.replace("/dashboard");
    } else {
        setTimeout(() => {
            setChecking(false);
        }, 0);
    }
  }, [router]);

  if (checking) return null; 

  return <>
  {
    children}</>;
}
