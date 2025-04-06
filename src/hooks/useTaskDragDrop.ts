
import { useCallback } from "react";
import { Task } from "@/types/calendar";

export const useTaskDragDrop = (currentWeek: number, updateTask: (week: number, task: Task) => void) => {
  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("altKey", e.altKey.toString());
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "0.5";
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "1";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetDay: string, targetTeam: string, targetAssignee: string, currentTasks: Task[]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const wasAltKeyPressed = e.dataTransfer.getData("altKey") === "true" || e.altKey;
    const taskToUpdate = currentTasks.find(task => task.id === taskId);
    
    if (taskToUpdate) {
      // Wanneer we een range-taak verplaatsen, behouden we de duur
      const durationInDays = taskToUpdate.endDay 
        ? (new Date(taskToUpdate.endDay).getTime() - new Date(taskToUpdate.day).getTime()) / (1000 * 3600 * 24)
        : 0;
      
      let newEndDay = undefined;
      if (taskToUpdate.endDay) {
        const targetDate = new Date(targetDay);
        const newEndDate = new Date(targetDate);
        newEndDate.setDate(targetDate.getDate() + durationInDays);
        newEndDay = newEndDate.toISOString().split('T')[0];
      }
      
      const updatedTask = {
        ...taskToUpdate,
        day: targetDay,
        endDay: newEndDay,
        team: targetTeam,
        assignee: targetAssignee, // Nu ook de assignee bijwerken
        id: wasAltKeyPressed ? crypto.randomUUID() : taskToUpdate.id
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
