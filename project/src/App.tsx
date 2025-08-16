import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GanttChart } from './components/GanttChart';
import { TaskPanel } from './components/TaskPanel';
import { ProjectProvider } from './contexts/ProjectContext';
import './App.css';

function App() {
  const [selectedView, setSelectedView] = useState<'gantt' | 'tasks' | 'calendar'>('gantt');

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header 
          selectedView={selectedView}
          onViewChange={setSelectedView}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
            {selectedView === 'gantt' && <GanttChart />}
            {selectedView === 'tasks' && <TaskPanel />}
            {selectedView === 'calendar' && <div className="p-6">Calendar view coming soon...</div>}
        </main>
      </div>
    </ProjectProvider>
  );
}

export default App;