import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 px-2 py-1 rounded"
      >
        <span>🌐</span>
        <span className="text-sm">{languages.find(l => l.code === currentLanguage)?.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 min-w-32">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                currentLanguage === lang.code ? 'bg-primary-50 text-primary-600' : ''
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}