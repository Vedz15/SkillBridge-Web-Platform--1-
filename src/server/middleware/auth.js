const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

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

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Verify user still exists
    const users = readUsers();
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user info to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  });
};

// Middleware to check if user is a guru
const requireGuru = (req, res, next) => {
  if (req.user.role !== 'guru') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Guru role required.'
    });
  }
  next();
};

// Middleware to check if user is a shishya
const requireShishya = (req, res, next) => {
  if (req.user.role !== 'shishya') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Shishya role required.'
    });
  }
  next();
};

// Middleware to check if user owns the resource
const requireOwnership = (req, res, next) => {
  const resourceUserId = req.params.userId || req.params.id;
  
  if (req.user.id !== resourceUserId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireGuru,
  requireShishya,
  requireOwnership
};