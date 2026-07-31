export default function About() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-8">
          About <span className="gradient-text">Dr. Rehana Mushtaq</span>
        </h1>

        <div className="space-y-8">
          <div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Dr. Rehana Mushtaq is a distinguished Associate Professor based in Karachi, Pakistan.
              With a career spanning over 15 years, she has established herself as a leading figure
              in the medical community.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Education</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• MBBS - University of Karachi</li>
              <li>• FCPS - College of Physicians and Surgeons Pakistan</li>
              <li>• Additional Certifications in Medical Education</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Professional Experience</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Associate Professor - Leading Hospital, Karachi (Current)</li>
              <li>• Senior Registrar - Medical Institute, Karachi</li>
              <li>• Registrar - University Hospital, Karachi</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Research & Publications</h2>
            <p className="text-gray-600 leading-relaxed">
              Dr. Rehana has published numerous research papers in national and international
              medical journals. Her research focuses on clinical medicine, healthcare education,
              and patient care improvements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Professional Memberships</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Pakistan Medical Association (PMA)</li>
              <li>• College of Physicians and Surgeons Pakistan (CPSP)</li>
              <li>• International Medical Association</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Specializations</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Clinical Medicine & Patient Care</li>
              <li>• Medical Education & Training</li>
              <li>• Medical Research & Publications</li>
              <li>• Healthcare Management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
