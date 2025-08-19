
import { 
  mockAuthAPI, 
  mockTasksAPI, 
  mockAIAPI, 
  mockPomodoroAPI, 
  mockCalendarAPI, 
  mockNotificationsAPI 
} from './mockApi';

// Use mock APIs instead of real API calls
export const authAPI = mockAuthAPI;
export const tasksAPI = mockTasksAPI;
export const aiAPI = mockAIAPI;
export const pomodoroAPI = mockPomodoroAPI;
export const calendarAPI = mockCalendarAPI;
export const notificationsAPI = mockNotificationsAPI;

// Create a mock axios instance for compatibility
const api = {
  interceptors: {
    request: {
      use: () => {},
    },
    response: {
      use: () => {},
    },
  },
};

export default api; 