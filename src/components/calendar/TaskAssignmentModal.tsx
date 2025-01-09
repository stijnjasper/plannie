import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/calendar";
import { DateRangePicker } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: editingTask ? new Date(editingTask.day) : new Date(selectedDate),
    to: editingTask?.endDay ? new Date(editingTask.endDay) : undefined,
  });

  const handleSave = () => {
    if (dateRange?.from) {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;
      const project = {
        startDate,
        endDate,
        title: editingTask ? editingTask.title : '',
        description: editingTask ? editingTask.description : '',
        assignee: teamMember,
      };
      onSave(project, editingTask ? editingTask.timeBlock : 2, editingTask ? editingTask.description : undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4 py-4">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
          <div>
            <label className="block text-sm font-medium">Team Member</label>
            <input
              type="text"
              value={teamMember}
              readOnly
              className="mt-1 block w-full border border-border rounded-md p-2"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
          <Button onClick={handleSave}>Opslaan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;