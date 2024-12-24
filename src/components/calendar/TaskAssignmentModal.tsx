import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/data/projects";
import ProjectSelector from "./quick-menu/ProjectSelector";
import TimeBlockSelector from "./quick-menu/TimeBlockSelector";
import DescriptionInput from "./quick-menu/DescriptionInput";
import { resetQuickMenuState } from "@/utils/quickMenuUtils";
import { Task } from "@/types/calendar";

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any, timeBlock: 2 | 4 | 6 | 8, description?: string) => void;
  selectedDate: string;
  teamMember: string;
  editingTask: Task | null;
}

const TaskAssignmentModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  teamMember,
  editingTask,
}: TaskAssignmentModalProps) => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [timeBlock, setTimeBlock] = useState<2 | 4 | 6 | 8>(2);
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleKeyboardShortcut = useCallback((e: KeyboardEvent) => {
    if (isOpen && (e.metaKey || e.ctrlKey) && (e.key === 'Enter' || e.key === 'Return')) {
      e.preventDefault();
      if (selectedProject) {
        // Gebruik een timeout om er zeker van te zijn dat alle state updates zijn verwerkt
        setTimeout(() => {
          onSave(selectedProject, timeBlock, description);
        }, 0);
      }
    }
  }, [isOpen, selectedProject, timeBlock, description, onSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        const project = PROJECTS.find(p => p.name === editingTask.title);
        if (project) {
          setSelectedProject(project);
          setTimeBlock(editingTask.timeBlock);
          setDescription(editingTask.description || "");
          setModalTitle(`Edit Task - ${project.name}`);
        } else {
          console.warn(`Project not found for title: ${editingTask.title}`);
          setModalTitle("Edit Task");
        }
      } else {
        setSelectedProject(null);
        setTimeBlock(2);
        setDescription("");
        setSearchQuery("");
        setModalTitle("New Task");
      }
    }
  }, [isOpen, editingTask]);

  const handleClose = () => {
    setSelectedProject(null);
    setTimeBlock(2);
    setDescription("");
    setSearchQuery("");
    onClose();
  };

  const handleSave = () => {
    if (selectedProject) {
      onSave(selectedProject, timeBlock, description);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background dark:bg-gray-900 border-border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-white">{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <ProjectSelector
            selectedProject={selectedProject}
            onProjectSelect={setSelectedProject}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />

          <TimeBlockSelector
            value={timeBlock}
            onChange={setTimeBlock}
          />

          <DescriptionInput
            description={description}
            onDescriptionChange={setDescription}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedProject}
            className="bg-primary dark:bg-blue-600 text-primary-foreground hover:bg-primary/90 dark:hover:bg-blue-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;