const mongoose = require('mongoose');
const Challenge = require('../app/models/Challenge');
require('dotenv').config();

const challenges = [
  {
    title: 'First Report',
    description: 'Submit your first civic issue report',
    points: 50,
    durationDays: 7,
    category: 'Reporting'
  },
  {
    title: 'Community Helper',
    description: 'Help resolve 5 community issues',
    points: 200,
    durationDays: 30,
    category: 'Community'
  },
  {
    title: 'Environmental Guardian',
    description: 'Report 3 environmental issues',
    points: 150,
    durationDays: 14,
    category: 'Environment'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Challenge.deleteMany({});
    await Challenge.insertMany(challenges);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();