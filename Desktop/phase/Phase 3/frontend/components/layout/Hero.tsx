"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

interface HeroProps {
  userName?: string;
  pending?: number;
  onPrimaryAction?: () => void;
}

export default function Hero({ userName = 'User', pending = 0, onPrimaryAction }: HeroProps) {
  return (
    <section className="mb-12 relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Dashboard</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{userName}</span>
          </h1>

          <p className="text-base text-gray-600 mb-6">
            You have <span className="font-semibold text-gray-800">{pending}</span> pending tasks. Get started by adding a new task or reviewing your progress.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={onPrimaryAction}
              className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Target className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              className="h-10 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Tasks
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="w-full lg:w-80"
        >
          {/* Decorative animated SVG card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">Productivity Overview</h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasks Completed</span>
                <span className="text-sm font-semibold text-gray-800">78%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full shadow-sm"
                  style={{ width: '78%' }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Focus Score</span>
                <span className="text-sm font-semibold text-gray-800">8.4/10</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
