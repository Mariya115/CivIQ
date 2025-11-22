import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const locationData = {
  'mumbai': {
    issues: ['Waterlogging in monsoon', 'Plastic waste on beaches', 'Air pollution from vehicles'],
    ngos: ['Greenpeace India - Mumbai', 'WWF-India Mumbai Office', 'Chintan (Waste Management)'],
    events: ['Marine Drive Beach Cleanup - Dec 15', 'Mangrove Plantation - Dec 20'],
    suggestions: {
      en: "Mumbai: Major issues are waterlogging and beach pollution. Active NGOs: Greenpeace Mumbai, WWF-India. Upcoming: Marine Drive cleanup Dec 15.",
      hi: "मुंबई: मुख्य समस्याएं जलभराव और समुद्री प्रदूषण। सक्रिय एनजीओ: ग्रीनपीस मुंबई, WWF-भारत। आगामी: मरीन ड्राइव सफाई 15 दिसंबर।"
    }
  },
  'delhi': {
    issues: ['Severe air pollution', 'Waste dumping in Yamuna', 'Water scarcity'],
    ngos: ['Centre for Science and Environment', 'Chintan Environmental Group', 'TERI Delhi'],
    events: ['Tree Plantation Drive - Dec 18', 'Air Quality Awareness - Dec 22'],
    suggestions: {
      en: "Delhi: Critical air pollution and waste issues. Key NGOs: CSE, Chintan, TERI. Upcoming: Tree plantation Dec 18.",
      hi: "दिल्ली: गंभीर वायु प्रदूषण और कचरा समस्या। मुख्य एनजीओ: CSE, चिंतन, TERI। आगामी: वृक्षारोपण 18 दिसंबर।"
    }
  },
  'bangalore': {
    issues: ['Lake pollution', 'Traffic congestion', 'Waste segregation'],
    ngos: ['SayTrees Environmental Trust', 'Kalpavriksh Bangalore', 'WWF-India Bangalore'],
    events: ['Lake Cleanup Drive - Dec 16', 'Urban Tree Plantation - Dec 25'],
    suggestions: {
      en: "Bangalore: Lake pollution and traffic issues. Active NGOs: SayTrees, Kalpavriksh, WWF. Upcoming: Lake cleanup Dec 16.",
      hi: "बैंगलोर: झील प्रदूषण और ट्रैफिक समस्या। सक्रिय एनजीओ: SayTrees, कल्पवृक्ष, WWF। आगामी: झील सफाई 16 दिसंबर।"
    }
  },
  'bengaluru': {
    issues: ['Lake pollution', 'Traffic congestion', 'Waste segregation'],
    ngos: ['SayTrees Environmental Trust', 'Kalpavriksh Bangalore', 'WWF-India Bangalore'],
    events: ['Lake Cleanup Drive - Dec 16', 'Urban Tree Plantation - Dec 25'],
    suggestions: {
      en: "Bengaluru: Lake pollution and traffic issues. Active NGOs: SayTrees, Kalpavriksh, WWF. Upcoming: Lake cleanup Dec 16.",
      hi: "बेंगलूरु: झील प्रदूषण और ट्रैफिक समस्या। सक्रिय एनजीओ: SayTrees, कल्पवृक्ष, WWF। आगामी: झील सफाई 16 दिसंबर।"
    }
  }
}

