import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import LanguageSelector from './LanguageSelector'

export default function Header() {
  const { t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        <Link to="/" className="flex flex-col items-center">
          <span className="text-4xl font-black text-primary-600 dark:text-primary-400">CivIQ</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('tagline')}</span>
        </Link>

        <div className="absolute right-4 flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <LanguageSelector />
          <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            {t('profile')}
          </Link>
        </div>
      </div>
    </header>
  )
}