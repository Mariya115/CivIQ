import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const youtubeVideos = [
  {
    id: 1,
    title: "Swachh Bharat Mission - Clean India",
    videoId: "L6hSuf7Q6pA",
    description: "Educational video on Swachh Bharat Mission and cleanliness",
    duration: "5:30"
  },
  {
    id: 2,
    title: "Climate Change Solutions",
    videoId: "yiw6_JakZFc",
    description: "Understanding climate change and practical solutions",
    duration: "8:15"
  },
  {
    id: 3,
    title: "Water Conservation Techniques",
    videoId: "_6xlNyWPpB8",
    description: "Simple water saving methods for households",
    duration: "6:45"
  },
  {
    id: 4,
    title: "Waste Management Best Practices",
    videoId: "6jQ7y_qQYUA",
    description: "How to properly manage and segregate waste",
    duration: "7:22"
  },
  {
    id: 5,
    title: "Renewable Energy Basics",
    videoId: "1kUE0BZtTRc",
    description: "Introduction to solar, wind and clean energy",
    duration: "10:45"
  },
  {
    id: 6,
    title: "Air Pollution and Health",
    videoId: "GVBeY1jSG9Y",
    description: "Understanding air quality and its health impacts",
    duration: "9:33"
  },
  {
    id: 7,
    title: "Sustainable Living Guide",
    videoId: "HQTUWK7CM-Y",
    description: "Tips for living sustainably in daily life",
    duration: "12:08"
  },
  {
    id: 8,
    title: "Urban Gardening for Beginners",
    videoId: "YhvfOlPYifY",
    description: "Growing plants in small urban spaces",
    duration: "8:20"
  }
]

const inspirationalArticles = [
  {
    id: 1,
    title: "Greta Thunberg: The Voice of Climate Action",
    author: "Environmental Team",
    excerpt: "How a young activist sparked a global movement for climate justice and inspired millions to take action.",
    content: "Greta Thunberg's journey from a concerned teenager to a global climate activist shows the power of individual action. Her school strikes for climate have inspired millions of young people worldwide to demand action on climate change. Her message is simple yet powerful: 'No one is too small to make a difference.' Through her speeches at the UN and other international forums, she has brought urgency to climate discussions and shown that age is no barrier to making meaningful change.",
    readTime: "5 min read",
    image: "🌍"
  },
  {
    id: 2,
    title: "Wangari Maathai: The Green Belt Movement",
    author: "Sustainability Stories",
    excerpt: "The inspiring story of Kenya's Nobel laureate who planted 51 million trees and empowered communities.",
    content: "Wangari Maathai founded the Green Belt Movement in 1977, which has planted over 51 million trees across Kenya. Her work went beyond environmental conservation to include democracy, women's rights, and poverty reduction. She became the first African woman to receive the Nobel Peace Prize in 2004. Her approach of combining environmental restoration with community empowerment shows how environmental action can address multiple social challenges simultaneously.",
    readTime: "7 min read",
    image: "🌳"
  },
  {
    id: 3,
    title: "Vandana Shiva: Seeds of Change",
    author: "Green Pioneers",
    excerpt: "How an Indian scholar became a global advocate for biodiversity and sustainable agriculture.",
    content: "Dr. Vandana Shiva has dedicated her life to protecting biodiversity and promoting sustainable agriculture. Through her organization Navdanya, she has helped establish seed banks and promoted organic farming across India. Her work highlights the importance of preserving traditional knowledge and protecting farmers' rights. She has shown how environmental protection and social justice are interconnected, inspiring a generation of environmental activists.",
    readTime: "6 min read",
    image: "🌾"
  }
]

