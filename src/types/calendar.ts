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
  name: string;
  title: string;
  avatar: string;
  team: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}