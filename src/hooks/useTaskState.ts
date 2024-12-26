import { useState } from "react";
import { Task } from "@/types/calendar";
import { useTaskQueries } from "./tasks/useTaskQueries";
import { useTaskMutations } from "./tasks/useTaskMutations";

export const useTaskState = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [quickMenuPosition, setQuickMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { tasks, teams, isLoadingTasks } = useTaskQueries();
  const { createTask, updateTask, deleteTask } = useTaskMutations();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleQuickMenuOpen = (day: string, position: { x: number; y: number }) => {
    setSelectedDay(day);
    setQuickMenuPosition(position);
    setIsQuickMenuOpen(true);
  };

  const handleQuickMenuClose = () => {
    setIsQuickMenuOpen(false);
    setSelectedDay(null);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  return {
    tasks,
    teams,
    isLoadingTasks,
    selectedTask,
    isTaskModalOpen,
    isQuickMenuOpen,
    quickMenuPosition,
    selectedDay,
    createTask,
    updateTask,
    deleteTask,
    handleTaskClick,
    handleQuickMenuOpen,
    handleQuickMenuClose,
    handleTaskModalClose,
  };
};