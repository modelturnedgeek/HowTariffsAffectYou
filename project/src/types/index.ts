export interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  assignee?: string;
  category: string;
  dependencies: string[];
  estimatedHours?: number;
  actualHours?: number;
  durationMonths: number;
  tariffHike?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  team: TeamMember[];
  milestones: Milestone[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
  description?: string;
  completed: boolean;
}

export interface TimelineConfig {
  scale: 'day' | 'week' | 'month';
  startDate: Date;
  endDate: Date;
  cellWidth: number;
}