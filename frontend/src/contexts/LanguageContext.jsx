import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const translations = {
  en: {
    tagline: "Empowering Civic Intelligence and Environmental Sustainability",
    profile: "Profile",
    dashboard: "CivIQ Dashboard",
    quickActions: "Quick Actions",
    reportIssue: "Report Issue",
    map: "Map",
    ngos: "NGOs",
    events: "Events",
    knowledge: "Knowledge",
    quiz: "Quiz",
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    // Story Hall
    storiesTitle: "Success Stories & Impact",
    storiesSubtitle: "Celebrating civic heroes and showcasing the real-world impact of community engagement",
    shareStoryTitle: "Share Your Success Story",
    shareStorySubtitle: "Have you made a positive impact in your community? Share your story to inspire others!",
    submitStory: "Submit Your Story",
    storyTitle: "Story Title",
    category: "Category",
    storySummary: "Story Summary",
    impactAchieved: "Impact Achieved",
    shareStoryBtn: "Share Story",
    readFullStory: "Read Full Story →",
    loginToShare: "Please login to share your story",
    storySubmitted: "Story submitted successfully! It will appear in the Knowledge Hub.",
    enterStoryTitle: "Enter your story title",
    tellContribution: "Tell us about your civic contribution...",
    impactExample: "e.g., 100+ residents benefited"
  },
  hi: {
    tagline: "नागरिक बुद्धिमत्ता को सशक्त बनाना",
    profile: "प्रोफ़ाइल",
    dashboard: "CivIQ डैशबोर्ड",
    quickActions: "त्वरित कार्य",
    reportIssue: "समस्या रिपोर्ट करें",
    map: "मानचित्र",
    ngos: "एनजीओ",
    events: "कार्यक्रम",
    knowledge: "ज्ञान",
    quiz: "प्रश्नोत्तरी",
    login: "लॉगिन",
    signup: "साइन अप",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "नाम",
    submit: "जमा करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    close: "बंद करें",
    // Story Hall
    storiesTitle: "सफलता की कहानियां और प्रभाव",
    storiesSubtitle: "नागरिक नायकों का जश्न मनाना और सामुदायिक भागीदारी के वास्तविक प्रभाव को दिखाना",
    shareStoryTitle: "अपनी सफलता की कहानी साझा करें",
    shareStorySubtitle: "क्या आपने अपने समुदाय में सकारात्मक प्रभाव डाला है? दूसरों को प्रेरित करने के लिए अपनी कहानी साझा करें!",
    submitStory: "अपनी कहानी सबमिट करें",
    storyTitle: "कहानी का शीर्षक",
    category: "श्रेणी",
    storySummary: "कहानी का सारांश",
    impactAchieved: "हासिल किया गया प्रभाव",
    shareStoryBtn: "कहानी साझा करें",
    readFullStory: "पूरी कहानी पढ़ें →",
    loginToShare: "कहानी साझा करने के लिए कृपया लॉगिन करें",
    storySubmitted: "कहानी सफलतापूर्वक सबमिट की गई! यह नॉलेज हब में दिखाई देगी।",
    enterStoryTitle: "अपनी कहानी का शीर्षक दर्ज करें",
    tellContribution: "हमें अपने नागरिक योगदान के बारे में बताएं...",
    impactExample: "उदा. 100+ निवासियों को लाभ हुआ"
  },
  bn: {
    tagline: "নাগরিক বুদ্ধিমত্তা ক্ষমতায়ন",
    profile: "প্রোফাইল",
    dashboard: "CivIQ ড্যাশবোর্ড",
    quickActions: "দ্রুত কর্ম",
    reportIssue: "সমস্যা রিপোর্ট করুন",
    map: "মানচিত্র",
    ngos: "এনজিও",
    events: "ইভেন্ট",
    knowledge: "জ্ঞান",
    quiz: "কুইজ",
    login: "লগইন",
    signup: "সাইন আপ",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    name: "নাম",
    submit: "জমা দিন",
    cancel: "বাতিল",
    save: "সেভ",
    close: "বন্ধ"
  },
  te: {
    tagline: "పౌర మేధస్సును శక్తివంతం చేయడం",
    profile: "ప్రొఫైల్",
    dashboard: "CivIQ డాష్బోర్డ్",
    quickActions: "త్వరిత చర్యలు",
    reportIssue: "సమస్యను నివేదించండి",
    map: "మ్యాప్",
    ngos: "ఎన్జిఓలు",
    events: "ఈవెంట్లు",
    knowledge: "జ్ఞానం",
    quiz: "క్విజ్",
    login: "లాగిన్",
    signup: "సైన్ అప్",
    email: "ఇమెయిల్",
    password: "పాస్వర్డ్",
    name: "పేరు",
    submit: "సమర్పించు",
    cancel: "రద్దు",
    save: "సేవ్",
    close: "మూసివేయి"
  },
  ta: {
    tagline: "குடிமக்கள் அறிவுத்திறனை வலுப்படுத்துதல்",
    profile: "சுயவிவரம்",
    dashboard: "CivIQ டாஷ்போர்டு",
    quickActions: "விரைவு செயல்கள்",
    reportIssue: "பிரச்சினையை புகாரளிக்கவும்",
    map: "வரைபடம்",
    ngos: "என்ஜிஓக்கள்",
    events: "நிகழ்வுகள்",
    knowledge: "அறிவு",
    quiz: "வினாடி வினா",
    login: "உள்நுழைய",
    signup: "பதிவு செய்க",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    name: "பெயர்",
    submit: "சமர்ப்பிக்க",
    cancel: "ரத்து",
    save: "சேமி",
    close: "மூடு"
  },
  kn: {
    tagline: "ನಾಗರಿಕ ಬುದ್ಧಿವಂತಿಕೆಯನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು",
    profile: "ಪ್ರೊಫೈಲ್",
    dashboard: "CivIQ ಡ್ಯಾಶ್ಬೋರ್ಡ್",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    reportIssue: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    map: "ನಕ್ಷೆ",
    ngos: "ಎನ್ಜಿಒಗಳು",
    events: "ಈವೆಂಟ್ಗಳು",
    knowledge: "ಜ್ಞಾನ",
    quiz: "ಕ್ವಿಜ್",
    login: "ಲಾಗಿನ್",
    signup: "ಸೈನ್ ಅಪ್",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್ವರ್ಡ್",
    name: "ಹೆಸರು",
    submit: "ಸಲ್ಲಿಸಿ",
    cancel: "ರದ್ದುಗೊಳಿಸಿ",
    save: "ಉಳಿಸಿ",
    close: "ಮುಚ್ಚಿ"
  },
  mr: {
    tagline: "नागरी बुद्धिमत्ता सक्षम करणे",
    profile: "प्रोफाइल",
    dashboard: "CivIQ डॅशबोर्ड",
    quickActions: "त्वरित कृती",
    reportIssue: "समस्या नोंदवा",
    map: "नकाशा",
    ngos: "एनजीओ",
    events: "कार्यक्रम",
    knowledge: "ज्ञान",
    quiz: "प्रश्नमंजुषा",
    login: "लॉगिन",
    signup: "साइन अप",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "नाव",
    submit: "सबमिट",
    cancel: "रद्द",
    save: "सेव्ह",
    close: "बंद"
  }
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'मराठी' }
]

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('civiq_language')
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem('civiq_language', langCode)
  }

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t,
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}