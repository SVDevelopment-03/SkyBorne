/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Sidebar from "@/components/layout/sidebar";
import { useEffect } from "react";
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
import { useGetUpcomingMeetingsQuery } from "@/store/api/meetingApi";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toTitleCase } from "@/utils/Titlecase";
import UserAvatar from "@/hooks/useAvatar";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  chart: {
    type: "donut",
    height: 450,
  },
  series: [75, 25, 100],

  labels: ["Completed", "Remaining", "Goal"],

  colors: ["#FBEFD8", "#494949", "#B95E82"],
  states: {
    hover: { filter: { type: "darke" } },
    active: { filter: { type: "none" } },
  },
  stroke: { width: 0 },

  tooltip: {
    enabled: false, // ❗ stop hover percentage
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

export default function Page() {
  const { data: upcomingData, isLoading: loadingMeetings } =
    useGetUpcomingMeetingsQuery(undefined);
    const today = format(new Date(), "dd/MM/yyyy");


  const {user} = useSelector((state:RootState)=>state.auth);
  const avatarName = user?.firstName[0] + (user?.lastName ? user?.lastName[0] :'' );
    const fullName =toTitleCase( user?.firstName +' ' + (user?.lastName ? user?.lastName :'' ));

    console.log(upcomingData);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  const formatTime = (iso: string) => {
    if (!iso) return "";
    console.log("iso", iso);

    const d = new Date(iso);
    console.log("iso2", d);
    const e = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    console.log("e", e);
    return e;
  };

  const users: UserData[] = [
    {
      id: "1",
      sessionName: "Yoga Flow",
      date: "Oct 28",
      duration: "20 min",
      status: "12/30",
      badge: false,
    },
    {
      id: "2",
      sessionName: "Mindful Meditation",
      date: "Oct 28",
      duration: "45 min",
      status: "10/20",
      badge: true,
    },
    {
      id: "3",
      sessionName: "Session Name",
      date: "Date",
      duration: "Duration",
      status: "Completed",
      badge: false,
    },
    {
      id: "4",
      sessionName: "Session Name",
      date: "Date",
      duration: "Duration",
      status: "Status",
      badge: true,
    },
  ];

  const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY as string;
  const STEP_KEY = process.env.NEXT_PUBLIC_STEP_KEY as string;

  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log("dashboard");

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  }, [STORAGE_KEY, STEP_KEY]);

  const goalDetail = [
    {
      icon: <CalenderIcon />,
      desc: "Upcoming Session",
      title: "-",
      desc2: "Yoga Flow",
    },
    {
      icon: <CreditsIcon />,
      desc: "Credits",
      title: "-",
      desc2: "Keep it going!",
    },
    {
      icon: <GoalIcon />,
      desc: "Monthly Goal",
      title: "-",
      desc2: "17 of 20 sessions",
    },
    {
      icon: <PlanIcon />,
      desc: "Current Plan",
      title: "-",
      desc2: "Expires Mar 15",
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
      <div className="rounded-[30px] bg-[#FBFAF9] grid grid-cols-[260px_1fr] h-dvh">
        <Sidebar />
        <div className="flex flex-col gap-7.5 h-full overflow-y-auto">
          <div className="px-7.5 py-6 bg-white sticky top-0 z-10 flex items-center justify-between">
            <div className="relative">
              <Input2
                placeholder="Search sessions, packages..."
                name="search"
                className="bg-[#F2F0ED80]! border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-[610px] h-11 top-[25px] left-[30px] rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <svg
                className="absolute left-4  top-6 transform -translate-y-1/2 "
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.7511 15.7501L12.4961 12.4951"
                  stroke="#494949"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
                  stroke="#494949"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <UserAvatar name={avatarName}/>
              <div>
                <Typography title={fullName} cssClass="text-[#212C26]!"/>
                <Typography title="Premium Member" cssClass="text-[#878787]! text-[16px]!"/>
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
                buttonText="Unlock My Plan"
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
                  buttonText="View All"
                />
                <div className="max-h-[305px] overflow-y-auto w-full pb-7.5 h-full">
                  <div
                    className={`flex flex-col gap-3 w-full h-full items-stretch ${
                      upcomingData?.meetings?.length === 0 || !upcomingData
                        ? "justify-center"
                        : ""
                    }`}
                  >
                    {!loadingMeetings &&
                      (upcomingData?.meetings?.length === 0 ||
                        !upcomingData) && (
                        <Typography
                          cssClass="text-center text-[30px]!"
                          title="No upcoming meetings scheduled."
                          type="xl2"
                        />
                      )}

                    {!loadingMeetings &&
                      upcomingData?.meetings?.map(
                        (meeting: any, index: number) => {
                          const time = formatTime(meeting?.startTime);
                          const date = formatDate(meeting?.startTime);
                          const trainer = meeting?.createdBy
                            ? `${meeting.createdBy.firstName || ""} ${
                                meeting.createdBy.lastName || ""
                              }`.trim()
                            : "";

                          return (
                            <SessionCard
                              key={index}
                              meetingId={meeting?._id}
                              userId={"6925ef6c19f63bed6b81b619"}
                              trainer={trainer}
                              joined={meeting?.joined ?? false}
                              participants={meeting?.participants ?? []}
                              participantsCount={
                                meeting?.participantsCount ?? 0
                              }
                              image="/images/upcoming-ico.jpg"
                              startTime={meeting?.startTime}
                              time={time ?? ""}
                              date={date ?? ""}
                              title={meeting?.topic ?? "Untitled"}
                              duration={`${meeting?.duration ?? 0} min`}
                            />
                          );
                        }
                      )}
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
                />
                <div className="w-full h-[275px]">
                  <ColumnGraph />
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
                  dateFilter
                />
                <div className="max-h-80 overflow-y-auto w-full pb-7.5">
                  <div className="flex flex-col w-full">
                    <DataTable
                      columns={columns as ColumnDef<UserData, unknown>[]}
                      data={users}
                      isLoadingData={false}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`bg-white rounded-[20px] p-7 flex flex-col items-start justify-start gap-7.5 w-full [&>*:first-child]:justify-start`}
              >
                <DashboardTitle
                  title="Monthly Goal Progress"
                  description="Monitor your wellness targets this month."
                />
                <div className="w-full">
                  <div className="min-w-[330px] max-h-80 relative">
                    <ReactApexChart
                      options={options}
                      series={options.series}
                      type="donut"
                      height={330}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
