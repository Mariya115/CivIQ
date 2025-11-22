const mongoose = require('mongoose');
const User = require('../app/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sampleUsers = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', points: 2500 },
  { name: 'Priya Sharma', email: 'priya@example.com', points: 2300 },
  { name: 'Amit Singh', email: 'amit@example.com', points: 2100 },
  { name: 'Sneha Patel', email: 'sneha@example.com', points: 1950 },
  { name: 'Vikram Gupta', email: 'vikram@example.com', points: 1800 },
  { name: 'Anita Reddy', email: 'anita@example.com', points: 1650 },
  { name: 'Rohit Jain', email: 'rohit@example.com', points: 1500 },
  { name: 'Kavya Nair', email: 'kavya@example.com', points: 1350 },
  { name: 'Suresh Yadav', email: 'suresh@example.com', points: 1200 },
  { name: 'Meera Agarwal', email: 'meera@example.com', points: 1100 },
  { name: 'Arjun Mehta', email: 'arjun@example.com', points: 1000 },
  { name: 'Deepika Roy', email: 'deepika@example.com', points: 950 },
  { name: 'Karan Malhotra', email: 'karan@example.com', points: 900 },
  { name: 'Ritu Bansal', email: 'ritu@example.com', points: 850 },
  { name: 'Sanjay Verma', email: 'sanjay@example.com', points: 800 },
  { name: 'Pooja Khanna', email: 'pooja@example.com', points: 750 },
  { name: 'Rahul Saxena', email: 'rahul@example.com', points: 700 },
  { name: 'Nisha Kapoor', email: 'nisha@example.com', points: 650 },
  { name: 'Manish Tiwari', email: 'manish@example.com', points: 600 },
  { name: 'Sunita Mishra', email: 'sunita@example.com', points: 550 }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = sampleUsers.map((user, index) => ({
      email: user.email,
      password: hashedPassword,
      profile: {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        address: `${index + 1} Sample Street`,
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      points: user.points,
      bills: [
        {
          type: 'electricity',
          amount: Math.floor(Math.random() * 3000) + 1000,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          discount: user.points >= 1800 ? 20 : user.points >= 1500 ? 15 : user.points >= 1200 ? 10 : user.points >= 900 ? 5 : 0,
          billId: 'ELE' + Date.now() + index,
          qrCode: `qr_${Date.now()}_${index}`
        },
        {
          type: 'water',
          amount: Math.floor(Math.random() * 1000) + 500,
          dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          discount: user.points >= 1800 ? 15 : user.points >= 1500 ? 10 : user.points >= 1200 ? 8 : user.points >= 900 ? 5 : 0,
          billId: 'WAT' + Date.now() + index,
          qrCode: `qr_water_${Date.now()}_${index}`
        }
      ],
      rewards: user.points >= 1800 ? [
        { title: '20% Electricity Discount', discount: 20, validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
        { title: '15% Water Bill Discount', discount: 15, validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
      ] : user.points >= 1200 ? [
        { title: '10% Utility Discount', discount: 10, validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) }
      ] : []
    }));

    await User.insertMany(users);
    console.log('✅ Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedUsers();