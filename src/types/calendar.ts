export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  assignee: string;
  day: string;
  color: string;
  team: string;
  timeBlock?: "whole-day" | "morning" | "afternoon";
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
  team: string;
}