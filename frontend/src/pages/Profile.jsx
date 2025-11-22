import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import QRCode from '../components/QRCode'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [bills, setBills] = useState([])
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (!token || !storedUser) {
        navigate('/login')
        return
      }
      
      // Use stored user data as fallback
      const userData = JSON.parse(storedUser)
      
      try {
        const [profileData, billsData] = await Promise.all([
          apiService.getProfile(),
          apiService.getBills()
        ])
        
        setUser(profileData)
        setBills(billsData.bills || [])
        setRewards(billsData.rewards || [])
      } catch (apiError) {
        // Use mock data when API fails
        setUser({
          userId: userData.id || 'USER001',
          email: userData.email === 'aarav@example.com' ? 'mariya@example.com' : userData.email,
          role: userData.role || 'Citizen',
          points: userData.points || 3250,
          createdAt: new Date().toISOString(),
          profile: {
            firstName: userData.firstName || 'Mariya',
            lastName: userData.lastName || 'User',
            address: userData.address || '123 Main Street',
            city: userData.city || 'Mumbai',
            state: userData.state || 'Maharashtra',
            pincode: userData.pincode || '400001'
          }
        })
        
        // Add mock bills with top user discount (20% off)
        setBills([
          {
            _id: 'BILL001',
            billId: 'ELEC2024001',
            type: 'electricity',
            amount: 2500,
            discount: 20,
            status: 'pending',
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: 'BILL002',
            billId: 'WATER2024001', 
            type: 'water',
            amount: 800,
            discount: 20,
            status: 'pending',
            dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: 'BILL003',
            billId: 'GAS2024001',
            type: 'gas', 
            amount: 1200,
            discount: 20,
            status: 'pending',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
        
        // Add top user reward
        setRewards([{
          title: 'Top 1 Civic Champion Reward',
          discount: 20,
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          used: false
        }])
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handlePayBill = async (billId) => {
    try {
      // Show QR code first, then process payment
      await showQRCode(billId)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  const processPayment = async (billId) => {
    try {
      await apiService.payBill(billId)
      setShowQR(null)
      loadProfile() // Refresh data
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  const showQRCode = async (billId) => {
    try {
      const qrData = await apiService.getBillQR(billId)
      // Generate random QR pattern
      const randomQR = generateRandomQR()
      setShowQR({
        ...qrData,
        qrPattern: randomQR,
        billId
      })
    } catch (error) {
      console.error('Failed to generate QR:', error)
    }
  }

  const generateRandomQR = () => {
    const size = 21 // Standard QR code size
    const pattern = []
    for (let i = 0; i < size; i++) {
      const row = []
      for (let j = 0; j < size; j++) {
        row.push(Math.random() > 0.5 ? 1 : 0)
      }
      pattern.push(row)
    }
    return pattern
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* User Info */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">👤 {user.profile?.firstName} {user.profile?.lastName}</h2>
              <p className="text-sm opacity-90">ID: {user.userId}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{user.points}</div>
              <div className="text-sm opacity-90">Civic Points</div>
            </div>
          </div>
        </div>
        
        {/* Bills Summary */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">💳 Bills</h2>
              <p className="text-sm opacity-90">{bills.filter(b => b.status === 'pending').length} pending</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{bills.length}</div>
              <div className="text-sm opacity-90">Total Bills</div>
            </div>
          </div>
        </div>
        
        {/* Rewards */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">🎁 Rewards</h2>
              <p className="text-sm opacity-90">{rewards.filter(r => !r.used).length} available</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{rewards.length}</div>
              <div className="text-sm opacity-90">Total Rewards</div>
            </div>
          </div>
        </div>
      </div>


      {/* Bills Section */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💳 My Bills & Payments</h2>
        
        {bills.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {bills.map((bill) => (
              <div key={bill._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold capitalize">
                    {bill.type === 'electricity' ? '⚡' : 
                     bill.type === 'water' ? '💧' : 
                     bill.type === 'gas' ? '🔥' :
                     bill.type === 'internet' ? '📶' :
                     bill.type === 'mobile' ? '📱' :
                     bill.type === 'dtv' ? '📺' :
                     bill.type === 'insurance' ? '🛡️' :
                     bill.type === 'maintenance' ? '🔧' : '📄'} {bill.type}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bill ID:</span>
                    <span className="font-mono">{bill.billId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>₹{bill.amount}</span>
                  </div>
                  {bill.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({bill.discount}%):</span>
                      <span>-₹{Math.floor(bill.amount * bill.discount / 100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Final Amount:</span>
                    <span>₹{Math.floor(bill.amount - (bill.amount * bill.discount / 100))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {bill.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => showQRCode(bill._id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                    >
                      📱 Show QR
                    </button>
                    <button
                      onClick={() => handlePayBill(bill._id)}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
                    >
                      💳 Pay Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No bills available</p>
        )}
      </div>
      
      {/* Rewards Section */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🎁 My Rewards</h2>
        
        {rewards.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {rewards.map((reward, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                reward.used ? 'bg-gray-50 opacity-60' : 'bg-gradient-to-r from-yellow-50 to-orange-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{reward.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reward.used ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
                  }`}>
                    {reward.used ? 'Used' : 'Available'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {reward.discount}% OFF
                </div>
                <div className="text-sm text-gray-600">
                  Valid until: {new Date(reward.validUntil).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No rewards yet</p>
            <p className="text-sm text-gray-400">Earn more civic points to unlock rewards!</p>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.profile?.firstName} {user.profile?.lastName}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.role}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <div className="p-3 bg-gray-50 rounded-lg font-mono">
              {user.userId}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.profile?.address}, {user.profile?.city}, {user.profile?.state} - {user.profile?.pincode}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>



      {/* Quick Actions */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => navigate('/report')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium">New Report</div>
          </button>
          <button 
            onClick={() => navigate('/challenges')}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-center"
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-medium">Challenges</div>
          </button>
          <button 
            onClick={() => navigate('/leaderboard')}
            className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 text-center"
          >
            <div className="text-2xl mb-2">🏅</div>
            <div className="text-sm font-medium">Leaderboard</div>
          </button>
          <button 
            onClick={() => navigate('/map')}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-center"
          >
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm font-medium">Map View</div>
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="glass-card p-6">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center">📱 Scan to Pay</h3>
            <div className="text-center">
              {/* QR Code */}
              <div className="mb-4">
                <QRCode 
                  size={200} 
                  data={`upi://pay?pa=civiq@paytm&pn=CivIQ&am=${showQR.data?.amount}&cu=INR&tn=Bill Payment ${showQR.data?.billId}`}
                />
              </div>
              
              <div className="text-left space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                <div><strong>Bill ID:</strong> {showQR.data?.billId}</div>
                <div><strong>Amount:</strong> ₹{showQR.data?.amount}</div>
                <div><strong>Type:</strong> {showQR.data?.type}</div>
                <div><strong>Due:</strong> {showQR.data?.dueDate ? new Date(showQR.data.dueDate).toLocaleDateString() : 'N/A'}</div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📱 Scan this QR code with any UPI app to pay your bill
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => processPayment(showQR.billId)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Mark as Paid
              </button>
              <button 
                onClick={() => setShowQR(null)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
