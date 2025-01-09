export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  assignee: string;
  day: string;
  color: string;
  team: string;
  timeBlock: 2 | 4 | 6 | 8;
  endDay?: string;
  recurrencePattern?: any;
}