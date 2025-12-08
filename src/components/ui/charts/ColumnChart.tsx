"use client";

import React, { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useGetMonthlyAttendanceQuery } from "@/store/api/meetingApi";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyAttendanceData {
  month: string;
  count: number;
}

type TimeFilter = "3months" | "6months" | "1year";

interface ApexChartProps {
  timeFilter: TimeFilter;
}

const ApexChart: React.FC<ApexChartProps> = ({ timeFilter }) => {
  // Fetch monthly attendance data
  const { data: attendanceData, isLoading } = useGetMonthlyAttendanceQuery({
    period: timeFilter,
  });

  // Transform API data into chart format
  const chartData = useMemo(() => {
    if (!attendanceData?.data) {
      return {
        values: [],
        labels: [],
        maxValue: 60,
        highlightedMonth: -1,
      };
    }

    const months = attendanceData.data;
    const values = months.map((m: MonthlyAttendanceData) => m.count);
    const labels = months.map((m: MonthlyAttendanceData) => m.month);

    // Find month with highest attendance
    const maxIndex = values.indexOf(Math.max(...values));
    const maxValue = Math.max(...values, 60);

    return {
      values,
      labels,
      maxValue: Math.ceil(maxValue / 10) * 10,
      highlightedMonth: maxIndex,
    };
  }, [attendanceData]);

  const barColors = chartData.values.map((_, i) =>
    i === chartData.highlightedMonth ? "#B95E82" : "#FFE8E8"
  );

  const state = {
    series: [{ name: "Sessions", data: chartData.values }],
    options: {
      chart: {
        type: "bar",
        height: 300,
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          columnWidth: "44px",
          borderRadius: 6,
          distributed: true,
        },
      },

      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          filter: {
            type: "none",
          },
        },
      },

      colors: barColors,

      xaxis: {
        categories: chartData.labels,
        axisBorder: {
          show: true,
          color: "#E8E8E8",
        },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 500,
            colors: "#000",
          },
        },
      },

      yaxis: {
        min: 0,
        max: chartData.maxValue,
        tickAmount: 6,
        axisBorder: {
          show: true,
          color: "#E8E8E8",
        },
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 500,
            colors: "#000",
          },
        },
      },

      grid: {
        show: false,
        padding: {
          left: 46,
        },
      },

      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts) {
          const dataIndex = opts.dataPointIndex;
          return dataIndex === chartData.highlightedMonth
            ? `${val} sessions`
            : "";
        },
        offsetY: 350,
        style: {
          fontSize: "13px",
          fontWeight: "700",
          colors: ["#FFFFFF"],
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          padding: 24,
          borderRadius: 6,
          opacity: 1,
          backgroundColor: "#B95E82",
        },
      },

      annotations: {
        points:
          chartData.highlightedMonth >= 0
            ? [
                {
                  x: chartData.labels[chartData.highlightedMonth],
                  y: chartData.values[chartData.highlightedMonth],
                  marker: { size: 0 },
                  image: {
                    path: "data:image/svg+xml;utf8,<svg width='12' height='8' xmlns='http://www.w3.org/2000/svg'><polygon points='6,8 0,0 12,0' fill='%23B95E82'/></svg>",
                    width: 12,
                    height: 8,
                    offsetY: -10,
                  },
                },
              ]
            : [],
      },

      tooltip: {
        theme: "light",
        marker: { show: false },
        y: { formatter: (val: number) => `${val} sessions` },
      },

      legend: { show: false },
    } satisfies ApexOptions,
  };

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-gray-500">Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px] w-full font-satoshi-500">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={300}
          width="100%"
        />
      </div>
    </div>
  );
};

export default ApexChart;