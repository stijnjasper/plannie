import { Project } from "@/types/calendar";

export const filterProjects = (projects: Project[], searchQuery: string) => {
  return projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const resetQuickMenuState = (
  setSelectedProject: (project: Project | null) => void,
  setTimeBlock: (timeBlock: "whole-day" | "morning" | "afternoon") => void,
  setDescription: (description: string) => void,
  setSearchQuery: (query: string) => void
) => {
  setSelectedProject(null);
  setTimeBlock("whole-day");
  setDescription("");
  setSearchQuery("");
};