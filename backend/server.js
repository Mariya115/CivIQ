const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple routes for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend connected!' });
});

app.post('/api/reports', (req, res) => {
  console.log('Report received:', req.body);
  res.json({ 
    success: true, 
    message: 'Report created successfully',
    data: { id: Date.now(), ...req.body }
  });
});

app.get('/api/reports', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Test Report', category: 'Road Issues', status: 'reported' }
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});