export default function Services() {
  const servicesList = [
    {
      category: 'Clinical Services',
      items: [
        'Comprehensive medical consultations',
        'Diagnostic assessments',
        'Treatment planning',
        'Follow-up care',
        'Patient counseling'
      ]
    },
    {
      category: 'Academic Services',
      items: [
        'Medical education and training',
        'Student mentorship',
        'Curriculum development',
        'Clinical workshops',
        'Seminar leadership'
      ]
    },
    {
      category: 'Research Services',
      items: [
        'Clinical research',
        'Medical publications',
        'Conference presentations',
        'Research collaboration',
        'Data analysis'
      ]
    }
  ]

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            My <span className="gradient-text">Services</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Comprehensive healthcare and academic services provided with
            dedication and excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 card-hover">
              <h2 className="text-2xl font-bold text-primary mb-6">{service.category}</h2>
              <ul className="space-y-3">
                {service.items.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-primary mt-1">✦</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Services Section */}
        <div className="mt-16 bg-white rounded-2xl p-12 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-dark mb-8 text-center">Additional Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Consultations</h3>
              <p className="text-gray-600">
                Expert consultations for complex medical cases. Available for in-person and remote consultations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Appointments</h3>
              <p className="text-gray-600">
                Easy appointment scheduling. Contact our office to book a consultation at your preferred time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Medical Reports</h3>
              <p className="text-gray-600">
                Comprehensive medical reports and documentation for patient records and legal purposes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Health Guidance</h3>
              <p className="text-gray-600">
                Personalized health guidance and preventive care recommendations based on individual needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
