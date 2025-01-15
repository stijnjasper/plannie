import { useState, useEffect } from "react";
import { getISOWeek, startOfWeek, addWeeks, subWeeks, format } from "date-fns";
import { Task } from "@/types/calendar";
import { useTaskState } from "@/hooks/useTaskState";
import { useTeamState } from "@/hooks/useTeamState";
import { useTeamRowsState } from "@/hooks/useTeamRowsState";
import { useToast } from "@/components/ui/use-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { DragDropContext } from "./calendar/DragDropContext";
import TimelineHeader from "./calendar/TimelineHeader";
import TimelineContent from "./calendar/TimelineContent";
import TaskAssignmentModal from "./calendar/TaskAssignmentModal";
import ViewTaskModal from "./calendar/ViewTaskModal";

const Timeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasksByWeek, updateTask, addTask, deleteTask, duplicateTask } = useTaskState(currentDate);
  const { teamMembers } = useTeamState();
  const { openTeams, toggleTeam } = useTeamRowsState();
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

  const handlePreviousWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
  const handleTodayClick = () => setCurrentDate(new Date());

  // Add hotkeys for week navigation
  useHotkeys('meta+left, ctrl+left', handlePreviousWeek, { preventDefault: true });
  useHotkeys('meta+right, ctrl+right', handleNextWeek, { preventDefault: true });

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
    const taskToUpdate = currentTasks.find(task => task.id === taskId);
    
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        day: targetDay,
        team: targetTeam
      };
      updateTask(currentWeek, updatedTask);
    }
  };

  const handleCellClick = (day: string, team: string) => {
    setModalState({
      isOpen: true,
      selectedDay: day,
      selectedTeam: team,
      editingTask: null,
    });
  };

  const handleModalSave = (project: any, timeBlock: 2 | 4 | 6 | 8, description?: string, selectedDate?: Date) => {
    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : modalState.selectedDay;
    
    if (modalState.editingTask) {
      const updatedTask = {
        ...modalState.editingTask,
        title: project.name,
        description,
        color: project.color,
        timeBlock,
        day: formattedDate,
      };
      updateTask(currentWeek, updatedTask);
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: project.name,
        description,
        assignee: teamMembers.find(member => member.team === modalState.selectedTeam)?.name || "",
        day: formattedDate,
        color: project.color,
        team: modalState.selectedTeam,
        timeBlock,
      };
      addTask(currentWeek, newTask);
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    setModalState(prev => ({ ...prev, isOpen: false, editingTask: null }));
  };

  const handleCopyLink = (taskId: string) => {
    const link = `/calendar-item/${taskId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "The task link has been copied to clipboard.",
    });
  };

  const dragDropContextValue = {
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };

  return (
    <DragDropContext.Provider value={dragDropContextValue}>
      <div className="w-full max-w-[1400px] mx-auto p-6 animate-fade-in">
        <TimelineHeader
          currentDate={currentDate}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onTodayClick={handleTodayClick}
        />

        <TimelineContent
          tasks={currentTasks}
          teamMembers={teamMembers}
          openTeams={openTeams}
          onToggleTeam={toggleTeam}
          onEditTask={(task) => setModalState({ ...modalState, isOpen: true, editingTask: task })}
          onDuplicateTask={(task) => duplicateTask(currentWeek, task)}
          onCopyLink={handleCopyLink}
          onDeleteTask={(taskId) => deleteTask(currentWeek, taskId)}
          onViewTask={(task) => {
            setSelectedTask(task);
            setViewModalOpen(true);
          }}
          onCellClick={handleCellClick}
          currentDate={currentDate}
        />

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
    </DragDropContext.Provider>
  );
};

export default Timeline;
