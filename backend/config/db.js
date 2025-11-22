const mongoose = require('mongoose');

const connectDB = async () => {
  // ✅ FIX: Removed deprecated options (bufferMaxEntries, useNewUrlParser, etc.)
  // Modern Mongoose (v6+) handles these defaults automatically.
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  // Try MongoDB Atlas first
  if (process.env.MONGO_URI) {
    try {
      console.log('🌍 Attempting to connect to MongoDB Atlas...');
      // We pass 'options' here, but it only contains the timeout settings now
      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error('❌ MongoDB Atlas connection failed:', error.message);
      
      if (error.message.includes('Authentication failed')) {
        console.log('🔑 Authentication Error: Please check your MongoDB Atlas credentials');
      }
    }
  }

  // Try local MongoDB as fallback
  if (process.env.MONGO_URI_LOCAL) {
    try {
      console.log('💻 Attempting to connect to local MongoDB...');
      const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL, options);
      console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error('❌ Local MongoDB connection failed:', error.message);
    }
  }

  console.log('⚠️ No database connection available - running in offline mode');
  console.log('💡 To fix: Check MongoDB Atlas credentials or start local MongoDB');
  return false;
};

module.exports = connectDB;