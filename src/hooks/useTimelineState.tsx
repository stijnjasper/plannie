import { useState } from "react";
import { Task } from "@/types/calendar";

interface ModalState {
  isOpen: boolean;
  selectedDay: string;
  selectedTeam: string;
  editingTask: Task | null;
}

export const useTimelineState = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    selectedDay: "",
    selectedTeam: "",
    editingTask: null,
  });

  const handleModalClose = () => {
    setModalState(prev => ({ ...prev, isOpen: false, editingTask: null }));
  };

  const handleCellClick = (day: string, team: string) => {
    setModalState({
      isOpen: true,
      selectedDay: day,
      selectedTeam: team,
      editingTask: null,
    });
  };

  return {
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
  };
};