export default function Knowledge() {
  const [activeTab, setActiveTab] = useState('videos')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedContent, setSelectedContent] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [contentType, setContentType] = useState('article')
  const [userContent, setUserContent] = useState([])
  const [commentText, setCommentText] = useState('')
  const [editingContent, setEditingContent] = useState(null)
  const [editFormData, setEditFormData] = useState({ title: '', content: '' })
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    category: 'Environment'
  })
  const { user } = useAuth()

  const handleUpvote = (contentId) => {
    const updatedContent = userContent.map(content => 
      content.id === contentId 
        ? { ...content, upvotes: (content.upvotes || 0) + 1 }
        : content
    )
    setUserContent(updatedContent)
    localStorage.setItem('civiq_user_content', JSON.stringify(updatedContent))
  }

  const handleAddComment = (contentId) => {
    if (!commentText.trim() || !user) return
    
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: user.user_metadata?.name || 'Anonymous',
      createdAt: new Date().toISOString()
    }
    
    const updatedContent = userContent.map(content => 
      content.id === contentId 
        ? { ...content, comments: [...(content.comments || []), newComment] }
        : content
    )
    setUserContent(updatedContent)
    localStorage.setItem('civiq_user_content', JSON.stringify(updatedContent))
    setCommentText('')
  }

  const handleEditContent = (content) => {
    setEditingContent(content)
    setEditFormData({ title: content.title, content: content.content })
  }

  const handleUpdateContent = (e) => {
    e.preventDefault()
    const updatedContent = userContent.map(content => 
      content.id === editingContent.id 
        ? { ...content, title: editFormData.title, content: editFormData.content }
        : content
    )
    setUserContent(updatedContent)
    localStorage.setItem('civiq_user_content', JSON.stringify(updatedContent))
    setEditingContent(null)
    setEditFormData({ title: '', content: '' })
  }

  const handleDeleteContent = (contentId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedContent = userContent.filter(content => content.id !== contentId)
      setUserContent(updatedContent)
      localStorage.setItem('civiq_user_content', JSON.stringify(updatedContent))
    }
  }

  const handleSubmitContent = (e) => {
    e.preventDefault()
    
    const newContent = {
      id: Date.now().toString(),
      ...formData,
      author: user?.user_metadata?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      type: contentType,
      likes: 0,
      views: 0
    }
    
    const existingContent = JSON.parse(localStorage.getItem('civiq_user_content') || '[]')
    existingContent.push(newContent)
    localStorage.setItem('civiq_user_content', JSON.stringify(existingContent))
    
    setUserContent(existingContent)
    setFormData({ title: '', content: '', videoUrl: '', category: 'Environment' })
    setShowCreateForm(false)
    alert('Content published successfully!')
  }

  const loadUserContent = () => {
    const content = JSON.parse(localStorage.getItem('civiq_user_content') || '[]')
    setUserContent(content)
  }

  useState(() => {
    loadUserContent()
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Knowledge Hub</h1>
        <p className="text-gray-600">Learn, share, and inspire environmental action</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {[
          { key: 'videos', label: '📺 Educational Videos', icon: '📺' },
          { key: 'articles', label: '📚 Inspiring Stories', icon: '📚' },
          { key: 'community', label: '👥 Community Content', icon: '👥' },
          { key: 'create', label: '✍️ Share Your Story', icon: '✍️' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.key 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Educational Videos</h2>
            <p className="text-gray-600">Watch curated videos to increase your civic and environmental knowledge</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {youtubeVideos.map(video => (
              <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1&origin=${window.location.origin}`}
                    title={video.title}
                    className="w-full h-full rounded-t-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Duration: {video.duration}</span>
                    <button className="text-primary-600 hover:underline">
                      Watch on YouTube
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Inspiring Environmental Stories</h2>
            <p className="text-gray-600">Read about environmental champions who made a difference</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationalArticles.map(article => (
              <div key={article.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{article.image}</div>
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-2">By {article.author} • {article.readTime}</p>
                <p className="text-gray-700 mb-4">{article.excerpt}</p>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="text-primary-600 hover:underline font-medium"
                >
                  Read Full Story →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Content Tab */}
      {activeTab === 'community' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Community Contributions</h2>
            <p className="text-gray-600">Stories, ideas, and videos shared by our community members</p>
          </div>
          
          {userContent.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No community content yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share your environmental story or idea!</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
              >
                Share Your Story
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {userContent.map(content => (
                <div key={content.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      content.type === 'article' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {content.type === 'article' ? '📄 Article' : '🎥 Video'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{content.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">By {content.author}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{content.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleUpvote(content.id)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600"
                      >
                        <span>👍</span>
                        <span>{content.upvotes || 0}</span>
                      </button>
                      <button 
                        onClick={() => setSelectedContent(content)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600"
                      >
                        <span>💬</span>
                        <span>{content.comments?.length || 0}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {content.videoUrl && (
                        <a href={content.videoUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-primary-600 hover:underline text-sm">
                          Watch Video →
                        </a>
                      )}
                      {user && content.author === user.user_metadata?.name && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditContent(content)}
                            className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteContent(content.id)}
                            className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Content Tab */}
      {activeTab === 'create' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Share Your Story</h2>
            <p className="text-gray-600">Contribute your ideas, experiences, or educational content</p>
          </div>
          
          {!user ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Login Required</h3>
              <p className="text-gray-600 mb-4">Please login to share your content with the community</p>
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
                Go to Login
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="article"
                      checked={contentType === 'article'}
                      onChange={(e) => setContentType(e.target.value)}
                      className="mr-2"
                    />
                    📄 Article/Story
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="video"
                      checked={contentType === 'video'}
                      onChange={(e) => setContentType(e.target.value)}
                      className="mr-2"
                    />
                    🎥 Video Link
                  </label>
                </div>
              </div>
              
              <form onSubmit={handleSubmitContent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter a compelling title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Environment">Environment</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Water Conservation">Water Conservation</option>
                    <option value="Climate Action">Climate Action</option>
                    <option value="Community Initiative">Community Initiative</option>
                  </select>
                </div>
                
                {contentType === 'video' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Video URL</label>
                    <input
                      type="url"
                      className="w-full p-3 border rounded-lg"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {contentType === 'article' ? 'Article Content' : 'Video Description'}
                  </label>
                  <textarea
                    required
                    className="w-full p-3 border rounded-lg h-40"
                    placeholder={contentType === 'article' 
                      ? "Share your story, experience, or knowledge..." 
                      : "Describe what viewers will learn from this video..."
                    }
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700"
                >
                  Publish Content
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                <p className="text-gray-600">By {selectedArticle.author} • {selectedArticle.readTime}</p>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="text-4xl mb-4">{selectedArticle.image}</div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedContent.title}</h3>
              <button 
                onClick={() => setSelectedContent(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{selectedContent.content}</p>
              {selectedContent.impact && (
                <div className="bg-green-50 p-3 rounded mt-3">
                  <span className="text-green-800 font-medium">🎯 Impact: {selectedContent.impact}</span>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Comments ({selectedContent.comments?.length || 0})</h4>
              
              {user && (
                <div className="mb-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border rounded-lg h-20"
                  />
                  <button
                    onClick={() => handleAddComment(selectedContent.id)}
                    className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Post Comment
                  </button>
                </div>
              )}
              
              <div className="space-y-3">
                {selectedContent.comments?.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.text}</p>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Content</h3>
            <form onSubmit={handleUpdateContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border rounded-lg"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  required
                  className="w-full p-3 border rounded-lg h-32"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingContent(null)}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}