const mongoose = require('mongoose');
const { User, Report, Bill, Challenge, Reward } = require('./mongodb-schema');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create indexes for better performance
    await createIndexes();
    
    // Seed initial data
    await seedInitialData();
    
    console.log('✅ Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function createIndexes() {
  // User indexes
  await User.createIndexes();
  
  // Report indexes
  await Report.collection.createIndex({ reportedBy: 1, createdAt: -1 });
  await Report.collection.createIndex({ status: 1, createdAt: -1 });
  await Report.collection.createIndex({ 'location.coordinates': '2dsphere' });
  
  // Bill indexes
  await Bill.collection.createIndex({ userId: 1, status: 1 });
  await Bill.collection.createIndex({ dueDate: 1, status: 1 });
  
  console.log('✅ Database indexes created');
}

async function seedInitialData() {
  // Clear existing data
  await User.deleteMany({});
  await Challenge.deleteMany({});
  
  // Create sample challenges
  const challenges = [
    {
      challengeId: 'CH001',
      title: 'First Report Champion',
      description: 'Submit your first civic issue report',
      points: 100,
      category: 'Reporting'
    },
    {
      challengeId: 'CH002', 
      title: 'Community Helper',
      description: 'Help resolve 5 community issues',
      points: 250,
      category: 'Community'
    },
    {
      challengeId: 'CH003',
      title: 'Environmental Guardian',
      description: 'Report 3 environmental issues',
      points: 200,
      category: 'Environment'
    }
  ];
  
  await Challenge.insertMany(challenges);
  console.log('✅ Sample challenges created');
}

// Run initialization
initializeDatabase();