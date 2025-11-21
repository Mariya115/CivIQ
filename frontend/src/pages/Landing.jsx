import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          🇮🇳 CivIQ - Civic Sense Intelligence Platform
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
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-3">AI-Powered Reporting</h3>
          <p className="text-gray-600">Report civic issues with automatic AI classification and GPS tagging</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold mb-3">Civic IQ Score</h3>
          <p className="text-gray-600">Track your civic responsibility with personalized IQ scoring</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
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
  )
}