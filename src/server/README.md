# SkillBridge Backend API

A Node.js + Express backend for the SkillBridge platform that connects Gurus (mentors) and Shishyas (learners).

## Features

- **Authentication**: User registration, login, and JWT token verification
- **User Profiles**: Profile management for both Gurus and Shishyas
- **Skills Management**: CRUD operations for skills offered by Gurus
- **Messaging System**: Real-time messaging between users
- **Reviews & Ratings**: Review system with automatic rating calculations
- **Search & Filtering**: Advanced search for skills and gurus

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Or start in production mode:
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Profiles (`/api/profiles`)
- `GET /api/profiles` - Get all profiles (with filtering)
- `GET /api/profiles/:id` - Get profile by ID
- `PUT /api/profiles/:id` - Update profile
- `GET /api/profiles/search/gurus` - Search gurus by location and criteria

### Skills (`/api/skills`)
- `GET /api/skills` - Get all skills (with filtering)
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create new skill (Guru only)
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill (soft delete)
- `GET /api/skills/search/all` - Search skills by text and filters

### Messages (`/api/messages`)
- `GET /api/messages/conversations/:userId` - Get user's conversations
- `GET /api/messages/:userId1/:userId2` - Get messages between two users
- `POST /api/messages` - Send a new message
- `PUT /api/messages/read/:messageId` - Mark message as read
- `PUT /api/messages/read/conversation/:userId1/:userId2` - Mark conversation as read
- `DELETE /api/messages/:messageId` - Delete message

### Reviews (`/api/reviews`)
- `GET /api/reviews/guru/:guruId` - Get reviews for a guru
- `GET /api/reviews/shishya/:shishyaId` - Get reviews by a shishya
- `GET /api/reviews/:reviewId` - Get review by ID
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

## Database Structure

The backend uses JSON files as a simple database for demo purposes:

### Users (`database/users.json`)
- Basic user information for both Gurus and Shishyas
- Includes profile details, location, and role-specific fields

### Skills (`database/skills.json`)
- Skills offered by Gurus
- Includes pricing, availability, and skill details

### Messages (`database/messages.json`)
- Messages between users
- Supports conversation threading and read status

### Reviews (`database/reviews.json`)
- Reviews and ratings from Shishyas about Gurus
- Automatically updates Guru average ratings

## Sample Data

The backend comes pre-loaded with sample data:

### Gurus:
1. **Arjun Sharma** - Yoga instructor (₹300/hr, 4.5⭐)
2. **Priya Patel** - Indian cooking expert (₹500/hr, 4.8⭐)
3. **Rahul Mehta** - Guitar teacher (₹400/hr, 4.2⭐)

### Shishyas:
1. **Neha Desai** - Interested in Yoga
2. **Amit Verma** - Interested in Cooking

### Features:
- Sample conversations between users
- Multiple skills per guru
- Reviews with ratings and comments
- Realistic availability schedules

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

For demo purposes, you can use these sample credentials:
- **Guru**: arjun.sharma@email.com / password123
- **Shishya**: neha.desai@email.com / password123

## Development Notes

- This is a demo backend using JSON files for data storage
- In production, replace with a proper database (MongoDB, PostgreSQL, etc.)
- Add proper validation, error handling, and security measures
- Implement real-time messaging with WebSockets
- Add file upload functionality for profile images
- Implement proper geolocation services for location-based search

## Health Check

Visit `http://localhost:3001/api/health` to verify the server is running.