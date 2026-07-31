'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - integrate with email service
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            For appointments, consultations, or any inquiries, feel free to reach out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold">Address</h3>
                    <p className="text-gray-500 text-sm">Karachi, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-gray-500 text-sm">+92-XXX-XXXXXXX</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-500 text-sm">dr.rehana@hospital.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    🕐
                  </div>
                  <div>
                    <h3 className="font-bold">Consultation Hours</h3>
                    <p className="text-gray-500 text-sm">Mon-Fri: 9AM - 5PM</p>
                    <p className="text-gray-500 text-sm">Sat: 10AM - 2PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                ✓ Thank you! Your message has been sent. Dr. Rehana will contact you shortly.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="+92-XXX-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition-all duration-300 font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
