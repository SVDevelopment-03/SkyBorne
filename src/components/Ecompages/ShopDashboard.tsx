"use client";

import { useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Loader,
  Heart,
  Clock,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  useGetShopOrderTrendQuery,
  useGetShopOverviewStatsQuery,
  useGetShopRecentActivitiesQuery,
  useGetShopRevenueTrendQuery,
  useGetShopTopProductsQuery,
} from "@/store/api/shopDashboardApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type TrendRange = "week" | "month" | "quarter";
type RevenueRange = "3months" | "6months" | "1year";

type ChangeType = "positive" | "negative" | "neutral";

interface StatCard {
  key: string;
  label: string;
  value: string;
  change: number;
  icon: ReactNode;
  changeType: ChangeType;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value || 0);
};

export default function ShopDashboard() {
  const [orderRange, setOrderRange] = useState<TrendRange>("week");
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("6months");

  const { data: overviewData, isLoading: overviewLoading, error: overviewError } =
    useGetShopOverviewStatsQuery();

  const { data: revenueTrendData, isLoading: revenueLoading } = useGetShopRevenueTrendQuery({
    period: revenueRange,
  });

  const { data: orderTrendData, isLoading: orderLoading } = useGetShopOrderTrendQuery({
    period: orderRange,
  });

  const { data: topProductsData, isLoading: topProductsLoading } = useGetShopTopProductsQuery({
    limit: 6,
  });

  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetShopRecentActivitiesQuery({ limit: 8 });

  const stats = overviewData?.data;

  const statCards: StatCard[] = useMemo(() => {
    if (!stats) {
      return [];
    }

    return [
      {
        key: "totalRevenue",
        label: "Total Revenue",
        value: formatCurrency(stats.totalRevenue.value),
        change: stats.totalRevenue.change,
        changeType:
          stats.totalRevenue.change > 0
            ? "positive"
            : stats.totalRevenue.change < 0
            ? "negative"
            : "neutral",
        icon: <DollarSign className="w-6 h-6 text-[#B95E82]" />,
      },
      {
        key: "thisMonthRevenue",
        label: "This Month Revenue",
        value: formatCurrency(stats.thisMonthRevenue.value),
        change: stats.thisMonthRevenue.change,
        changeType:
          stats.thisMonthRevenue.change > 0
            ? "positive"
            : stats.thisMonthRevenue.change < 0
            ? "negative"
            : "neutral",
        icon: <ArrowUpRight className="w-6 h-6 text-[#B95E82]" />,
      },
      {
        key: "totalOrders",
        label: "Total Orders",
        value: formatNumber(stats.totalOrders.value),
        change: stats.totalOrders.change,
        changeType:
          stats.totalOrders.change > 0
            ? "positive"
            : stats.totalOrders.change < 0
            ? "negative"
            : "neutral",
        icon: <ShoppingCart className="w-6 h-6 text-[#B95E82]" />,
      },
      {
        key: "pendingOrders",
        label: "Pending Orders",
        value: formatNumber(stats.pendingOrders.value),
        change: stats.pendingOrders.change,
        changeType: "neutral",
        icon: <Clock className="w-6 h-6 text-[#B95E82]" />,
      },
      {
        key: "totalCustomers",
        label: "Total Customers",
        value: formatNumber(stats.totalCustomers.value),
        change: stats.totalCustomers.change,
        changeType:
          stats.totalCustomers.change > 0
            ? "positive"
            : stats.totalCustomers.change < 0
            ? "negative"
            : "neutral",
        icon: <Users className="w-6 h-6 text-[#B95E82]" />,
      },
      {
        key: "activeProducts",
        label: "Active Products",
        value: formatNumber(stats.activeProducts.value),
        change: stats.activeProducts.change,
        changeType: "neutral",
        icon: <Package className="w-6 h-6 text-[#B95E82]" />,
      },
      {
        key: "lowStockProducts",
        label: "Low Stock Products",
        value: formatNumber(stats.lowStockProducts.value),
        change: stats.lowStockProducts.change,
        changeType: stats.lowStockProducts.value > 0 ? "negative" : "neutral",
        icon: <AlertTriangle className="w-6 h-6 text-[#B95E82]" />,
      },
      {
        key: "conversionRate",
        label: "Conversion Rate",
        value: `${(stats.conversionRate.value || 0).toFixed(1)}%`,
        change: stats.conversionRate.change,
        changeType:
          stats.conversionRate.change > 0
            ? "positive"
            : stats.conversionRate.change < 0
            ? "negative"
            : "neutral",
        icon: <Percent className="w-6 h-6 text-[#B95E82]" />,
      },
    ];
  }, [stats]);

  const orderGrowthChartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["#B95E82"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#E8E8E8",
      padding: { left: 30, right: 20 },
    },
    xaxis: {
      categories: orderTrendData?.data?.labels || [],
      tickAmount: orderRange === "quarter" ? 5 : undefined,
      labels: {
        show: true,
        hideOverlappingLabels: true,
        rotate: 0,
        style: {
          fontSize: "12px",
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
        formatter: (value) => `${Math.round(value)}`,
      },
      axisBorder: { show: true, color: "#E8E8E8" },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value: number) => `${Math.round(value)} orders`,
      },
    },
  };

  const orderGrowthSeries = [
    {
      name: "Orders",
      data: orderTrendData?.data?.values || [],
    },
  ];

  const revenueChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      stacked: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#FFB3BA"],
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#E8E8E8",
      padding: { left: 30, right: 20 },
    },
    xaxis: {
      categories: revenueTrendData?.data?.labels || [],
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
        formatter: (value) => `$${value.toFixed(0)}`,
      },
      axisBorder: { show: true, color: "#E8E8E8" },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };

  const revenueSeries = [
    {
      name: "Revenue",
      data: revenueTrendData?.data?.values || [],
    },
  ];

  const maxRevenueValue = Math.max(...(revenueTrendData?.data?.values || [0]));

  const topProducts = topProductsData?.data || [];
  const activities = activitiesData?.data || [];

  return (
    <div className="min-h-screen">
      <div className="px-0 md:px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
            <p className="text-gray-600 mt-1">
              E-commerce performance, orders and inventory insights.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:p-8">
        {overviewLoading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 animate-spin text-[#B95E82]" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        ) : overviewError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-center">Failed to load shop dashboard stats</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {statCards.map((card) => (
                <div key={card.key} className="rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B95E82]/10 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        card.changeType === "positive"
                          ? "text-green-600"
                          : card.changeType === "negative"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {card.changeType === "positive" ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : card.changeType === "negative" ? (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      ) : null}
                      {card.change.toFixed(1)}%
                    </div>
                  </div>
                  <p className="text-sm mb-2 text-gray-600">{card.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900">Order Growth</h2>
                    <p className="text-gray-600 text-sm mt-1">Order trend over time</p>
                  </div>
                  <Select
                    value={orderRange}
                    onValueChange={(value) => setOrderRange(value as TrendRange)}
                  >
                    <SelectTrigger className="w-full sm:w-[170px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 h-10">
                      <SelectValue placeholder="This week" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="quarter">This quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {orderLoading ? (
                  <div className="flex justify-center items-center py-24">
                    <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6">
                    <div className="px-6">
                      <ReactApexChart
                        options={orderGrowthChartOptions}
                        series={orderGrowthSeries}
                        type="line"
                        height={300}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 relative">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900">Monthly Revenue</h2>
                    <p className="text-gray-600 text-sm mt-1">Revenue trends for the year</p>
                  </div>
                  <Select
                    value={revenueRange}
                    onValueChange={(value) => setRevenueRange(value as RevenueRange)}
                  >
                    <SelectTrigger className="w-full sm:w-[170px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 h-10">
                      <SelectValue placeholder="Last 6 months" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="3months">Last 3 months</SelectItem>
                      <SelectItem value="6months">Last 6 months</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {revenueLoading ? (
                  <div className="flex justify-center items-center py-24">
                    <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
                  </div>
                ) : (
                  <>
                    {maxRevenueValue > 0 && (
                      <div className="absolute top-36 right-4 sm:top-25 sm:right-6 bg-[#b95e82] font-satoshi-500 text-white text-xs font-bold px-6 py-1 rounded-full">
                        ${maxRevenueValue.toFixed(2)}
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
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 rounded-xl bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Top Selling Products</h3>
                  <span className="inline-flex items-center gap-1 text-sm text-[#B95E82]">
                    <Heart className="w-4 h-4" />
                    Best performers
                  </span>
                </div>

                {topProductsLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <Loader className="w-7 h-7 animate-spin text-[#B95E82]" />
                  </div>
                ) : topProducts.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    No product sales data available
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-xs font-semibold uppercase text-gray-500">
                            Product
                          </th>
                          <th className="text-left py-3 text-xs font-semibold uppercase text-gray-500">
                            Sold
                          </th>
                          <th className="text-left py-3 text-xs font-semibold uppercase text-gray-500">
                            Orders
                          </th>
                          <th className="text-left py-3 text-xs font-semibold uppercase text-gray-500">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product) => (
                          <tr key={product.productId} className="border-b border-gray-50">
                            <td className="py-3 text-sm text-gray-900 font-medium">{product.name}</td>
                            <td className="py-3 text-sm text-gray-700">{product.quantitySold}</td>
                            <td className="py-3 text-sm text-gray-700">{product.orders}</td>
                            <td className="py-3 text-sm text-gray-900 font-semibold">
                              {formatCurrency(product.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-white p-6 max-h-[460px] overflow-y-auto [scrollbar-width:thin]">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>

                {activitiesLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <Loader className="w-7 h-7 animate-spin text-[#B95E82]" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    No recent activity found
                  </div>
                ) : (
                  <div className="space-y-4 pr-1">
                    {activities.map((activity, index) => (
                      <div key={`${activity.text}-${index}`} className="flex items-start gap-3">
                        <span
                          className={`mt-2 w-2 h-2 rounded-full ${
                            activity.type === "success"
                              ? "bg-green-500"
                              : activity.type === "warning"
                              ? "bg-orange-400"
                              : "bg-[#B95E82]"
                          }`}
                        />
                        <div>
                          <p className="text-sm text-gray-800 leading-5">{activity.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
