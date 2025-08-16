import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Task } from '../types';
import { TimelineHeader } from './TimelineHeader';
import { TaskRow } from './TaskRow';
import { TaskDetails } from './TaskDetails';
import { Edit3 } from 'lucide-react';

export const GanttChart: React.FC = () => {
  const { state, dispatch } = useProject();
  const { currentProject, selectedTask, timelineConfig } = state;
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingDuration, setEditingDuration] = useState<string | null>(null);
  const [durationValue, setDurationValue] = useState('');
  const ganttRef = useRef<HTMLDivElement>(null);

  const cellWidth = 40;
  const rowHeight = 50;

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

  const handleTaskClick = (task: Task) => {
    dispatch({ type: 'SET_SELECTED_TASK', task });
    setShowTaskDetails(true);
  };

  const handleTaskDrag = (task: Task, newStartDate: Date, newEndDate: Date) => {
    const updatedTask = {
      ...task,
      startDate: newStartDate,
      endDate: newEndDate
    };
    dispatch({ type: 'UPDATE_TASK', task: updatedTask });
  };

  const handleTaskNameEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditingValue(task.name.replace('Input 1: ', ''));
  };

  const handleTaskNameSave = (taskId: string) => {
    const task = currentProject.tasks.find(t => t.id === taskId);
    if (task) {
      const prefix = task.name.split(':')[0];
      const updatedTask = {
        ...task,
        name: `${prefix}: ${editingValue}`
      };
      dispatch({ type: 'UPDATE_TASK', task: updatedTask });
    }
    setEditingTask(null);
    setEditingValue('');
  };

  const handleDurationEdit = (task: Task) => {
    setEditingDuration(task.id);
    setDurationValue(task.durationMonths.toString());
  };

  const handleDurationSave = (taskId: string) => {
    const task = currentProject.tasks.find(t => t.id === taskId);
    if (task) {
      const months = parseInt(durationValue) || 1;
      const updatedTask = {
        ...task,
        durationMonths: months
      };
      dispatch({ type: 'UPDATE_TASK', task: updatedTask });
    }
    setEditingDuration(null);
    setDurationValue('');
  };

  const handleDurationCancel = () => {
    setEditingDuration(null);
    setDurationValue('');
  };

  const handleTaskNameCancel = () => {
    setEditingTask(null);
    setEditingValue('');
  };
  const getDaysBetween = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTaskPosition = (task: Task) => {
    const daysDiff = getDaysBetween(timelineConfig.startDate, task.startDate);
    // Use durationMonths to calculate width - each month = one cell width
    const taskWidthInCells = task.durationMonths;
    
    return {
      left: daysDiff * cellWidth,
      width: Math.max(taskWidthInCells * cellWidth, cellWidth),
    };
  };

  const totalDays = getDaysBetween(timelineConfig.startDate, timelineConfig.endDate);
  const chartWidth = totalDays * cellWidth;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex border-b border-gray-200">
        <div className="w-96 bg-gray-50 border-r border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-4">Tasks</h3>
        </div>
        <div className="flex-1 overflow-x-auto">
          <TimelineHeader
            startDate={timelineConfig.startDate}
            endDate={timelineConfig.endDate}
            cellWidth={cellWidth}
            scale={timelineConfig.scale}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-96 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          {currentProject.tasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                selectedTask?.id === task.id ? 'bg-blue-50' : 'hover:bg-gray-100'
              }`}
              style={{ height: rowHeight }}
            >
              <div className="flex items-center justify-between">
                <div>
                  {editingTask === task.id ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Input 1:</span>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTaskNameSave(task.id);
                          if (e.key === 'Escape') handleTaskNameCancel();
                        }}
                        onBlur={() => handleTaskNameSave(task.id)}
                        className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task description"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 group">
                      <h4 
                        className="font-medium text-sm text-gray-900 truncate cursor-text"
                        onClick={() => task.id === '1' ? handleTaskNameEdit(task) : handleTaskClick(task)}
                      >
                        {task.name || 'Input 1: Click to add description'}
                      </h4>
                      {task.id === '1' && (
                        <button
                          onClick={() => handleTaskNameEdit(task)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                        >
                          <Edit3 className="h-3 w-3 text-gray-500" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Duration:</span>
                    {editingDuration === task.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={durationValue}
                          onChange={(e) => setDurationValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleDurationSave(task.id);
                            if (e.key === 'Escape') handleDurationCancel();
                          }}
                          onBlur={() => handleDurationSave(task.id)}
                          className="w-12 px-1 py-0.5 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                        <span className="text-xs text-gray-500">months</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDurationEdit(task)}
                        className="flex items-center space-x-1 px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        <span>{task.durationMonths}</span>
                        <span className="text-gray-500">months</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getTariffHikeColor(task.tariffHike) }}
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {task.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto" ref={ganttRef}>
          <div className="relative" style={{ width: chartWidth, minWidth: '100%' }}>
            {/* Grid lines */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={chartWidth}
              height={currentProject.tasks.length * rowHeight}
            >
              <defs>
                <pattern
                  id="grid"
                  width={cellWidth}
                  height={rowHeight}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${cellWidth} 0 L 0 0 0 ${rowHeight}`}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Today line */}
              {(() => {
                const today = new Date();
                if (today >= timelineConfig.startDate && today <= timelineConfig.endDate) {
                  const todayPosition = getDaysBetween(timelineConfig.startDate, today) * cellWidth;
                  return (
                    <line
                      x1={todayPosition}
                      y1={0}
                      x2={todayPosition}
                      y2={currentProject.tasks.length * rowHeight}
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="timeline-today-line"
                    />
                  );
                }
                return null;
              })()}
            </svg>

            {/* Task bars */}
            {currentProject.tasks.map((task, index) => {
              const position = getTaskPosition(task);
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  position={position}
                  rowIndex={index}
                  rowHeight={rowHeight}
                  cellWidth={cellWidth}
                  isSelected={selectedTask?.id === task.id}
                  onClick={() => handleTaskClick(task)}
                  onDrag={(newStartDate, newEndDate) => handleTaskDrag(task, newStartDate, newEndDate)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {showTaskDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setShowTaskDetails(false)}
          onUpdate={(updatedTask) => {
            dispatch({ type: 'UPDATE_TASK', task: updatedTask });
            setShowTaskDetails(false);
          }}
        />
      )}
    </div>
  );
};