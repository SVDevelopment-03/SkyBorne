"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";
import useGetUser from "@/hooks/useGetUser";
import useFetchUser from "@/hooks/useFetchUser";
import Sidebar from "@/components/layout/sidebar";
import UserAvatar from "@/hooks/useAvatar";
import { Typography } from "@/components/ui/heading";
import { toTitleCase } from "@/utils/Titlecase";
import SidebarDrawer from "@/components/layout/sidebar-drawer";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: AuthLayoutProps) {
  useFetchUser();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useGetUser();
  const [checking, setChecking] = useState(true);
  const avatarName =
    user?.firstName[0] + (user?.lastName ? user?.lastName[0] : "");
  const fullName = toTitleCase(
    user?.firstName + " " + (user?.lastName ? user?.lastName : "")
  );

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
    <div className="rounded-[30px] bg-[#FBFAF9] grid grid-cols-1 lg:grid-cols-[260px_1fr] h-dvh overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex lg:hidden">
        <SidebarDrawer /> 
      </div>
      <div className="flex flex-col min-h-dvh">
        {pathname !== "/dashboard" && (
          <div className="px-7.5 py-6 bg-white sticky top-0 z-10 flex items-center justify-end">
            <div className="flex items-center gap-10 text-[#212C26]">
              <div className="flex items-center gap-2">
                <UserAvatar name={avatarName} />
                <div>
                  <Typography title={fullName} cssClass="text-[#212C26]!" />
                  <Typography
                    title="Premium Member"
                    cssClass="text-[#878787]! text-[16px]!"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-7.5 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

{
  /* <Bell className="h-8 w-8" /> */
}
{
  /* <div className="bg-[#E05252] absolute -top-1.5 -right-1 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] rounded-full h-5 w-5 px-1.5 py-0.5">
                <h2 className="text-white  text-[12px] font-semibold font-inter!"  style={{ fontFamily: "Inter, sans-serif" }}>3</h2>
              </div> */
}
