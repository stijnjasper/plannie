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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search Projects</Label>
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="dark:bg-[#1b1b1b] dark:border-[#333333]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectSelect(project)}
            className={cn(
              project.color,
              "p-3 rounded-md text-left transition-all border",
              "dark:text-[#f0f0f0] dark:border-[#333333]",
              selectedProject?.id === project.id
                ? "ring-2 ring-ring ring-offset-2 dark:ring-offset-[#1b1b1b]"
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