"use client";

import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ApexChart = () => {
  const highlightedMonth = 3;

  const values = [15, 40, 30, 55, 42, 43];
  const labels = ["Mar", "Apr", "Jun", "Jul", "Aug", "Sept"];

  const barColors = values.map((_, i) =>
    i === highlightedMonth ? "#B95E82" : "#FFE8E8"
  );

  const [state] = useState({
    series: [{ name: "Sessions", data: values }],
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

      //   grid: {
      //     show: false, // ⭐ remove grid completely
      //   },

      colors: barColors,

      xaxis: {
        categories: labels,

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
        max: 60,
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
          left: 46, // Adjust this value to increase or decrease the space
          // You can also add right, top, and bottom padding here if needed
        },
      },

      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const dataIndex = opts.dataPointIndex;
          return dataIndex === 3 ? `${val} sessions` : "";
        },
        offsetY: 350, // keep slight gap
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
        }, // ⭐ IMPORTANT
      },

      annotations: {
        points: [
          {
            x: "Jul",
            y: 55,
            marker: { size: 0 },
            image: {
              path: "data:image/svg+xml;utf8,<svg width='12' height='8' xmlns='http://www.w3.org/2000/svg'><polygon points='6,8 0,0 12,0' fill='%23B95E82'/></svg>",
              width: 12,
              height: 8,
              offsetY: -10,
            },
          },
        ],
      },

      tooltip: {
        theme: "light",
        marker: { show: false },
        y: { formatter: (val: number) => `${val} sessions` },
      },
      legend: { show: false },
    } satisfies ApexOptions,
  });

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
