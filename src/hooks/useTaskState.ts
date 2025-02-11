
import { useState } from "react";
import { Task } from "@/types/calendar";
import { getISOWeek } from "date-fns";
import { useTaskQueries } from "./tasks/useTaskQueries";
import { useTaskMutations } from "./tasks/useTaskMutations";

export const useTaskState = (initialDate: Date) => {
  const [tasksByWeek, setTasksByWeek] = useState<Record<number, Task[]>>({});
  const { data: fetchedTasks } = useTaskQueries(initialDate);
  const { updateTask: updateTaskMutation, addTask: addTaskMutation, deleteTask: deleteTaskMutation, duplicateTask: duplicateTaskMutation } = useTaskMutations();

  const currentWeek = getISOWeek(initialDate);

  // Sort tasks by type (range vs single) and order_timestamp
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // First, sort by range (range tasks come first)
      const aIsRange = !!a.endDay;
      const bIsRange = !!b.endDay;
      if (aIsRange !== bIsRange) {
        return aIsRange ? -1 : 1;
      }
      // Then sort by order_timestamp
      const aTime = a.orderTimestamp ? new Date(a.orderTimestamp).getTime() : 0;
      const bTime = b.orderTimestamp ? new Date(b.orderTimestamp).getTime() : 0;
      return aTime - bTime;
    });
  };

  // Update local state when tasks are fetched
  if (fetchedTasks && !tasksByWeek[currentWeek]) {
    setTasksByWeek(prev => ({
      ...prev,
      [currentWeek]: sortTasks(fetchedTasks)
    }));
  }

  const updateTask = async (weekNumber: number, updatedTask: Task) => {
    const result = await updateTaskMutation(weekNumber, updatedTask);
    if (result) {
      setTasksByWeek(prev => ({
        ...prev,
        [weekNumber]: sortTasks(prev[weekNumber].map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )),
      }));
    }
  };

  const addTask = async (weekNumber: number, newTask: Task) => {
    const result = await addTaskMutation(weekNumber, newTask);
    if (result) {
      setTasksByWeek(prev => ({
        ...prev,
        [weekNumber]: sortTasks([...(prev[weekNumber] || []), newTask]),
      }));
    }
  };

  const deleteTask = async (weekNumber: number, taskId: string) => {
    const success = await deleteTaskMutation(weekNumber, taskId);
    if (success) {
      setTasksByWeek(prev => ({
        ...prev,
        [weekNumber]: sortTasks(prev[weekNumber].filter((task) => task.id !== taskId)),
      }));
    }
  };

  const duplicateTask = async (weekNumber: number, task: Task) => {
    const result = await duplicateTaskMutation(weekNumber, task);
    if (result) {
      setTasksByWeek(prev => ({
        ...prev,
        [weekNumber]: sortTasks([...prev[weekNumber], result]),
      }));
    }
  };

  return {
    tasksByWeek,
    updateTask,
    addTask,
    deleteTask,
    duplicateTask,
  };
};
