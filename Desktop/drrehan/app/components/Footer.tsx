import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Dr. Rehana Mushtaq</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Associate Professor based in Karachi, Pakistan, dedicated to
              excellence in healthcare and medical education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 Karachi, Pakistan</li>
              <li>📞 +92-XXX-XXXXXXX</li>
              <li>✉️ dr.rehana@hospital.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold mb-4">Consultation Hours</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Mon - Fri: 9:00 AM - 5:00 PM</li>
              <li>Sat: 10:00 AM - 2:00 PM</li>
              <li>Sun: Closed</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 Dr. Rehana Mushtaq. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ in Karachi, Pakistan</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
