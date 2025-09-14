const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '../database/users.json');
const SKILLS_FILE = path.join(__dirname, '../database/skills.json');
const MESSAGES_FILE = path.join(__dirname, '../database/messages.json');
const REVIEWS_FILE = path.join(__dirname, '../database/reviews.json');

// Helper functions
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const readSkills = () => {
  try {
    const data = fs.readFileSync(SKILLS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const readMessages = () => {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const readReviews = () => {
  try {
    const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Smart Matching - Suggests Gurus based on Shishya's goals, skills, and location
router.get('/match', (req, res) => {
  try {
    const { skills, location_lat, location_lng, max_distance = 50, limit = 5 } = req.query;
    
    const users = readUsers();
    const skillsData = readSkills();
    
    // Filter gurus only
    let gurus = users.filter(user => user.role === 'guru');
    
    // If skills are specified, filter by matching skills
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
      gurus = gurus.filter(guru => {
        const guruSkills = guru.skills.map(s => s.toLowerCase());
        return skillsArray.some(skill => 
          guruSkills.some(gs => gs.includes(skill) || skill.includes(gs))
        );
      });
    }
    
    // If location is provided, filter by distance
    if (location_lat && location_lng) {
      const lat = parseFloat(location_lat);
      const lng = parseFloat(location_lng);
      
      gurus = gurus.map(guru => ({
        ...guru,
        distance: calculateDistance(lat, lng, guru.latitude, guru.longitude)
      })).filter(guru => guru.distance <= parseFloat(max_distance));
      
      // Sort by distance
      gurus.sort((a, b) => a.distance - b.distance);
    }
    
    // Sort by rating and take limit
    gurus.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    gurus = gurus.slice(0, parseInt(limit));
    
    // Add skills information
    gurus = gurus.map(guru => {
      const guruSkills = skillsData.filter(skill => skill.guru_id === guru.id);
      return {
        ...guru,
        available_skills: guruSkills.map(skill => ({
          id: skill.id,
          title: skill.title,
          price_per_hour: skill.price_per_hour
        }))
      };
    });
    
    res.json({
      success: true,
      data: {
        recommended_gurus: gurus,
        total_found: gurus.length,
        message: `Found ${gurus.length} recommended gurus based on your criteria`
      }
    });
    
  } catch (error) {
    console.error('Smart matching error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get smart matches',
      error: error.message
    });
  }
});

// Location-Based - Finds Gurus nearby using geolocation
router.get('/location', (req, res) => {
  try {
    const { lat, lng, radius = 25, limit = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const users = readUsers();
    const skillsData = readSkills();
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxRadius = parseFloat(radius);
    
    // Filter gurus and calculate distances
    let nearbyGurus = users
      .filter(user => user.role === 'guru')
      .map(guru => ({
        ...guru,
        distance: calculateDistance(latitude, longitude, guru.latitude, guru.longitude)
      }))
      .filter(guru => guru.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, parseInt(limit));
    
    // Add skills information
    nearbyGurus = nearbyGurus.map(guru => {
      const guruSkills = skillsData.filter(skill => skill.guru_id === guru.id);
      return {
        ...guru,
        available_skills: guruSkills.map(skill => ({
          id: skill.id,
          title: skill.title,
          price_per_hour: skill.price_per_hour
        })),
        distance_km: Math.round(guru.distance * 10) / 10 // Round to 1 decimal
      };
    });
    
    res.json({
      success: true,
      data: {
        nearby_gurus: nearbyGurus,
        search_center: { lat: latitude, lng: longitude },
        search_radius_km: maxRadius,
        total_found: nearbyGurus.length
      }
    });
    
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find nearby gurus',
      error: error.message
    });
  }
});

// Secure & Trusted - Returns profile verification info
router.get('/verify', (req, res) => {
  try {
    const { user_id } = req.query;
    const users = readUsers();
    
    if (user_id) {
      // Get specific user verification
      const user = users.find(u => u.id === user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const verificationDetails = {
        user_id: user.id,
        name: user.name,
        is_verified: user.is_verified,
        verification_level: user.is_verified ? 'Gold' : 'Basic',
        trust_score: user.is_verified ? 95 : 65,
        verification_badges: []
      };
      
      if (user.is_verified) {
        verificationDetails.verification_badges = [
          'Phone Verified',
          'Email Verified',
          'Government ID Verified'
        ];
        
        if (user.role === 'guru' && user.total_students > 10) {
          verificationDetails.verification_badges.push('Experienced Teacher');
        }
        
        if (user.average_rating > 4.5) {
          verificationDetails.verification_badges.push('Top Rated');
        }
      } else {
        verificationDetails.verification_badges = ['Email Verified'];
      }
      
      res.json({
        success: true,
        data: verificationDetails
      });
    } else {
      // Get verification statistics
      const totalUsers = users.length;
      const verifiedUsers = users.filter(u => u.is_verified).length;
      const verificationRate = Math.round((verifiedUsers / totalUsers) * 100);
      
      const gurus = users.filter(u => u.role === 'guru');
      const verifiedGurus = gurus.filter(u => u.is_verified).length;
      const guruVerificationRate = Math.round((verifiedGurus / gurus.length) * 100);
      
      res.json({
        success: true,
        data: {
          platform_stats: {
            total_users: totalUsers,
            verified_users: verifiedUsers,
            verification_rate: `${verificationRate}%`,
            guru_verification_rate: `${guruVerificationRate}%`
          },
          trust_features: [
            'Government ID Verification',
            'Phone Number Verification',
            'Email Verification',
            'Background Checks for Gurus',
            'Secure Payment Processing',
            'Review-based Trust Scores'
          ],
          security_measures: [
            'End-to-end Encrypted Chat',
            'Secure Payment Gateway',
            'AI-powered Spam Detection',
            '24/7 Support Monitoring',
            'Report & Block Features'
          ]
        }
      });
    }
    
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification info',
      error: error.message
    });
  }
});

// Real-time Chat - Simulates chat messages between a Guru and Shishya
router.get('/chat', (req, res) => {
  try {
    const { conversation_id, limit = 10 } = req.query;
    const messages = readMessages();
    const users = readUsers();
    
    let chatMessages;
    
    if (conversation_id) {
      // Get specific conversation
      chatMessages = messages
        .filter(msg => msg.conversation_id === conversation_id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(-parseInt(limit));
    } else {
      // Get sample conversation for demo
      chatMessages = messages
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, parseInt(limit));
    }
    
    // Add sender information
    const chatWithSenders = chatMessages.map(msg => {
      const sender = users.find(u => u.id === msg.from_user);
      const recipient = users.find(u => u.id === msg.to_user);
      
      return {
        ...msg,
        sender: sender ? {
          id: sender.id,
          name: sender.name,
          role: sender.role,
          profile_image: sender.profile_image
        } : null,
        recipient: recipient ? {
          id: recipient.id,
          name: recipient.name,
          role: recipient.role
        } : null
      };
    });
    
    res.json({
      success: true,
      data: {
        messages: chatWithSenders,
        total_messages: chatMessages.length,
        conversation_active: true,
        last_activity: chatMessages.length > 0 ? 
          chatMessages[chatMessages.length - 1].created_at : null,
        chat_features: [
          'Real-time messaging',
          'File sharing',
          'Voice messages',
          'AI translation',
          'Message encryption'
        ]
      }
    });
    
  } catch (error) {
    console.error('Chat simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat data',
      error: error.message
    });
  }
});

// Review System - Shows reviews and ratings for Gurus
router.get('/reviews', (req, res) => {
  try {
    const { guru_id } = req.query;
    const reviews = readReviews();
    const users = readUsers();
    
    if (guru_id) {
      // Get reviews for specific guru
      const guruReviews = reviews.filter(r => r.guru_id === guru_id);
      const guru = users.find(u => u.id === guru_id);
      
      if (!guru) {
        return res.status(404).json({
          success: false,
          message: 'Guru not found'
        });
      }
      
      const reviewsWithShishyas = guruReviews.map(review => {
        const shishya = users.find(u => u.id === review.shishya_id);
        return {
          ...review,
          shishya: shishya ? {
            id: shishya.id,
            name: shishya.name,
            profile_image: shishya.profile_image
          } : null
        };
      });
      
      const totalRating = guruReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = guruReviews.length > 0 ? 
        Math.round((totalRating / guruReviews.length) * 10) / 10 : 0;
      
      res.json({
        success: true,
        data: {
          guru: {
            id: guru.id,
            name: guru.name,
            profile_image: guru.profile_image,
            total_reviews: guruReviews.length,
            average_rating: averageRating
          },
          reviews: reviewsWithShishyas,
          rating_breakdown: {
            5: guruReviews.filter(r => r.rating === 5).length,
            4: guruReviews.filter(r => r.rating === 4).length,
            3: guruReviews.filter(r => r.rating === 3).length,
            2: guruReviews.filter(r => r.rating === 2).length,
            1: guruReviews.filter(r => r.rating === 1).length
          }
        }
      });
    } else {
      // Get platform review statistics
      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const platformAverage = totalReviews > 0 ? 
        Math.round((totalRating / totalReviews) * 10) / 10 : 0;
      
      // Get top-rated gurus
      const gurus = users.filter(u => u.role === 'guru');
      const topRatedGurus = gurus
        .filter(guru => {
          const guruReviews = reviews.filter(r => r.guru_id === guru.id);
          return guruReviews.length >= 2; // At least 2 reviews
        })
        .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        .slice(0, 5);
      
      res.json({
        success: true,
        data: {
          platform_stats: {
            total_reviews: totalReviews,
            average_rating: platformAverage,
            total_gurus: gurus.length
          },
          top_rated_gurus: topRatedGurus.map(guru => ({
            id: guru.id,
            name: guru.name,
            profile_image: guru.profile_image,
            rating: guru.average_rating,
            total_reviews: reviews.filter(r => r.guru_id === guru.id).length,
            skills: guru.skills
          })),
          recent_reviews: reviews
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(review => {
              const guru = users.find(u => u.id === review.guru_id);
              const shishya = users.find(u => u.id === review.shishya_id);
              return {
                ...review,
                guru_name: guru ? guru.name : 'Unknown',
                shishya_name: shishya ? shishya.name : 'Anonymous'
              };
            })
        }
      });
    }
    
  } catch (error) {
    console.error('Reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
});

// AI Assistant - Returns automated onboarding tips and FAQs
router.get('/assistant', (req, res) => {
  try {
    const { user_type, topic, user_id } = req.query;
    
    const onboardingTips = {
      guru: [
        {
          id: 1,
          title: "Complete Your Profile",
          description: "Add a professional photo, detailed bio, and list all your skills to attract more students.",
          priority: "high",
          icon: "user"
        },
        {
          id: 2,
          title: "Set Competitive Pricing",
          description: "Research similar gurus in your area and set prices that reflect your experience level.",
          priority: "medium",
          icon: "rupee"
        },
        {
          id: 3,
          title: "Create Detailed Skill Listings",
          description: "Describe what students will learn, prerequisites, and session structure clearly.",
          priority: "high",
          icon: "book"
        },
        {
          id: 4,
          title: "Respond Quickly to Messages",
          description: "Fast response times increase your booking rate. Aim to reply within 2 hours.",
          priority: "medium",
          icon: "message"
        }
      ],
      shishya: [
        {
          id: 1,
          title: "Define Your Learning Goals",
          description: "Be clear about what you want to achieve to find the perfect guru for your needs.",
          priority: "high",
          icon: "target"
        },
        {
          id: 2,
          title: "Read Reviews Carefully",
          description: "Check guru ratings and read detailed reviews from other students before booking.",
          priority: "high",
          icon: "star"
        },
        {
          id: 3,
          title: "Prepare for Your Sessions",
          description: "Come with questions and practice materials to make the most of your learning time.",
          priority: "medium",
          icon: "notebook"
        },
        {
          id: 4,
          title: "Communicate Your Schedule",
          description: "Let your guru know your availability and preferred learning pace upfront.",
          priority: "medium",
          icon: "calendar"
        }
      ]
    };
    
    const faqs = [
      {
        id: 1,
        question: "How do I find the right guru for my skill?",
        answer: "Use our smart matching feature to get personalized recommendations based on your location, goals, and skill level. You can also browse by category and read reviews.",
        category: "Getting Started"
      },
      {
        id: 2,
        question: "Is my payment information secure?",
        answer: "Yes, we use bank-level encryption and secure payment gateways. Your financial information is never stored on our servers.",
        category: "Security"
      },
      {
        id: 3,
        question: "What if I'm not satisfied with a session?",
        answer: "We offer a satisfaction guarantee. If you're not happy with a session, contact our support team within 24 hours for a refund or credit.",
        category: "Support"
      },
      {
        id: 4,
        question: "Can I reschedule or cancel sessions?",
        answer: "Yes, you can reschedule up to 4 hours before the session time. Cancellations made less than 4 hours in advance may incur a fee.",
        category: "Booking"
      },
      {
        id: 5,
        question: "How do I become a verified guru?",
        answer: "Complete your profile, upload government ID, verify your phone number, and maintain a 4+ star rating with at least 5 reviews.",
        category: "Verification"
      }
    ];
    
    const personalizedTips = [];
    
    // Add user-specific tips if user_id is provided
    if (user_id) {
      const users = readUsers();
      const user = users.find(u => u.id === user_id);
      
      if (user) {
        if (user.role === 'guru' && !user.is_verified) {
          personalizedTips.push({
            id: 'verify',
            title: "Get Verified",
            description: "Increase your bookings by 60% by completing profile verification.",
            priority: "high",
            action: "Start Verification"
          });
        }
        
        if (user.role === 'guru' && (!user.average_rating || user.average_rating < 4)) {
          personalizedTips.push({
            id: 'improve_rating',
            title: "Improve Your Rating",
            description: "Focus on student satisfaction to increase your rating and attract more bookings.",
            priority: "medium",
            action: "View Tips"
          });
        }
      }
    }
    
    let responseData = {
      success: true,
      data: {
        ai_assistant: {
          name: "SkillBot",
          avatar: "🤖",
          status: "online",
          capabilities: [
            "Skill matching recommendations",
            "Learning path suggestions",
            "Pricing guidance",
            "Platform support",
            "Success tips"
          ]
        },
        onboarding_tips: user_type ? onboardingTips[user_type] || [] : [],
        personalized_tips: personalizedTips,
        faqs: topic ? faqs.filter(faq => 
          faq.category.toLowerCase().includes(topic.toLowerCase()) ||
          faq.question.toLowerCase().includes(topic.toLowerCase())
        ) : faqs.slice(0, 3),
        quick_actions: [
          { id: 'find_guru', label: 'Find a Guru', icon: 'search' },
          { id: 'complete_profile', label: 'Complete Profile', icon: 'user' },
          { id: 'view_bookings', label: 'My Bookings', icon: 'calendar' },
          { id: 'contact_support', label: 'Contact Support', icon: 'help' }
        ]
      }
    };
    
    res.json(responseData);
    
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI assistance',
      error: error.message
    });
  }
});

module.exports = router;