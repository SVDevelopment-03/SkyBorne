"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";
import useGetUser from "@/hooks/useGetUser";
import FullPageLoader from "@/components/ui/FullPageLoader";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const {user} = useGetUser();

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? getAccessToken()
      : null;      
    const nextParam =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next")
        : null;
    const safeNext =
      nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
        ? nextParam
        : null;

    // if (token && user?.onboardingCompleted) {

    if (token && user?.onboardingCompleted) {
      if (safeNext) {
        router.replace(safeNext);
        return;
      }

      if(user.role !== "admin"){
        router.replace("/dashboard");
      }else{
        router.replace("/admin-dashboard");
      }
    }
    // if(token && !user?.onboardingCompleted){
    //   router.replace("/signup?step=7");
    // }
     else {
        setTimeout(() => {
            setChecking(false);
        }, 0);
    }
  }, [router, user?.onboardingCompleted, user?.role]);

  if (checking) return <FullPageLoader label="Preparing login..." />; 

  return <>
  {
    children}</>;
}
