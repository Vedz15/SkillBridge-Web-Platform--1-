const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
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

// Get all profiles (with optional filtering)
router.get('/', (req, res) => {
  try {
    const { role, location, skill, page = 1, limit = 10 } = req.query;
    let users = readUsers();

    // Remove passwords from all users
    users = users.map(({ password, ...user }) => user);

    // Apply filters
    if (role) {
      users = users.filter(user => user.role === role);
    }

    if (location) {
      users = users.filter(user => 
        user.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // For skill-based search, we would typically join with skills table
    // For now, just return filtered users
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        profiles: paginatedUsers,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(users.length / limit),
          total_count: users.length,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles',
      error: error.message
    });
  }
});

// Get profile by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const users = readUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Remove password from response
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      data: {
        profile: userProfile
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update profile
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Don't allow updating sensitive fields
    const { password, id: userId, email, role, created_at, ...allowedUpdates } = updateData;

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...allowedUpdates,
      updated_at: new Date().toISOString()
    };

    writeUsers(users);

    // Remove password from response
    const { password: _, ...updatedProfile } = users[userIndex];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Search gurus by location and skills
router.get('/search/gurus', (req, res) => {
  try {
    const { location, skill, minRating, maxPrice, page = 1, limit = 10 } = req.query;
    let users = readUsers();

    // Filter only gurus
    users = users.filter(user => user.role === 'guru');

    // Apply filters
    if (location) {
      users = users.filter(user => 
        user.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minRating) {
      users = users.filter(user => 
        user.average_rating >= parseFloat(minRating)
      );
    }

    if (maxPrice) {
      users = users.filter(user => 
        user.hourly_rate <= parseFloat(maxPrice)
      );
    }

    // Remove passwords
    users = users.map(({ password, ...user }) => user);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        gurus: paginatedUsers,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(users.length / limit),
          total_count: users.length,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Search gurus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search gurus',
      error: error.message
    });
  }
});

module.exports = router;