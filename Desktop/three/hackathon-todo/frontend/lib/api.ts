// frontend/lib/api.ts
import { Task, TaskCreateInput, TaskUpdateInput } from '../types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Define types
export interface TaskFilters {
  skip?: number;
  limit?: number;
}

// Task API functions
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  const params = new URLSearchParams();
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

  const response = await fetch(`${API_BASE_URL}/tasks?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.json();
};

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }
  return response.json();
};

export const createTask = async (taskData: TaskCreateInput): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }
  return response.json();
};

export const updateTask = async (id: number, taskData: TaskUpdateInput): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
};

export const toggleTaskComplete = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle task completion: ${response.statusText}`);
  }
  return response.json();
};

// Authentication functions
export const getCurrentUser = async (): Promise<any> => {
  // In a real implementation, you would include the JWT token in the header
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/users/me/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get current user: ${response.statusText}`);
  }
  return response.json();
};