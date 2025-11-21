import { useState } from 'react'

export default function HelpSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('faq')

  const faqs = [
    {
      question: "How do I report a civic issue?",
      answer: "Click on 'Report Issue' from the dashboard, fill in the details, add photos if needed, and submit. You can track the progress from 'My Reports'."
    },
    {
      question: "How can I track my reports?",
      answer: "Go to 'My Reports' section to see all your submitted reports and their current status (Reported, In Progress, Resolved)."
    },
    {
      question: "What types of issues can I report?",
      answer: "You can report various civic issues like potholes, garbage, water problems, electricity issues, traffic problems, and more."
    },
    {
      question: "How do I change the language?",
      answer: "Use the language selector in the top-right corner to switch between English, Hindi, Bengali, Telugu, Tamil, Kannada, and Marathi."
    }
  ]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-40"
        title="Help & Support"
      >
        ❓
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Help & Support</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'faq'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'contact'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Contact
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'faq' && (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b dark:border-gray-700 pb-4">
                  <h3 className="font-semibold mb-2 dark:text-white">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 dark:text-white">Get in Touch</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>📧 Email: support@civiq.in</p>
                  <p>📞 Phone: +91-1234567890</p>
                  <p>🕒 Support Hours: 9 AM - 6 PM (Mon-Fri)</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 dark:text-white">Quick Support</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Use our AI chatbot for instant help with common questions.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Open Chatbot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}