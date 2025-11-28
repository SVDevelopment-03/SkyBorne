"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
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
