"use client";
import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminSidebarDrawer from "@/components/layout/admin-sidebar-drawer";
import TrainerSidebar from "@/components/layout/trainer-sidebar";
import TrainerSidebarDrawer from "@/components/layout/trainer-sidebar-drawer";
import { Typography } from "@/components/ui/heading";
import UserAvatar from "@/hooks/useAvatar";
import useFetchUser from "@/hooks/useFetchUser";
import useGetUser from "@/hooks/useGetUser";
import { getAccessToken } from "@/lib/token";
import { toTitleCase } from "@/utils/Titlecase";
import { format } from "date-fns/format";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FullPageLoader from "@/components/ui/FullPageLoader";

const Adminlayout = ({ children }: { children: React.ReactNode }) => {
  useFetchUser();
  const router = useRouter();
  const { user } = useGetUser();
  const [checking, setChecking] = useState(true);

  const today = format(new Date(), "dd/MM/yyyy");

  const avatarName = `${user?.firstName?.charAt(0) || "U"}${
    user?.lastName?.charAt(0) || ""
  }`;
  const fullName = toTitleCase(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"
  );

  useEffect(() => {
    const token = getAccessToken();

    // if (!user?.onboardingCompleted) {
    if (!token) {
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    } else if (token && user?.role != "trainer") {
      setTimeout(() => {
        router.replace("/dashboard");
      }, 0);
    } else {
      setTimeout(() => {
        setChecking(false);
      }, 0);
    }
  }, [router, user?.role]);

  if (checking) return <FullPageLoader label="Loading trainer workspace..." />;

  return (
    <div className="rounded-[30px] bg-[#FBFAF9] grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-dvh">
      <div className="lg:hidden">
        <TrainerSidebarDrawer />
      </div>

      <div className="hidden lg:flex">
        <TrainerSidebar /> {/* Your original sidebar */}
      </div>
      <div>
        <div className="px-7.5 py-6 bg-white sticky top-0 z-10 flex items-center justify-end">
          <div className="flex items-center justify-end gap-10 text-[#212C26]">
            <div className="relative">
              {/* <Bell className="h-8 w-8" /> */}
              {/* <div className="bg-[#E05252] absolute -top-1.5 -right-1 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] rounded-full h-5 w-5 px-1.5 py-0.5">
                        <h2 className="text-white  text-[12px] font-semibold font-inter!"  style={{ fontFamily: "Inter, sans-serif" }}>3</h2>
                      </div> */}
            </div>
            <div className="flex items-center gap-2">
              <UserAvatar name={avatarName} />
              <div>
                <Typography title={fullName} cssClass="text-[#212C26]!" />
                <Typography
                  title="Trainer"
                  cssClass="text-[#878787]! text-[16px]!"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-dvh overflow-y-auto [scrollbar-width:none] py-10 px-4 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Adminlayout;
