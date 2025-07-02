"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  data: {
    "30m": number[][];
    "1h": number[][];
    "4h": number[][];
    "7d": number[][];
  };
  categories: {
    "30m": string[];
    "1h": string[];
    "4h": string[];
    "7d": string[];
  };
}

const SplineAreaChart = ({ data, categories }: ChartProps) => {
  const [range, setRange] = useState<"30m" | "1h" | "4h" | "7d">("30m");

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 400,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 1 },
    xaxis: {
      type: "datetime",
      categories: categories[range],
      //labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        show: false,
      },
    },

    yaxis: { show: false },
    grid: {
      show: true,
      yaxis: {
        lines: { show: false },
      },
      xaxis: {
        lines: { show: false },
      },
      strokeDashArray: 4,
    },
    tooltip: {
      x: { format: "dd/MM/yy HH:mm" },
      theme: "dark",
    },
    legend: { show: false },
    colors: ["#14f195", "#9945ff"],
  };

  const series = [
    { name: "Solana", data: data[range][0] },
    { name: "Usdc", data: data[range][1] },
  ];

  return (
    <div className=" w-full p-0">
      <Chart options={options} series={series} type="area" height={350} />
      <div className="flex gap-2 mb-2 text-center">
        {/* {["30m", "1h", "4h", "7d"].map((r) => (
          <button
            key={r}
            className={`px-3 py-1 cursor-pointer text-sm rounded ${
              range === r ? " text-2xl font-bold  " : "text-gray-500"
            }`}
            onClick={() => setRange(r as any)}>
            {r}
          </button>
        ))} */}
        {(["30m", "1h", "4h", "7d"] as const).map((r) => (
          <button
            key={r}
            className={`px-3 py-1 cursor-pointer text-sm rounded ${
              range === r ? " text-2xl font-bold  " : "text-gray-500"
            }`}
            onClick={() => setRange(r)}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SplineAreaChart;
