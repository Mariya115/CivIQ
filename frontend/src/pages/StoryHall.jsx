import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'

export default function StoryHall() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    impact: '',
    category: 'Success Story'
  })
  
  const handleSubmitStory = (e) => {
    e.preventDefault()
    
    const newStory = {
      id: Date.now().toString(),
      ...formData,
      author: user?.user_metadata?.name || 'Anonymous',
      location: user?.user_metadata?.city || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      upvotes: 0,
      comments: []
    }
    
    // Save to Knowledge Hub community content
    const existingContent = JSON.parse(localStorage.getItem('civiq_user_content') || '[]')
    const storyContent = {
      ...newStory,
      type: 'story',
      content: formData.summary,
      createdAt: new Date().toISOString()
    }
    existingContent.push(storyContent)
    localStorage.setItem('civiq_user_content', JSON.stringify(existingContent))
    
    // Also save to stories
    const existingStories = JSON.parse(localStorage.getItem('civiq_stories') || '[]')
    existingStories.push(newStory)
    localStorage.setItem('civiq_stories', JSON.stringify(existingStories))
    
    setFormData({ title: '', summary: '', impact: '', category: 'Success Story' })
    setShowForm(false)
    alert(t('storySubmitted'))
  }

  const stories = [
    {
      id: 1,
      title: "From Garbage Dump to Community Garden",
      author: "Rajesh Kumar",
      location: "Mumbai, Maharashtra",
      date: "2024-01-10",
      summary: "How a persistent citizen transformed an illegal dumping ground into a beautiful community space",
      impact: "500+ residents benefited",
      category: "Success Story"
    },
    {
      id: 2,
      title: "College Students Clean 50 Potholes in One Week",
      author: "Green Warriors Club",
      location: "Pune, Maharashtra", 
      date: "2024-01-08",
      summary: "Engineering students took initiative to report and coordinate fixing of dangerous potholes",
      impact: "50 potholes fixed",
      category: "Community Action"
    },
    {
      id: 3,
      title: "AI Helps Identify Pollution Hotspots",
      author: "CivIQ Team",
      location: "Delhi, NCR",
      date: "2024-01-05",
      summary: "Machine learning analysis reveals patterns in citizen reports, leading to targeted cleanup drives",
      impact: "15 hotspots cleaned",
      category: "Tech Impact"
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('storiesTitle')}</h1>
      <p className="text-gray-600 mb-8">
        {t('storiesSubtitle')}
      </p>
      
      <div className="grid gap-8">
        {stories.map(story => (
          <article key={story.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      {story.category}
                    </span>
                    <span className="text-sm text-gray-500">{story.date}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{story.title}</h2>
                  <p className="text-gray-600 mb-4">{story.summary}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>✍️ {story.author}</span>
                      <span>📍 {story.location}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      🎯 {story.impact}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('readFullStory')}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <div className="mt-12 bg-yellow-50 border border-yellow-200 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">{t('shareStoryTitle')}</h2>
        <p className="text-yellow-700 mb-6">
          {t('shareStorySubtitle')}
        </p>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700"
        >
          {t('submitStory')}
        </button>
      </div>

      {/* Story Submission Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{t('shareStoryTitle')}</h3>
            
            {!user ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">{t('loginToShare')}</p>
                <button 
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  {t('close')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitStory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('storyTitle')}</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder={t('enterStoryTitle')}
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('category')}</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Success Story">Success Story</option>
                    <option value="Community Action">Community Action</option>
                    <option value="Environmental Impact">Environmental Impact</option>
                    <option value="Tech Innovation">Tech Innovation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('storySummary')}</label>
                  <textarea
                    required
                    className="w-full p-3 border rounded-lg h-32"
                    placeholder={t('tellContribution')}
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('impactAchieved')}</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder={t('impactExample')}
                    value={formData.impact}
                    onChange={(e) => setFormData({...formData, impact: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700"
                  >
                    {t('shareStoryBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}