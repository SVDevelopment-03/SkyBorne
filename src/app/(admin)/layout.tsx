"use client";
import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminSidebarDrawer from "@/components/layout/admin-sidebar-drawer";
import useFetchUser from "@/hooks/useFetchUser";
import useGetUser from "@/hooks/useGetUser";
import { getAccessToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Adminlayout = ({ children }: { children: React.ReactNode }) => {
     useFetchUser(); 
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
    }
    else if (token && user?.role != "admin"){
       setTimeout(() => {
        router.replace("/dashboard");
      }, 0);

    }
     else {
      setTimeout(() => {
        setChecking(false);
      }, 0);
    }
  }, [router]);

  if (checking) return null;

  return (
    <div className="rounded-[30px] bg-[#FBFAF9] grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-dvh">
      <div className="md:hidden">
        <AdminSidebarDrawer />
      </div>

      <div className="hidden md:flex">
        <AdminSidebar /> {/* Your original sidebar */}
      </div>
      <div className="h-dvh overflow-y-auto p-10">{children}</div>
    </div>
  );
};

export default Adminlayout;
