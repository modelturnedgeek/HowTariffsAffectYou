import React from 'react';
import { Search, Download, Share, User, Calendar, List, BarChart3 } from 'lucide-react';

interface HeaderProps {
  selectedView: 'gantt' | 'tasks' | 'calendar';
  onViewChange: (view: 'gantt' | 'tasks' | 'calendar') => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedView, onViewChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">How Tariffs Affect Your Company</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('gantt')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === 'gantt'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Timeline
          </button>
          <button
            onClick={() => onViewChange('tasks')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === 'tasks'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4 inline mr-1" />
            Tasks
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            Calendar
          </button>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Share className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};