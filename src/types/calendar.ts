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
}

export interface TeamMember {
  id: string;
  full_name: string;
  role: string | null;
  team_id: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  status: "active" | "deactivated";
  // UI specific aliases
  name: string;
  title: string;
  avatar: string;
  // Virtual property from the teams join
  team?: string | null;
}