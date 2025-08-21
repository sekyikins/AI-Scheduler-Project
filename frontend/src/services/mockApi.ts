import { Task, TaskCreate, TaskUpdate, PomodoroSession, CalendarEvent, Notification, ApiResponse, PaginatedResponse } from '../types';
import { 
  mockUser, 
  mockTasks, 
  mockPomodoroSessions, 
  mockCalendarEvents, 
  mockNotifications, 
  mockAIResponse,
  mockStats 
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API response wrapper
const createMockResponse = <T>(data: T, message: string = 'Success', success: boolean = true): ApiResponse<T> => ({
  data,
  message,
  success,
});

// Mock Auth API
export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    await delay(1000); // Simulate network delay
    
    // Accept multiple demo credentials for testing
    const validCredentials = [
      { email: 'demo@example.com', password: 'password' },
      { email: 'test@example.com', password: 'password123' },
      { email: 'demo@aischeduler.com', password: 'demo123' },
      { email: 'admin@aischeduler.com', password: 'admin2024' },
    ];
    
    const isValid = validCredentials.some(
      cred => cred.email === email && cred.password === password
    );
    
    if (isValid) {
      return createMockResponse({
        token: 'mock-jwt-token-12345',
        user: { ...mockUser, email, name: email.split('@')[0] },
      }, 'Login successful');
    } else {
      throw new Error('Invalid credentials');
    }
  },

  register: async (email: string, password: string, name: string) => {
    await delay(1000);
    
    // Check if email already exists (simulate duplicate email check)
    if (email === 'demo@example.com' || email === 'test@example.com' || 
        email === 'demo@aischeduler.com' || email === 'admin@aischeduler.com') {
      throw new Error('Email already exists');
    }
    
    return createMockResponse({
      token: 'mock-jwt-token-12345',
      user: { ...mockUser, email, name },
    }, 'Registration successful');
  },

  logout: async () => {
    await delay(500);
    return createMockResponse(null, 'Logout successful');
  },

  refresh: async () => {
    await delay(500);
    return createMockResponse({ token: 'new-mock-jwt-token-67890' }, 'Token refreshed');
  },

  me: async () => {
    await delay(300);
    return createMockResponse(mockUser, 'User info retrieved');
  },
};

// Mock Tasks API
export const mockTasksAPI = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; priority?: string }) => {
    await delay(800);
    
    let filteredTasks = [...mockTasks];
    
    if (params?.status) {
      filteredTasks = filteredTasks.filter(task => task.status === params.status);
    }
    
    if (params?.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === params.priority);
    }
    
    const paginatedResponse: PaginatedResponse<Task> = {
      data: filteredTasks,
      total: filteredTasks.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      hasNext: false,
      hasPrev: false,
    };
    
    return createMockResponse(paginatedResponse, 'Tasks retrieved successfully');
  },

  getById: async (id: string) => {
    await delay(500);
    const task = mockTasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return createMockResponse(task, 'Task retrieved successfully');
  },

  create: async (task: TaskCreate) => {
    await delay(1000);
    
    const newTask: Task = {
      id: (mockTasks.length + 1).toString(),
      ...task,
      status: 'pending',
      aiGenerated: false,
      actualDuration: undefined,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockTasks.push(newTask);
    return createMockResponse(newTask, 'Task created successfully');
  },

  update: async (id: string, updates: TaskUpdate) => {
    await delay(800);
    
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    return createMockResponse(mockTasks[taskIndex], 'Task updated successfully');
  },

  delete: async (id: string) => {
    await delay(500);
    
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(taskIndex, 1);
    return createMockResponse(null, 'Task deleted successfully');
  },

  bulkUpdate: async (updates: { id: string; updates: TaskUpdate }[]) => {
    await delay(1000);
    
    const updatedTasks: Task[] = [];
    
    for (const update of updates) {
      const taskIndex = mockTasks.findIndex(t => t.id === update.id);
      if (taskIndex !== -1) {
        mockTasks[taskIndex] = {
          ...mockTasks[taskIndex],
          ...update.updates,
          updatedAt: new Date(),
        };
        updatedTasks.push(mockTasks[taskIndex]);
      }
    }
    
    return createMockResponse(updatedTasks, 'Tasks updated successfully');
  },
};

