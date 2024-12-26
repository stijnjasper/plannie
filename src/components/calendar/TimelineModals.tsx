import TaskAssignmentModal from "./TaskAssignmentModal";
import ViewTaskModal from "./ViewTaskModal";
import { Task, TeamMember } from "@/types/calendar";

interface TimelineModalsProps {
  modalState: {
    isOpen: boolean;
    selectedDay: string;
    selectedTeam: string;
    editingTask: Task | null;
  };
  viewModalOpen: boolean;
  selectedTask: Task | null;
  teamMembers: TeamMember[];
  onModalClose: () => void;
  onViewModalClose: () => void;
  onModalSave: (project: any, timeBlock: 2 | 4 | 6 | 8, description?: string) => void;
}

const TimelineModals = ({
  modalState,
  viewModalOpen,
  selectedTask,
  teamMembers,
  onModalClose,
  onViewModalClose,
  onModalSave,
}: TimelineModalsProps) => {
  return (
    <>
      <TaskAssignmentModal
        isOpen={modalState.isOpen}
        onClose={onModalClose}
        onSave={onModalSave}
        selectedDate={modalState.selectedDay}
        teamMember={teamMembers.find(member => member.team === modalState.selectedTeam)?.name || ""}
        editingTask={modalState.editingTask}
      />

      <ViewTaskModal
        isOpen={viewModalOpen}
        onClose={onViewModalClose}
        task={selectedTask}
      />
    </>
  );
};

export default TimelineModals;