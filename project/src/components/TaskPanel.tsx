import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Task } from '../types';
import { Plus, Search, Filter, Calendar, User, Clock } from 'lucide-react';

export const TaskPanel: React.FC = () => {
  const { state, dispatch } = useProject();
  const { currentProject } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'startDate' | 'priority'>('startDate');

  const filteredTasks = currentProject.tasks
    .filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'startDate':
          return a.startDate.getTime() - b.startDate.getTime();
        case 'priority':
          const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="startDate">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.name}</h3>
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 ml-2"
                style={{ backgroundColor: getTariffHikeColor(task.tariffHike) }}
              />
            </div>

            {task.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{task.progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${task.progress}%`,
                    backgroundColor: getTariffHikeColor(task.tariffHike)
                  }}
                />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                </div>

                {task.assignee && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {task.assignee}
                  </div>
                )}

                {task.estimatedHours && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {task.actualHours || 0} / {task.estimatedHours} hours
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {task.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );

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
};