import { useEffect, useState } from "react";
import Widget from "../../components/widget/Widget";
import { MdBarChart } from "react-icons/md";
import StatisticsChart from "./components/StatisticsChart";
import DaysChart from "./components/DaysChart";
import { useFetchFactory } from "../../utils/useFetchFactory";
import { BASE_URL } from "../../constants";

function Dashboard() {
  const { processFetch: fetchStats } = useFetchFactory();
  const { processFetch: fetchDaysStats } = useFetchFactory();
  const { processFetch: fetchCount } = useFetchFactory();

  const [count, setCount] = useState(0);

  const [stats, setStats] = useState([]);
  const [daysChartData, setDaysChartData] = useState([]);

  useEffect(() => {
    fetchStats(BASE_URL + "/api/statistics")
        .then((data) => setStats(data))
        .catch((err) => console.log(err));

    fetchDaysStats(BASE_URL + "/api/statistics/daysStats")
      .then((data) => setDaysChartData(data))
      .catch((err) => console.log(err));

    fetchCount(BASE_URL + "/api/statistics/count")
      .then((data) => setCount(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Total emails"}
          subtitle={count.toString()}
        />
      </div>

      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <StatisticsChart data={stats} />
        <DaysChart data={daysChartData} />
      </div>
    </div>
  );
}

export default Dashboard;
