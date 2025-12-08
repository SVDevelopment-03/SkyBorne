"use client";
import DashboardBanner from "@/components/dashboard/user-dashboard/DashboardBanner";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import UserAvatar from "@/hooks/useAvatar";
import { Bell } from "lucide-react";
import { toTitleCase } from "@/utils/Titlecase";
import { Typography } from "@/components/ui/heading";

const Page = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const today = format(new Date(), "dd/MM/yyyy");

  const avatarName =
    user?.firstName[0] + (user?.lastName ? user?.lastName[0] : "");
  const fullName = toTitleCase(
    user?.firstName + " " + (user?.lastName ? user?.lastName : "")
  );

  return (
    <>
      <div className="px-7.5 py-6 bg-white sticky top-0 z-10 flex items-center justify-end">
        <div className="flex items-center gap-10 text-[#212C26]">
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
                title="Premium Member"
                cssClass="text-[#878787]! text-[16px]!"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-[30px] bg-[#FBFAF9] px-7.5 py-6">
        <div className="relative">
          <DashboardBanner
            badgeTitle={`Good Morning, ${user?.firstName}`}
            badgeDate={today}
            heading="This Feature Will Be Available Soon"
            description=""
            buttonText=""
            src="/images/dashboard-banner.jpg"
          />
        </div>
      </div>
    </>
  );
};

export default Page;
