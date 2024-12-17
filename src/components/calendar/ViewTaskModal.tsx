import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task } from "@/types/calendar";

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewTaskModal = ({ task, isOpen, onClose }: ViewTaskModalProps) => {
  if (!task) return null;

  const dialogDescription = `View details for task: ${task.title}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="view-task-description">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p id="view-task-description" className="sr-only">
            {dialogDescription}
          </p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Time Block</p>
            <p className="text-sm text-muted-foreground">
              {`${task.timeBlock} hours`}
            </p>
          </div>
          
          {task.description && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Assignee</p>
            <p className="text-sm text-muted-foreground">{task.assignee}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTaskModal;