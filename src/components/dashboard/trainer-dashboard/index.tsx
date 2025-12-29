/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useMemo } from "react";
import { Users, TrendingUp, Calendar, DollarSign, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Typography } from "@/components/ui/heading";
import TrainerSessionCard from "./TrainerSessionCard";
import { useGetTrainerUpcomingMeetingsQuery } from "@/store/api/meetingApi";

import {
  useGetTrainerStatsQuery,
  useGetSessionsAttendanceQuery,
} from "@/store/api/trainerApi";

import DashboardTitle from "@/components/dashboard/user-dashboard/DashboardTitle";
import useGetUser from "@/hooks/useGetUser";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface TrainerStats {
  sessionsThisMonth: { value: number; change: number };
  monthlyEarnings: { value: number; change: number };
  activeStudents: { value: number; change: number };
  completionRate: { value: number; change: number };
}

const TrainerDashboard = () => {
  

  // Fetch all trainer-specific data from RTK Query
  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetTrainerStatsQuery();

  const [attendancePeriod, setAttendancePeriod] = useState("week");

// Map frontend period to backend period parameter
const attendancePeriodMap: any = {
  week: "1week",    // or "7days" - depends on your backend
  month: "1month",
};

// Update the query to use dynamic period
const { data: attendanceData, isLoading: attendanceLoading } = useGetSessionsAttendanceQuery({
  period: attendancePeriodMap[attendancePeriod],
});

// Now you can use all the data without slicing
const weeklyAttendanceData = useMemo(() => {
  if (!attendanceData?.data?.values) {
    return attendancePeriod === "week" 
      ? [90, 85, 88, 92, 90, 87, 89] 
      : Array(30).fill(85);
  }
  // Use all returned data - no slicing needed
  return attendanceData.data.values;
}, [attendanceData, attendancePeriod]);


  // Build stats array from API data
  const stats = statsData?.data
    ? [
        {
          icon: <Calendar className="w-6 h-6 text-[#b95e82]" />,
          label: "Sessions This Month",
          value: statsData.data.sessionsThisMonth.value,
          change: statsData.data.sessionsThisMonth.change,
          changeType: statsData.data.sessionsThisMonth.change >= 0 ? ("positive" as const) : ("negative" as const),
        },
        {
          icon: <DollarSign className="w-6 h-6 text-[#B95E82]" />,
          label: "Monthly Earnings",
          value: `$${(statsData.data.monthlyEarnings.value / 100).toFixed(2)}`,
          change: statsData.data.monthlyEarnings.change,
          changeType: statsData.data.monthlyEarnings.change >= 0 ? ("positive" as const) : ("negative" as const),
        },
        {
          icon: <Users className="w-6 h-6 text-[#b95e82]" />,
          label: "Active Students",
          value: statsData.data.activeStudents.value.toLocaleString(),
          change: statsData.data.activeStudents.change,
          changeType: statsData.data.activeStudents.change >= 0 ? ("positive" as const) : ("negative" as const),
        },
        {
          icon: <TrendingUp className="w-6 h-6 text-[#b95e82]" />,
          label: "Completion Rate",
          value: `${statsData.data.completionRate.value}%`,
          change: statsData.data.completionRate.change,
          changeType: statsData.data.completionRate.change >= 0 ? ("positive" as const) : ("negative" as const),
        },
      ]
    : [];

    const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];


  // Weekly Attendance Chart Options - Simplified Design
  const weeklyAttendanceChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["#B95E82"],
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: "#E8E8E8",
      padding: { left: 10, right: 10 },
    },
    xaxis: {
  categories:
    attendancePeriod === "week"
      ? attendanceData?.data?.labels ?? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : attendanceData?.data?.labels ?? MONTH_LABELS,

      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#666",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      max: 100,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#000",
        },
      },
      axisBorder: { show: false },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `${Math.round(val)}%`,
      },
    },
    states: {
      hover: { filter: { type: "darken" } },
      active: { filter: { type: "none" } },
    },
  };

 const weeklyAttendanceSeries = [
    {
      name: "Attendance Rate",
      data: weeklyAttendanceData,
    },
  ];

  // Calculate average attendance
  const averageAttendance = useMemo(() => {
    if (weeklyAttendanceData.length === 0) return 0;
    const sum = weeklyAttendanceData.reduce((a, b) => a + b, 0);
    return Math.round(sum / weeklyAttendanceData.length);
  }, [weeklyAttendanceData]);

  // Get highest day
  const highestDay = useMemo(() => {
    const maxValue = Math.max(...weeklyAttendanceData);
    const dayIndex = weeklyAttendanceData.indexOf(maxValue);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return { day: days[dayIndex], rate: maxValue };
  }, [weeklyAttendanceData]);

  const userRegion = {
    region: "IN",
    timezone: "Asia/Kolkata",
  };

  const { user } = useGetUser();

  const {
  data: upcomingData,
  isLoading: loadingMeetings,
  isFetching,
} = useGetTrainerUpcomingMeetingsQuery(
  { 
    search: "", 
    date: new Date().toISOString().split("T")[0] // Today's date
  },
  { 
    skip: !user?.id // Skip query if user not loaded
  }
);

  const formatDateWithTimezone = (iso: string, tz?: string) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: tz,
    });
  };

  const formatTimeWithTimezone = (iso: string, tz?: string) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: tz,
    });
  };

  return (
    <div className="min-h-scree">
      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName || "Trainer"}! 🌟</h1>
            <p className="text-gray-600 mt-1">{"Here's your performance summary"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-pink-500" />
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            </div>
          ) : statsError ? (
            <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-center">Failed to load statistics</p>
            </div>
          ) : (
            stats.map((stat, idx) => {
              const isAlt = idx % 2 === 1;

              return (
                <div
                  key={idx}
                  className={`
                    w-full
                    rounded-[20px]
                    px-[25px]
                    pt-[28px]
                    pb-[26px]
                    shadow-sm
                    ${isAlt ? "bg-[#FFFAF0]" : "bg-white"}
                  `}
                >
                  <div className="mb-6">
                    <div className="size-11 flex items-center justify-center rounded-lg bg-[#FFF1F5]">
                      {stat.icon}
                    </div>
                  </div>

                  <p
                    className="text-[20px] font-medium leading-[16px] mb-3"
                    style={{ color: "#494949" }}
                  >
                    {stat.label}
                  </p>

                  <h3 className="text-[28px] font-bold text-gray-900 mt-10">
                    {stat.value}
                  </h3>

                  {typeof stat.change === "number" && (
                    <div
                      className={`
                        inline-flex
                        items-center
                        justify-center
                        mt-1
                        min-w-[66px]
                        h-[26px]
                        px-[12px]
                        py-[15px]
                        rounded-full
                        ${stat.changeType === "positive" ? "bg-[#D1FAE5]" : "bg-[#FEE2E2]"}
                      `}
                    >
                      <span
                        className={`
                          text-[18px]
                          leading-[16px]
                          font-normal
                          ${stat.changeType === "positive" ? "text-[#065F46]" : "text-[#7F1D1D]"}
                        `}
                      >
                        {stat.change >= 0 ? "+" : ""}{stat.change}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Today's Sessions */}
          <div className="bg-white rounded-[20px] p-7 pb-0 flex flex-col items-start gap-7 h-full">
            <DashboardTitle
              title="Today's Sessions"
              description="Your scheduled classes for today"
            />
            <div className="max-h-[305px] overflow-y-auto w-full pb-7 h-full">
              <div
                className={`flex flex-col gap-3 w-full h-full items-stretch ${
                  upcomingData?.meetings?.length === 0 || !upcomingData
                    ? "justify-center"
                    : ""
                }`}
              >
                {!loadingMeetings &&
                  !isFetching &&
                  (upcomingData?.meetings?.length === 0 || !upcomingData) && (
                    <Typography
                      cssClass="text-center text-[24px]!"
                      title="No sessions today."
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
                    const formattedDate = formatDateWithTimezone(
                      meeting?.localTime,
                      userRegion?.timezone
                    );
                    const trainer = meeting?.trainer?.name ?? "";

                    return (
                      <TrainerSessionCard
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
                        time={formattedTime}
                        date={formattedDate}
                        title={meeting?.title ?? "Untitled"}
                        duration={`${meeting?.duration ?? 0} min`}
                      />
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Weekly Attendance */}
          <div className="bg-white rounded-[20px] p-7 flex flex-col items-start gap-7 w-full">
            <div className="w-full flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Weekly Attendance</h3>
                <p className="text-sm text-gray-600 mt-1">Attendance rate over the past week</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={attendancePeriod}
                  onChange={(e) => setAttendancePeriod(e.target.value as "week" | "month")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b95e82] focus:border-transparent"
                >
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
              </div>
            </div>

            <div className="w-full h-[250px]">
              {attendanceData?.data ? (
                <ReactApexChart
                  options={weeklyAttendanceChartOptions}
                  series={weeklyAttendanceSeries}
                  type="bar"
                  height={250}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-6 h-6 animate-spin text-pink-500" />
                </div>
              )}
            </div>

            {/* Stats Below Chart */}
            <div className="w-full flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-gray-900">{averageAttendance}%</p>
                <p className="text-sm text-gray-600 mt-1">Average this week</p>
              </div>
              {/* <div className="text-right">
                <p className="text-sm text-gray-500">Highest Day</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {highestDay.day} Rate: {highestDay.rate}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;