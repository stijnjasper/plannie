import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TeamMemberList from "./calendar/TeamMemberList";
import DayColumn from "./calendar/DayColumn";

interface Task {
  id: string;
  title: string;
  subtitle?: string;
  assignee: string;
  day: string;
  color: string;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
  team: string;
}

const Timeline = () => {
  const [tasks, setTasks] = useState<Task[]>([
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

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Chen",
      title: "Lead Designer",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      team: "Design",
    },
    {
      id: "2",
      name: "Mike Johnson",
      title: "Frontend Developer",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
      team: "Development",
    },
    {
      id: "3",
      name: "Emma Davis",
      title: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      team: "Marketing",
    },
  ]);

  const currentDate = new Date();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const formatDate = (dayOffset: number) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + dayOffset);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDay: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, day: targetDay }
          : task
      )
    );
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
        <div className="grid grid-cols-[200px_1fr]">
          <div className="p-4 bg-muted border-b font-medium">People</div>
          <div className="grid grid-cols-5 border-b bg-muted">
            {days.map((day, index) => (
              <div key={day} className="p-4 border-r last:border-r-0">
                <div className="font-medium">{day} - {formatDate(index)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {["Marketing", "Development", "Design"].map((team) => (
            <div key={team} className="grid grid-cols-[200px_1fr]">
              <TeamMemberList teamMembers={teamMembers} team={team} />
              <div className="grid grid-cols-5">
                {days.map((day) => (
                  <DayColumn
                    key={`${team}-${day}`}
                    day={day}
                    tasks={tasks}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
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