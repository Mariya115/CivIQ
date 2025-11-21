# System Architecture

## Overview
CivIQ is built with a microservices architecture consisting of:
- React frontend
- Node.js backend API
- Python AI service
- MongoDB database

## Components

### Frontend (React + Vite)
- User interface and interactions
- Real-time updates
- Map visualization

### Backend (Node.js + Express)
- REST API endpoints
- Authentication and authorization
- Business logic

### AI Service (Python + Flask)
- Image analysis using YOLO
- Text classification
- ML model inference

### Database (MongoDB)
- User data
- Reports and submissions
- Challenges and campaigns

## Data Flow
1. User submits report through frontend
2. Backend validates and stores data
3. AI service analyzes images/text
4. Results stored and notifications sent