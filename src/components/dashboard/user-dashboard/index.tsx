/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Sidebar from "@/components/layout/sidebar";
import { useEffect, useState } from "react";
import DashboardBanner from "./DashboardBanner";
import { Typography } from "@/components/ui/heading";
import {
  CalenderIcon,
  CreditsIcon,
  GoalIcon,
  PlanIcon,
} from "@/icons/dashboardIcon";
import DashboardTitle from "./DashboardTitle";
import SessionCard from "./SessionCard";
import ColumnGraph from "@/components/ui/charts/ColumnChart";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { columns, UserData } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input2 } from "@/components/ui/input";
import {
  useGetAllMeetingsQuery,
  useGetUpcomingMeetingsQuery,
} from "@/store/api/meetingApi";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toTitleCase } from "@/utils/Titlecase";
import UserAvatar from "@/hooks/useAvatar";
import { getUserRegion } from "@/utils/timezone";
import { useGetDashboardStatsQuery } from "@/store/api/authApi";
import { SearchIcon } from "@/icons/helpIcon";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const getCreditsChartOptions = (
  totalCredits: number,
  usedCredits: number
): ApexOptions => {
  // Calculate remaining credits
  const remainingCredits = Math.max(0, totalCredits - usedCredits);
  console.log("credits", totalCredits, usedCredits, remainingCredits);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 450,
    },
    series: [usedCredits, remainingCredits, totalCredits],

    labels: ["Used Credits", "Remaining Credits", "Total Credits"],

    colors: ["#FBEFD8", "#494949", "#B95E82"],
    states: {
      hover: { filter: { type: "darke" } },
      active: { filter: { type: "none" } },
    },
    stroke: { width: 0 },

    tooltip: {
      enabled: false,
    },

    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: false },
            total: {
              show: true,
              showAlways: true,
              fontSize: "18px",
              fontWeight: 500,
              color: "#494949",

              formatter: function (w) {
                const completed = w.globals.series[0]; // 75
                const remaining = w.globals.series[1]; // 25

                const percent = (completed / (completed + remaining)) * 100;
                if(isNaN(percent)){
                  return "No Record"


                } 

                return percent.toFixed(0) + "% Completed";
              },
            },
          },
        },
      },
    },

    legend: {
      show: true,
      position: "bottom",
      fontSize: "18px",
      fontWeight: 500,
      labels: {
        colors: "#000",
      },
      markers: {
        size: 10,
        strokeWidth: 0,
        offsetX: -10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 6,
      },
    },
  };

  return options;
};

type MeetingStatus = "registered" | "joined" | "completed" | "missed";

interface GetMeetingsParams {
  status?: MeetingStatus;
  page?: number;
  limit?: number;
}

