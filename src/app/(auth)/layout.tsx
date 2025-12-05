"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";
import useGetUser from "@/hooks/useGetUser";

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
    // if (token && user?.onboardingCompleted) {

    if (token && user?.onboardingCompleted) {
      router.replace("/dashboard");
    }
    // if(token && !user?.onboardingCompleted){
    //   router.replace("/signup?step=7");
    // }
     else {
        setTimeout(() => {
            setChecking(false);
        }, 0);
    }
  }, [router,user?.onboardingCompleted]);

  if (checking) return null; 

  return <>
  {
    children}</>;
}
