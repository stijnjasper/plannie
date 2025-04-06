
import { createContext, useContext } from 'react';
import { Task } from '@/types/calendar';

interface DragDropContextType {
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, day: string, team: string, assignee: string) => void;
}

export const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};
