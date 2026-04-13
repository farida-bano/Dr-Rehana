// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Sun, Moon, Palette, Sparkles } from 'lucide-react';
import { Task } from '../types/task';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from '../lib/api';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTasks();

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const createdTask = await createTask({ title: newTask, description: '', isCompleted: false });
      setTasks(prev => [...prev, createdTask]);
      setNewTask('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updatedTask = await toggleTaskComplete(id);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 animate-slide-up">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                TaskFlow
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Your productivity companion</p>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
          </button>
        </header>

        {/* Add Task Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-1" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6 animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow transition-transform duration-300 hover:scale-[1.02]">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{tasks.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow transition-transform duration-300 hover:scale-[1.02]">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tasks.filter(t => t.isCompleted).length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Done</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow transition-transform duration-300 hover:scale-[1.02]">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {tasks.filter(t => !t.isCompleted).length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4 animate-slide-up">
          {tasks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-block p-4 bg-indigo-100 dark:bg-gray-700 rounded-full mb-4">
                <Palette className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No tasks yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Add your first task to get started!</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow transition-all duration-300 hover:shadow-md animate-slide-up ${
                  task.isCompleted ? 'opacity-80 border-l-4 border-green-500' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={`mr-3 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        task.isCompleted
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                      } transition-colors`}
                      aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {task.isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <span
                      className={`${
                        task.isCompleted
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-800 dark:text-gray-200'
                      } transition-all`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm animate-slide-up">
          <p>Stay productive and accomplish your goals one task at a time</p>
        </footer>
      </div>
    </div>
  );
}