import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/calendar";
import { filterProjects, resetQuickMenuState } from "@/utils/quickMenuUtils";
import ProjectSelector from "./quick-menu/ProjectSelector";
import TimeBlockSelector from "./quick-menu/TimeBlockSelector";
import DescriptionInput from "./quick-menu/DescriptionInput";

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [timeBlock, setTimeBlock] = useState<"whole-day" | "morning" | "afternoon">("whole-day");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (editingTask) {
      const project = PROJECTS.find(p => p.name === editingTask.title);
      if (project) {
        setSelectedProject(project);
        setTimeBlock(editingTask.timeBlock);
        setDescription(editingTask.description || "");
      }
    }

    const handleMessage = (event: MessageEvent) => {
      // Get the current origin without any trailing slashes or ports
      const currentOrigin = window.location.origin.replace(/\/$/, '');
      const eventOrigin = event.origin.replace(/\/$/, '');
      
      console.log("Comparing origins:");
      console.log("Current origin (sanitized):", currentOrigin);
      console.log("Event origin (sanitized):", eventOrigin);
      
      // Strict origin comparison
      if (eventOrigin !== currentOrigin) {
        console.warn("Origin mismatch - message rejected");
        console.warn(`Expected: ${currentOrigin}`);
        console.warn(`Received: ${eventOrigin}`);
        return;
      }
      
      // Only process messages if origins match
      console.log('Processing message:', event.data);
      
      try {
        const data = JSON.parse(JSON.stringify(event.data));
        console.log('Parsed message data:', data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [editingTask]);

  const handleClose = () => {
    resetQuickMenuState(setSelectedProject, setTimeBlock, setDescription, setSearchQuery);
    onClose();
  };

  const handleSave = () => {
    if (selectedProject) {
      if (window.opener) {
        // Sanitize the origin to ensure consistent format
        const targetOrigin = window.location.origin.replace(/\/$/, '');
        console.log("Sending message to target origin:", targetOrigin);
        
        try {
          const message = { 
            type: 'taskSaved',
            timestamp: new Date().toISOString()
          };
          
          window.opener.postMessage(message, targetOrigin);
          console.log("Message sent successfully:", message);
        } catch (error) {
          console.error("Error sending message:", error);
          console.error("Error details:", {
            targetOrigin: targetOrigin,
            windowOpener: !!window.opener,
            errorMessage: error instanceof Error ? error.message : String(error)
          });
        }
      }
      
      onSave(selectedProject, timeBlock, description);
      handleClose();
    }
  };

  const filteredProjects = filterProjects(PROJECTS, searchQuery);
  const dialogDescription = editingTask 
    ? `Edit task for ${teamMember} on ${selectedDate}`
    : `Create new task for ${teamMember} on ${selectedDate}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        aria-describedby="task-assignment-description"
        className="sm:max-w-[500px]"
      >
        <DialogHeader>
          <DialogTitle>
            {selectedDate} - {teamMember}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p id="task-assignment-description" className="sr-only">
            {dialogDescription}
          </p>

          <ProjectSelector
            projects={filteredProjects}
            selectedProject={selectedProject}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onProjectSelect={setSelectedProject}
          />

          <TimeBlockSelector
            value={timeBlock}
            onChange={(value) => {
              if (value === "whole-day" || value === "morning" || value === "afternoon") {
                setTimeBlock(value);
              }
            }}
          />

          <DescriptionInput
            value={description}
            onChange={setDescription}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
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