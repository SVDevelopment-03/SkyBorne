"use client";

import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
  DollarSign,
  Loader,
  CheckCircle2,
  Clock,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  useGetOverviewStatsQuery,
  useGetUserGrowthQuery,
  useGetMonthlyRevenueQuery,
  useGetRecentActivitiesQuery,
  useGetTopServicesQuery,
} from "@/store/api/adminApi";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "week"
  );
  const [revenueRange, setRevenueRange] = useState<
    "3months" | "6months" | "1year"
  >("6months");

  // Fetch all data from RTK Query
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetOverviewStatsQuery();

  const { data: userGrowthData, isLoading: growthLoading } =
    useGetUserGrowthQuery({
      period: timeRange,
    });

  const { data: revenueData, isLoading: revenueLoading } =
    useGetMonthlyRevenueQuery({
      period: revenueRange,
    });

  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetRecentActivitiesQuery();

  const { data: servicesData, isLoading: servicesLoading } =
    useGetTopServicesQuery();

  // Build stats array from API data
  const stats = statsData?.data
    ? [
        {
          icon: <Users className="w-6 h-6 text-[#b95e82]" />,
          label: "Active Users",
          value: statsData.data.activeUsers.value.toLocaleString(),
          change: statsData.data.activeUsers.change,
          changeType:
            statsData.data.activeUsers.change >= 0
              ? ("positive" as const)
              : ("negative" as const),
        },
        {
          icon: <DollarSign className="w-6 h-6 text-[#B95E82]" />,
          label: "Revenue (USD)",
          value: `$${(statsData.data.monthlyRevenue.value / 100).toFixed(2)}`,
          change: statsData.data.monthlyRevenue.change,
          changeType:
            statsData.data.monthlyRevenue.change >= 0
              ? ("positive" as const)
              : ("negative" as const),
        },
        {
          icon: <TrendingUp className="w-6 h-6 text-[#B95E82]" />,
          label: "Growth Rate",
          value: `${statsData.data.growthRate.value}%`,
          change: statsData.data.growthRate.change,
          changeType: "positive" as const,
        },
        {
          icon: <AlertCircle className="w-6 h-6 text-[#b95e82]" />,
          label: "Active Trainers",
          value: statsData.data.activeTrainers.value,
          change: statsData.data.activeTrainers.change,
          changeType: "positive" as const,
        },

        {
          icon: <Clock className="w-6 h-6 text-[#B95E82]" />,
          label: "Pending Approvals",
          value: 0,
          change: 0,
          changeType: "neutral" as const,
        },
        {
          icon: <Calendar className="w-6 h-6 text-[#b95e82]" />,
          label: "Sessions This Month",
          value: statsData.data.sessionsThisMonth.value,
          change: statsData.data.sessionsThisMonth.change,
          changeType:
            statsData.data.sessionsThisMonth.change >= 0
              ? ("positive" as const)
              : ("negative" as const),
        },
      ]
    : [];

  // User Growth Chart Options - Fixed for better label display
  const userGrowthChartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["#B95E82"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      colors: ["#B95E82"], // ✅ ensures bar fill color
    },
    grid: {
      show: true,
      borderColor: "#E8E8E8",
      padding: { left: 30, right: 20 },
    },
    xaxis: {
      categories: userGrowthData?.data?.labels || [],

      tickAmount: timeRange === "quarter" ? 5 : undefined, // ⭐ MAIN FIX

      labels: {
        show: true,
        hideOverlappingLabels: true,
        rotate: 0,
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#666",
        },
      },

      axisBorder: { show: true, color: "#E8E8E8" },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "13px",
          fontWeight: 500,
          colors: "#000",
        },
        formatter: (val) => `${Math.round(val)}`,
      },
      axisBorder: { show: true, color: "#E8E8E8" },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `${Math.round(val)} users`,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              maxHeight: 80,
            },
          },
        },
      },
    ],
  };

  const userGrowthSeries = [
    {
      name: "New Users",
      data: userGrowthData?.data?.values || [],
    },
  ];

  // Revenue Chart Options - Fixed scaling
  const revenueChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      stacked: false,
    },
    colors: ["#FFB3BA"],
    plotOptions: {
      bar: {
        columnWidth: "45%",
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
      padding: { left: 30, right: 20 },
    },
    xaxis: {
      categories: revenueData?.data?.labels || [],
      labels: {
        style: {
          fontSize: "13px",
          fontWeight: 500,
          colors: "#000",
        },
      },
      axisBorder: { show: true, color: "#E8E8E8" },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Revenue ($)",
      },
      labels: {
        style: {
          fontSize: "13px",
          fontWeight: 500,
          colors: "#000",
        },
        formatter: (val) => `$${(val / 100).toFixed(0)}`,
      },
      axisBorder: { show: true, color: "#E8E8E8" },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `$${(val / 100).toFixed(2)}`,
      },
    },
    states: {
      hover: { filter: { type: "darken" } },
      active: { filter: { type: "none" } },
    },
  };

  const revenueSeries = [
    {
      name: "Revenue",
      data: revenueData?.data?.values || [],
    },
  ];

  // Find max revenue for annotation
  const maxRevenueValue = Math.max(...(revenueData?.data?.values || [0]));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              {"Welcome back! Here's what's happening today."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 mb-8">
          {statsLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            </div>
          ) : statsError ? (
            <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-center">
                Failed to load statistics
              </p>
            </div>
          ) : (
            <>
              {/* First Card - Spans 2 rows */}
              <div className="rounded-lg p-8 bg-white row-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>{stats[0].icon}</div>
                  </div>
                  <p className="text-sm mb-2 text-gray-600">{stats[0].label}</p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-3">
                    {stats[0].value}
                  </h3>
                </div>
              </div>

              <div className="row-span-2 flex flex-col gap-4">
                {stats.slice(1, 3).map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl  ${
                      idx == 1 ? "bg-[#FFFAF0]" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>{stat.icon}</div>
                    </div>
                    <p className={`text-sm mb-2 `}>{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="row-span-2 flex flex-col gap-4">
                {stats.slice(3, 5).map((stat, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-6 borde row-span-1   ${
                      idx == 0 ? "bg-[#FFFAF0]" : "bg-white"
                    } `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>{stat.icon}</div>
                    </div>
                    <p className={`text-sm mb-2 `}>{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Last Card - Spans 2 rows */}

              {stats[5] && (
                <div className="rounded-lg p-8 bg-white row-span-2 col-start-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>{stats[5].icon}</div>
                    </div>
                    <p className="text-sm mb-2 text-gray-600">
                      {stats[5].label}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-3">
                      {stats[5].value}
                    </h3>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">User Growth</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Your wellness journey statistics
                </p>
              </div>
              <select
                value={timeRange}
                onChange={(e) =>
                  setTimeRange(e.target.value as "week" | "month" | "quarter")
                }
                className="text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="quarter">This quarter</option>
              </select>
            </div>
            {growthLoading ? (
              <div className="flex justify-center items-center py-24">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            ) : userGrowthData?.data?.values &&
              userGrowthData.data.values.length > 0 ? (
              <div className="overflow-x-auto -mx-6">
                <div className="px-6">
                  <ReactApexChart
                    options={userGrowthChartOptions}
                    series={userGrowthSeries}
                    type="line"
                    height={300}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center py-24 text-gray-500">
                <p>No data available</p>
              </div>
            )}
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Monthly Revenue
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Revenue trends for the year
                </p>
              </div>
              <select
                value={revenueRange}
                onChange={(e) =>
                  setRevenueRange(
                    e.target.value as "3months" | "6months" | "1year"
                  )
                }
                className="text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
              </select>
            </div>
            {revenueLoading ? (
              <div className="flex justify-center items-center py-24">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            ) : revenueData?.data?.values &&
              revenueData.data.values.length > 0 ? (
              <>
                {maxRevenueValue > 0 && (
                  <div className="absolute top-25 right-6 bg-[#b95e82]  font-satoshi-500 text-white text-xs font-bold px-6 py-1 rounded-full">
                    ${(maxRevenueValue / 100).toFixed(2)}
                  </div>
                )}
                <div className="overflow-x-auto -mx-6">
                  <div className="px-6">
                    <ReactApexChart
                      options={revenueChartOptions}
                      series={revenueSeries}
                      type="bar"
                      height={300}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center py-24 text-gray-500">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-h-[450px] overflow-y-auto [scrollbar-width:thin]">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Recent Activity
            </h2>
            <p className="text-gray-600 text-sm mb-6">Latest admin actions</p>

            {activitiesLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            ) : activitiesData?.data && activitiesData.data.length > 0 ? (
              <div className="space-y-4">
                {activitiesData.data.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg"
                  >
                    <div className="pt-1 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 whitespace-pre-line">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-12 text-gray-500">
                <p className="text-sm">No recent activities</p>
              </div>
            )}
          </div>

          {/* Top Performing Services */}
          {/* <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Services</h2>
            {servicesLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            ) : servicesData?.data && servicesData.data.length > 0 ? (
              <div className="space-y-4">
                {servicesData.data.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.service}</p>
                      <p className="text-gray-500 text-sm">{item.users} users</p>
                    </div>
                    <p className="font-semibold text-gray-900 ml-2">{item.revenue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-12 text-gray-500">
                <p>No services data available</p>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
