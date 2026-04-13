"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroFull() {
  return (
    <header className="min-h-[calc(100vh-80px)] relative flex items-center justify-center text-center overflow-hidden bg-gray-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 opacity-40 blur-3xl" />
        <div className="absolute right-[-8rem] bottom-0 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200 to-cyan-200 opacity-30 blur-3xl" />
      </div>

      <motion.div
        className="z-10 max-w-6xl px-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="w-4 h-4" />
          Introducing Nava
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Nava — The Feeling of Productivity, Perfected
        </h1>

        <div className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-10 space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>Silky-smooth interactions make every tap and swipe feel like a gentle reward.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/sign-up">
            <Button variant="primary" size="lg" className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
              Start Your Journey
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50">
              Experience Nava <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </header>
  );
}
