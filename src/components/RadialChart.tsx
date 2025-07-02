"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useContext } from "react";

//import { ThemeContext } from "./ThemeProvider";
import { useTheme } from "./ThemeProvider";


// Dynamically import to prevent SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RadialChartProps {
  series: number[];
  labels: string[];
}


const RadialChart: React.FC<RadialChartProps> = ({ series, labels }) => {
  //const { darkMode, setDarkMode } = useContext(ThemeContext);
  const {darkMode, toggleTheme} = useTheme()

    const textColor = darkMode ? "white" : "#000000";

    const options: ApexOptions = {
      
    chart: {
      type: "radialBar",
      height: 300,
      offsetY: -10,
      offsetX: 2,
      },
     
    colors: ["#14f195", "#9945ff"],
      plotOptions: {
        
          radialBar: {
            dataLabels: {
                // name: {
                //   color: '#FFFFFF',
                // },
                value: {
                  color: textColor,
                }
              },
        hollow: {
          margin: 5,
          size: "48%",
          background: "transparent",
        },
        track: {
          show: true,
          background: "#40475D",
          strokeWidth: "10%",
          opacity: 1,
          margin: 3,
        },
      },
    },
      labels,
    
    legend: {
   
      show: true,

      position: "bottom",
      offsetX: -5,
      offsetY: 1,
      formatter: (val, opts) =>
        `${val} - ${opts.w.globals.series[opts.seriesIndex]}%`,
      labels: {
        useSeriesColors: false,
        colors: textColor,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
  };

  return (
    <div className="dark:bg-gray-950 flex justify-center items-center  bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] w-full  rounded-4xl mb-10 ">
      <Chart options={options} series={series} type="radialBar" height={320} />
    </div>
  );
};

export default RadialChart;
