import Hero from './components/Hero'
import Link from 'next/link'

export default function Home() {
  const services = [
    {
      icon: '🏥',
      title: 'Clinical Services',
      description: 'Comprehensive medical care with a patient-centered approach.'
    },
    {
      icon: '📚',
      title: 'Medical Education',
      description: 'Teaching and mentoring future healthcare professionals.'
    },
    {
      icon: '🔬',
      title: 'Research',
      description: 'Advancing medical knowledge through innovative research.'
    },
    {
      icon: '💊',
      title: 'Consultations',
      description: 'Expert consultations for complex medical cases.'
    }
  ]

  return (
    <>
      <Hero />

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              My <span className="gradient-text">Services</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Dedicated to providing exceptional healthcare services and
              advancing medical education in Karachi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="card-hover bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-dark mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                About <span className="gradient-text">Dr. Rehana Mushtaq</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dr. Rehana Mushtaq is a distinguished Associate Professor based in Karachi, Pakistan.
                With over 15 years of experience in the medical field, she has dedicated her career
                to providing exceptional patient care and advancing medical education.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Her expertise spans across clinical practice, academic teaching, and medical research,
                making her a respected figure in the healthcare community.
              </p>
              <Link
                href="/about"
                className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-secondary transition-all duration-300"
              >
                Read Full Profile
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  📍
                </div>
                <div>
                  <h4 className="font-bold">Location</h4>
                  <p className="text-gray-500 text-sm">Karachi, Pakistan</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  🏥
                </div>
                <div>
                  <h4 className="font-bold">Hospital</h4>
                  <p className="text-gray-500 text-sm">Leading Hospital in Karachi</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  🎓
                </div>
                <div>
                  <h4 className="font-bold">Position</h4>
                  <p className="text-gray-500 text-sm">Associate Professor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Patient <span className="gradient-text">Testimonials</span>
            </h2>
            <p className="text-gray-500">What patients say about Dr. Rehana Mushtaq</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex text-accent mb-4">★★★★★</div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  "Dr. Rehana is an exceptional doctor who truly cares about her patients.
                  Her expertise and compassion are unmatched."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Patient {index + 1}</h4>
                    <p className="text-xs text-gray-500">Karachi</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
