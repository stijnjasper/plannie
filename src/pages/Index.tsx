import Timeline from "../components/Timeline";
import Sidebar from "@/components/layout/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen calendar-header-bg dark:bg-[#262626]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 pt-6">
          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default Index;