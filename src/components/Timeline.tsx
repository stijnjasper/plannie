import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Task {
  id: string;
  title: string;
  start: number;
  duration: number;
  color: string;
}

const Timeline = () => {
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design Review",
      start: 10,
      duration: 2,
      color: "bg-[#34C759]/10 border-[#34C759]/20",
    },
    {
      id: "2",
      title: "Team Meeting",
      start: 14,
      duration: 1,
      color: "bg-[#FF9500]/10 border-[#FF9500]/20",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2;
    }
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border bg-white shadow-sm">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hidden"
        >
          <div className="min-w-[1400px]">
            <div className="grid grid-cols-[auto_repeat(24,minmax(60px,1fr))] border-b">
              <div className="p-4 border-r bg-muted font-medium">Days</div>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="p-4 text-center border-r text-sm text-muted-foreground"
                >
                  {hour.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {DAYS.map((day, dayIndex) => (
              <div
                key={day}
                className="grid grid-cols-[auto_repeat(24,minmax(60px,1fr))] relative"
              >
                <div className="p-4 border-r border-b font-medium bg-muted">
                  {day}
                </div>
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="p-4 border-r border-b"
                  />
                ))}
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`absolute top-1/2 -translate-y-1/2 h-[calc(100%-16px)] ${
                      task.color
                    } border rounded-md transition-transform duration-200 hover:scale-[1.02] cursor-pointer`}
                    style={{
                      left: `calc(${task.start / 24 * 100}% + 100px)`,
                      width: `calc(${task.duration / 24 * 100}% - 8px)`,
                    }}
                  >
                    <div className="p-2 text-sm font-medium truncate">
                      {task.title}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;