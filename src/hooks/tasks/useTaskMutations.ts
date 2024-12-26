import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/calendar";
import { toast } from "sonner";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: async (task: Omit<Task, "id">) => {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .eq("name", task.team)
        .single();

      if (teamError) {
        throw new Error(`Team not found: ${task.team}`);
      }

      const { error } = await supabase.from("tasks").insert({
        title: task.title,
        description: task.description,
        assignee_id: task.assignee,
        start_day: task.day,
        end_day: task.endDay,
        color: task.color,
        team_id: teamData.id,
        time_block: task.timeBlock,
        recurrence_pattern: task.recurrencePattern,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Taak succesvol aangemaakt");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("Er ging iets mis bij het aanmaken van de taak");
    },
  });

  const updateTask = useMutation({
    mutationFn: async (task: Task) => {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .eq("name", task.team)
        .single();

      if (teamError) {
        throw new Error(`Team not found: ${task.team}`);
      }

      const { error } = await supabase
        .from("tasks")
        .update({
          title: task.title,
          description: task.description,
          assignee_id: task.assignee,
          start_day: task.day,
          end_day: task.endDay,
          color: task.color,
          team_id: teamData.id,
          time_block: task.timeBlock,
          recurrence_pattern: task.recurrencePattern,
        })
        .eq("id", task.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Taak succesvol bijgewerkt");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast.error("Er ging iets mis bij het bijwerken van de taak");
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Taak succesvol verwijderd");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast.error("Er ging iets mis bij het verwijderen van de taak");
    },
  });

  return {
    createTask,
    updateTask,
    deleteTask,
  };
};