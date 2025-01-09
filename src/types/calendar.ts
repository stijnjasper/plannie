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

export interface TeamMember {
  id: string;
  full_name: string;
  role?: string;
  team_id?: string;
  avatar_url?: string;
  is_admin?: boolean;
  status: "active" | "deactivated";
  // UI specific aliases
  name: string;
  title: string;
  avatar: string;
  team: string | null;
}