// Mock AI API
export const mockAIAPI = {
  parseCommand: async (command: string) => {
    await delay(2000); // Simulate AI processing time
    
    return createMockResponse(mockAIResponse, 'Command parsed successfully');
  },

  suggestTasks: async (context: string) => {
    await delay(1500);
    
    return createMockResponse(mockAIResponse.tasks, 'Tasks suggested successfully');
  },

  optimizeSchedule: async (tasks: Task[]) => {
    await delay(3000);
    
    const optimizedTasks = tasks.map(task => ({
      ...task,
      priority: task.priority === 'low' ? 'medium' : task.priority,
      updatedAt: new Date(),
    }));
    
    return createMockResponse(optimizedTasks, 'Schedule optimized successfully');
  },
};

// Mock Pomodoro API
export const mockPomodoroAPI = {
  startSession: async (taskId?: string, duration?: number) => {
    await delay(500);
    
    const newSession: PomodoroSession = {
      id: (mockPomodoroSessions.length + 1).toString(),
      taskId: taskId,
      userId: '1',
      startTime: new Date(),
      endTime: undefined,
      duration: duration || 25,
      type: 'work',
      completed: false,
    };
    
    mockPomodoroSessions.push(newSession);
    return createMockResponse(newSession, 'Session started successfully');
  },

  endSession: async (sessionId: string) => {
    await delay(500);
    
    const session = mockPomodoroSessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.endTime = new Date();
    session.completed = true;
    
    return createMockResponse(session, 'Session ended successfully');
  },

  getSessions: async (params?: { page?: number; limit?: number; date?: string }) => {
    await delay(800);
    
    const paginatedResponse: PaginatedResponse<PomodoroSession> = {
      data: mockPomodoroSessions,
      total: mockPomodoroSessions.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      hasNext: false,
      hasPrev: false,
    };
    
    return createMockResponse(paginatedResponse, 'Sessions retrieved successfully');
  },

  getStats: async (period?: string) => {
    await delay(500);
    
    return createMockResponse(mockStats, 'Stats retrieved successfully');
  },
};

// Mock Calendar API
export const mockCalendarAPI = {
  getEvents: async (start: Date, end: Date) => {
    await delay(800);
    
    const filteredEvents = mockCalendarEvents.filter(event => 
      event.start >= start && event.end <= end
    );
    
    return createMockResponse(filteredEvents, 'Events retrieved successfully');
  },

  createEvent: async (event: Omit<CalendarEvent, 'id' | 'userId'>) => {
    await delay(1000);
    
    const newEvent: CalendarEvent = {
      id: (mockCalendarEvents.length + 1).toString(),
      ...event,
      userId: '1',
    };
    
    mockCalendarEvents.push(newEvent);
    return createMockResponse(newEvent, 'Event created successfully');
  },

  updateEvent: async (id: string, event: Partial<CalendarEvent>) => {
    await delay(800);
    
    const eventIndex = mockCalendarEvents.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    mockCalendarEvents[eventIndex] = {
      ...mockCalendarEvents[eventIndex],
      ...event,
    };
    
    return createMockResponse(mockCalendarEvents[eventIndex], 'Event updated successfully');
  },

  deleteEvent: async (id: string) => {
    await delay(500);
    
    const eventIndex = mockCalendarEvents.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    mockCalendarEvents.splice(eventIndex, 1);
    return createMockResponse(null, 'Event deleted successfully');
  },

  syncToGoogle: async (taskIds: string[]) => {
    await delay(2000);
    
    return createMockResponse(null, 'Events synced to Google Calendar successfully');
  },
};

// Mock Notifications API
export const mockNotificationsAPI = {
  getAll: async (params?: { page?: number; limit?: number; read?: boolean }) => {
    await delay(600);
    
    let filteredNotifications = [...mockNotifications];
    
    if (params?.read !== undefined) {
      filteredNotifications = filteredNotifications.filter(n => n.read === params.read);
    }
    
    const paginatedResponse: PaginatedResponse<Notification> = {
      data: filteredNotifications,
      total: filteredNotifications.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      hasNext: false,
      hasPrev: false,
    };
    
    return createMockResponse(paginatedResponse, 'Notifications retrieved successfully');
  },

  markAsRead: async (id: string) => {
    await delay(300);
    
    const notification = mockNotifications.find(n => n.id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    notification.read = true;
    return createMockResponse(notification, 'Notification marked as read');
  },

  markAllAsRead: async () => {
    await delay(500);
    
    mockNotifications.forEach(n => n.read = true);
    return createMockResponse(null, 'All notifications marked as read');
  },

  delete: async (id: string) => {
    await delay(300);
    
    const notificationIndex = mockNotifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      throw new Error('Notification not found');
    }
    
    mockNotifications.splice(notificationIndex, 1);
    return createMockResponse(null, 'Notification deleted successfully');
  },
}; 