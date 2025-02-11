
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/calendar";
import { format, startOfWeek, endOfWeek } from "date-fns";

export const useTaskQueries = (currentDate: Date) => {
  const fetchTasks = async () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    const startDate = format(weekStart, 'yyyy-MM-dd');
    const endDate = format(weekEnd, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles(full_name),
        team:teams(name)
      `)
      .or(`and(start_day.gte.${startDate},start_day.lte.${endDate}),and(end_day.gte.${startDate},start_day.lt.${startDate})`)
      .order('order_timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      assignee: task.assignee?.full_name || "",
      day: task.start_day,
      endDay: task.end_day,
      color: task.color,
      team: task.team?.name || "",
      timeBlock: task.time_block as 2 | 4 | 6 | 8,
      orderTimestamp: task.order_timestamp
    }));
  };

  return useQuery({
    queryKey: ['tasks', format(currentDate, 'yyyy-MM-dd')],
    queryFn: fetchTasks
  });
};
