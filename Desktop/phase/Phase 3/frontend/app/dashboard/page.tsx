"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TodoCard } from '@/components/todo/TodoCard';
import type { Todo } from '@/lib/types';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoComplete } from '@/lib/api';
import { useChatContext } from '@/components/chatbot/ChatProvider';
import { Plus, Sparkles, Layout, CheckCircle2, ListTodo, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import Hero from '@/components/layout/Hero';

export default function DashboardPage() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingTodo, setEditingTodo] = React.useState<Todo | null>(null);
  const [formData, setFormData] = React.useState({ title: '', description: '' });
  const [userName, setUserName] = React.useState('');
  const router = useRouter();
  const { addToast } = useToast();
  const { chatState } = useChatContext();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('user_name');
      if (name) setUserName(name);
    }

    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await getTodos();
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
        addToast({
          type: 'error',
          message: 'Failed to load tasks',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [addToast, chatState.refreshTrigger]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const newTodo = await createTodo({
        title: formData.title,
        description: formData.description,
        completed: false,
      });
      setTodos([newTodo, ...todos]);
      setShowAddModal(false);
      setFormData({ title: '', description: '' });
      addToast({
        type: 'success',
        message: 'Task created successfully!',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to create todo:', error);
      addToast({
        type: 'error',
        message: 'Failed to create task',
      });
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({ title: todo.title, description: todo.description || '' });
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo || !formData.title.trim()) return;

    try {
      const updated = await updateTodo(editingTodo.id, {
        title: formData.title,
        description: formData.description,
        completed: editingTodo.completed,
      });
      setTodos(todos.map((todo) => (todo.id === updated.id ? updated : todo)));
      setEditingTodo(null);
      setFormData({ title: '', description: '' });
      addToast({
        type: 'success',
        message: 'Task updated successfully',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to update todo:', error);
      addToast({
        type: 'error',
        message: 'Failed to update task',
      });
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const updated = await toggleTodoComplete(id, !todo.completed);
      setTodos(todos.map((t) => (t.id === id ? updated : t)));

      if (updated.completed) {
        addToast({
          type: 'success',
          message: '🎉 Task completed! Great job!',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      addToast({
        type: 'error',
        message: 'Failed to update task',
      });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      addToast({
        type: 'info',
        message: 'Task deleted',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      addToast({
        type: 'error',
        message: 'Failed to delete task',
      });
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      <div className="section-horizontal section-vertical max-w-7xl mx-auto">
        {/* Hero */}
        <div className="animate-welcome">
          <React.Suspense fallback={<div className="h-36" />}>
            {/* lazy-like boundary for hero */}
            {/* @ts-ignore - dynamic import not necessary */}
            <Hero userName={userName || 'User'} pending={totalCount - completedCount} onPrimaryAction={() => setShowAddModal(true)} />
          </React.Suspense>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16 animate-welcome" style={{ animationDelay: '0.1s' }}>
          <div className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl relative overflow-hidden group border border-gray-200 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Productivity Pulse</p>
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-bold text-gray-800">{progress}%</span>
                    <div className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-medium shadow-sm">
                      +12% INCREMENTAL
                    </div>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-xl font-bold text-blue-600">{completedCount}/{totalCount}</p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {totalCount === 0
                  ? "System initialized. Waiting for task deployment."
                  : `Completed ${completedCount} tasks. ${totalCount - completedCount} remaining.`}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl flex flex-col justify-between border border-indigo-100 hover:border-indigo-300 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md" onClick={() => setShowAddModal(true)}>
            <div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300 shadow-lg">
                <Plus className="w-6 h-6" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">New Task</h3>
              <p className="text-sm text-gray-600">Add a new task to your list.</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-indigo-600 text-sm font-medium uppercase tracking-wide group-hover:translate-x-1 transition-transform">
              Add Task <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tasks Section Header */}
        <div className="flex items-center justify-between mb-10 animate-welcome" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-gray-800">Your Tasks</h3>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-xs font-medium">
              {todos.length} TASKS
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && todos.length === 0 && (
          <div className="animate-welcome" style={{ animationDelay: '0.3s' }}>
            <EmptyState
              type="no-todos"
              title="Registry Clear"
              description="No active tasks detected. Ready for new system entry."
              cta={{
                text: 'Deploy First Task',
                action: () => setShowAddModal(true),
              }}
            />
          </div>
        )}

        {/* Todo List Grid */}
        {!loading && todos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className="animate-welcome"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <TodoCard
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Common Style for Add and Edit */}
      {(showAddModal || editingTodo) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-4 bg-black/50">
          <div
            className="absolute inset-0 bg-black/30 animate-in fade-in duration-500"
            onClick={() => {
              setShowAddModal(false);
              setEditingTodo(null);
              setFormData({ title: '', description: '' });
            }}
          />
          <div className="relative bg-white w-full max-w-lg rounded-2xl p-8 border border-gray-200 shadow-xl animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                  {editingTodo ? <Sparkles className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {editingTodo ? 'Edit Task' : 'New Task'}
                  </h3>
                  <p className="text-xs uppercase font-medium text-gray-500 tracking-wider">Task Management</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTodo(null);
                  setFormData({ title: '', description: '' });
                }}
                className="w-10 h-10 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Task Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title..."
                  autoFocus
                  required
                  className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a description (optional)..."
                  rows={3}
                  className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all resize-none outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTodo(null);
                    setFormData({ title: '', description: '' });
                  }}
                  className="h-12 rounded-lg font-medium text-gray-700 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="h-12 rounded-lg font-medium"
                >
                  {editingTodo ? 'Update Task' : 'Add Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
