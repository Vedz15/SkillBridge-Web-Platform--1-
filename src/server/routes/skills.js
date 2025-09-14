const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const SKILLS_FILE = path.join(__dirname, '../database/skills.json');
const USERS_FILE = path.join(__dirname, '../database/users.json');

// Helper functions
const readSkills = () => {
  try {
    const data = fs.readFileSync(SKILLS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeSkills = (skills) => {
  fs.writeFileSync(SKILLS_FILE, JSON.stringify(skills, null, 2));
};

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Get all skills with optional filtering
router.get('/', (req, res) => {
  try {
    const { category, skill_level, location, min_price, max_price, guru_id, page = 1, limit = 10 } = req.query;
    let skills = readSkills();
    const users = readUsers();

    // Filter active skills only
    skills = skills.filter(skill => skill.is_active);

    // Apply filters
    if (category) {
      skills = skills.filter(skill => 
        skill.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (skill_level) {
      skills = skills.filter(skill => skill.skill_level === skill_level);
    }

    if (guru_id) {
      skills = skills.filter(skill => skill.guru_id === guru_id);
    }

    if (min_price) {
      skills = skills.filter(skill => skill.price_per_hour >= parseFloat(min_price));
    }

    if (max_price) {
      skills = skills.filter(skill => skill.price_per_hour <= parseFloat(max_price));
    }

    // Add guru information to each skill
    skills = skills.map(skill => {
      const guru = users.find(user => user.id === skill.guru_id);
      if (guru) {
        const { password, ...guruInfo } = guru;
        return {
          ...skill,
          guru: guruInfo
        };
      }
      return skill;
    });

    // Filter by location if provided
    if (location) {
      skills = skills.filter(skill => 
        skill.guru && skill.guru.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSkills = skills.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        skills: paginatedSkills,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(skills.length / limit),
          total_count: skills.length,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
      error: error.message
    });
  }
});

// Get skill by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const skills = readSkills();
    const users = readUsers();
    
    const skill = skills.find(s => s.id === id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Add guru information
    const guru = users.find(user => user.id === skill.guru_id);
    if (guru) {
      const { password, ...guruInfo } = guru;
      skill.guru = guruInfo;
    }

    res.json({
      success: true,
      data: {
        skill
      }
    });

  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill',
      error: error.message
    });
  }
});

// Create new skill (for gurus)
router.post('/', (req, res) => {
  try {
    const skillData = req.body;
    const skills = readSkills();

    // Validation
    const requiredFields = ['guru_id', 'title', 'description', 'category', 'price_per_hour'];
    for (const field of requiredFields) {
      if (!skillData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Verify guru exists
    const users = readUsers();
    const guru = users.find(user => user.id === skillData.guru_id && user.role === 'guru');
    if (!guru) {
      return res.status(404).json({
        success: false,
        message: 'Guru not found'
      });
    }

    const newSkill = {
      id: Date.now(), // Simple numeric ID for demo
      ...skillData,
      created_at: new Date().toISOString(),
      is_active: true,
      duration_per_session: skillData.duration_per_session || 60,
      skill_level: skillData.skill_level || 'beginner',
      max_students: skillData.max_students || 1,
      session_type: skillData.session_type || 'one_on_one',
      requirements: skillData.requirements || '',
      availability: skillData.availability || {}
    };

    skills.push(newSkill);
    writeSkills(skills);

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: {
        skill: newSkill
      }
    });

  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create skill',
      error: error.message
    });
  }
});

// Update skill
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const skills = readSkills();
    
    const skillIndex = skills.findIndex(s => s.id === id);

    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Don't allow updating certain fields
    const { id: skillId, guru_id, created_at, ...allowedUpdates } = updateData;

    skills[skillIndex] = {
      ...skills[skillIndex],
      ...allowedUpdates,
      updated_at: new Date().toISOString()
    };

    writeSkills(skills);

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: {
        skill: skills[skillIndex]
      }
    });

  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skill',
      error: error.message
    });
  }
});

// Delete skill
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const skills = readSkills();
    
    const skillIndex = skills.findIndex(s => s.id === id);

    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Soft delete by marking as inactive
    skills[skillIndex].is_active = false;
    skills[skillIndex].deleted_at = new Date().toISOString();

    writeSkills(skills);

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });

  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete skill',
      error: error.message
    });
  }
});

// Search skills
router.get('/search/all', (req, res) => {
  try {
    const { q, category, location, min_price, max_price, skill_level } = req.query;
    let skills = readSkills();
    const users = readUsers();

    // Filter active skills only
    skills = skills.filter(skill => skill.is_active);

    // Add guru information
    skills = skills.map(skill => {
      const guru = users.find(user => user.id === skill.guru_id);
      if (guru) {
        const { password, ...guruInfo } = guru;
        return { ...skill, guru: guruInfo };
      }
      return skill;
    });

    // Text search in title and description
    if (q) {
      const searchTerm = q.toLowerCase();
      skills = skills.filter(skill => 
        skill.title.toLowerCase().includes(searchTerm) ||
        skill.description.toLowerCase().includes(searchTerm) ||
        skill.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply other filters (same as in GET /)
    if (category) {
      skills = skills.filter(skill => 
        skill.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (skill_level) {
      skills = skills.filter(skill => skill.skill_level === skill_level);
    }

    if (location) {
      skills = skills.filter(skill => 
        skill.guru && skill.guru.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (min_price) {
      skills = skills.filter(skill => skill.price_per_hour >= parseFloat(min_price));
    }

    if (max_price) {
      skills = skills.filter(skill => skill.price_per_hour <= parseFloat(max_price));
    }

    res.json({
      success: true,
      data: {
        skills,
        total_count: skills.length
      }
    });

  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search skills',
      error: error.message
    });
  }
});

module.exports = router;