const responses = {
  en: {
    greeting: "Hello! I'm CivIQ Assistant. How can I help you today? You can ask about reporting issues, finding NGOs, joining events, or get location-specific suggestions!",
    reportHelp: "To report a civic issue: 1) Click 'Report Issue' button 2) Fill out the form with details 3) Add your location 4) Submit. You'll earn points for verified reports!",
    mapHelp: "The interactive map shows all reported civic issues in your area. Different colors represent different categories like waste, pollution, infrastructure. Click markers for details!",
    ngoHelp: "I can help you find NGOs in your area! Which city are you in? I have information about environmental NGOs in Mumbai, Delhi, Bangalore and other major cities.",
    eventsHelp: "Join environmental events to make a difference! I can show you upcoming tree plantations, cleanup drives, and awareness campaigns. Which city interests you?",
    quizHelp: "Test your civic knowledge with our interactive quiz! It covers environmental issues, waste management, and civic responsibilities. Take it from the Quiz section!",
    knowledgeHelp: "Access our Knowledge Hub with 12+ educational videos, inspiring stories, and community content. Learn about climate change, waste management, and sustainable living!",
    profileHelp: "Your profile shows your civic contributions, points earned, and settings. Access it from the top-right corner to view your impact and customize preferences.",
    pointsHelp: "Earn points by: Reporting issues (15 pts), Volunteering at events (15-25 pts), Taking quizzes (10 pts per correct answer). Check leaderboard for rankings!",
    loginHelp: "To access all features, please login or signup. Click the Profile button and select Login. New users can create an account with just email and password!",
    signupHelp: "Join CivIQ community! Click Profile → Sign Up, fill your details (name, email, password, city, role), and start making your city better!",
    locationPrompt: "Please tell me your city name (like Mumbai, Delhi, Bangalore) and I'll provide specific information about local issues, NGOs, and events!",
    mapAccess: "You can access the interactive map by clicking the 'Map' button on the dashboard. It shows real-time civic issues reported by citizens in your area.",
    howToUse: "CivIQ helps you improve your city! 1) Report civic issues 2) Connect with NGOs 3) Join environmental events 4) Learn from educational content 5) Earn points for contributions!",
    features: "CivIQ Features: 📝 Issue Reporting, 🗺️ Interactive Map, 🏢 NGO Directory, 📅 Environmental Events, 📚 Knowledge Hub, 🧠 Civic Quiz, 🏆 Leaderboard, 👤 User Profiles",
    contact: "Need help? You can: 1) Use this chat for instant help 2) Check our Knowledge Hub for guides 3) Visit the Help section in your profile 4) Report bugs through the feedback option",
    privacy: "Your privacy matters! We only collect necessary data for civic reporting. Check Privacy Settings in your profile to control data sharing and visibility preferences.",
    languages: "CivIQ supports 7 languages: English, Hindi, Bengali, Telugu, Tamil, Kannada, Marathi. Change language using the 🌐 button in the header!",
    mobile: "CivIQ works great on mobile! All features are optimized for phones and tablets. Report issues on-the-go with location capture and photo upload!",
    offline: "Some features work offline! Your reports are saved locally and sync when you're back online. The map requires internet for real-time updates.",
    notifications: "Stay updated! Enable notifications in your profile settings to get alerts about: New events in your city, Report status updates, Community achievements",
    default: "I can help with: \n• Reporting civic issues \n• Finding local NGOs \n• Joining environmental events \n• Using the interactive map \n• Taking civic awareness quiz \n\nWhat interests you?"
  },
  hi: {
    greeting: "नमस्ते! मैं CivIQ सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं? स्थानीय सुझावों के लिए आप मुझे अपना स्थान बता सकते हैं!",
    reportHelp: "समस्या रिपोर्ट करने के लिए: 1) 'समस्या रिपोर्ट करें' पर क्लिक करें 2) फॉर्म भरें 3) स्थान जोड़ें 4) जमा करें",
    mapHelp: "मानचित्र आपके क्षेत्र में सभी रिपोर्ट की गई नागरिक समस्याओं को श्रेणियों के लिए अलग रंगों के साथ दिखाता है।",
    ngoHelp: "अपने क्षेत्र में काम करने वाले एनजीओ ब्राउज़ करें और पर्यावरणीय कारणों के लिए स्वयंसेवा करें।",
    eventsHelp: "स्वयंसेवक अंक अर्जित करने के लिए आगामी पर्यावरणीय कार्यक्रमों और अभियानों में शामिल हों।",
    quizHelp: "अपने ज्ञान का परीक्षण और सुधार करने के लिए हमारी नागरिक जागरूकता प्रश्नोत्तरी लें।",
    locationPrompt: "स्थान-विशिष्ट सुझावों के लिए कृपया मुझे अपने शहर का नाम बताएं।",
    default: "मैं समस्याओं की रिपोर्टिंग, मानचित्र का उपयोग, एनजीओ खोजने, कार्यक्रमों में शामिल होने या प्रश्नोत्तरी लेने में मदद कर सकता हूं। आप क्या जानना चाहेंगे?"
  },
  bn: {
    greeting: "নমস্কার! আমি CivIQ সহায়ক। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    reportHelp: "সমস্যা রিপোর্ট করতে: ১) 'সমস্যা রিপোর্ট করুন' বোতামে ক্লিক করুন ২) বিবরণ দিয়ে ফর্ম পূরণ করুন ৩) অবস্থান যোগ করুন ৪) জমা দিন।",
    ngoHelp: "আপনার এলাকার এনজিওগুলি খুঁজুন এবং পরিবেশগত কাজে স্বেচ্ছাসেবক হন।",
    default: "আমি সমস্যা রিপোর্ট, মানচিত্র ব্যবহার, এনজিও খোঁজা বা কুইজ নিতে সাহায্য করতে পারি। আপনি কী জানতে চান?"
  },
  te: {
    greeting: "నమస్కారం! నేను CivIQ సహాయకుడిని। ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    reportHelp: "సమస్యను నివేదించడానికి: ౧) 'సమస్య నివేదించు' బటన్‌పై క్లిక్ చేయండి ౨) వివరాలతో ఫారం పూరించండి ౩) స్థానం జోడించండి ౪) సమర్పించండి।",
    ngoHelp: "మీ ప్రాంతంలోని ఎన్‌జిఓలను కనుగొనండి మరియు పర్యావరణ కారణాల కోసం స్వచ్ఛందంగా పనిచేయండి।",
    default: "నేను సమస్యల నివేదన, మ్యాప్ ఉపయోగం, ఎన్‌జిఓలను కనుగొనడం లేదా క్విజ్ తీసుకోవడంలో సహాయం చేయగలను। మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?"
  },
  ta: {
    greeting: "வணக்கம்! நான் CivIQ உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    reportHelp: "பிரச்சினையை புகாரளிக்க: ௧) 'பிரச்சினை புகாரளி' பொத்தானை அழுத்தவும் ௨) விவரங்களுடன் படிவத்தை நிரப்பவும் ௩) இடத்தை சேர்க்கவும் ௪) சமர்ப்பிக்கவும்।",
    ngoHelp: "உங்கள் பகுதியில் உள்ள என்ஜிஓக்களைக் கண்டறிந்து சுற்றுச்சூழல் காரணங்களுக்காக தன்னார்வத் தொண்டு செய்யுங்கள்।",
    default: "நான் பிரச்சினை புகாரளிப்பு, வரைபட பயன்பாடு, என்ஜிஓக்களைக் கண்டறிதல் அல்லது வினாடி வினா எடுப்பதில் உதவ முடியும். நீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?"
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು CivIQ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    reportHelp: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಲು: ೧) 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ೨) ವಿವರಗಳೊಂದಿಗೆ ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ ೩) ಸ್ಥಳವನ್ನು ಸೇರಿಸಿ ೪) ಸಲ್ಲಿಸಿ।",
    ngoHelp: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿನ ಎನ್‌ಜಿಒಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಪರಿಸರ ಕಾರಣಗಳಿಗಾಗಿ ಸ್ವಯಂಸೇವಕರಾಗಿ ಕೆಲಸ ಮಾಡಿ।",
    default: "ನಾನು ಸಮಸ್ಯೆಗಳ ವರದಿ, ನಕ್ಷೆ ಬಳಕೆ, ಎನ್‌ಜಿಒಗಳನ್ನು ಹುಡುಕುವುದು ಅಥವಾ ಕ್ವಿಜ್ ತೆಗೆದುಕೊಳ್ಳುವುದರಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಏನು ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಿ?"
  },
  mr: {
    greeting: "नमस्कार! मी CivIQ सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
    reportHelp: "समस्या नोंदवण्यासाठी: १) 'समस्या नोंदवा' बटणावर क्लिक करा २) तपशीलांसह फॉर्म भरा ३) स्थान जोडा ४) सबमिट करा।",
    ngoHelp: "तुमच्या क्षेत्रातील एनजीओ शोधा आणि पर्यावरणीय कारणांसाठी स्वयंसेवा करा।",
    default: "मी समस्या नोंदवणे, नकाशा वापरणे, एनजीओ शोधणे किंवा प्रश्नमंजुषा घेण्यात मदत करू शकतो. तुम्हाला काय जाणून घ्यायचे आहे?"
  }
}

