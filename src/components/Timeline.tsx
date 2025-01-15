import { getISOWeek } from "date-fns";
import { format } from "date-fns";
import { Task } from "@/types/calendar";
import { useTaskState } from "@/hooks/useTaskState";
import { useTeamState } from "@/hooks/useTeamState";
import { useTeamRowsState } from "@/hooks/useTeamRowsState";
import { useTimelineState } from "@/hooks/useTimelineState";
import { useTaskModal } from "@/hooks/useTaskModal";
import { useTaskDragDrop } from "@/hooks/useTaskDragDrop";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext } from "./calendar/DragDropContext";
import TimelineHeader from "./calendar/TimelineHeader";
import TimelineContent from "./calendar/TimelineContent";
import TaskAssignmentModal from "./calendar/TaskAssignmentModal";
import ViewTaskModal from "./calendar/ViewTaskModal";

const Timeline = () => {
  const { currentDate, handlePreviousWeek, handleNextWeek, handleTodayClick } = useTimelineState();
  const { tasksByWeek, updateTask, addTask, deleteTask, duplicateTask } = useTaskState(currentDate);
  const { teamMembers } = useTeamState();
  const { openTeams, toggleTeam } = useTeamRowsState();
  const { toast } = useToast();

  const {
    selectedTask,
    setSelectedTask,
    viewModalOpen,
    setViewModalOpen,
    modalState,
    setModalState,
    handleModalClose,
    handleCellClick,
  } = useTaskModal();

  const currentWeek = getISOWeek(currentDate);
  const currentTasks = tasksByWeek[currentWeek] || [];

  const { handleDragStart, handleDragEnd, handleDrop } = useTaskDragDrop(
    currentWeek,
    updateTask
  );

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
    handleDrop: (e: React.DragEvent, day: string, team: string) => 
      handleDrop(e, day, team, currentTasks),
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