import { useState, useEffect } from "react";
import { Task } from "@/types/calendar";
import { getISOWeek } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useTaskState = (initialDate: Date) => {
  const [tasksByWeek, setTasksByWeek] = useState<Record<number, Task[]>>({});
  const { toast } = useToast();

  // Fetch tasks for the current week
  useEffect(() => {
    const fetchTasks = async () => {
      const weekNumber = getISOWeek(initialDate);
      const startOfWeek = new Date(initialDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles(full_name),
          team:teams(name)
        `)
        .gte('start_day', startOfWeek.toISOString().split('T')[0])
        .lte('start_day', endOfWeek.toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      const formattedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        assignee: task.assignee?.full_name || "",
        day: task.start_day, // Map start_day to day for backwards compatibility
        color: task.color,
        team: task.team?.name || "",
        timeBlock: task.time_block as 2 | 4 | 6 | 8
      }));

      setTasksByWeek(prev => ({
        ...prev,
        [weekNumber]: formattedTasks
      }));
    };

    fetchTasks();
  }, [initialDate]);

  const updateTask = async (weekNumber: number, updatedTask: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update({
        title: updatedTask.title,
        description: updatedTask.description,
        start_day: updatedTask.day, // Map day to start_day
        color: updatedTask.color,
        time_block: updatedTask.timeBlock,
        team_id: await getTeamId(updatedTask.team)
      })
      .eq('id', updatedTask.id);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    setTasksByWeek(prev => ({
      ...prev,
      [weekNumber]: prev[weekNumber].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  };

  const addTask = async (weekNumber: number, newTask: Task) => {
    const { data: teamData } = await supabase
      .from('teams')
      .select('id')
      .eq('name', newTask.team)
      .single();

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', newTask.assignee)
      .single();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: newTask.title,
        description: newTask.description,
        assignee_id: profileData?.id,
        start_day: newTask.day, // Map day to start_day
        color: newTask.color,
        team_id: teamData?.id,
        time_block: newTask.timeBlock
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    setTasksByWeek(prev => ({
      ...prev,
      [weekNumber]: [...(prev[weekNumber] || []), newTask],
    }));
  };

  const deleteTask = async (weekNumber: number, taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return;
    }

    setTasksByWeek(prev => ({
      ...prev,
      [weekNumber]: prev[weekNumber].filter((task) => task.id !== taskId),
    }));
    
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    });
  };

  const duplicateTask = async (weekNumber: number, task: Task) => {
    const duplicatedTask = {
      ...task,
      id: crypto.randomUUID()
    };
    
    await addTask(weekNumber, duplicatedTask);
    
    toast({
      title: "Task duplicated",
      description: "The task has been duplicated successfully.",
    });
  };

  const getTeamId = async (teamName: string) => {
    const { data } = await supabase
      .from('teams')
      .select('id')
      .eq('name', teamName)
      .single();
    
    return data?.id;
  };

  return {
    tasksByWeek,
    updateTask,
    addTask,
    deleteTask,
    duplicateTask,
  };
};