import { Link } from 'react-router-dom'
import React from 'react'

export default function Landing() {
  // Add page background
  React.useEffect(() => {
    document.body.className = 'page-landing'
    return () => document.body.className = ''
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* Faded Ashok Chakra Background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-96 h-96 opacity-10 animate-spin" style={{animationDuration: '20s'}}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#000080" strokeWidth="2"/>
            <circle cx="100" cy="100" r="10" fill="#000080"/>
            {Array.from({length: 24}, (_, i) => {
              const angle = (i * 15) * Math.PI / 180
              const x1 = 100 + 15 * Math.cos(angle)
              const y1 = 100 + 15 * Math.sin(angle)
              const x2 = 100 + 85 * Math.cos(angle)
              const y2 = 100 + 85 * Math.sin(angle)
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="1.5"/>
            })}
          </svg>
        </div>
      </div>
      
      <div className="relative z-10">
      {/* Hero Section */}
      <div className="text-center mb-16 mt-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Civic Sense Intelligence Platform
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Building Responsible Citizens for a Sustainable India
        </p>
        <p className="text-lg text-gray-500 mb-8">
          AI-powered civic awareness and accountability platform transforming how citizens collaborate for a cleaner India
        </p>
        <div className="space-x-4">
          <Link
            to="/signup"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 text-lg font-semibold"
          >
            Start Your Civic Journey
          </Link>
          <Link
            to="/login"
            className="border border-primary-600 text-primary-600 px-8 py-4 rounded-lg hover:bg-primary-50 text-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-orange-50 p-6 rounded-lg shadow text-center border-2 border-orange-200 border-opacity-50">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-3">AI-Powered Reporting</h3>
          <p className="text-gray-600">Report civic issues with automatic AI classification and GPS tagging</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow text-center border-2 border-blue-200 border-opacity-50">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold mb-3">Civic IQ Score</h3>
          <p className="text-gray-600">Track your civic responsibility with personalized IQ scoring</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow text-center border-2 border-green-200 border-opacity-50">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-3">Gamified Challenges</h3>
          <p className="text-gray-600">Earn EcoPoints and badges through civic engagement challenges</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 text-white p-8 rounded-lg text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Making Real Impact</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold">1.7L+</div>
            <div className="text-primary-100">Tonnes of waste generated daily in India</div>
          </div>
          <div>
            <div className="text-4xl font-bold">47%</div>
            <div className="text-primary-100">Waste remains untreated</div>
          </div>
          <div>
            <div className="text-4xl font-bold">100%</div>
            <div className="text-primary-100">Digital solution for civic awareness</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Build a Cleaner India?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of civic champions making a difference in their communities
        </p>
        <Link
          to="/quiz"
          className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-lg font-semibold"
        >
          Take Civic Awareness Quiz
        </Link>
      </div>
      </div>
    </div>
  )
}