const quickReplies = {
  en: [
    { text: "How to report issue?", key: "reportHelp" },
    { text: "Find NGOs", key: "ngoHelp" },
    { text: "Join events", key: "eventsHelp" },
    { text: "Local suggestions", key: "locationPrompt" }
  ],
  hi: [
    { text: "समस्या कैसे रिपोर्ट करें?", key: "reportHelp" },
    { text: "एनजीओ खोजें", key: "ngoHelp" },
    { text: "कार्यक्रमों में शामिल हों", key: "eventsHelp" },
    { text: "स्थानीय सुझाव", key: "locationPrompt" }
  ],
  bn: [
    { text: "সমস্যা কীভাবে রিপোর্ট করবেন?", key: "reportHelp" },
    { text: "এনজিও খুঁজুন", key: "ngoHelp" },
    { text: "ইভেন্টে যোগ দিন", key: "eventsHelp" },
    { text: "স্থানীয় পরামর্শ", key: "locationPrompt" }
  ],
  te: [
    { text: "సమస్యను ఎలా నివేదించాలి?", key: "reportHelp" },
    { text: "ఎన్‌జిఓలను కనుగొనండి", key: "ngoHelp" },
    { text: "ఈవెంట్‌లలో చేరండి", key: "eventsHelp" },
    { text: "స్థానిక సూచనలు", key: "locationPrompt" }
  ],
  ta: [
    { text: "பிரச்சினையை எப்படி புகாரளிப்பது?", key: "reportHelp" },
    { text: "என்ஜிஓக்களைக் கண்டறியுங்கள்", key: "ngoHelp" },
    { text: "நிகழ்வுகளில் சேருங்கள்", key: "eventsHelp" },
    { text: "உள்ளூர் பரிந்துரைகள்", key: "locationPrompt" }
  ],
  kn: [
    { text: "ಸಮಸ್ಯೆಯನ್ನು ಹೇಗೆ ವರದಿ ಮಾಡುವುದು?", key: "reportHelp" },
    { text: "ಎನ್‌ಜಿಒಗಳನ್ನು ಹುಡುಕಿ", key: "ngoHelp" },
    { text: "ಈವೆಂಟ್‌ಗಳಲ್ಲಿ ಸೇರಿ", key: "eventsHelp" },
    { text: "ಸ್ಥಳೀಯ ಸಲಹೆಗಳು", key: "locationPrompt" }
  ],
  mr: [
    { text: "समस्या कशी नोंदवायची?", key: "reportHelp" },
    { text: "एनजीओ शोधा", key: "ngoHelp" },
    { text: "कार्यक्रमांमध्ये सहभागी व्हा", key: "eventsHelp" },
    { text: "स्थानिक सूचना", key: "locationPrompt" }
  ]
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [chatLanguage, setChatLanguage] = useState('en')
  const { currentLanguage } = useLanguage()
  
  const [recognition, setRecognition] = useState(null)
  const [synthesis, setSynthesis] = useState(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      const langMap = { 'hi': 'hi-IN', 'kn': 'kn-IN', 'mr': 'mr-IN', 'bn': 'bn-IN', 'te': 'te-IN', 'ta': 'ta-IN' }
      recognitionInstance.lang = langMap[chatLanguage] || 'en-US'
      setRecognition(recognitionInstance)
    }
    
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis)
    }
  }, [chatLanguage])

  const lang = ['hi', 'kn', 'mr', 'bn', 'te', 'ta'].includes(chatLanguage) ? chatLanguage : 'en'

  const addMessage = (text, isUser = false) => {
    setMessages(prev => [...prev, { text, isUser, timestamp: Date.now() }])
    
    // Speak bot responses
    if (!isUser && synthesis && text) {
      speakText(text)
    }
  }

  const speakText = (text) => {
    if (synthesis && !isSpeaking) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      const langMap = { 'hi': 'hi-IN', 'kn': 'kn-IN', 'mr': 'mr-IN', 'bn': 'bn-IN', 'te': 'te-IN', 'ta': 'ta-IN' }
      utterance.lang = langMap[chatLanguage] || 'en-US'
      utterance.rate = 0.8
      utterance.onend = () => setIsSpeaking(false)
      synthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true)
      recognition.start()
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
    }
  }

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSend = () => {
    if (!inputText.trim()) return
    
    addMessage(inputText, true)
    
    // Comprehensive response system
    const input = inputText.toLowerCase()
    let response = responses[lang]?.default || responses.en.default
    
    // Check for specific city mentions (including variations)
    const cities = Object.keys(locationData)
    let mentionedCity = cities.find(city => input.includes(city))
    
    // Handle city variations
    if (input.includes('bengaluru') || input.includes('bangalore')) {
      mentionedCity = 'bengaluru'
    }
    
    if (mentionedCity) {
      const cityData = locationData[mentionedCity]
      const cityName = mentionedCity === 'bengaluru' ? 'Bangalore/Bengaluru' : mentionedCity.charAt(0).toUpperCase() + mentionedCity.slice(1)
      
      if (input.includes('ngo') || input.includes('एनजीओ')) {
        response = `🏢 NGOs in ${cityName}:\n\n• ${cityData.ngos[0]} - Environmental activism & campaigns\n• ${cityData.ngos[1]} - Biodiversity & policy advocacy\n• ${cityData.ngos[2]} - Wildlife & forest conservation\n\n📍 Next Steps:\n1. Visit our 'NGOs' page from dashboard\n2. Click 'View Profile' for contact details\n3. Use 'Volunteer' button to join activities\n\nWould you like information about events or how to volunteer?`
      } else if (input.includes('event') || input.includes('कार्यक्रम')) {
        response = `📅 Upcoming Events in ${cityName}:\n\n• ${cityData.events[0]}\n• ${cityData.events[1]}\n\n📍 How to Join:\n1. Go to 'Events' page\n2. Click 'Register' on any event\n3. Fill volunteer form\n4. Earn points after participation!\n\nEach event awards 15-25 volunteer points.`
      } else if (input.includes('issue') || input.includes('problem') || input.includes('समस्या')) {
        response = `⚠️ Common Issues in ${cityName}:\n\n• ${cityData.issues[0]}\n• ${cityData.issues[1]}\n• ${cityData.issues[2]}\n\n📍 Report Similar Issues:\n1. Click 'Report Issue' button\n2. Select category & add details\n3. Capture location\n4. Submit for 15 points!\n\nYour reports help improve the city.`
      } else {
        response = `🌆 ${cityName} Overview:\n\n🔴 Key Issues: ${cityData.issues.slice(0,2).join(', ')}\n🏢 Active NGOs: ${cityData.ngos.length} organizations\n📅 Upcoming Events: ${cityData.events.length} activities\n\n📍 Quick Actions:\n• Ask "NGOs in ${cityName}" for organizations\n• Ask "Events in ${cityName}" for activities\n• Use dashboard buttons for direct access`
      }
    } else if (input.includes('thank') || input.includes('thanks')) {
      response = "😊 You're welcome! I'm here to help make your city better. Feel free to ask about:\n• Finding NGOs in your city\n• Joining environmental events\n• Reporting civic issues\n• Using the interactive map\n\nWhat else can I help you with?"
    } else if (input.includes('help') || input.includes('assist') || input.includes('how to use')) {
      response = responses[lang]?.howToUse || "🤝 CivIQ helps you improve your city! 1) Report civic issues 2) Connect with NGOs 3) Join environmental events 4) Learn from educational content 5) Earn points for contributions!"
    } else if (input.includes('features') || input.includes('what can') || input.includes('capabilities')) {
      response = responses[lang]?.features || "📱 CivIQ Features: 📝 Issue Reporting, 🗺️ Interactive Map, 🏢 NGO Directory, 📅 Environmental Events, 📚 Knowledge Hub, 🧠 Civic Quiz, 🏆 Leaderboard, 👤 User Profiles"
    } else if (input.includes('points') || input.includes('score') || input.includes('earn')) {
      response = responses[lang]?.pointsHelp || "🎆 Earn points by: Reporting issues (15 pts), Volunteering at events (15-25 pts), Taking quizzes (10 pts per correct answer). Check leaderboard for rankings!"
    } else if (input.includes('login') || input.includes('sign in') || input.includes('account')) {
      response = responses[lang]?.loginHelp || "To access all features, please login or signup. Click the Profile button and select Login. New users can create an account with just email and password!"
    } else if (input.includes('signup') || input.includes('register') || input.includes('create account')) {
      response = responses[lang]?.signupHelp || "Join CivIQ community! Click Profile → Sign Up, fill your details (name, email, password, city, role), and start making your city better!"
    } else if (input.includes('profile') || input.includes('my account') || input.includes('settings')) {
      response = responses[lang]?.profileHelp || "Your profile shows your civic contributions, points earned, and settings. Access it from the top-right corner to view your impact and customize preferences."
    } else if (input.includes('knowledge') || input.includes('learn') || input.includes('videos') || input.includes('education')) {
      response = responses[lang]?.knowledgeHelp || "Access our Knowledge Hub with 12+ educational videos, inspiring stories, and community content. Learn about climate change, waste management, and sustainable living!"
    } else if (input.includes('language') || input.includes('hindi') || input.includes('tamil') || input.includes('translate')) {
      response = responses[lang]?.languages || "CivIQ supports 7 languages: English, Hindi, Bengali, Telugu, Tamil, Kannada, Marathi. Change language using the 🌐 button in the header!"
    } else if (input.includes('mobile') || input.includes('phone') || input.includes('app')) {
      response = responses[lang]?.mobile || "CivIQ works great on mobile! All features are optimized for phones and tablets. Report issues on-the-go with location capture and photo upload!"
    } else if (input.includes('offline') || input.includes('internet') || input.includes('connection')) {
      response = responses[lang]?.offline || "Some features work offline! Your reports are saved locally and sync when you're back online. The map requires internet for real-time updates."
    } else if (input.includes('notification') || input.includes('alert') || input.includes('update')) {
      response = responses[lang]?.notifications || "Stay updated! Enable notifications in your profile settings to get alerts about: New events in your city, Report status updates, Community achievements"
    } else if (input.includes('contact') || input.includes('support') || input.includes('feedback')) {
      response = responses[lang]?.contact || "Need help? You can: 1) Use this chat for instant help 2) Check our Knowledge Hub for guides 3) Visit the Help section in your profile 4) Report bugs through the feedback option"
    } else if (input.includes('privacy') || input.includes('data') || input.includes('security')) {
      response = responses[lang]?.privacy || "Your privacy matters! We only collect necessary data for civic reporting. Check Privacy Settings in your profile to control data sharing and visibility preferences."
    } else if (input.includes('leaderboard') || input.includes('ranking') || input.includes('top users')) {
      response = "🏆 Leaderboard shows top contributors! Rankings based on: Points earned, Issues reported, Events attended, Quiz scores. Compete with other citizens to improve your city!"
    } else if (input.includes('volunteer') || input.includes('volunteering')) {
      response = "🤝 Volunteer Opportunities:\n\n• Join NGO activities through our NGO directory\n• Participate in environmental events\n• Help with community cleanup drives\n• Spread awareness in your neighborhood\n\nEarn 15-25 points per volunteer activity!"
    } else if (input.includes('find ngo') || input.includes('ngo in') || input.includes('एनजीओ खोज')) {
      response = "🔍 Finding NGOs for you!\n\nI have detailed information about environmental NGOs in:\n• Mumbai - Marine conservation & pollution\n• Delhi - Air quality & waste management\n• Bangalore - Lake restoration & urban forestry\n\n📍 Just tell me: 'NGOs in [your city]' and I'll show you specific organizations with contact details!"
    } else if (input.includes('access map') || input.includes('open map') || input.includes('view map')) {
      response = "🗺️ Accessing the Map:\n\n📍 Steps:\n1. Click 'Map' button on dashboard\n2. View color-coded issue markers\n3. Click markers for details\n4. Filter by category if needed\n\n🌈 Color Guide:\n• Red: Waste issues\n• Blue: Water problems\n• Green: Pollution reports\n\nThe map updates in real-time with new reports!"
    } else if (input.includes('location') || input.includes('city') || input.includes('स्थान') || input.includes('शहर')) {
      response = "📍 Tell me your city for personalized help!\n\nI have specific data for:\n• Mumbai - Beach cleanups & waste management\n• Delhi - Air pollution & tree plantation\n• Bangalore - Lake conservation & traffic\n\nJust say: 'I'm in [city name]' or 'NGOs in [city]'"
    } else if (input.includes('report') || input.includes('रिपोर्ट')) {
      response = "📝 Reporting Civic Issues:\n\n📍 Step-by-Step:\n1. Click 'Report Issue' on dashboard\n2. Choose category (waste, pollution, etc.)\n3. Add title & description\n4. Capture/add location\n5. Upload photo (optional)\n6. Submit for review\n\n🎆 Earn 15 points for verified reports!\nYour reports help improve city services."
    } else if (input.includes('map') || input.includes('मानचित्र')) {
      response = "🗺️ Interactive Civic Map:\n\n👁️ What you'll see:\n• Real-time issue reports\n• Color-coded categories\n• Location-based filtering\n• Issue status updates\n\n📍 Access: Dashboard → 'Map' button\n\nClick any marker to see issue details, photos, and resolution status!"
    } else if (input.includes('ngo') || input.includes('एनजीओ')) {
      response = "🏢 Environmental NGOs:\n\nI can help you find NGOs by city! We have partnerships with 10+ organizations.\n\n📍 Quick Examples:\n• 'NGOs in Mumbai' - Marine conservation groups\n• 'NGOs in Delhi' - Air quality organizations\n• 'NGOs in Bangalore' - Lake restoration groups\n\n🔗 Each NGO profile includes contact info and volunteer opportunities!"
    } else if (input.includes('event') || input.includes('कार्यक्रम')) {
      response = "📅 Environmental Events & Campaigns:\n\n🌱 Types of Events:\n• Tree plantation drives\n• Beach/lake cleanups\n• Waste segregation workshops\n• Awareness campaigns\n\n📍 Join Events:\n1. Visit 'Events' page\n2. Click 'Register' on any event\n3. Fill volunteer form\n4. Attend & earn 15-25 points!\n\nWhich city are you interested in?"
    } else if (input.includes('quiz') || input.includes('प्रश्न')) {
      response = "🧠 Civic Awareness Quiz:\n\n🎯 What's Included:\n• 8 environmental questions\n• Waste management topics\n• Climate change awareness\n• Civic responsibilities\n\n📍 How to Play:\n1. Click 'Quiz' on dashboard\n2. Answer multiple choice questions\n3. Get instant feedback\n4. Earn 10 points per correct answer\n\nTest your civic knowledge now!"
    } else if (input.includes('hello') || input.includes('hi') || input.includes('नमस्ते') || input.includes('ನಮಸ್ಕಾರ') || input.includes('नमस्कार')) {
      response = responses[lang]?.greeting || responses.en.greeting
    } else if (input.includes('weather') || input.includes('temperature')) {
      response = "🌦️ I focus on civic issues, not weather! But climate change affects weather patterns. Check our Knowledge Hub for climate change videos and learn how civic action can help address environmental challenges!"
    } else if (input.includes('traffic') || input.includes('road') || input.includes('transport')) {
      response = "🚗 Traffic & Transportation Issues:\n\n• Report road problems using 'Report Issue'\n• Check map for traffic-related reports\n• Join events promoting public transport\n• Learn about green transportation in Knowledge Hub\n\nWhich city are you asking about?"
    } else if (input.includes('pollution') || input.includes('air quality') || input.includes('smog')) {
      response = "🌫️ Air Pollution Help:\n\n• Report air quality issues in your area\n• Join tree plantation events\n• Connect with environmental NGOs\n• Watch air pollution videos in Knowledge Hub\n\nTell me your city for specific NGOs and events!"
    } else if (input.includes('waste') || input.includes('garbage') || input.includes('trash') || input.includes('litter')) {
      response = "🗑️ Waste Management Help:\n\n• Report waste dumping issues\n• Learn proper segregation techniques\n• Join cleanup drives in your city\n• Watch waste management videos\n\nWhich aspect interests you most?"
    } else if (input.includes('water') || input.includes('drainage') || input.includes('sewage')) {
      response = "💧 Water Issues Support:\n\n• Report water leakage or drainage problems\n• Learn water conservation techniques\n• Join water conservation events\n• Connect with water-focused NGOs\n\nWhat's your specific water concern?"
    } else if (input.includes('tree') || input.includes('forest') || input.includes('plant') || input.includes('green')) {
      response = "🌳 Green Initiatives:\n\n• Join tree plantation events\n• Learn urban gardening from videos\n• Connect with environmental NGOs\n• Report deforestation issues\n\nInterested in events in your city?"
    } else if (input.includes('complaint') || input.includes('problem') || input.includes('issue')) {
      response = "📝 Filing Complaints/Issues:\n\n• Use 'Report Issue' for civic problems\n• Add photos and location details\n• Track status of your reports\n• Earn points for verified reports\n\nWhat type of issue do you want to report?"
    } else if (input.includes('government') || input.includes('municipal') || input.includes('authority')) {
      response = "🏢 Government & Civic Authorities:\n\n• Report issues that reach local authorities\n• Connect with NGOs working with government\n• Learn about civic rights and responsibilities\n• Participate in community initiatives\n\nHow can I help you engage with civic processes?"
    } else {
      // Enhanced fallback with more suggestions
      response = "🤔 I'd love to help! Try asking:\n\n💬 Popular Questions:\n• 'NGOs in [your city]' - Find local organizations\n• 'How to report issues?' - Learn reporting process\n• 'Events in [city]' - Join environmental activities\n• 'How to earn points?' - Understand reward system\n• 'What are CivIQ features?' - Explore platform\n\n📍 Or ask about: pollution, waste, water, traffic, volunteering, profile, quiz, map\n\nUse quick buttons below for instant help!"
    }
    
    setTimeout(() => addMessage(response), 500)
    setInputText('')
  }

  const handleQuickReply = (key) => {
    addMessage(responses[lang][key])
  }

  const openChat = () => {
    setIsOpen(true)
    if (messages.length === 0) {
      addMessage(responses[lang]?.greeting || responses.en.greeting)
    }
  }

  // Update greeting when language changes
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setMessages(prev => [
        { text: responses[lang]?.greeting || responses.en.greeting, isUser: false, timestamp: Date.now() },
        ...prev.slice(1)
      ])
    }
  }, [chatLanguage])

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="static-icon fixed bottom-20 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white border rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary-600 text-white p-3 rounded-t-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">CivIQ Assistant</span>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                ×
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">🌐 Language:</span>
              <select
                value={chatLanguage}
                onChange={(e) => setChatLanguage(e.target.value)}
                className="text-xs bg-white text-gray-800 rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="bn">বাংলা</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-2 rounded-lg text-sm ${
                  msg.isUser 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="p-2 border-t">
              <div className="text-xs text-gray-500 mb-2">Quick help:</div>
              <div className="flex flex-wrap gap-1">
                {quickReplies[lang].map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.key)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex mb-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  lang === 'hi' ? 'संदेश टाइप करें...' :
                  lang === 'kn' ? 'ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ...' :
                  lang === 'mr' ? 'संदेश टाइप करा...' :
                  lang === 'bn' ? 'বার্তা টাইপ করুন...' :
                  lang === 'te' ? 'సందేశం టైప్ చేయండి...' :
                  lang === 'ta' ? 'செய்தியை தட்டச்சு செய்யுங்கள்...' :
                  'Type a message...'
                }
                className="flex-1 border rounded-l-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-primary-600 text-white px-3 py-2 hover:bg-primary-700"
              >
                ➤
              </button>
            </div>
            
            <div className="flex justify-center space-x-2">
              {recognition && (
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`px-3 py-1 rounded text-xs ${
                    isListening 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isListening ? '🎤 Listening...' : '🎤 Voice'}
                </button>
              )}
              
              {synthesis && (
                <button
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  className={`px-3 py-1 rounded text-xs ${
                    isSpeaking 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {isSpeaking ? '🔇 Stop' : '🔊 Audio'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}