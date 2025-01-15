import { useState } from "react";
import { Task } from "@/types/calendar";

export const useTaskModal = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedDay: "",
    selectedTeam: "",
    editingTask: null as Task | null,
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