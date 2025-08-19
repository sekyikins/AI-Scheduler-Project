import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskCreate, TaskUpdate } from '../types';
import { tasksAPI } from '../services/api';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: TaskCreate) => Promise<Task>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  bulkUpdateTasks: (updates: { id: string; updates: TaskUpdate }[]) => Promise<Task[]>;
  refreshTasks: () => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const createTask = async (taskData: TaskCreate): Promise<Task> => {
    try {
      const response = await tasksAPI.create(taskData);
      const newTask = response.data;
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTask = async (id: string, updates: TaskUpdate): Promise<Task> => {
    try {
      const response = await tasksAPI.update(id, updates);
      const updatedTask = response.data;
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await tasksAPI.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const bulkUpdateTasks = async (updates: { id: string; updates: TaskUpdate }[]): Promise<Task[]> => {
    try {
      const response = await tasksAPI.bulkUpdate(updates);
      const updatedTasks = response.data;
      setTasks(prev => prev.map(task => {
        const update = updates.find(u => u.id === task.id);
        return update ? updatedTasks.find(t => t.id === task.id) || task : task;
      }));
      return updatedTasks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tasks';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByStatus = (status: Task['status']): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByPriority = (priority: Task['priority']): Task[] => {
    return tasks.filter(task => task.priority === priority);
  };

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTasks,
    refreshTasks,
    getTaskById,
    getTasksByStatus,
    getTasksByPriority,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 