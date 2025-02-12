import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";
import ProjectSelector from "./quick-menu/ProjectSelector";
import TimeBlockSelector from "./quick-menu/TimeBlockSelector";
import DateSelector from "./quick-menu/DateSelector";
import DescriptionInput from "./quick-menu/DescriptionInput";
import { Task } from "@/types/calendar";
import { PROJECTS } from "@/data/projects";

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any, timeBlock: 2 | 4 | 6 | 8, description?: string, selectedDate?: Date, endDate?: Date) => void;
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
  const [selectedTaskDate, setSelectedTaskDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (isOpen && (e.metaKey || e.ctrlKey) && (e.key === 'Enter' || e.key === 'Return')) {
      e.preventDefault();
      if (selectedProject) {
        setTimeout(() => {
          onSave(selectedProject, timeBlock, description, selectedTaskDate, selectedEndDate);
        }, 0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [isOpen, selectedProject, timeBlock, description, selectedTaskDate, selectedEndDate, onSave]);

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        const project = PROJECTS.find(p => p.name === editingTask.title);
        if (project) {
          setSelectedProject(project);
          setTimeBlock(editingTask.timeBlock);
          setDescription(editingTask.description || "");
          setSelectedTaskDate(new Date(editingTask.day));
          setSelectedEndDate(editingTask.endDay ? new Date(editingTask.endDay) : null);
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
        setSelectedTaskDate(new Date(selectedDate));
        setSelectedEndDate(null);
        setModalTitle("New Task");
      }
    }
  }, [isOpen, editingTask, selectedDate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[85vh] flex flex-col overflow-hidden sm:max-w-[500px] bg-background dark:bg-gray-900 border-border dark:border-[rgb(46_46_46)]">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-foreground dark:text-white">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-4">
          <div className="space-y-6 py-2">
            <ProjectSelector
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />

            <DateSelector
              selectedDate={selectedTaskDate}
              endDate={selectedEndDate}
              onDateChange={([start, end]) => {
                setSelectedTaskDate(start);
                setSelectedEndDate(end);
              }}
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
        </div>

        <DialogFooter className="gap-2 mt-auto px-4 pb-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-modal-button dark:bg-modal-button-dark border-modal-button-border dark:border-modal-button-border-dark text-modal-button-text dark:text-modal-button-text-dark hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => selectedProject && onSave(selectedProject, timeBlock, description, selectedTaskDate, selectedEndDate)}
            disabled={!selectedProject}
            className="bg-primary dark:bg-blue-600 text-primary-foreground hover:bg-primary/90 dark:hover:bg-blue-700 inline-flex items-center gap-2"
          >
            Save
            <span className="flex items-center gap-1 text-xs opacity-60 ml-1">
              <Command className="h-3 w-3" />
              <span>+</span>
              <span>↵</span>
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;