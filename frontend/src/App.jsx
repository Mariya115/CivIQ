import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import HelpSupport from './components/HelpSupport'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Quiz from './pages/Quiz'
import ReportForm from './pages/ReportForm'
import MyReports from './pages/MyReports'
import MapView from './pages/MapView'
import Challenges from './pages/Challenges'
import Leaderboard from './pages/Leaderboard'
import Campaigns from './pages/Campaigns'
import Profile from './pages/Profile'
import StoryHall from './pages/StoryHall'
import NGOs from './pages/NGOs'
import Events from './pages/Events'
import Knowledge from './pages/Knowledge'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/report" element={<ReportForm />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/ngos" element={<NGOs />} />
              <Route path="/events" element={<Events />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/stories" element={<StoryHall />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
            <HelpSupport />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App