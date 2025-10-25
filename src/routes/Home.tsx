import WideBarChart from "@/components/charts/Home/WideBarChart";

import PatientNumberCard from "@/components/charts/Home/PatientNumberChart";
import UsageChart from "@/components/charts/Home/UsageChart";
import StatsChart from "@/components/charts/Home/StatsChart";

const Home = () => {
  return (
    <div className="relative full p-8 col gap-8 min-h-max">
      
      <div className="relative w-full">
        <WideBarChart />
      </div>

      <div className="relative grid grid-cols-3 gap-4 full">
        
        <PatientNumberCard />
        <UsageChart />
        <StatsChart />

      </div>
    </div>
  );
};

export default Home;