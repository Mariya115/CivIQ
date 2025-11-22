const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
let dbConnected = false;
let mockDb = null;

try {
  const connectDB = require('./config/db');
  connectDB().then(connected => {
    dbConnected = connected;
    if (connected) {
      console.log('✅ Database connected successfully');
    } else {
      console.log('❌ Database connection failed - using mock database');
      mockDb = require('./config/mockDb');
      app.set('mockDb', mockDb);
    }
  });
} catch (error) {
  console.error('Database connection file not found:', error.message);
  mockDb = require('./config/mockDb');
  app.set('mockDb', mockDb);
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes with error handling
try {
  app.use('/api/auth', require('./app/routes/auth'));
} catch (error) {
  console.error('Auth routes not found:', error.message);
}

try {
  app.use('/api/reports', require('./app/routes/reports'));
} catch (error) {
  console.error('Reports routes not found:', error.message);
}

try {
  app.use('/api/users', require('./app/routes/users'));
} catch (error) {
  console.error('Users routes not found:', error.message);
}

try {
  app.use('/api/challenges', require('./app/routes/challenges'));
} catch (error) {
  console.error('Challenges routes not found:', error.message);
}

try {
  app.use('/api/leaderboard', require('./app/routes/leaderboard'));
} catch (error) {
  console.error('Leaderboard routes not found:', error.message);
}

try {
  app.use('/api/bills', require('./app/routes/bills'));
} catch (error) {
  console.error('Bills routes not found:', error.message);
}

try {
  app.use('/api/otp', require('./app/routes/otp'));
} catch (error) {
  console.error('OTP routes not found:', error.message);
}

try {
  app.use('/api/session', require('./app/routes/session'));
} catch (error) {
  console.error('Session routes not found:', error.message);
}

// Basic API endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'Connected' : 'Disconnected'
  });
});

// Database status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    server: 'Running',
    database: dbConnected ? 'MongoDB Connected' : 'Mock Database Active',
    timestamp: new Date().toISOString()
  });
});

// Mock data endpoint for testing
app.get('/api/mock-data', (req, res) => {
  const mockDatabase = app.get('mockDb');
  if (mockDatabase) {
    res.json({
      users: mockDatabase.users.length,
      reports: mockDatabase.reports.length,
      challenges: mockDatabase.challenges.length,
      topUsers: mockDatabase.users.slice(0, 5).map(u => ({ name: `${u.profile.firstName} ${u.profile.lastName}`, points: u.points }))
    });
  } else {
    res.json({ message: 'Using real database' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = parseInt(process.env.PORT) || 4000;

// Function to find available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

// Start server with available port
findAvailablePort(PORT).then((availablePort) => {
  app.listen(availablePort, () => {
    console.log(`✅ Server running on port ${availablePort}`);
    console.log(`🐈 Health check: http://localhost:${availablePort}/health`);
    console.log(`📡 Test API: http://localhost:${availablePort}/api/test`);
    console.log(`📊 Status API: http://localhost:${availablePort}/api/status`);
    
    if (availablePort !== PORT) {
      console.log(`⚠️ Note: Using port ${availablePort} instead of ${PORT}`);
      console.log(`🔄 Update your frontend VITE_API_URL to: http://localhost:${availablePort}/api`);
    }
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});