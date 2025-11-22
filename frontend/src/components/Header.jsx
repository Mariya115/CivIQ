import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import LanguageSelector from './LanguageSelector'

export default function Header() {
  const { t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <header className="bg-gradient-to-r from-orange-400 via-white to-green-500 dark:from-orange-600 dark:via-gray-800 dark:to-green-600 shadow-sm transition-colors relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-white/90 to-green-500/20 dark:from-orange-600/30 dark:via-gray-800/90 dark:to-green-600/30"></div>
      <div className="container mx-auto px-4 py-6 flex justify-center items-center relative z-10">
        <Link to="/" className="flex flex-col items-center">
          <span className="text-6xl font-black text-gray-800 dark:text-white drop-shadow-lg">CivIQ</span>
          <span className="text-lg text-gray-700 dark:text-gray-200 font-bold mt-2">{t('tagline')}</span>
        </Link>

        <div className="absolute right-4 flex items-center space-x-3 z-20">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-800 dark:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors backdrop-blur-sm"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <LanguageSelector />
          <Link to="/profile" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-xl" title="Profile">
            👤
          </Link>
        </div>
      </div>
    </header>
  )
}