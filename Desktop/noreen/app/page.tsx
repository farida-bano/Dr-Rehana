'use client';

import Link from 'next/link';
import { ArrowRight, Heart, Truck, Clock } from 'lucide-react';
import { FeaturedMeals } from '@/components/featured-meals';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 md:py-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-200 rounded-full opacity-20 blur-3xl -ml-48 -mb-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-orange-600 font-semibold text-lg">Welcome to MaaKiRasoi</p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Ghar Jaisa Khana
                </h1>
                <p className="text-2xl md:text-3xl text-orange-600 font-semibold">
                  Daal Chawal & Fresh Kabab
                </p>
              </div>
              <p className="text-lg text-gray-600">
                Savor the warmth of home-cooked meals prepared fresh daily by our passionate founder. Every dish tells a story of dedication and family recipes passed down through generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                >
                  Browse Menu <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
                >
                  Order Now
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 md:h-full min-h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl opacity-20 blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl h-full flex items-center justify-center text-8xl shadow-2xl animate-bounce">
                🍲
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MaaKiRasoi?</h2>
            <p className="text-lg text-gray-600">Fresh, authentic, and delivered with care</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl bg-orange-50 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Made with Love</h3>
              <p className="text-gray-600">
                Every dish is prepared with passion and care, using traditional recipes and the finest ingredients.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl bg-orange-50 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Hot, fresh meals delivered to your doorstep within 30-45 minutes. We guarantee quality and speed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl bg-orange-50 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Daily</h3>
              <p className="text-gray-600">
                Prepared fresh every day. No frozen meals, no compromises. Just authentic home-cooked food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Meals Section */}
      <FeaturedMeals />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to taste authentic Pakistani flavors?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Order now and get your favorite meals delivered hot and fresh!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
          >
            Order Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
