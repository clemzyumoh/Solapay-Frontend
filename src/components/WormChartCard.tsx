

"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface WormChartProps {
  data: number[];
  color?: string; // default color if not provided
}

export default function WormChart({ data, color = "#ffffff" }: WormChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 40,
      sparkline: { enabled: true },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.5,
      },
    },
    stroke: { curve: "smooth", width: 2 },
    colors: [color],
    tooltip: {
      x: { show: false },
      y: { title: { formatter: () => "" } },
    },
    markers: { size: 0 },
    responsive: [
      {
        breakpoint: 768, // mobile
        options: {
          chart: {
            height: 50,
            width:120,
          },
        },
      },
      {
        breakpoint: 1024, // tablet
        options: {
          chart: {
            height: 60,
          },
        },
      },
    ],
  };

  return (
    <Chart options={options} series={[{ data }]} type="line" height={60} width={170} />
  );
}
