import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Task } from "@/types/calendar";

interface Project {
  id: string;
  name: string;
  color: string;
}

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project, timeBlock: "whole-day" | "morning" | "afternoon", description?: string) => void;
  selectedDate: string;
  teamMember: string;
  editingTask: Task | null;
}

const PROJECTS: Project[] = [
  { id: "1", name: "Company Internal", color: "bg-[#34C759]/10 border-[#34C759]/20" },
  { id: "2", name: "Client Platform 5", color: "bg-[#FF9500]/10 border-[#FF9500]/20" },
  { id: "3", name: "Marketing Strategy", color: "bg-[#AF52DE]/10 border-[#AF52DE]/20" },
  { id: "4", name: "Product Development", color: "bg-[#5856D6]/10 border-[#5856D6]/20" },
  { id: "5", name: "Client Support", color: "bg-[#FF2D55]/10 border-[#FF2D55]/20" },
  { id: "6", name: "Platform Upgrade", color: "bg-[#5AC8FA]/10 border-[#5AC8FA]/20" },
  { id: "7", name: "Internal Training", color: "bg-[#FFCC00]/10 border-[#FFCC00]/20" },
  { id: "8", name: "User Testing", color: "bg-[#FF3B30]/10 border-[#FF3B30]/20" },
];

const TaskAssignmentModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  teamMember,
  editingTask,
}: TaskAssignmentModalProps) => {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [timeBlock, setTimeBlock] = React.useState<"whole-day" | "morning" | "afternoon">("whole-day");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (editingTask) {
      const project = PROJECTS.find(p => p.name === editingTask.title);
      if (project) {
        setSelectedProject(project);
        setTimeBlock(editingTask.timeBlock);
      }
    }
  }, [editingTask]);

  const filteredProjects = PROJECTS.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (selectedProject) {
      onSave(selectedProject, timeBlock);
      onClose();
      // Reset form
      setSelectedProject(null);
      setTimeBlock("whole-day");
      setSearchQuery("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedDate} - {teamMember}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Search Projects</Label>
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
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

          <div className="space-y-2">
            <Label>Time Block</Label>
            <RadioGroup
              value={timeBlock}
              onValueChange={setTimeBlock}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whole-day" id="whole-day" />
                <Label htmlFor="whole-day">Whole Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="morning" />
                <Label htmlFor="morning">Morning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="afternoon" />
                <Label htmlFor="afternoon">Afternoon</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedProject}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;