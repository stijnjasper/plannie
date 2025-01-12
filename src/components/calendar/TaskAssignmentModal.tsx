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
import DateSelector from "./quick-menu/DateSelector";
import DescriptionInput from "./quick-menu/DescriptionInput";
import { Command } from "lucide-react";
import { Task } from "@/types/calendar";

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any, timeBlock: 2 | 4 | 6 | 8, description?: string, endDate?: Date) => void;
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

  const handleKeyboardShortcut = useCallback((e: KeyboardEvent) => {
    if (isOpen && (e.metaKey || e.ctrlKey) && (e.key === 'Enter' || e.key === 'Return')) {
      e.preventDefault();
      if (selectedProject) {
        setTimeout(() => {
          onSave(selectedProject, timeBlock, description, selectedEndDate);
        }, 0);
      }
    }
  }, [isOpen, selectedProject, timeBlock, description, selectedEndDate, onSave]);

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
        // Set the selected date from the calendar cell
        setSelectedTaskDate(new Date(selectedDate));
        setSelectedEndDate(null);
        setModalTitle("New Task");
      }
    }
  }, [isOpen, editingTask, selectedDate]);

  const handleClose = () => {
    setSelectedProject(null);
    setTimeBlock(2);
    setDescription("");
    setSearchQuery("");
    setSelectedEndDate(null);
    onClose();
  };

  const handleSave = () => {
    if (selectedProject) {
      onSave(selectedProject, timeBlock, description, selectedEndDate);
    }
  };

  const handleDateChange = ([start, end]: [Date, Date | null]) => {
    setSelectedTaskDate(start);
    setSelectedEndDate(end);
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

          <DateSelector
            selectedDate={selectedTaskDate}
            endDate={selectedEndDate}
            onDateChange={handleDateChange}
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
            className="bg-modal-button dark:bg-modal-button-dark border-modal-button-border dark:border-modal-button-border-dark text-modal-button-text dark:text-modal-button-text-dark hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
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