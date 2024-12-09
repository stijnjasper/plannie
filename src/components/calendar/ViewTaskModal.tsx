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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Time Block</p>
            <p className="text-sm text-muted-foreground">
              {task.timeBlock ? (
                task.timeBlock.charAt(0).toUpperCase() + task.timeBlock.slice(1)
              ) : (
                "Not specified"
              )}
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