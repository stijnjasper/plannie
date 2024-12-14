import Timeline from "../components/Timeline";
import Sidebar from "@/components/layout/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-muted">
      <Sidebar />
      <Timeline />
    </div>
  );
};

export default Index;