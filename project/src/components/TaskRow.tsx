import React, { useState } from 'react';
import { Task } from '../types';

interface TaskRowProps {
  task: Task;
  position: { left: number; width: number };
  rowIndex: number;
  rowHeight: number;
  cellWidth: number;
  isSelected: boolean;
  onClick: () => void;
  onDrag: (newStartDate: Date, newEndDate: Date) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  position,
  rowIndex,
  rowHeight,
  cellWidth,
  isSelected,
  onClick,
  onDrag
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, taskLeft: 0 });

  const getTariffHikeColor = (tariffHike: number = 0): string => {
    // Clamp tariff hike between 0 and 100
    const clampedHike = Math.max(0, Math.min(100, tariffHike));
    
    // Convert to 0-1 scale
    const intensity = clampedHike / 100;
    
    // Pink to red color scale
    // Pink: rgb(251, 207, 232) = #fbcfe8
    // Red: rgb(239, 68, 68) = #ef4444
    
    const pinkR = 251, pinkG = 207, pinkB = 232;
    const redR = 239, redG = 68, redB = 68;
    
    const r = Math.round(pinkR + (redR - pinkR) * intensity);
    const g = Math.round(pinkG + (redG - pinkG) * intensity);
    const b = Math.round(pinkB + (redB - pinkB) * intensity);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      taskLeft: position.left
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const newLeft = Math.max(0, dragStart.taskLeft + deltaX);
    const daysDiff = Math.round(newLeft / cellWidth);
    
    // Update task position visually (you'd implement smooth dragging here)
    // This is a simplified version
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Calculate new dates and call onDrag
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div
      className={`absolute flex items-center task-bar ${isSelected ? 'selected' : ''}`}
      style={{
        left: position.left,
        width: position.width,
        top: rowIndex * rowHeight + 10,
        height: rowHeight - 20,
        backgroundColor: getTariffHikeColor(task.tariffHike),
        borderRadius: '6px',
        cursor: isDragging ? 'grabbing' : 'pointer',
        opacity: isDragging ? 0.8 : 1
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      {/* Progress bar */}
      <div
        className="absolute left-0 top-0 h-full bg-black bg-opacity-20 rounded-l-md"
        style={{ width: `${task.progress}%` }}
      />
      
      {/* Task content */}
      <div className="relative z-10 px-3 flex items-center justify-between w-full text-white">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{task.name}</div>
          <div className="text-xs opacity-90">{task.progress}%</div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          />
        </div>
      </div>

      {/* Resize handles */}
      <div className="drag-handle absolute left-0 top-0 w-2 h-full cursor-ew-resize bg-white bg-opacity-30 rounded-l-md" />
      <div className="drag-handle absolute right-0 top-0 w-2 h-full cursor-ew-resize bg-white bg-opacity-30 rounded-r-md" />
    </div>
  );
};