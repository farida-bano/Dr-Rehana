'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Todo } from '@/lib/types';
import { CheckCircle2, Trash2, Edit3, Calendar, Clock } from 'lucide-react';

export interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  index?: number;
}

const TodoCard = ({ todo, onToggle, onDelete, onEdit, index = 0 }: TodoCardProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(todo.id);
    }, 300);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  return (
    <div
      className={cn(
        'group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg',
        todo.completed && 'opacity-70 bg-gradient-to-br from-gray-50 to-gray-100',
        isDeleting && 'opacity-0 scale-95'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Status Indicator & Title */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={handleToggle}
              className={cn(
                'mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                todo.completed
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white scale-110 shadow-md'
                  : 'border-gray-300 hover:border-blue-500 group-hover:scale-105 bg-white'
              )}
            >
              {todo.completed && <CheckCircle2 className="w-4 h-4" />}
            </button>
            <div className="min-w-0">
              <h3 className={cn(
                'text-lg font-semibold tracking-tight transition-all duration-300 text-gray-800',
                todo.completed && 'line-through opacity-60'
              )}>
                {todo.title}
              </h3>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="w-9 h-9 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="w-9 h-9 p-0 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p className={cn(
            'text-sm mb-6 line-clamp-2 text-gray-600 group-hover:text-gray-700 transition-colors',
            todo.completed && 'line-through opacity-50'
          )}>
            {todo.description}
          </p>
        )}

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {new Date(todo.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TodoCard };
