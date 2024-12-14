import Timeline from "../components/Timeline";
import Sidebar from "@/components/layout/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-muted">
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