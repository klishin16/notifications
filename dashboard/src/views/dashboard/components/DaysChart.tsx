import Card from "../../../components/card";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const mapDataToChart = (data: Array<{ date: string; count: string }>) => {
  const dates: string[] = [];
  const series: number[] = [];

  data.forEach((item) => {
    dates.push(item.date);
    series.push(parseFloat(item.count));
  });

  return {
    options: {
      chart: {
        type: "line",

        toolbar: {
          show: false,
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#A3AED0",
            fontSize: "12px",
            fontWeight: "500",
          },
        },
        type: "text",
        categories: dates,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "center", // top, center, bottom
          },
          distributed: true,
        },
      },
      stroke: {
        curve: "smooth",
      },
    },
    series: [
      {
        name: "Emails",
        data: series,
      },
    ],
  };
};

interface DaysChartProps {
    data: any;
}

const DaysChart: React.FC<DaysChartProps> = ({ data }) => {
    const [chartData, setChartData] = useState<{
        options: object;
        series: ApexAxisChartSeries;
    }>(null);

    useEffect(() => {
        const mappedData = mapDataToChart(data);
        setChartData(mappedData);
    }, [data]);

    return (
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
            <div className="mb-auto flex items-center justify-between px-6">
                <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                    Статистика количества email по дням
                </h2>
            </div>

            <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
                <div className="h-full w-full">
                    { chartData && <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        width="100%"
                        height="100%"
                    /> }
                </div>
            </div>
        </Card>
    );
};

export default DaysChart;
