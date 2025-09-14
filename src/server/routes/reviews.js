const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const REVIEWS_FILE = path.join(__dirname, '../database/reviews.json');
const USERS_FILE = path.join(__dirname, '../database/users.json');
const SKILLS_FILE = path.join(__dirname, '../database/skills.json');

// Helper functions
const readReviews = () => {
  try {
    const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeReviews = (reviews) => {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
};

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const readSkills = () => {
  try {
    const data = fs.readFileSync(SKILLS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to update guru's average rating
const updateGuruRating = (guruId) => {
  const reviews = readReviews();
  const users = readUsers();
  
  const guruReviews = reviews.filter(r => r.guru_id === guruId);
  const totalRating = guruReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = guruReviews.length > 0 ? (totalRating / guruReviews.length) : 0;
  
  const userIndex = users.findIndex(u => u.id === guruId);
  if (userIndex !== -1) {
    users[userIndex].average_rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
    users[userIndex].total_reviews = guruReviews.length;
    writeUsers(users);
  }
};

// Get reviews for a guru
router.get('/guru/:guruId', (req, res) => {
  try {
    const { guruId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = readReviews();
    const users = readUsers();
    const skills = readSkills();

    // Find reviews for this guru
    let guruReviews = reviews.filter(r => r.guru_id === guruId);

    // Add shishya and skill information
    guruReviews = guruReviews.map(review => {
      const shishya = users.find(u => u.id === review.shishya_id);
      const skill = skills.find(s => s.id === review.skill_id);
      
      return {
        ...review,
        shishya: shishya ? {
          id: shishya.id,
          name: shishya.name,
          profile_image: shishya.profile_image
        } : null,
        skill: skill ? {
          id: skill.id,
          title: skill.title
        } : null
      };
    });

    // Sort by creation date (newest first)
    guruReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReviews = guruReviews.slice(startIndex, endIndex);

    // Calculate rating statistics
    const ratingStats = {
      total_reviews: guruReviews.length,
      average_rating: guruReviews.length > 0 ? 
        Math.round((guruReviews.reduce((sum, r) => sum + r.rating, 0) / guruReviews.length) * 10) / 10 : 0,
      rating_distribution: {
        5: guruReviews.filter(r => r.rating === 5).length,
        4: guruReviews.filter(r => r.rating === 4).length,
        3: guruReviews.filter(r => r.rating === 3).length,
        2: guruReviews.filter(r => r.rating === 2).length,
        1: guruReviews.filter(r => r.rating === 1).length
      }
    };

    res.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        rating_stats: ratingStats,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(guruReviews.length / limit),
          total_count: guruReviews.length,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get guru reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get reviews by a shishya
router.get('/shishya/:shishyaId', (req, res) => {
  try {
    const { shishyaId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = readReviews();
    const users = readUsers();
    const skills = readSkills();

    // Find reviews by this shishya
    let shishyaReviews = reviews.filter(r => r.shishya_id === shishyaId);

    // Add guru and skill information
    shishyaReviews = shishyaReviews.map(review => {
      const guru = users.find(u => u.id === review.guru_id);
      const skill = skills.find(s => s.id === review.skill_id);
      
      return {
        ...review,
        guru: guru ? {
          id: guru.id,
          name: guru.name,
          profile_image: guru.profile_image
        } : null,
        skill: skill ? {
          id: skill.id,
          title: skill.title
        } : null
      };
    });

    // Sort by creation date (newest first)
    shishyaReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReviews = shishyaReviews.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(shishyaReviews.length / limit),
          total_count: shishyaReviews.length,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get shishya reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Create a new review
router.post('/', (req, res) => {
  try {
    const { guru_id, shishya_id, skill_id, rating, comment, session_date } = req.body;

    // Validation
    if (!guru_id || !shishya_id || !skill_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'guru_id, shishya_id, skill_id, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const users = readUsers();
    const skills = readSkills();
    const reviews = readReviews();

    // Verify users and skill exist
    const guru = users.find(u => u.id === guru_id && u.role === 'guru');
    const shishya = users.find(u => u.id === shishya_id && u.role === 'shishya');
    const skill = skills.find(s => s.id === skill_id);

    if (!guru || !shishya || !skill) {
      return res.status(404).json({
        success: false,
        message: 'Guru, shishya, or skill not found'
      });
    }

    // Check if review already exists for this combination
    const existingReview = reviews.find(r => 
      r.guru_id === guru_id && 
      r.shishya_id === shishya_id && 
      r.skill_id === skill_id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this guru and skill'
      });
    }

    const newReview = {
      id: Date.now(), // Simple numeric ID for demo
      guru_id,
      shishya_id,
      skill_id,
      rating: parseInt(rating),
      comment: comment || '',
      created_at: new Date().toISOString(),
      session_date: session_date || new Date().toISOString(),
      verified_purchase: true
    };

    reviews.push(newReview);
    writeReviews(reviews);

    // Update guru's average rating
    updateGuruRating(guru_id);

    // Add related information to response
    const reviewWithInfo = {
      ...newReview,
      guru: {
        id: guru.id,
        name: guru.name,
        profile_image: guru.profile_image
      },
      shishya: {
        id: shishya.id,
        name: shishya.name,
        profile_image: shishya.profile_image
      },
      skill: {
        id: skill.id,
        title: skill.title
      }
    };

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review: reviewWithInfo
      }
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
});

// Update a review
router.put('/:reviewId', (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    const reviews = readReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update allowed fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      reviews[reviewIndex].rating = parseInt(rating);
    }

    if (comment !== undefined) {
      reviews[reviewIndex].comment = comment;
    }

    reviews[reviewIndex].updated_at = new Date().toISOString();

    writeReviews(reviews);

    // Update guru's average rating if rating was changed
    if (rating !== undefined) {
      updateGuruRating(reviews[reviewIndex].guru_id);
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review: reviews[reviewIndex]
      }
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
});

// Delete a review
router.delete('/:reviewId', (req, res) => {
  try {
    const { reviewId } = req.params;
    const reviews = readReviews();
    
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const guruId = reviews[reviewIndex].guru_id;
    reviews.splice(reviewIndex, 1);
    writeReviews(reviews);

    // Update guru's average rating
    updateGuruRating(guruId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

// Get review by ID
router.get('/:reviewId', (req, res) => {
  try {
    const { reviewId } = req.params;
    const reviews = readReviews();
    const users = readUsers();
    const skills = readSkills();
    
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Add related information
    const guru = users.find(u => u.id === review.guru_id);
    const shishya = users.find(u => u.id === review.shishya_id);
    const skill = skills.find(s => s.id === review.skill_id);

    const reviewWithInfo = {
      ...review,
      guru: guru ? {
        id: guru.id,
        name: guru.name,
        profile_image: guru.profile_image
      } : null,
      shishya: shishya ? {
        id: shishya.id,
        name: shishya.name,
        profile_image: shishya.profile_image
      } : null,
      skill: skill ? {
        id: skill.id,
        title: skill.title
      } : null
    };

    res.json({
      success: true,
      data: {
        review: reviewWithInfo
      }
    });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
});

module.exports = router;