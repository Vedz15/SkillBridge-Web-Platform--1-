const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const JWT_SECRET = 'skillbridge_jwt_secret_key_2024';
const USERS_FILE = path.join(__dirname, '../database/users.json');

// Helper function to read users from file
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write users to file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, location, bio } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !role || !location) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (!['guru', 'shishya'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either guru or shishya'
      });
    }

    const users = readUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now(), // Simple numeric ID for demo
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      bio: bio || '',
      location,
      latitude: 0, // In real app, this would be geocoded
      longitude: 0,
      is_verified: false,
      profile_image: `https://images.unsplash.com/photo-${Date.now() % 10 === 0 ? '1507003211169-0a1dd7228f2d' : '1494790108755-2616b74bb516'}?w=400`,
      created_at: new Date().toISOString(),
      languages: ['English', 'Hindi']
    };

    // Add role-specific fields
    if (role === 'guru') {
      newUser.years_experience = 0;
      newUser.hourly_rate = 0;
      newUser.total_students = 0;
      newUser.average_rating = 0;
    } else {
      newUser.interests = [];
      newUser.learning_goals = '';
    }

    users.push(newUser);
    writeUsers(users);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const users = readUsers();
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
});

module.exports = router;