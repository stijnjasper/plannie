import { useState } from "react";
import TeamRow from "./calendar/TeamRow";
import WeekHeader from "./calendar/WeekHeader";
import TaskAssignmentModal from "./calendar/TaskAssignmentModal";
import ViewTaskModal from "./calendar/ViewTaskModal";
import { addWeeks, subWeeks, format, getISOWeek } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Task, TeamMember } from "@/types/calendar";

const Timeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasksByWeek, setTasksByWeek] = useState<Record<number, Task[]>>({
    [getISOWeek(currentDate)]: [
      {
        id: "1",
        title: "Design Review",
        subtitle: "UI Suite Pages",
        description: "Review the latest UI designs for the platform upgrade",
        assignee: "Sarah Chen",
        day: "Mon",
        color: "bg-[#34C759]/10 border-[#34C759]/20",
        team: "Design",
        timeBlock: "morning"
      },
      {
        id: "2",
        title: "Team Meeting",
        subtitle: "Sprint Planning",
        description: "Weekly sprint planning session with the development team",
        assignee: "Mike Johnson",
        day: "Wed",
        color: "bg-[#FF9500]/10 border-[#FF9500]/20",
        team: "Development",
        timeBlock: "afternoon"
      },
    ]
  });

  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

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

  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({
    Marketing: true,
    Development: true,
    Design: true,
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedDay: "",
    selectedTeam: "",
    editingTask: null as Task | null,
  });

  const currentWeek = getISOWeek(currentDate);
  const currentTasks = tasksByWeek[currentWeek] || [];

  const handlePreviousWeek = () => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
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

  const handleDrop = (e: React.DragEvent, targetDay: string, targetTeam: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    setTasksByWeek((prevTasksByWeek) => {
      const updatedTasks = (prevTasksByWeek[currentWeek] || []).map((task) =>
        task.id === taskId ? { ...task, day: targetDay, team: targetTeam } : task
      );
      return {
        ...prevTasksByWeek,
        [currentWeek]: updatedTasks,
      };
    });
  };

  const handleCellClick = (day: string, team: string) => {
    setModalState({
      isOpen: true,
      selectedDay: day,
      selectedTeam: team,
      editingTask: null,
    });
  };

  const handleEditTask = (task: Task) => {
    setModalState({
      isOpen: true,
      selectedDay: task.day,
      selectedTeam: task.team,
      editingTask: task,
    });
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  const handleModalClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, editingTask: null }));
  };

  const handleModalSave = (project: any, timeBlock: string, description?: string) => {
    if (modalState.editingTask) {
      setTasksByWeek((prev) => ({
        ...prev,
        [currentWeek]: prev[currentWeek].map((task) =>
          task.id === modalState.editingTask?.id
            ? {
                ...task,
                title: project.name,
                subtitle: `(${timeBlock})`,
                description,
                color: project.color,
                timeBlock,
              }
            : task
        ),
      }));
    } else {
      const newTask: Task = {
        id: Math.random().toString(),
        title: project.name,
        subtitle: `(${timeBlock})`,
        description,
        assignee: teamMembers.find(member => member.team === modalState.selectedTeam)?.name || "",
        day: modalState.selectedDay,
        color: project.color,
        team: modalState.selectedTeam,
        timeBlock: timeBlock as Task["timeBlock"],
      };

      setTasksByWeek((prev) => ({
        ...prev,
        [currentWeek]: [...(prev[currentWeek] || []), newTask],
      }));
    }
  };

  const handleDuplicateTask = (task: Task) => {
    const duplicatedTask = {
      ...task,
      id: Math.random().toString(),
    };

    setTasksByWeek((prev) => ({
      ...prev,
      [currentWeek]: [...(prev[currentWeek] || []), duplicatedTask],
    }));

    toast({
      title: "Task duplicated",
      description: "The task has been duplicated successfully.",
    });
  };

  const handleCopyLink = (taskId: string) => {
    const link = `/calendar-item/${taskId}`;
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link copied",
      description: "The task link has been copied to clipboard.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasksByWeek((prev) => ({
      ...prev,
      [currentWeek]: (prev[currentWeek] || []).filter((task) => task.id !== taskId),
    }));

    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    });
  };

  const toggleTeam = (team: string) => {
    setOpenTeams((prev) => ({
      ...prev,
      [team]: !prev[team],
    }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 space-y-6 animate-fade-in">
      <WeekHeader
        currentDate={currentDate}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      <div className="relative overflow-hidden rounded-lg border bg-white shadow-sm">
        {["Marketing", "Development", "Design"].map((team) => (
          <TeamRow
            key={team}
            team={team}
            isOpen={openTeams[team]}
            onToggle={() => toggleTeam(team)}
            teamMembers={teamMembers}
            tasks={currentTasks.filter((task) => task.team === team)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onCellClick={handleCellClick}
            onEditTask={handleEditTask}
            onDuplicateTask={handleDuplicateTask}
            onCopyLink={handleCopyLink}
            onDeleteTask={handleDeleteTask}
            onViewTask={handleViewTask}
          />
        ))}
      </div>

      <TaskAssignmentModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        selectedDate={modalState.selectedDay}
        teamMember={teamMembers.find(member => member.team === modalState.selectedTeam)?.name || ""}
        editingTask={modalState.editingTask}
      />

      <ViewTaskModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};

export default Timeline;