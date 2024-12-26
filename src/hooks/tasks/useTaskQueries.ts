import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/calendar";

export const useTaskQueries = () => {
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          assignee:assignee_id (
            id,
            full_name,
            avatar_url,
            role,
            team_id,
            teams:team_id (
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map the data to match the Task type
      return data.map((task: any): Task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        assignee: task.assignee?.id || "",
        day: task.start_day,
        endDay: task.end_day,
        color: task.color,
        team: task.assignee?.teams?.name || "",
        timeBlock: task.time_block,
        recurrencePattern: task.recurrence_pattern,
      }));
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return {
    tasks: tasks || [],
    teams: teams || [],
    isLoadingTasks,
  };
};