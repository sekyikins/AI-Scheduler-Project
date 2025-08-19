export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'overdue';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags?: string[];
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  aiGenerated?: boolean;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
  estimatedDuration?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'overdue';
  dueDate?: Date;
  tags?: string[];
  estimatedDuration?: number;
  actualDuration?: number;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  type: 'work' | 'break';
  completed: boolean;
  userId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  taskId?: string;
  userId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  userId: string;
  taskId?: string;
}

export interface AIResponse {
  tasks: TaskCreate[];
  message: string;
  confidence: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
} 