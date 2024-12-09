import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "@/types/calendar";

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: Project | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProjectSelect: (project: Project) => void;
}

const ProjectSelector = ({
  projects,
  selectedProject,
  searchQuery,
  onSearchChange,
  onProjectSelect,
}: ProjectSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search Projects</Label>
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {projects.map((project) => (
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