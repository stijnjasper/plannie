export interface Project {
  id: string;
  name: string;
  color: string;
}

export const PROJECTS: Project[] = [
  { id: "1", name: "Company internal", color: "bg-blue-100" },
  { id: "2", name: "Client meeting", color: "bg-green-100" },
  { id: "3", name: "Project planning", color: "bg-yellow-100" },
  { id: "4", name: "Team sync", color: "bg-purple-100" },
  { id: "5", name: "Training", color: "bg-pink-100" },
  { id: "6", name: "Documentation", color: "bg-orange-100" },
];