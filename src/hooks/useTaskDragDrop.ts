import { useCallback } from "react";
import { Task } from "@/types/calendar";

export const useTaskDragDrop = (currentWeek: number, updateTask: (week: number, task: Task) => void) => {
  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "0.5";
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "1";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetDay: string, targetTeam: string, currentTasks: Task[]) => {
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
  }, [currentWeek, updateTask]);

  return {
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
};