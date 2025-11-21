# API Specification

## Authentication Endpoints

### POST /api/auth/register
Register new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### POST /api/auth/login
User login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Reports Endpoints

### POST /api/reports
Create new report
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "infrastructure",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "images": ["base64_image_data"]
}
```

### GET /api/reports
Get reports with filters
Query params: `category`, `status`, `lat`, `lng`, `radius`

### GET /api/reports/:id
Get specific report details

## Challenges Endpoints

### GET /api/challenges
Get active challenges

### POST /api/challenges/:id/participate
Join a challenge

## AI Analysis Endpoints

### POST /api/ai/analyze
Analyze image for civic issues
```json
{
  "image": "base64_image_data"
}
```

Response:
```json
{
  "detections": [
    {
      "category": "pothole",
      "confidence": 0.85,
      "bbox": [x, y, width, height]
    }
  ]
}
```