import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Task {
  id: string;
  title: string;
  subtitle?: string;
  assignee: string;
  day: string;
  color: string;
}

const Timeline = () => {
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design Review",
      subtitle: "UI Suite Pages",
      assignee: "Sarah Chen",
      day: "Mon",
      color: "bg-[#34C759]/10 border-[#34C759]/20",
    },
    {
      id: "2",
      title: "Team Meeting",
      subtitle: "Sprint Planning",
      assignee: "Mike Johnson",
      day: "Wed",
      color: "bg-[#FF9500]/10 border-[#FF9500]/20",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const formatDate = (dayOffset: number) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + dayOffset);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Week {currentDate.getWeek()}</h1>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="grid grid-cols-5 border-b bg-muted">
          {days.map((day, index) => (
            <div key={day} className="p-4 border-r last:border-r-0">
              <div className="font-medium">{day} - {formatDate(index)}</div>
            </div>
          ))}
        </div>

        <div className="divide-y">
          {["Marketing", "Development", "Design"].map((team) => (
            <div key={team} className="grid grid-cols-5">
              {days.map((day) => (
                <div key={`${team}-${day}`} className="p-4 border-r last:border-r-0 min-h-[120px] relative">
                  {tasks
                    .filter((task) => task.day === day)
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`${task.color} border p-3 rounded-md mb-2 cursor-pointer hover:scale-[1.02] transition-transform`}
                      >
                        <div className="font-medium text-sm">{task.title}</div>
                        {task.subtitle && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {task.subtitle}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {task.assignee}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get week number
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function(): number {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export default Timeline;