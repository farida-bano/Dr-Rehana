import React from 'react'
import Link from 'next/link'
import { MessageSquare, Mail, Phone, MessageCircle } from 'lucide-react'

export default function Home() {
  const channels = [
    { icon: MessageSquare, label: 'Web', color: 'from-blue-500 to-blue-600' },
    { icon: Mail, label: 'Email', color: 'from-purple-500 to-purple-600' },
    { icon: MessageCircle, label: 'WhatsApp', color: 'from-green-500 to-green-600' },
    { icon: Phone, label: 'Voice', color: 'from-orange-500 to-orange-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            Multi-Channel Support
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get instant support across your favorite channels. Choose how you want to reach us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {channels.map((channel, idx) => {
            const Icon = channel.icon
            return (
              <div
                key={idx}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${channel.color} rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                <div className="relative bg-slate-800 rounded-xl p-6 text-center hover:bg-slate-700 transition duration-300 transform group-hover:scale-105">
                  <Icon className="w-12 h-12 mx-auto mb-3 text-gray-300 group-hover:text-white transition" />
                  <p className="text-gray-200 font-semibold">{channel.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/support-form">
            <button className="group relative px-8 py-4 font-bold text-lg overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition duration-300 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <span className="relative text-white flex items-center justify-center gap-2">
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </Link>
        </div>
      </div>

    </div>
  )
}
