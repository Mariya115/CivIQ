// In-memory mock database for development when MongoDB is unavailable
class MockDB {
  constructor() {
    this.users = this.generateMockUsers();
    this.reports = [];
    this.challenges = [
      {
        _id: '1',
        title: 'First Report',
        description: 'Submit your first civic issue report',
        points: 50,
        status: 'active',
        category: 'Reporting',
        createdAt: new Date()
      }
    ];
    this.userChallenges = [];
  }

  generateMockUsers() {
    const names = [
      'Aarav Sharma', 'Diya Patel', 'Arjun Singh', 'Ananya Gupta', 'Vihaan Kumar',
      'Isha Reddy', 'Reyansh Jain', 'Saanvi Nair', 'Aditya Yadav', 'Kavya Agarwal',
      'Vivaan Mehta', 'Kiara Roy', 'Aryan Malhotra', 'Navya Bansal', 'Sai Verma',
      'Myra Khanna', 'Dhruv Saxena', 'Anika Kapoor', 'Karthik Tiwari', 'Riya Mishra'
    ];
    
    const points = [3250, 2890, 2675, 2420, 2180, 1950, 1720, 1580, 1340, 1200, 1080, 950, 820, 750, 680, 620, 580, 540, 500, 460];
    
    return names.map((name, index) => {
      const [firstName, lastName] = name.split(' ');
      return {
        _id: `user_${index + 1}`,
        userId: `CIV${Date.now()}${index}`,
        email: `${firstName.toLowerCase()}@example.com`,
        phone: `+91${9000000000 + index}`,
        password: '$2a$10$hashedpassword', // Mock hashed password
        profile: {
          firstName,
          lastName: lastName || '',
          address: `${index + 1} Sample Street`,
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        points: points[index],
        bills: [
          {
            _id: `bill_ele_${index}`,
            type: 'electricity',
            amount: Math.floor(Math.random() * 3000) + 1000,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            discount: points[index] >= 2000 ? 20 : points[index] >= 1600 ? 15 : points[index] >= 1200 ? 10 : points[index] >= 800 ? 5 : 0,
            status: 'pending',
            billId: `ELE${Date.now()}${index}`,
            qrCode: `qr_${Date.now()}_${index}`
          },
          {
            _id: `bill_wat_${index}`,
            type: 'water',
            amount: Math.floor(Math.random() * 1000) + 500,
            dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            discount: points[index] >= 2000 ? 15 : points[index] >= 1600 ? 10 : points[index] >= 1200 ? 8 : points[index] >= 800 ? 5 : 0,
            status: 'pending',
            billId: `WAT${Date.now()}${index}`,
            qrCode: `qr_water_${Date.now()}_${index}`
          }
        ],
        rewards: points[index] >= 2000 ? [
          { title: '🏆 Top 5 Champion - 20% Bill Discount', discount: 20, validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), used: false },
          { title: '⚡ Electricity Bill Reward', discount: 15, validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), used: false },
          { title: '💧 Water Bill Reward', discount: 12, validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), used: false }
        ] : points[index] >= 1600 ? [
          { title: '⭐ High Achiever - 15% Discount', discount: 15, validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), used: false },
          { title: '🏠 Utility Bill Discount', discount: 10, validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), used: false }
        ] : points[index] >= 1200 ? [
          { title: '🌟 Active Citizen - 10% Discount', discount: 10, validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), used: false }
        ] : points[index] >= 800 ? [
          { title: '🎯 Rising Star - 5% Discount', discount: 5, validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), used: false }
        ] : [],
        role: 'Citizen',
        isActive: true,
        lastLogin: null,
        loginCount: 0,
        createdAt: new Date()
      };
    });
  }

  // Mock user operations
  async findUser(query) {
    return this.users.find(u => u.email === query.email || u._id === query._id);
  }

  async createUser(userData) {
    const user = { 
      _id: Date.now().toString(), 
      userId: `CIV${Date.now()}${Math.floor(Math.random() * 1000)}`,
      email: userData.email,
      phone: userData.phone,
      password: userData.password, // Store hashed password in production
      profile: {
        firstName: userData.profile?.firstName || userData.firstName || '',
        lastName: userData.profile?.lastName || userData.lastName || '',
        address: userData.profile?.address || userData.address || '',
        city: userData.profile?.city || userData.city || '',
        state: userData.profile?.state || userData.state || '',
        pincode: userData.profile?.pincode || userData.pincode || ''
      },
      role: userData.role || 'Citizen',
      points: 50,
      bills: [
        {
          _id: `bill_ele_${Date.now()}`,
          type: 'electricity',
          amount: Math.floor(Math.random() * 3000) + 1000,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          discount: 0,
          status: 'pending',
          billId: `ELE${Date.now()}`,
          qrCode: `qr_${Date.now()}`
        },
        {
          _id: `bill_wat_${Date.now()}`,
          type: 'water',
          amount: Math.floor(Math.random() * 1000) + 500,
          dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          discount: 0,
          status: 'pending',
          billId: `WAT${Date.now()}`,
          qrCode: `qr_water_${Date.now()}`
        }
      ],
      rewards: [],
      isActive: true,
      lastLogin: null,
      loginCount: 0,
      createdAt: new Date() 
    };
    this.users.push(user);
    console.log(`New user created: ${user.email} with ID: ${user.userId}`);
    return user;
  }

  // Mock leaderboard
  async getLeaderboard() {
    return this.users
      .sort((a, b) => b.points - a.points)
      .slice(0, 20)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        points: user.points,
        badge: index === 0 ? '🥇 Civic Champion' : index === 1 ? '🥈 Community Leader' : index === 2 ? '🥉 Change Maker' : index === 3 ? '🏆 Top Contributor' : index === 4 ? '⭐ Elite Citizen' : index < 10 ? '🌟 High Achiever' : index < 15 ? '🎯 Active Member' : '🌱 Rising Star'
      }));
  }

  // Mock bills operations
  async getUserBills(userId) {
    const user = this.users.find(u => u._id === userId);
    return user ? { bills: user.bills, rewards: user.rewards } : { bills: [], rewards: [] };
  }

  async payBill(userId, billId) {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      const bill = user.bills.find(b => b._id === billId);
      if (bill) {
        bill.status = 'paid';
        return bill;
      }
    }
    return null;
  }

  async getBillQR(userId, billId) {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      const bill = user.bills.find(b => b._id === billId);
      if (bill) {
        return {
          qrCode: bill.qrCode,
          data: {
            billId: bill.billId,
            amount: bill.amount - (bill.amount * bill.discount / 100),
            type: bill.type,
            userId: user.userId,
            dueDate: bill.dueDate
          }
        };
      }
    }
    return null;
  }

  // Mock report operations
  async findReports() {
    return this.reports;
  }

  async createReport(reportData) {
    const report = { _id: Date.now().toString(), ...reportData, createdAt: new Date() };
    this.reports.push(report);
    return report;
  }

  // Mock challenge operations
  async findChallenges() {
    return this.challenges;
  }
}

module.exports = new MockDB();