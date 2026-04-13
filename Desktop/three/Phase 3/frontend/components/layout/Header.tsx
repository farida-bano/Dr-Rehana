"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserMenu } from '@/components/ui/UserMenu';
import { cn } from '@/lib/utils';
import { Layout, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  // Hide header on auth pages for a cleaner focus on the forms
  if (isAuthPage) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'border-b border-gray-200',
        'transition-all duration-500 ease-in-out',
        'bg-white'
      )}
    >
      <div className="section-horizontal py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg group-hover:shadow-blue-500/30 group-hover:rotate-6 transition-all duration-500">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 leading-none">
                Nava <span className="text-blue-600">Todo</span>
              </h1>
            </Link>

            {/* Main Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                  pathname === '/' ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                  pathname === '/dashboard' ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-100 border border-gray-200">
              <ThemeToggle position="header" />
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <UserMenu />
            </div>

            {!pathname?.includes('/dashboard') && (
              <Link href="/dashboard" className="hidden sm:block">
                <button className="px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all active:scale-95 shadow">
                  Go to Workspace
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
