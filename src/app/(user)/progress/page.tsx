"use client";
import DashboardBanner from "@/components/dashboard/user-dashboard/DashboardBanner";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const Page = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const today = format(new Date(), "dd/MM/yyyy");

  return (
    <>
     
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
