import { useState } from "react";
import TeamRow from "./calendar/TeamRow";
import WeekHeader from "./calendar/WeekHeader";
import TaskAssignmentModal from "./calendar/TaskAssignmentModal";
import ViewTaskModal from "./calendar/ViewTaskModal";
import { addWeeks, subWeeks, getISOWeek } from "date-fns";
import { Task } from "@/types/calendar";
import { useTaskState } from "@/hooks/useTaskState";
import { useTeamState } from "@/hooks/useTeamState";
import { useToast } from "@/components/ui/use-toast";

const Timeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasksByWeek, updateTask, addTask, deleteTask, duplicateTask } = useTaskState(currentDate);
  const { teamMembers, openTeams, toggleTeam } = useTeamState();
  const { toast } = useToast();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedDay: "",
    selectedTeam: "",
    editingTask: null as Task | null,
  });

  const currentWeek = getISOWeek(currentDate);
  const currentTasks = tasksByWeek[currentWeek] || [];

  const handlePreviousWeek = () => setCurrentDate((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate((prev) => addWeeks(prev, 1));

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "1";
  };

  const handleDrop = (e: React.DragEvent, targetDay: string, targetTeam: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const updatedTasks = currentTasks.map((task) =>
      task.id === taskId ? { ...task, day: targetDay, team: targetTeam } : task
    );
    tasksByWeek[currentWeek] = updatedTasks;
  };

  const handleCellClick = (day: string, team: string) => {
    setModalState({
      isOpen: true,
      selectedDay: day,
      selectedTeam: team,
      editingTask: null,
    });
  };

  const handleModalSave = (project: any, timeBlock: "whole-day" | "morning" | "afternoon", description?: string) => {
    if (modalState.editingTask) {
      const updatedTask = {
        ...modalState.editingTask,
        title: project.name,
        subtitle: `(${timeBlock})`,
        description,
        color: project.color,
        timeBlock,
      };
      updateTask(currentWeek, updatedTask);
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
        timeBlock,
      };
      addTask(currentWeek, newTask);
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, editingTask: null }));
  };

  const handleCopyLink = (taskId: string) => {
    const link = `/calendar-item/${taskId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "The task link has been copied to clipboard.",
    });
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onCellClick={handleCellClick}
            onEditTask={(task) => setModalState({ ...modalState, isOpen: true, editingTask: task })}
            onDuplicateTask={(task) => duplicateTask(currentWeek, task)}
            onCopyLink={handleCopyLink}
            onDeleteTask={(taskId) => deleteTask(currentWeek, taskId)}
            onViewTask={(task) => {
              setSelectedTask(task);
              setViewModalOpen(true);
            }}
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