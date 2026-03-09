/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useMemo, useState } from "react";
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
  useGetCompletedSessionsQuery,
  useGetUpcomingMeetingsQuery,
} from "@/store/api/meetingApi";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toTitleCase } from "@/utils/Titlecase";
import UserAvatar from "@/hooks/useAvatar";
import { useGetDashboardStatsQuery } from "@/store/api/authApi";
import { useGetPlansQuery } from "@/store/api/publicApi";
import { SearchIcon } from "@/icons/helpIcon";
import { useUserRegionFromStore } from "@/utils/timezone";
import { COUNTRY_TIMEZONE_MAP_ALL } from "@/constants/countryTimezoneMap";
import CustomPagination from "@/components/ui/CustromPagination";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const getCreditsChartOptions = (
  totalCredits: number,
  usedCredits: number,
): ApexOptions => {
  // Calculate remaining credits
  const remainingCredits = Math.max(0, totalCredits - usedCredits);

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
                if (isNaN(percent)) {
                  return "No Record";
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

export default function Page() {
  const [userRegion, setUserRegion] = useState<{
    region: string | null;
    timezone: string | null;
  } | null>(null);

  const { region, timezone } = useUserRegionFromStore();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 3;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setTimeout(() => {
      console.log("user region", region);
      setUserRegion({
        region: region ?? null,
        timezone: timezone ?? null,
      });
    }, 0);
  }, [region, timezone]);

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
  } = useGetDashboardStatsQuery({ region: userRegion?.region });
  const { data: plansData } = useGetPlansQuery(undefined);

  const plans = useMemo(() => plansData?.data || [], [plansData]);

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

  const getCurrentPlanDisplayName = (): string => {
    const apiDisplayName = String(
      dashboardData?.data?.currentPlan?.displayName || "",
    ).trim();
    if (apiDisplayName && apiDisplayName.toLowerCase() !== "no plan") {
      return apiDisplayName;
    }

    const rawPlan = String(
      dashboardData?.data?.currentPlan?.plan || user?.plan || "",
    ).trim();
    if (!rawPlan) return "No Plan";

    const fixedPlanMap: Record<string, string> = {
      "gold-yoga": "Gold Package",
      "gold-zumba": "Gold Package",
      "gold-mixed": "Gold Package",
      diamond: "Diamond Package",
      platinum: "Platinum Package",
    };

    const normalizedRaw = rawPlan.toLowerCase();
    if (fixedPlanMap[normalizedRaw]) return fixedPlanMap[normalizedRaw];

    const match = plans.find((plan: any) => {
      const keys = [
        String(plan?.uuid || "").toLowerCase(),
        String(plan?.planId || "").toLowerCase(),
        String(plan?._id || "").toLowerCase(),
        String(plan?.name || "").toLowerCase().trim(),
      ].filter(Boolean);
      return keys.includes(normalizedRaw);
    });

    if (match?.name) {
      return toTitleCase(String(match.name));
    }

    return "Custom Plan";
  };

  const today = format(new Date(), "dd/MM/yyyy");

  const { user } = useSelector((state: RootState) => state.auth);
  const userCountryTimezone = useMemo(() => {
    const countryCode = String(user?.countryCode || "").trim().toUpperCase();
    if (!countryCode) return null;
    const timezones = COUNTRY_TIMEZONE_MAP_ALL[countryCode];
    return Array.isArray(timezones) && timezones.length > 0 ? timezones[0] : null;
  }, [user?.countryCode]);
  const {
    data: completedSessionsData,
    isLoading: isLoadingCompletedSessions,
  } = useGetCompletedSessionsQuery({
    page,
    limit,
  });

  const completedSessions = completedSessionsData?.data?.sessions || [];
  const completedSessionsPagination = completedSessionsData?.data?.pagination;
  const paginationTotalPages = completedSessionsPagination?.totalPages ?? 1;
  const paginationCurrentPage = completedSessionsPagination?.currentPage ?? 1;

  const avatarName = `${user?.firstName?.charAt(0) || "U"}${
    user?.lastName?.charAt(0) || ""
  }`;
  const fullName = toTitleCase(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User",
  );
  type TimeFilter = "3months" | "6months" | "1year";

  // ✅ Helper function to format date with timezone awareness
  // If region is not 'live' and region time has passed, shows next day date for recording
  const formatDateWithTimezone = (isoString: string, timezone?: string) => {
    if (!isoString) return "N/A";

    try {
      const date = new Date(isoString);

      // Validate date
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      // if (mode !== "live" && regionTimeStr) {
      //   const classDatetime = new Date(isoString);
      //   const currentTime = Date.now();

      //   const [timeStr, period] = regionTimeStr.split(" ");
      //   const [hours, minutes] = timeStr.split(":");

      //   let hour = parseInt(hours, 10);
      //   const minute = parseInt(minutes, 10);

      //   if (period === "PM" && hour !== 12) {
      //     hour += 12;
      //   } else if (period === "AM" && hour === 12) {
      //     hour = 0;
      //   }

      //   const regionDateTime = new Date(classDatetime);
      //   regionDateTime.setHours(hour, minute, 0, 0);

      //   if (currentTime > regionDateTime.getTime()) {
      //     date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      //   }
      // }

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

      return formattedDate;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "N/A";
    }
  };

  const formatTimeWithTimezone = (isoString: string, timezone?: string) => {
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

  const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY as string;
  const STEP_KEY = process.env.NEXT_PUBLIC_STEP_KEY as string;

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("6months");

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
        : String(dashboardData?.data?.upcomingSessions ?? 0),
      desc2: getNextUpcomingSessionText(
        dashboardData?.data?.upcomingSessions ?? 0,
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
      title: tileLoading ? "-" : getCurrentPlanDisplayName(),
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

      <div className="px-7.5 py-6 bg-white sticky top-0 z-10 flex items-center justify-between gap-6 border-b border-[#E6E6E6]">
        <div className="relative max-xl:w-[70%]">
          <Input2
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full xl:w-[610px] h-11 top-[25px] left-[30px] rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
          />
          <SearchIcon />
        </div>
        <div className="flex items-center md:gap-10 text-[#212C26]">
          <div className="relative">
            {/* <Bell className="h-8 w-8" /> */}
            {/* <div className="bg-[#E05252] absolute -top-1.5 -right-1 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] rounded-full h-5 w-5 px-1.5 py-0.5">
                <h2 className="text-white  text-[12px] font-semibold font-inter!"  style={{ fontFamily: "Inter, sans-serif" }}>3</h2>
              </div> */}
          </div>
          <div className="flex items-center gap-2">
            <UserAvatar name={avatarName} />
            <div className="max-md:hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7.5 ">
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
                    const normalizedUserRegion = String(userRegion?.region || "")
                      .trim()
                      .toLowerCase();
                    const regionInfo = meeting?.regions?.find(
                      (r: any) =>
                        String(r?.region || "")
                          .trim()
                          .toLowerCase() === normalizedUserRegion,
                    );

                    // need to reuse
                    // const formattedTime = formatTimeWithTimezone(
                    //   meeting?.localTime,
                    //   userRegion?.timezone
                    // );

                    const formattedTime =
                      formatTimeWithTimezone(
                        meeting?.localTime,
                        userCountryTimezone ||
                          userRegion?.timezone ||
                          regionInfo?.timezone,
                      );

                    // ✅ Use the enhanced formatDateWithTimezone with recording mode support
                    const formattedDate = formatDateWithTimezone(
                      meeting?.localTime,
                      userCountryTimezone ||
                        userRegion?.timezone ||
                        regionInfo?.timezone,
                    );

                    const trainer = meeting?.trainer?.name ?? "";

                    return (
                      <SessionCard
                        key={index}
                        meetingId={meeting?._id}
                        userId={user?.id}
                        isLive={true}
                        // isLive={regionInfo?.mode === "live"}
                        trainer={trainer}
                        region={region as string}
                        joined={meeting?.joined ?? false}
                        participants={meeting?.participants ?? []}
                        participantsCount={meeting?.participantsCount ?? 0}
                        image="/images/upcoming-ico.jpg"
                        startTime={meeting?.localTime}
                        time={formattedTime}
                        // time={regionInfo?.localTime}
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

        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-7.5">
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
                    data={(completedSessions as UserData[]) ?? []}
                    isLoadingData={isLoadingCompletedSessions}
                  />
                }
              </div>
            </div>
            {paginationTotalPages > 1 && (
              <div className="w-full flex justify-center pb-2">
                <CustomPagination
                  totalPages={paginationTotalPages}
                  currentPage={paginationCurrentPage}
                  onPageChange={handlePageChange}
                  visiblePages={3}
                />
              </div>
            )}
          </div>
          <div
            className={`bg-white rounded-[20px] p-7 mb-16 sm:mb-0 flex flex-col items-start justify-start gap-7.5 w-full [&>*:first-child]:justify-start`}
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
