import { useState } from "react";
import { Task } from "@/types/calendar";
import { getISOWeek } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export const useTaskState = (initialDate: Date) => {
  const [tasksByWeek, setTasksByWeek] = useState<Record<number, Task[]>>({
    [getISOWeek(initialDate)]: [
      {
        id: "1",
        title: "Design Review",
        subtitle: "UI Suite Pages",
        description: "Review the latest UI designs for the platform upgrade",
        assignee: "Sarah Chen",
        day: "Mon",
        color: "bg-[#34C759]/10 border-[#34C759]/20",
        team: "Design",
        timeBlock: "morning"
      },
      {
        id: "2",
        title: "Team Meeting",
        subtitle: "Sprint Planning",
        description: "Weekly sprint planning session with the development team",
        assignee: "Mike Johnson",
        day: "Wed",
        color: "bg-[#FF9500]/10 border-[#FF9500]/20",
        team: "Development",
        timeBlock: "afternoon"
      },
    ]
  });

  const { toast } = useToast();

  const updateTask = (weekNumber: number, updatedTask: Task) => {
    setTasksByWeek((prev) => ({
      ...prev,
      [weekNumber]: prev[weekNumber].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  };

  const addTask = (weekNumber: number, newTask: Task) => {
    setTasksByWeek((prev) => ({
      ...prev,
      [weekNumber]: [...(prev[weekNumber] || []), newTask],
    }));
  };

  const deleteTask = (weekNumber: number, taskId: string) => {
    setTasksByWeek((prev) => ({
      ...prev,
      [weekNumber]: prev[weekNumber].filter((task) => task.id !== taskId),
    }));
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    });
  };

  const duplicateTask = (weekNumber: number, task: Task) => {
    const duplicatedTask = {
      ...task,
      id: Math.random().toString(),
    };
    addTask(weekNumber, duplicatedTask);
    toast({
      title: "Task duplicated",
      description: "The task has been duplicated successfully.",
    });
  };

  return {
    tasksByWeek,
    updateTask,
    addTask,
    deleteTask,
    duplicateTask,
  };
};