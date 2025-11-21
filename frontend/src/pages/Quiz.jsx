import { useState } from 'react'

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  const questions = [
    {
      question: "What should you do with plastic waste?",
      options: ["Throw on road", "Segregate and recycle", "Burn it", "Bury it"],
      correct: 1
    },
    {
      question: "How often should you report civic issues?",
      options: ["Never", "Only major issues", "Whenever you see them", "Once a month"],
      correct: 2
    },
    {
      question: "Which gas is primarily responsible for global warming?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correct: 2
    },
    {
      question: "What is the 3 R's principle in waste management?",
      options: ["Reduce, Reuse, Recycle", "Remove, Replace, Restore", "Repair, Renew, Refresh", "Read, Research, Report"],
      correct: 0
    },
    {
      question: "Which transportation method is most eco-friendly?",
      options: ["Private car", "Motorcycle", "Public transport/Cycling", "Private jet"],
      correct: 2
    },
    {
      question: "What percentage of Earth's water is freshwater?",
      options: ["10%", "25%", "3%", "50%"],
      correct: 2
    },
    {
      question: "Which practice helps conserve water at home?",
      options: ["Taking long showers", "Leaving taps running", "Fixing leaky pipes", "Washing cars daily"],
      correct: 2
    },
    {
      question: "What is composting?",
      options: ["Burning organic waste", "Converting organic waste to fertilizer", "Throwing waste in rivers", "Burying plastic waste"],
      correct: 1
    }
  ]

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
  }

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz Complete!</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Final Score: {score}/{questions.length * 10}</h2>
          <p className="text-gray-600 mb-6">
            {score >= questions.length * 7 ? "Excellent! You have great civic awareness!" : 
             score >= questions.length * 5 ? "Good job! Keep learning about civic issues." :
             "Keep practicing to improve your civic knowledge!"}
          </p>
          <button
            onClick={resetQuiz}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Take Quiz Again
          </button>
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
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <h3 className="text-xl mb-6">{questions[currentQuestion].question}</h3>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => {
            let buttonClass = "w-full text-left p-3 border rounded-lg transition-colors "
            
            if (showFeedback) {
              if (index === questions[currentQuestion].correct) {
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
                {showFeedback && index === questions[currentQuestion].correct && " ✓"}
                {showFeedback && selectedAnswer === index && index !== questions[currentQuestion].correct && " ✗"}
              </button>
            )
          })}
        </div>
        
        {showFeedback && (
          <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
            selectedAnswer === questions[currentQuestion].correct 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedAnswer === questions[currentQuestion].correct 
              ? '🎉 Correct! Well done!' 
              : `❌ Incorrect. The correct answer is: ${questions[currentQuestion].options[questions[currentQuestion].correct]}`
            }
          </div>
        )}
        
        {showFeedback && (
          <button
            onClick={handleNext}
            className="w-full mt-4 bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-lg">Current Score: <span className="font-bold text-primary-600">{score}</span></p>
        </div>
      </div>
    </div>
  )
}