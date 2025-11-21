#!/bin/bash

echo "Starting CivIQ development environment..."

# Start backend
echo "Starting backend server..."
cd backend && npm run dev &

# Start frontend
echo "Starting frontend server..."
cd frontend && npm run dev &

# Start AI service
echo "Starting AI service..."
cd ai_service && python app.py &

echo "All services started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "AI Service: http://localhost:8000"