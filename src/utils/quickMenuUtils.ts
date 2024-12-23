import { Project } from "@/data/projects";

export const filterProjects = (projects: Project[], searchQuery: string) => {
  return projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const resetQuickMenuState = (
  setSelectedProject: (project: Project | null) => void,
  setTimeBlock: (timeBlock: 2 | 4 | 6 | 8) => void,
  setDescription: (description: string) => void,
  setSearchQuery: (query: string) => void
) => {
  setSelectedProject(null);
  setTimeBlock(2);
  setDescription("");
  setSearchQuery("");
};