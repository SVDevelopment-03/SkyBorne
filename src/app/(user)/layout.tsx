"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";
import useGetUser from "@/hooks/useGetUser";
import useFetchUser from "@/hooks/useFetchUser";
import Sidebar from "@/components/layout/sidebar";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: AuthLayoutProps) {
  useFetchUser();
  const router = useRouter();
  const { user } = useGetUser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    // if (!user?.onboardingCompleted) {
    if (!token) {
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    } else if (token && !user?.onboardingCompleted) {
      setTimeout(() => {
        router.replace("/signup?step=7");
      }, 0);
    } else {
      setTimeout(() => {
        setChecking(false);
      }, 0);
    }
  }, [router]);

  if (checking) return null;

  return (
    <div className="rounded-[30px] bg-[#FBFAF9] grid grid-cols-[260px_1fr] h-dvh">
      <Sidebar />
      <div className="flex flex-col gap-7.5 h-full overflow-y-auto">
        
        {children}</div>
    </div>
  );
}
