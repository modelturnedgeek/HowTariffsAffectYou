import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, Project, TeamMember, Milestone } from '../types';

interface ProjectState {
  currentProject: Project;
  selectedTask: Task | null;
  viewMode: 'gantt' | 'tasks' | 'calendar';
  timelineConfig: {
    scale: 'day' | 'week' | 'month';
    startDate: Date;
    endDate: Date;
  };
}

type ProjectAction = 
  | { type: 'SET_SELECTED_TASK'; task: Task | null }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'SET_VIEW_MODE'; mode: 'gantt' | 'tasks' | 'calendar' }
  | { type: 'UPDATE_TIMELINE'; config: Partial<ProjectState['timelineConfig']> };

const initialProject: Project = {
  id: '1',
  name: 'Sample Project',
  description: 'A sample project to demonstrate the Gantt chart functionality',
  startDate: new Date(2025, 7, 1),
  endDate: new Date(2025, 9, 31),
  tasks: [
    {
      id: '1',
      name: 'Input 1: ',
      description: 'Initial project setup and planning phase',
      startDate: new Date(2025, 7, 1),
      endDate: new Date(2025, 7, 7),
      progress: 100,
      priority: 'high',
      status: 'completed',
      assignee: 'John Doe',
      category: 'Planning',
      dependencies: [],
      estimatedHours: 40,
      actualHours: 38,
      durationMonths: 1,
      tariffHike: 0
    },
    {
      id: '1b',
      name: 'Input 2: ',
      description: 'Second input task',
      startDate: new Date(2025, 7, 8),
      endDate: new Date(2025, 7, 14),
      progress: 0,
      priority: 'medium',
      status: 'not-started',
      assignee: 'User',
      category: 'Input',
      dependencies: [],
      estimatedHours: 20,
      actualHours: 0,
      durationMonths: 1,
      tariffHike: 0
    },
    {
      id: '1c',
      name: 'Input 3: ',
      description: 'Third input task',
      startDate: new Date(2025, 7, 15),
      endDate: new Date(2025, 7, 21),
      progress: 0,
      priority: 'medium',
      status: 'not-started',
      assignee: 'User',
      category: 'Input',
      dependencies: [],
      estimatedHours: 20,
      actualHours: 0,
      durationMonths: 1,
      tariffHike: 0
    },
    {
      id: '1d',
      name: 'Input 4: ',
      description: 'Fourth input task',
      startDate: new Date(2025, 7, 22),
      endDate: new Date(2025, 7, 28),
      progress: 0,
      priority: 'medium',
      status: 'not-started',
      assignee: 'User',
      category: 'Input',
      dependencies: [],
      estimatedHours: 20,
      actualHours: 0,
      durationMonths: 1,
      tariffHike: 0
    },
    {
      id: '2',
      name: 'Design Phase',
      description: 'UI/UX design and wireframing',
      startDate: new Date(2025, 7, 8),
      endDate: new Date(2025, 7, 21),
      progress: 75,
      priority: 'high',
      status: 'in-progress',
      assignee: 'Jane Smith',
      category: 'Design',
      dependencies: ['1'],
      estimatedHours: 80,
      actualHours: 60,
      durationMonths: 2,
      tariffHike: 0
    },
    {
      id: '3',
      name: 'Frontend Development',
      description: 'React component development',
      startDate: new Date(2025, 7, 15),
      endDate: new Date(2025, 8, 10),
      progress: 45,
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Mike Johnson',
      category: 'Development',
      dependencies: ['2'],
      estimatedHours: 120,
      actualHours: 50,
      durationMonths: 3,
      tariffHike: 0
    },
    {
      id: '4',
      name: 'Backend Development',
      description: 'API development and database setup',
      startDate: new Date(2025, 7, 22),
      endDate: new Date(2025, 8, 15),
      progress: 30,
      priority: 'high',
      status: 'in-progress',
      assignee: 'Sarah Wilson',
      category: 'Development',
      dependencies: ['1'],
      estimatedHours: 100,
      actualHours: 25,
      durationMonths: 2,
      tariffHike: 0
    },
    {
      id: '5',
      name: 'Testing & QA',
      description: 'Comprehensive testing and quality assurance',
      startDate: new Date(2025, 8, 11),
      endDate: new Date(2025, 9, 5),
      progress: 0,
      priority: 'medium',
      status: 'not-started',
      assignee: 'David Brown',
      category: 'Testing',
      dependencies: ['3', '4'],
      estimatedHours: 60,
      actualHours: 0,
      durationMonths: 1,
      tariffHike: 0
    },
    {
      id: '6',
      name: 'Deployment',
      description: 'Production deployment and launch',
      startDate: new Date(2025, 9, 6),
      endDate: new Date(2025, 9, 15),
      progress: 0,
      priority: 'critical',
      status: 'not-started',
      assignee: 'John Doe',
      category: 'Deployment',
      dependencies: ['5'],
      estimatedHours: 30,
      actualHours: 0,
      durationMonths: 1,
      tariffHike: 0
    }
  ],
  team: [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Project Manager' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'UI/UX Designer' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Frontend Developer' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Backend Developer' },
    { id: '5', name: 'David Brown', email: 'david@example.com', role: 'QA Engineer' }
  ],
  milestones: [
    { id: '1', name: 'Project Kickoff', date: new Date(2025, 7, 1), completed: true },
    { id: '2', name: 'Design Complete', date: new Date(2025, 7, 21), completed: false },
    { id: '3', name: 'Development Complete', date: new Date(2025, 8, 15), completed: false },
    { id: '4', name: 'Project Launch', date: new Date(2025, 9, 15), completed: false }
  ]
};

const initialState: ProjectState = {
  currentProject: initialProject,
  selectedTask: null,
  viewMode: 'gantt',
  timelineConfig: {
    scale: 'day',
    startDate: new Date(2025, 7, 1),
    endDate: new Date(2025, 9, 31)
  }
};

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_SELECTED_TASK':
      return { ...state, selectedTask: action.task };
    
    case 'ADD_TASK':
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          tasks: [...state.currentProject.tasks, action.task]
        }
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          tasks: state.currentProject.tasks.map(task => 
            task.id === action.task.id ? action.task : task
          )
        },
        selectedTask: state.selectedTask?.id === action.task.id ? action.task : state.selectedTask
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          tasks: state.currentProject.tasks.filter(task => task.id !== action.taskId)
        },
        selectedTask: state.selectedTask?.id === action.taskId ? null : state.selectedTask
      };
    
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.mode };
    
    case 'UPDATE_TIMELINE':
      return {
        ...state,
        timelineConfig: { ...state.timelineConfig, ...action.config }
      };
    
    default:
      return state;
  }
};

const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
} | null>(null);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};