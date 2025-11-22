import { useState, useEffect } from 'react'

const allQuestions = [
  { question: "What should you do with plastic waste?", options: ["Throw on road", "Segregate and recycle", "Burn it", "Bury it"], correct: 1 },
  { question: "How often should you report civic issues?", options: ["Never", "Only major issues", "Whenever you see them", "Once a month"], correct: 2 },
  { question: "Which gas is primarily responsible for global warming?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
  { question: "What is the 3 R's principle in waste management?", options: ["Reduce, Reuse, Recycle", "Remove, Replace, Restore", "Repair, Renew, Refresh", "Read, Research, Report"], correct: 0 },
  { question: "Which transportation method is most eco-friendly?", options: ["Private car", "Motorcycle", "Public transport/Cycling", "Private jet"], correct: 2 },
  { question: "What percentage of Earth's water is freshwater?", options: ["10%", "25%", "3%", "50%"], correct: 2 },
  { question: "Which practice helps conserve water at home?", options: ["Taking long showers", "Leaving taps running", "Fixing leaky pipes", "Washing cars daily"], correct: 2 },
  { question: "What is composting?", options: ["Burning organic waste", "Converting organic waste to fertilizer", "Throwing waste in rivers", "Burying plastic waste"], correct: 1 },
  { question: "What does biodegradable mean?", options: ["Cannot be broken down", "Can be broken down naturally", "Made of plastic", "Toxic to environment"], correct: 1 },
  { question: "Which is a renewable energy source?", options: ["Coal", "Oil", "Solar power", "Natural gas"], correct: 2 },
  { question: "What causes air pollution in cities?", options: ["Trees", "Vehicle emissions", "Rain", "Wind"], correct: 1 },
  { question: "How can you reduce water wastage?", options: ["Use more water", "Take shorter showers", "Leave taps open", "Water plants excessively"], correct: 1 },
  { question: "What is the main cause of deforestation?", options: ["Natural disasters", "Human activities", "Animal migration", "Climate change"], correct: 1 },
  { question: "Which material takes longest to decompose?", options: ["Paper", "Food waste", "Plastic", "Wood"], correct: 2 },
  { question: "What is acid rain caused by?", options: ["Too much oxygen", "Industrial pollution", "Clean air", "Pure water"], correct: 1 },
  { question: "Which practice helps reduce carbon footprint?", options: ["Driving more", "Using LED bulbs", "Wasting electricity", "Burning trash"], correct: 1 },
  { question: "What is the greenhouse effect?", options: ["Cooling of Earth", "Warming of Earth's atmosphere", "Growing plants", "Building houses"], correct: 1 },
  { question: "Which is NOT a water pollutant?", options: ["Industrial waste", "Sewage", "Oxygen", "Chemicals"], correct: 2 },
  { question: "What should you do with electronic waste?", options: ["Throw in regular bin", "Recycle at e-waste centers", "Burn it", "Bury it"], correct: 1 },
  { question: "Which gas depletes the ozone layer?", options: ["Oxygen", "CFC", "Nitrogen", "Hydrogen"], correct: 1 },
  { question: "What is sustainable development?", options: ["Using all resources quickly", "Meeting present needs without harming future", "Ignoring environment", "Building more factories"], correct: 1 },
  { question: "Which is a sign of water pollution?", options: ["Clear water", "Foul smell and color change", "Fish swimming", "Plants growing"], correct: 1 },
  { question: "What causes noise pollution?", options: ["Silence", "Loud sounds from traffic/industry", "Birds singing", "Wind blowing"], correct: 1 },
  { question: "Which practice conserves energy?", options: ["Leaving lights on", "Using energy-efficient appliances", "Running AC all day", "Keeping devices plugged in"], correct: 1 },
  { question: "What is organic farming?", options: ["Using chemical pesticides", "Farming without synthetic chemicals", "Indoor farming only", "Machine-only farming"], correct: 1 },
  { question: "Which is a consequence of global warming?", options: ["Cooler temperatures", "Rising sea levels", "More ice formation", "Decreased rainfall everywhere"], correct: 1 },
  { question: "What is recycling?", options: ["Throwing away items", "Converting waste into reusable materials", "Burning waste", "Burying waste"], correct: 1 },
  { question: "Which tree is known as 'Tree of Life'?", options: ["Mango", "Neem", "Apple", "Pine"], correct: 1 },
  { question: "What is the main component of natural gas?", options: ["Oxygen", "Methane", "Nitrogen", "Carbon dioxide"], correct: 1 },
  { question: "Which is a biodegradable material?", options: ["Plastic bag", "Paper", "Glass bottle", "Metal can"], correct: 1 },
  { question: "What causes smog?", options: ["Clean air", "Air pollution + sunlight", "Rain", "Snow"], correct: 1 },
  { question: "Which is the cleanest fuel?", options: ["Coal", "Hydrogen", "Diesel", "Petrol"], correct: 1 },
  { question: "What is urban heat island effect?", options: ["Cities cooler than surroundings", "Cities warmer than surroundings", "No temperature difference", "Cities always cold"], correct: 1 },
  { question: "Which practice reduces plastic waste?", options: ["Using more plastic bags", "Using cloth bags", "Throwing plastic anywhere", "Burning plastic"], correct: 1 },
  { question: "What is the main cause of water scarcity?", options: ["Too much rain", "Overuse and pollution", "Too many rivers", "Clean water"], correct: 1 },
  { question: "Which is a natural air purifier?", options: ["Car exhaust", "Trees and plants", "Factory smoke", "Burning waste"], correct: 1 },
  { question: "What is soil erosion?", options: ["Soil becoming fertile", "Loss of topsoil", "Soil getting water", "Soil becoming hard"], correct: 1 },
  { question: "Which energy source is unlimited?", options: ["Coal", "Solar energy", "Oil", "Natural gas"], correct: 1 },
  { question: "What is the effect of deforestation?", options: ["More oxygen", "Loss of biodiversity", "Cooler climate", "More rainfall"], correct: 1 },
  { question: "Which is a water conservation method?", options: ["Rainwater harvesting", "Wasting water", "Polluting rivers", "Overusing groundwater"], correct: 0 },
  { question: "What causes eutrophication in water bodies?", options: ["Clean water", "Excess nutrients from fertilizers", "Fish swimming", "Sunlight"], correct: 1 },
  { question: "Which is a green building practice?", options: ["Using more energy", "Installing solar panels", "Wasting water", "Using harmful materials"], correct: 1 },
  { question: "What is carbon footprint?", options: ["Size of feet", "Amount of CO2 emissions produced", "Walking distance", "Shoe size"], correct: 1 },
  { question: "Which is a consequence of air pollution?", options: ["Better health", "Respiratory diseases", "Cleaner environment", "More oxygen"], correct: 1 },
  { question: "What is the purpose of wetlands?", options: ["Waste disposal", "Natural water filtration", "Building construction", "Mining"], correct: 1 },
  { question: "Which practice helps wildlife conservation?", options: ["Destroying habitats", "Creating protected areas", "Hunting animals", "Polluting environment"], correct: 1 },
  { question: "What is the main cause of species extinction?", options: ["Natural evolution", "Human activities", "Animal diseases", "Weather changes"], correct: 1 },
  { question: "Which is a characteristic of sustainable cities?", options: ["High pollution", "Efficient public transport", "Waste everywhere", "No green spaces"], correct: 1 },
  { question: "What is the role of ozone layer?", options: ["Causes pollution", "Protects from UV radiation", "Creates smog", "Reduces oxygen"], correct: 1 },
  { question: "Which is a renewable resource?", options: ["Coal", "Wind", "Oil", "Natural gas"], correct: 1 },
  { question: "What causes land pollution?", options: ["Clean soil", "Improper waste disposal", "Planting trees", "Rain water"], correct: 1 },
  { question: "Which is an eco-friendly transportation?", options: ["Private jets", "Bicycles", "Large trucks", "Old cars"], correct: 1 },
  { question: "What is the greenhouse gas effect on climate?", options: ["Cooling effect", "Warming effect", "No effect", "Freezing effect"], correct: 1 },
  { question: "Which practice reduces energy consumption?", options: ["Using incandescent bulbs", "Using LED lights", "Keeping appliances on", "Overusing electricity"], correct: 1 },
  { question: "What is the main source of marine pollution?", options: ["Fish", "Land-based activities", "Ocean currents", "Sea plants"], correct: 1 },
  { question: "Which is a sign of healthy ecosystem?", options: ["No animals", "High biodiversity", "Polluted water", "Dead plants"], correct: 1 },
  { question: "What is the impact of plastic on marine life?", options: ["Helps them grow", "Causes harm and death", "Provides food", "No impact"], correct: 1 },
  { question: "Which is a water-saving device?", options: ["Regular taps", "Low-flow showerheads", "Leaky pipes", "Open drains"], correct: 1 },
  { question: "What is the main benefit of urban forests?", options: ["More pollution", "Air purification", "Noise increase", "Heat generation"], correct: 1 },
  { question: "Which is a sustainable farming practice?", options: ["Overuse of pesticides", "Crop rotation", "Soil depletion", "Water wastage"], correct: 1 },
  { question: "What causes thermal pollution?", options: ["Cold water", "Hot water discharge from industries", "Clean water", "Rain water"], correct: 1 },
  { question: "Which is a green energy source?", options: ["Coal power", "Hydroelectric power", "Oil burning", "Gas combustion"], correct: 1 },
  { question: "What is the effect of overpopulation on environment?", options: ["Less resource use", "Increased resource consumption", "Better environment", "No effect"], correct: 1 },
  { question: "Which material is most recyclable?", options: ["Mixed plastics", "Aluminum", "Dirty paper", "Food waste"], correct: 1 },
  { question: "What is the main cause of coral bleaching?", options: ["Cold water", "Rising ocean temperatures", "Clean water", "Fish activity"], correct: 1 },
  { question: "Which practice helps reduce air pollution?", options: ["Burning more fuel", "Using public transport", "Industrial emissions", "Cutting trees"], correct: 1 },
  { question: "What is the purpose of environmental laws?", options: ["Increase pollution", "Protect environment", "Harm wildlife", "Waste resources"], correct: 1 },
  { question: "Which is a consequence of soil pollution?", options: ["Better crops", "Reduced agricultural productivity", "More nutrients", "Healthier plants"], correct: 1 },
  { question: "What is the role of decomposers in ecosystem?", options: ["Create waste", "Break down dead matter", "Pollute environment", "Consume oxygen"], correct: 1 },
  { question: "Which is a water pollution indicator?", options: ["Clear water", "High BOD levels", "Fish presence", "Good taste"], correct: 1 },
  { question: "What is the main advantage of solar energy?", options: ["High pollution", "Renewable and clean", "Limited availability", "Expensive always"], correct: 1 },
  { question: "Which practice conserves biodiversity?", options: ["Habitat destruction", "Creating wildlife corridors", "Introducing invasive species", "Overhunting"], correct: 1 },
  { question: "What is the impact of climate change on agriculture?", options: ["Always positive", "Unpredictable weather patterns", "No impact", "Better yields always"], correct: 1 },
  { question: "Which is a sustainable waste management practice?", options: ["Open dumping", "Waste segregation", "Burning all waste", "Throwing in water bodies"], correct: 1 },
  { question: "What causes indoor air pollution?", options: ["Fresh air", "Poor ventilation and chemicals", "Open windows", "Plants"], correct: 1 },
  { question: "Which is an example of circular economy?", options: ["Linear production", "Reuse and recycle materials", "Single-use products", "Waste generation"], correct: 1 },
  { question: "What is the main cause of groundwater depletion?", options: ["Too much rain", "Over-extraction", "River flow", "Ocean water"], correct: 1 },
  { question: "Which is a benefit of green roofs?", options: ["More heat", "Temperature regulation", "Water wastage", "Air pollution"], correct: 1 },
  { question: "What is the effect of pesticides on environment?", options: ["Only positive", "Can harm non-target species", "No effect", "Always safe"], correct: 1 },
  { question: "Which is a characteristic of smart cities?", options: ["High energy waste", "Efficient resource management", "More pollution", "Traffic congestion"], correct: 1 },
  { question: "What is the main source of methane emissions?", options: ["Trees", "Livestock and landfills", "Ocean", "Mountains"], correct: 1 },
  { question: "Which practice helps in carbon sequestration?", options: ["Deforestation", "Afforestation", "Burning forests", "Soil degradation"], correct: 1 },
  { question: "What is the impact of urbanization on water cycle?", options: ["No change", "Altered drainage patterns", "Better water quality", "More groundwater"], correct: 1 },
  { question: "Which is a green transportation fuel?", options: ["Diesel", "Biofuel", "Petrol", "Kerosene"], correct: 1 },
  { question: "What is the main cause of habitat fragmentation?", options: ["Natural disasters", "Human development", "Animal migration", "Weather changes"], correct: 1 },
  { question: "Which is a water treatment method?", options: ["Adding more pollutants", "Filtration and disinfection", "Mixing with waste", "Heating only"], correct: 1 },
  { question: "What is the effect of light pollution?", options: ["Better visibility", "Disrupts wildlife behavior", "Saves energy", "No impact"], correct: 1 },
  { question: "Which is a sustainable fishing practice?", options: ["Overfishing", "Selective fishing methods", "Using harmful nets", "Fishing during breeding"], correct: 1 },
  { question: "What is the main benefit of composting?", options: ["Creates waste", "Reduces organic waste and creates fertilizer", "Increases pollution", "Wastes time"], correct: 1 },
  { question: "Which is a renewable energy storage method?", options: ["Coal storage", "Battery systems", "Oil tanks", "Gas cylinders"], correct: 1 },
  { question: "What is the impact of mining on environment?", options: ["Only positive", "Habitat destruction and pollution", "No impact", "Improves landscape"], correct: 1 },
  { question: "Which practice reduces food waste?", options: ["Buying excess food", "Meal planning", "Throwing away leftovers", "Ignoring expiry dates"], correct: 1 },
  { question: "What is the main cause of ocean acidification?", options: ["Fish activity", "CO2 absorption by oceans", "Salt water", "Ocean currents"], correct: 1 },
  { question: "Which is an eco-friendly building material?", options: ["Plastic", "Bamboo", "Asbestos", "Lead"], correct: 1 },
  { question: "What is the purpose of environmental impact assessment?", options: ["Increase pollution", "Evaluate environmental effects of projects", "Speed up construction", "Ignore environment"], correct: 1 },
  { question: "Which is a sign of air quality improvement?", options: ["More smog", "Better visibility", "Increased coughing", "Burning eyes"], correct: 1 },
  { question: "What is the main advantage of electric vehicles?", options: ["More noise", "Zero direct emissions", "Higher fuel cost", "More pollution"], correct: 1 },
  { question: "Which practice helps in waste reduction?", options: ["Buying more", "Choosing reusable products", "Single-use items", "Excessive packaging"], correct: 1 },
  { question: "What is the effect of invasive species?", options: ["Help ecosystem", "Disrupt local ecosystems", "No impact", "Improve biodiversity"], correct: 1 },
  { question: "Which is a water conservation technique in agriculture?", options: ["Flood irrigation", "Drip irrigation", "Overwatering", "Water wastage"], correct: 1 },
  { question: "What is the main cause of desertification?", options: ["Too much water", "Overgrazing and deforestation", "Rain", "Cold weather"], correct: 1 },
  { question: "Which is a benefit of urban planning?", options: ["Random development", "Efficient land use", "More traffic", "Increased pollution"], correct: 1 },
  { question: "What is the impact of fast fashion on environment?", options: ["Positive only", "Increased waste and pollution", "No impact", "Reduces waste"], correct: 1 },
  { question: "Which is a natural carbon sink?", options: ["Factories", "Forests", "Cars", "Buildings"], correct: 1 },
  { question: "What is the main purpose of recycling?", options: ["Create more waste", "Reduce resource consumption", "Increase pollution", "Waste money"], correct: 1 }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [questions, setQuestions] = useState([])

  // Select 10 random questions when component mounts
  useEffect(() => {
    const getRandomQuestions = () => {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 10)
    }
    setQuestions(getRandomQuestions())
  }, [])

  const handleAnswer = (selectedOption) => {
    setSelectedAnswer(selectedOption)
    setShowFeedback(true)
    
    if (selectedOption === questions[currentQuestion].correct) {
      setScore(score + 10)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizComplete(false)
    // Generate new random questions
    const getRandomQuestions = () => {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 10)
    }
    setQuestions(getRandomQuestions())
  }

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz Complete!</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Final Score: {score}/100</h2>
          <p className="text-gray-600 mb-6">
            {score >= 70 ? "Excellent! You have great civic awareness!" : 
             score >= 50 ? "Good job! Keep learning about civic issues." :
             "Keep practicing to improve your civic knowledge!"}
          </p>
          <div className="mb-6">
            <p className="text-sm text-gray-500">Questions answered from a pool of 100+ civic awareness topics</p>
          </div>
          <button
            onClick={resetQuiz}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Take New Quiz (10 Random Questions)
          </button>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="text-4xl mb-4">🔄</div>
          <p>Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Civic Awareness Quiz</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of 10 (from 100+ questions)
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>
        <h3 className="text-xl mb-6">{questions[currentQuestion]?.question}</h3>
        <div className="space-y-3">
          {questions[currentQuestion]?.options.map((option, index) => {
            let buttonClass = "w-full text-left p-3 border rounded-lg transition-colors "
            
            if (showFeedback) {
              if (index === questions[currentQuestion]?.correct) {
                buttonClass += "bg-green-100 border-green-500 text-green-800"
              } else if (selectedAnswer === index) {
                buttonClass += "bg-red-100 border-red-500 text-red-800"
              } else {
                buttonClass += "bg-gray-100 border-gray-300 text-gray-600"
              }
            } else {
              buttonClass += "hover:bg-primary-50 border-gray-300"
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={buttonClass}
              >
                {option}
                {showFeedback && index === questions[currentQuestion]?.correct && " ✓"}
                {showFeedback && selectedAnswer === index && index !== questions[currentQuestion]?.correct && " ✗"}
              </button>
            )
          })}
        </div>
        
        {showFeedback && (
          <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
            selectedAnswer === questions[currentQuestion]?.correct 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedAnswer === questions[currentQuestion]?.correct 
              ? '🎉 Correct! Well done!' 
              : `❌ Incorrect. The correct answer is: ${questions[currentQuestion]?.options[questions[currentQuestion]?.correct]}`
            }
          </div>
        )}
        
        {showFeedback && (
          <button
            onClick={handleNext}
            className="w-full mt-4 bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700"
          >
            {currentQuestion === 9 ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-lg">Current Score: <span className="font-bold text-primary-600">{score}</span></p>
        </div>
      </div>
    </div>
  )
}