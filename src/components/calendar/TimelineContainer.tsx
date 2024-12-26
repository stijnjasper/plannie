import { useEffect } from "react";
import { getISOWeek, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { useTaskState } from "@/hooks/useTaskState";
import { useTeamState } from "@/hooks/useTeamState";
import { useTimelineState } from "@/hooks/useTimelineState";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext } from "./DragDropContext";
import TimelineHeader from "./TimelineHeader";
import TimelineContent from "./TimelineContent";
import TimelineModals from "./TimelineModals";

const TimelineContainer = () => {
  const {
    currentDate,
    setCurrentDate,
    selectedTask,
    setSelectedTask,
    viewModalOpen,
    setViewModalOpen,
    modalState,
    setModalState,
    handleModalClose,
    handleCellClick,
  } = useTimelineState();

  const { tasksByWeek, updateTask, addTask, deleteTask, duplicateTask } = useTaskState(currentDate);
  const { teamMembers, openTeams, toggleTeam } = useTeamState();
  const { toast } = useToast();

  const currentWeek = getISOWeek(currentDate);
  const currentTasks = tasksByWeek[currentWeek] || [];

  const handlePreviousWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
  const handleTodayClick = () => setCurrentDate(new Date());

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

  const handleModalSave = (project: any, timeBlock: 2 | 4 | 6 | 8, description?: string) => {
    if (modalState.editingTask) {
      const updatedTask = {
        ...modalState.editingTask,
        title: project.name,
        description,
        color: project.color,
        timeBlock,
      };
      updateTask(currentWeek, updatedTask);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: project.name,
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
        />

        <TimelineModals
          modalState={modalState}
          viewModalOpen={viewModalOpen}
          selectedTask={selectedTask}
          teamMembers={teamMembers}
          onModalClose={handleModalClose}
          onViewModalClose={() => setViewModalOpen(false)}
          onModalSave={handleModalSave}
        />
      </div>
    </DragDropContext.Provider>
  );
};

export default TimelineContainer;