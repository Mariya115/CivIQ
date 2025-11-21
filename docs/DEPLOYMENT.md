# Deployment Guide

## Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account
- Vercel account (for frontend)
- Render account (for backend)

## Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `VITE_API_URL`
3. Deploy automatically on push to main

## Backend Deployment (Render)
1. Create new web service on Render
2. Connect GitHub repository
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENAI_KEY`
4. Deploy from main branch

## AI Service Deployment
1. Deploy to Render or Railway
2. Set Python environment
3. Install requirements
4. Configure model paths

## Database Setup (MongoDB Atlas)
1. Create cluster
2. Configure network access
3. Create database user
4. Get connection string