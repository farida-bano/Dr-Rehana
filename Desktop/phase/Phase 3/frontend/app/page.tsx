"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Layout, Shield, Zap, Star, CheckCircle2 } from 'lucide-react';
import HeroFull from '@/components/layout/HeroFull';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] overflow-x-hidden relative">
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10 dark:from-black/40 dark:to-black/20 z-0"></div>
      <div className="relative z-10">
        {/* Full-screen Landing Hero */}
        <HeroFull />
        {/* Features Grid */}
        <section className="section-horizontal section-vertical bg-white/80 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why TaskFlow Pro?</h2>
              <p className="text-gray-600">Superior design and performance for your workflow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Lightning Fast"
                description="Optimized performance ensures your tasks load in milliseconds, no matter the scale."
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="Secure by Design"
                description="Enterprise-grade JWT authentication keeps your personal data safe and private."
              />
              <FeatureCard
                icon={<Star className="w-8 h-8" />}
                title="Premium UI"
                description="Beautiful clean design with smooth animations and dark mode support."
              />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 px-6 border-y border-gray-200 overflow-hidden relative bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="flex -space-x-4 mb-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/20">
                  U{i}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-500 text-white flex items-center justify-center font-bold text-xs">+</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Used by 10,000+ teams worldwide</h3>
            <p className="uppercase tracking-widest text-xs text-gray-500 font-medium">Trusted across the globe</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg">
                  <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">TaskFlow</h3>
              </div>
              <p className="text-gray-600 max-w-sm">
                The premium way to organize your life and tasks. Beautifully designed,
                intelligently built.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-widest text-xs text-gray-500">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/dashboard" className="link-hover link-active">Features</Link></li>
                <li><Link href="/dashboard" className="link-hover link-active">Pricing</Link></li>
                <li><Link href="/dashboard" className="link-hover link-active">Integrations</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-widest text-xs text-gray-500">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/" className="link-hover link-active">About Us</Link></li>
                <li><Link href="/" className="link-hover link-active">Privacy Policy</Link></li>
                <li><Link href="/" className="link-hover link-active">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            &copy; 2026 TaskFlow Pro. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md group">
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:rotate-6 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}
