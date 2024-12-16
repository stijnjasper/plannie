import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectSelectorProps {
  selectedProject: Project | null;
  onProjectSelect: (project: Project) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const ProjectSelector = ({
  selectedProject,
  onProjectSelect,
  searchQuery,
  onSearchQueryChange,
}: ProjectSelectorProps) => {
  const filteredProjects = PROJECTS.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProjectColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-100': 'bg-task-blue-light dark:bg-task-blue-dark',
      'bg-green-100': 'bg-task-green-light dark:bg-task-green-dark',
      'bg-yellow-100': 'bg-task-yellow-light dark:bg-task-yellow-dark',
      'bg-purple-100': 'bg-task-purple-light dark:bg-task-purple-dark',
      'bg-pink-100': 'bg-task-purple-light dark:bg-task-purple-dark',
      'bg-orange-100': 'bg-task-yellow-light dark:bg-task-yellow-dark',
    };
    return colorMap[color] || color;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search Projects</Label>
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectSelect(project)}
            className={cn(
              getProjectColor(project.color),
              "p-3 rounded-md text-left transition-all border",
              "dark:border-gray-700 dark:text-gray-100",
              selectedProject?.id === project.id
                ? "ring-2 ring-ring ring-offset-2 dark:ring-offset-gray-900"
                : ""
            )}
          >
            {project.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;