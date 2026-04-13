// frontend/types/task.ts

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  due_date?: Date;
  owner_id: number;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  isCompleted?: boolean;
  due_date?: Date;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  due_date?: Date;
}