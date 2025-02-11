import Card from "../../../components/card";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const statusToColor: Record<string, string> = {
  'created': '#ffea00',
  'sent': '#00e676',
  'pending': '#2979ff',
  'failed': '#ff1744',
}

const mapDataToChart = (data: Array<{ status: string; count: string }>) => {
  const categories: string[] = [];
  const series: number[] = [];
  const colors: string[] = [];

  data.forEach((item) => {
    categories.push(item.status);
    series.push(parseFloat(item.count));
    colors.push(statusToColor[item.status]);
  });

  return {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories,
      },
      fill: {
        colors
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'center', // top, center, bottom
          },
          distributed: true
        }
      },
      legend: {
        markers: {
          fillColors: colors,
        }
      }
    },
    series: [
      {
        name: "Emails",
        data: series,
      },
    ],
  };
};

interface StatisticsChartProps {
  data: any;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ data }) => {
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
          Статистика статусов отправки email
        </h2>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          {chartData && (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              width="100%"
              height="100%"
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatisticsChart;
