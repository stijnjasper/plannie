import { Task } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTaskMutations = () => {
  const { toast } = useToast();

  const getTeamId = async (teamName: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('teams')
      .select('id')
      .eq('name', teamName)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching team:', error);
      return null;
    }
    
    return data?.id || null;
  };

  const getAssigneeId = async (assigneeName: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', assigneeName)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching assignee:', error);
      return null;
    }
    
    return data?.id || null;
  };

  const updateTask = async (weekNumber: number, updatedTask: Task) => {
    const teamId = await getTeamId(updatedTask.team);
    if (!teamId) {
      toast({
        title: "Error",
        description: `Team "${updatedTask.team}" not found`,
        variant: "destructive",
      });
      return null;
    }

    const { error } = await supabase
      .from('tasks')
      .update({
        title: updatedTask.title,
        description: updatedTask.description,
        start_day: updatedTask.day,
        color: updatedTask.color,
        time_block: updatedTask.timeBlock,
        team_id: teamId
      })
      .eq('id', updatedTask.id);

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }

    return updatedTask;
  };

  const addTask = async (weekNumber: number, newTask: Task) => {
    const teamId = await getTeamId(newTask.team);
    if (!teamId) {
      toast({
        title: "Error",
        description: `Team "${newTask.team}" not found`,
        variant: "destructive",
      });
      return null;
    }

    const assigneeId = await getAssigneeId(newTask.assignee);
    if (!assigneeId) {
      toast({
        title: "Error",
        description: `Assignee "${newTask.assignee}" not found`,
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: newTask.title,
        description: newTask.description,
        assignee_id: assigneeId,
        start_day: newTask.day,
        color: newTask.color,
        team_id: teamId,
        time_block: newTask.timeBlock
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Could not add task",
        variant: "destructive",
      });
      return null;
    }

    return newTask;
  };

  const deleteTask = async (weekNumber: number, taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Could not delete task",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    });
    return true;
  };

  const duplicateTask = async (weekNumber: number, task: Task) => {
    const duplicatedTask = {
      ...task,
      id: crypto.randomUUID()
    };
    
    const result = await addTask(weekNumber, duplicatedTask);
    
    if (result) {
      toast({
        title: "Task duplicated",
        description: "The task has been duplicated successfully.",
      });
    }
    
    return result;
  };

  return {
    updateTask,
    addTask,
    deleteTask,
    duplicateTask,
  };
};