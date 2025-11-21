import { useState } from 'react'

export default function Footer() {
  const [showModal, setShowModal] = useState(null)

  return (
    <>
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-6 mt-12 transition-colors">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6">
            <p>© 2024 CivIQ. All rights reserved.</p>
            <div className="flex space-x-4">
              <button onClick={() => setShowModal('privacy')} className="hover:text-primary-400 text-sm transition-colors">Privacy Policy</button>
              <button onClick={() => setShowModal('terms')} className="hover:text-primary-400 text-sm transition-colors">Terms of Service</button>
              <button onClick={() => setShowModal('contact')} className="hover:text-primary-400 text-sm transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showModal === 'privacy' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Privacy Policy</h2>
              <button onClick={() => setShowModal(null)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <h3 className="text-lg font-semibold">Information We Collect</h3>
              <p>We collect information you provide when creating an account, reporting civic issues, and using our platform features.</p>
              <h3 className="text-lg font-semibold">How We Use Your Information</h3>
              <p>Your information is used to facilitate civic reporting, track issue resolution, and improve municipal services.</p>
              <h3 className="text-lg font-semibold">Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access.</p>
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <p>For privacy concerns, contact us at privacy@civiq.in or call 0833856998.</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showModal === 'terms' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Terms of Service</h2>
              <button onClick={() => setShowModal(null)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <h3 className="text-lg font-semibold">Acceptance of Terms</h3>
              <p>By using CivIQ, you agree to these terms and conditions.</p>
              <h3 className="text-lg font-semibold">User Responsibilities</h3>
              <p>Users must provide accurate information when reporting civic issues and use the platform responsibly.</p>
              <h3 className="text-lg font-semibold">Prohibited Activities</h3>
              <p>Users may not submit false reports, spam the system, or use the platform for illegal activities.</p>
              <h3 className="text-lg font-semibold">Service Availability</h3>
              <p>We strive to maintain service availability but cannot guarantee uninterrupted access.</p>
              <h3 className="text-lg font-semibold">Limitation of Liability</h3>
              <p>CivIQ is not liable for damages arising from use of the platform or municipal response times.</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showModal === 'contact' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Contact Us</h2>
              <button onClick={() => setShowModal(null)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
                <p className="text-gray-600 mb-4">We're here to help with your civic reporting needs</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">📞</span>
                  <div>
                    <div className="font-medium">Phone</div>
                    <a href="tel:0833856998" className="text-primary-600 hover:underline">0833856998</a>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">📧</span>
                  <div>
                    <div className="font-medium">Email</div>
                    <a href="mailto:support@civiq.in" className="text-primary-600 hover:underline">support@civiq.in</a>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">🕰</span>
                  <div>
                    <div className="font-medium">Support Hours</div>
                    <div className="text-gray-600">9 AM - 6 PM (Mon-Fri)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}