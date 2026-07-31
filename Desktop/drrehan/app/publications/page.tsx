export default function Publications() {
  const publications = [
    {
      year: '2024',
      title: 'Advanced Clinical Approaches in Modern Healthcare',
      journal: 'International Medical Journal',
      type: 'Research Paper'
    },
    {
      year: '2023',
      title: 'Medical Education Excellence and Student Outcomes',
      journal: 'Journal of Medical Education',
      type: 'Research Paper'
    },
    {
      year: '2023',
      title: 'Patient Care Innovations in Teaching Hospitals',
      journal: 'Healthcare Management Review',
      type: 'Research Paper'
    },
    {
      year: '2022',
      title: 'Strategies for Effective Clinical Teaching',
      journal: 'Medical Teaching Quarterly',
      type: 'Research Paper'
    },
    {
      year: '2022',
      title: 'Healthcare Quality Improvement Initiatives',
      journal: 'Quality in Health Care',
      type: 'Research Paper'
    },
    {
      year: '2021',
      title: 'Clinical Practice Guidelines and Evidence-Based Medicine',
      journal: 'Clinical Practice Journal',
      type: 'Research Paper'
    },
  ]

  const conferences = [
    {
      year: '2024',
      title: 'International Medical Conference - Karachi',
      role: 'Keynote Speaker',
      topic: 'Future of Medical Education'
    },
    {
      year: '2023',
      title: 'Pakistan Medical Association Annual Conference',
      role: 'Presenter',
      topic: 'Healthcare Innovation and Excellence'
    },
    {
      year: '2023',
      title: 'South Asian Medical Summit',
      role: 'Panelist',
      topic: 'Medical Education Standards'
    },
    {
      year: '2022',
      title: 'Clinical Practice Workshop Series',
      role: 'Facilitator',
      topic: 'Modern Clinical Approaches'
    },
  ]

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Publications & <span className="gradient-text">Research</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Dr. Rehana's contributions to medical literature and research
          </p>
        </div>

        {/* Research Papers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-dark mb-8">Research Papers</h2>
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        {pub.year}
                      </span>
                      <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                        {pub.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2">{pub.title}</h3>
                    <p className="text-gray-500 text-sm">{pub.journal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conference Presentations */}
        <div>
          <h2 className="text-3xl font-bold text-dark mb-8">Conference Presentations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {conferences.map((conf, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
                <div className="flex items-start gap-3 mb-4">
                  <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium">
                    {conf.year}
                  </span>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                    {conf.role}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{conf.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Topic: {conf.topic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-dark mb-6">Research Interests</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-primary mb-2">Clinical Research</h3>
              <p className="text-gray-600 text-sm">
                Focus on improving clinical outcomes and patient care through evidence-based research and innovation.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">Medical Education</h3>
              <p className="text-gray-600 text-sm">
                Advancing teaching methodologies and developing future healthcare professionals through quality education.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">Healthcare Quality</h3>
              <p className="text-gray-600 text-sm">
                Implementing quality improvement initiatives and best practices in healthcare delivery.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">Patient Outcomes</h3>
              <p className="text-gray-600 text-sm">
                Research focused on improving patient satisfaction and long-term health outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
