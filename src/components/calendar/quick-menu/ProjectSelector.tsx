import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";

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
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectSelect(project)}
            className={`${project.color} p-3 rounded-md text-left transition-all ${
              selectedProject?.id === project.id
                ? "ring-2 ring-ring ring-offset-2"
                : ""
            }`}
          >
            {project.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;