export default function Page() {
  const [userRegion, setUserRegion] = useState<{
    timezone: string;
    region: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState<MeetingStatus | undefined>("joined");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const region = getUserRegion();
    console.log("region", region);

    setTimeout(() => {
      setUserRegion(region);
    }, 0);
  }, []);

  const {
    data: upcomingData,
    isLoading: loadingMeetings,
    isFetching,
  } = useGetUpcomingMeetingsQuery({
    region: userRegion?.region,
    search: debouncedSearch,
  });

  const {
    data: dashboardData,
    isLoading: tileLoading,
    error: tileerror,
  } = useGetDashboardStatsQuery(undefined);

  const totalCredits = dashboardData?.data?.totalCredits || 0;
  const classesAttended = dashboardData?.data?.classesAttended || 0;

  const usedCredits = classesAttended;

  const chartOptions = getCreditsChartOptions(totalCredits, usedCredits);

  // Generate series data: [used, remaining, total]
  const remainingCredits = Math.max(0, totalCredits - usedCredits);
  const chartSeries = [usedCredits, remainingCredits, totalCredits];

  // Helper function to format next upcoming session
  const getNextUpcomingSessionText = (upcomingSessions: number): string => {
    if (upcomingSessions === 0) return "No upcoming sessions";
    return upcomingSessions === 1
      ? "1 session"
      : `${upcomingSessions} sessions`;
  };

  // Helper function to get plan expiry text
  const getPlanExpiryText = (plan: string | undefined): string => {
    // You can customize this based on your plan expiry logic
    const today = new Date();
    const daysUntilExpiry = 98; // Example: 98 days until expiry

    if (!plan) return "No plan selected";

    const expiryDate = new Date(today);
    expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

    const month = expiryDate.toLocaleString("en-US", { month: "short" });
    const day = expiryDate.getDate();

    return `Expires ${month} ${day}`;
  };

  console.log("dashboard", dashboardData);

  const today = format(new Date(), "dd/MM/yyyy");

  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, error, refetch }: any = useGetAllMeetingsQuery({
    userId: user?.id,
    status,
    page,
    limit,
  } as GetMeetingsParams);

  console.log("meeting data", data);

  const avatarName =
    user?.firstName[0] + (user?.lastName ? user?.lastName[0] : "");
  const fullName = toTitleCase(
    user?.firstName + " " + (user?.lastName ? user?.lastName : "")
  );
  type TimeFilter = "3months" | "6months" | "1year";

  // ✅ Helper function to format date with timezone awareness
  // If region is not 'live' and region time has passed, shows next day date for recording
  const formatDateWithTimezone = (
    isoString: string,
    timezone?: string,
    regionTimeStr?: string,
    mode?: string,
  ) => {
    console.log("🎯 formatDateWithTimezone called:", {
      isoString,
      timezone,
      regionTimeStr,
      mode,
    });

    if (!isoString) return "N/A";

    try {
      let date = new Date(isoString);

      // Validate date
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      // ✅ NEW LOGIC: If region is not live and region time has passed,
      // show next day's date for recording class
      if (mode !== "live" && regionTimeStr) {
        const classDatetime = new Date(isoString);
        const currentTime = Date.now();

        console.log("📅 Recording Mode Detected:");
        console.log("  ISO Time:", isoString);
        console.log("  Region Time String:", regionTimeStr);
        console.log("  Class DateTime:", classDatetime.toISOString());
        console.log("  Current Time:", new Date(currentTime).toISOString());

        // Parse region time string (e.g., "10:00 AM")
        const [timeStr, period] = regionTimeStr.split(" ");
        const [hours, minutes] = timeStr.split(":");

        let hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);

        // Convert to 24-hour format
        if (period === "PM" && hour !== 12) {
          hour += 12;
        } else if (period === "AM" && hour === 12) {
          hour = 0;
        }

        // Create a new date with the region's time for comparison
        const regionDateTime = new Date(classDatetime);
        regionDateTime.setHours(hour, minute, 0, 0);

        console.log(
          "  Region DateTime (for comparison):",
          regionDateTime.toISOString(),
        );
        console.log(
          "  Time Difference (ms):",
          currentTime - regionDateTime.getTime(),
        );

        // If region time is in the past and mode is 'replay', add 1 day to the date
        if (currentTime > regionDateTime.getTime()) {
          console.log(
            "📅 Recording class time has passed, showing next day date",
          );
          date = new Date(date.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
        }
      }

      // Use timezone if available, otherwise user's local timezone
      const options = {
        day: "numeric" as const,
        month: "short" as const,
        year: "numeric" as const,
        timeZone: timezone || undefined,
      };

      const formattedDate = date
        .toLocaleDateString("en-GB", options)
        .replace(",", "");
      console.log("✅ Final Formatted Date:", formattedDate);

      return formattedDate;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "N/A";
    }
  };

  const formatTimeWithTimezone = (isoString: string, timezone?: string) => {
    console.log("time", isoString, timezone);

    if (!isoString) return "N/A";

    try {
      const date = new Date(isoString);

      // Validate date
      if (isNaN(date.getTime())) {
        return "Invalid Time";
      }

      const options = {
        hour: "numeric" as const,
        minute: "2-digit" as const,
        hour12: true,
        timeZone: timezone || undefined,
      };

      return date.toLocaleTimeString("en-US", options);
    } catch (error) {
      console.error("Time formatting error:", error);
      return "N/A";
    }
  };

  // Combined format: "Oct 28, 2:30 PM"
  const formatDateTimeWithTimezone = (isoString: string, timezone?: string) => {
    const date = formatDateWithTimezone(isoString, timezone);
    const time = formatTimeWithTimezone(isoString, timezone);
    return `${date}, ${time}`;
  };

  const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY as string;
  const STEP_KEY = process.env.NEXT_PUBLIC_STEP_KEY as string;

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("6months");

  const handleFilterChange = (value: string) => {
    setTimeFilter(value as TimeFilter);
  };

  const getFilterLabel = (value: string) => {
    switch (value) {
      case "1":
        return "6months";
      case "2":
        return "3months";
      case "3":
        return "1year";
      default:
        return "6months";
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log("dashboard");

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
    localStorage.removeItem("orderRef");
  }, [STORAGE_KEY, STEP_KEY]);

  const goalDetail = [
    {
      icon: <CalenderIcon />,
      desc: "Upcoming Session",
      title: tileLoading
        ? "-"
        : String(dashboardData?.data?.upcomingSessions || "-"),
      desc2: getNextUpcomingSessionText(
        dashboardData?.data?.upcomingSessions || 0
      ),
    },
    {
      icon: <CreditsIcon />,
      desc: "Credits",
      title: tileLoading
        ? "-"
        : String(dashboardData?.data?.totalCredits || "-"),
      desc2: "Keep it going!",
    },
    {
      icon: <GoalIcon />,
      desc: "Class Attended",
      title: tileLoading
        ? "-"
        : String(dashboardData?.data?.classesAttended || "-"),
      desc2: dashboardData?.data?.classesAttended
        ? `${dashboardData?.data?.classesAttended} sessions completed`
        : "Start attending classes",
    },
    {
      icon: <PlanIcon />,
      desc: "Current Plan",
      title: tileLoading
        ? "-"
        : dashboardData?.data?.currentPlan?.displayName || "No Plan",
      desc2: getPlanExpiryText(dashboardData?.data?.currentPlan?.plan),
    },
  ];

  // const SessionCardDetail = [
  //   {
  //     image: "/images/upcoming-ico.jpg",
  //     time: "6:00 PM ",
  //     duration: "45 min",
  //     date: "5 Dec",
  //     title: "Yoga Flow",
  //   },
  //   {
  //     image: "/images/upcoming-ico.jpg",
  //     time: "6:00 PM · 45 min",
  //     duration: "45 min",
  //     date: "Tommorow",
  //     title: "Yoga Flow",
  //   },
  //   {
  //     image: "/images/upcoming-ico.jpg",
  //     time: "6:00 PM · 45 min",
  //     duration: "45 min",
  //     date: "Tommorow",
  //     title: "Yoga Flow",
  //   },
  // ];

  return (
    <>
      {/* <Join/> */}

      <div className="px-7.5 py-6 bg-white sticky top-0 z-10 flex items-center justify-between">
        <div className="relative">
          <Input2
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-[610px] h-11 top-[25px] left-[30px] rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
          />
          <SearchIcon />
        </div>
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
      <div className="flex flex-col gap-7.5 p-7.5 pt-0">
        <div className="relative">
          <DashboardBanner
            badgeTitle={`Good Morning, ${user?.firstName}`}
            badgeDate={today}
            heading="Ready for your next session?"
            description="You're doing great! Keep the momentum in your wellness journey."
            buttonText=""
            src="/images/dashboard-banner.jpg"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {goalDetail?.map((goal, i) => (
            <div
              key={i}
              className={`${
                i % 2 == 0 ? "bg-white" : "bg-[#FBEFD8]"
              } rounded-[20px] p-6 flex flex-col items-start gap-9`}
            >
              <div className="flex flex-col gap-3">
                <div
                  className={`${
                    i % 2 == 0 ? "bg-[#B95E82]/10" : "bg-black/10"
                  } p-2.5 rounded-[12px] size-11`}
                >
                  {goal?.icon}
                </div>
                <Typography
                  title={goal?.desc}
                  type="theme"
                  cssClass="text-base!"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Typography
                  title={goal?.title}
                  type="xxl"
                  cssClass="text-xl! md:text-[24px]! text-[#212C26]!"
                />

                <Typography
                  title={goal?.desc}
                  type="theme"
                  cssClass="text-sm! md:text-base!"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7.5 ">
          <div
            className={`bg-white rounded-[20px] p-7 pb-0 flex flex-col items-start gap-7.5 h-hull`}
          >
            <DashboardTitle
              title="Upcoming Sessions"
              description="Your scheduled wellness activities"
              // buttonText="View All"
            />
            <div className="max-h-[305px] overflow-y-auto w-full pb-7.5 h-full">
              <div
                className={`flex flex-col gap-3 w-full h-full items-stretch ${
                  upcomingData?.meetings?.length === 0 || !upcomingData
                    ? "justify-start"
                    : ""
                }`}
              >
                {(loadingMeetings || isFetching) && <SessionCardShimmer />}
                {!loadingMeetings &&
                  !isFetching &&
                  (upcomingData?.meetings?.length === 0 || !upcomingData) && (
                    <Typography
                      cssClass="text-center text-[24px]!"
                      title="No upcoming meetings scheduled."
                      type="xl2"
                    />
                  )}

                {!loadingMeetings &&
                  !isFetching &&
                  upcomingData?.meetings?.map((meeting: any, index: number) => {
                    const regionInfo = meeting?.regions?.find(
                      (r: any) => r.region == userRegion?.region
                    );

                    const formattedTime = formatTimeWithTimezone(
                      meeting?.localTime,
                      userRegion?.timezone
                    );
                    
                    // ✅ Use the enhanced formatDateWithTimezone with recording mode support
                    const formattedDate = formatDateWithTimezone(
                      meeting?.localTime,
                      userRegion?.timezone,
                      regionInfo?.localTime,
                      regionInfo?.mode,
                    );
                    
                    const trainer = meeting?.trainer?.name ?? "";

                    return (
                      <SessionCard
                        key={index}
                        meetingId={meeting?._id}
                        userId={user?.id}
                        isLive={regionInfo?.mode === "live"}
                        trainer={trainer}
                        region={userRegion?.region as string}
                        joined={meeting?.joined ?? false}
                        participants={meeting?.participants ?? []}
                        participantsCount={meeting?.participantsCount ?? 0}
                        image="/images/upcoming-ico.jpg"
                        startTime={meeting?.localTime}
                        time={regionInfo?.localTime} // Use formatted time
                        date={formattedDate} // Use formatted date with recording logic
                        title={meeting?.title ?? "Untitled"}
                        duration={`${meeting?.duration ?? 0} min`}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
          <div
            className={`bg-white rounded-[20px] p-7 flex flex-col items-start gap-7.5 w-full`}
          >
            <DashboardTitle
              title="Attendance & Progress"
              description="Your wellness journey statistics"
              selectText="View All"
              onFilterChange={(value) => {
                const filter = getFilterLabel(value);
                setTimeFilter(filter as TimeFilter);
              }}
            />
            <div className="w-full h-[275px]">
              <ColumnGraph timeFilter={timeFilter} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-7.5">
          <div
            className={`bg-white rounded-[20px] p-7 flex flex-col items-start gap-7.5 w-full`}
          >
            <DashboardTitle
              title="Completed Sessions"
              description="Your accomplishments maintain momentum!"
              // dateFilter
            />
            <div className="max-h-80 overflow-y-auto w-full pb-7.5">
              <div className="flex flex-col w-full">
                {
                  <DataTable
                    columns={columns as ColumnDef<UserData, unknown>[]}
                    data={(data?.data as UserData[]) ?? []}
                    isLoadingData={isLoading}
                  />
                }
              </div>
            </div>
          </div>
          <div
            className={`bg-white rounded-[20px] p-7 flex flex-col items-start justify-start gap-7.5 w-full [&>*:first-child]:justify-start`}
          >
            <DashboardTitle
              title="Your Credits Journey"
              description="Track your class credit usage and remaining balance."
            />
            <div className="w-full">
              <div className="min-w-[330px] max-h-80 relative">
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                  height={330}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const shimmer = "animate-pulse bg-[#f2d6ce]";

export const SessionCardShimmer = () => {
  return (
    <div className="bg-[#FFF4F0] p-[11px] rounded-[15px] flex items-start justify-between w-full animate-pulse">
      {/* LEFT: IMAGE + TEXT */}
      <div className="flex items-center gap-[15px]">
        {/* Image placeholder */}
        <div className={`rounded-[10px] bg-[#f2d6ce] h-[108px] w-[131px]`} />

        {/* Text placeholders */}
        <div className="flex flex-col gap-4 w-[160px]">
          {/* Title line */}
          <div className={`${shimmer} h-4 w-3/4 rounded-md`} />

          {/* Time + Duration */}
          <div className={`${shimmer} h-3 w-1/2 rounded-md`} />

          {/* Join button */}
          <div className={`${shimmer} h-8 w-[85px] rounded-md`} />
        </div>
      </div>

      {/* RIGHT: DATE + PARTICIPANTS */}
      <div className="flex flex-col items-end justify-between h-full gap-10">
        {/* Date Badge */}
        <div className="rounded-[10px] px-3 py-3 w-[70px] flex items-center gap-2 bg-[#f2d6ce]">
          {/* <div className={`${shimmer} h-4 w-4 rounded`} /> */}
          {/* <div className={`${shimmer} h-3 w-8 rounded-md`} /> */}
        </div>

        {/* Participants */}
      </div>
    </div>
  );
};