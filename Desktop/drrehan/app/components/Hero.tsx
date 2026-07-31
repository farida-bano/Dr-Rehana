'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              <span className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-medium">
                👩‍⚕️ Associate Professor
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Dr. <span className="gradient-text">Rehana Mushtaq</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Dedicated Healthcare Professional & Academician
            </p>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Serving the community with excellence in patient care,
              medical education, and research in Karachi, Pakistan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-primary text-white px-8 py-3 rounded-full hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Book Appointment
              </Link>
              <Link
                href="/about"
                className="border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">15+</h3>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">50+</h3>
                <p className="text-sm text-gray-500">Publications</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">500+</h3>
                <p className="text-sm text-gray-500">Patients Treated</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                  {/* Placeholder for Dr. Rehana's photo */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-6xl">
                    👩‍⚕️
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary rounded-full opacity-40 animate-pulse delay-75"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
