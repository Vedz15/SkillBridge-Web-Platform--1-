const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Helper function to hash passwords
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Additional sample data generation
const generateAdditionalUsers = async () => {
  const additionalUsers = [
    {
      id: "guru-4",
      name: "Maya Krishnan",
      email: "maya.krishnan@email.com",
      password: await hashPassword("password123"),
      phone: "+91-9876543215",
      role: "guru",
      bio: "Classical dance instructor specializing in Bharatanatyam. 20+ years of experience teaching traditional Indian dance forms. Passionate about preserving cultural heritage.",
      location: "Chennai, Tamil Nadu",
      latitude: 13.0827,
      longitude: 80.2707,
      is_verified: true,
      profile_image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      created_at: "2024-01-20T12:00:00Z",
      years_experience: 20,
      hourly_rate: 450,
      total_students: 30,
      average_rating: 4.9,
      languages: ["Tamil", "Hindi", "English"]
    },
    {
      id: "guru-5",
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      password: await hashPassword("password123"),
      phone: "+91-9876543216",
      role: "guru",
      bio: "Digital marketing expert with 10 years of industry experience. Specialized in social media marketing, SEO, and content strategy. Helping businesses grow online.",
      location: "Gurgaon, Haryana",
      latitude: 28.4595,
      longitude: 77.0266,
      is_verified: true,
      profile_image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
      created_at: "2024-01-25T09:30:00Z",
      years_experience: 10,
      hourly_rate: 800,
      total_students: 20,
      average_rating: 4.6,
      languages: ["Hindi", "English", "Punjabi"]
    },
    {
      id: "shishya-3",
      name: "Riya Sharma",
      email: "riya.sharma@email.com",
      password: await hashPassword("password123"),
      phone: "+91-9876543217",
      role: "shishya",
      bio: "Marketing professional interested in learning classical dance to connect with Indian culture. Also looking to improve my digital marketing skills.",
      location: "Mumbai, Maharashtra",
      latitude: 19.0760,
      longitude: 72.8777,
      is_verified: false,
      profile_image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
      created_at: "2024-02-08T14:20:00Z",
      interests: ["Dance", "Culture", "Digital Marketing"],
      learning_goals: "Learn Bharatanatyam and improve digital marketing skills"
    }
  ];

  return additionalUsers;
};

const generateAdditionalSkills = () => {
  return [
    {
      id: "skill-7",
      guru_id: "guru-4",
      title: "Bharatanatyam Classical Dance",
      description: "Learn the beautiful classical dance form of Bharatanatyam. Covers basic positions, mudras, expressions, and traditional compositions. Perfect for beginners.",
      category: "Arts & Culture",
      price_per_hour: 450,
      duration_per_session: 90,
      availability: {
        monday: ["16:00", "17:30"],
        tuesday: ["16:00", "17:30"],
        wednesday: ["16:00", "17:30"],
        thursday: ["16:00", "17:30"],
        friday: ["16:00", "17:30"],
        saturday: ["09:00", "10:30", "16:00", "17:30"],
        sunday: ["09:00", "10:30", "16:00", "17:30"]
      },
      skill_level: "beginner",
      max_students: 4,
      session_type: "group",
      requirements: "Comfortable clothing, bare feet, enthusiasm to learn",
      created_at: "2024-01-20T12:30:00Z",
      is_active: true
    },
    {
      id: "skill-8",
      guru_id: "guru-5",
      title: "Digital Marketing Fundamentals",
      description: "Complete digital marketing course covering SEO, social media marketing, content marketing, and analytics. Practical hands-on approach with real-world examples.",
      category: "Business",
      price_per_hour: 800,
      duration_per_session: 120,
      availability: {
        monday: ["19:00"],
        tuesday: ["19:00"],
        wednesday: ["19:00"],
        thursday: ["19:00"],
        saturday: ["10:00", "14:00"],
        sunday: ["10:00", "14:00"]
      },
      skill_level: "beginner",
      max_students: 6,
      session_type: "group",
      requirements: "Laptop, notebook, basic computer skills",
      created_at: "2024-01-25T10:00:00Z",
      is_active: true
    }
  ];
};

const generateAdditionalMessages = () => {
  return [
    {
      id: "msg-11",
      from_user: "shishya-3",
      to_user: "guru-4",
      text: "Hi Maya, I'm very interested in learning Bharatanatyam. I have no prior dance experience but I'm eager to learn about Indian classical dance.",
      created_at: "2024-02-20T16:00:00Z",
      is_read: true,
      conversation_id: "conv-4"
    },
    {
      id: "msg-12",
      from_user: "guru-4",
      to_user: "shishya-3",
      text: "Hello Riya! It's wonderful that you want to learn Bharatanatyam. Don't worry about not having experience - everyone starts somewhere. We'll begin with basic postures and hand gestures. Are you available for a trial class this weekend?",
      created_at: "2024-02-20T16:30:00Z",
      is_read: false,
      conversation_id: "conv-4"
    }
  ];
};

const generateAdditionalReviews = () => {
  return [
    {
      id: "review-8",
      guru_id: "guru-4",
      shishya_id: "shishya-3",
      skill_id: "skill-7",
      rating: 5,
      comment: "Maya is an incredible teacher! Her patience and dedication to preserving the art form is inspiring. I learned so much in just one session. The way she explains the cultural significance makes it even more meaningful.",
      created_at: "2024-02-21T19:00:00Z",
      session_date: "2024-02-21T16:00:00Z",
      verified_purchase: true
    }
  ];
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Read existing data
    const usersPath = path.join(__dirname, '../database/users.json');
    const skillsPath = path.join(__dirname, '../database/skills.json');
    const messagesPath = path.join(__dirname, '../database/messages.json');
    const reviewsPath = path.join(__dirname, '../database/reviews.json');

    let existingUsers = [];
    let existingSkills = [];
    let existingMessages = [];
    let existingReviews = [];

    try {
      existingUsers = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      existingSkills = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
      existingMessages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
      existingReviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    } catch (error) {
      console.log('No existing data found, creating fresh database...');
    }

    // Generate additional data
    const additionalUsers = await generateAdditionalUsers();
    const additionalSkills = generateAdditionalSkills();
    const additionalMessages = generateAdditionalMessages();
    const additionalReviews = generateAdditionalReviews();

    // Merge with existing data (avoid duplicates)
    const allUsers = [...existingUsers];
    const allSkills = [...existingSkills];
    const allMessages = [...existingMessages];
    const allReviews = [...existingReviews];

    // Add new users if they don't exist
    additionalUsers.forEach(newUser => {
      if (!allUsers.find(u => u.id === newUser.id)) {
        allUsers.push(newUser);
      }
    });

    // Add new skills if they don't exist
    additionalSkills.forEach(newSkill => {
      if (!allSkills.find(s => s.id === newSkill.id)) {
        allSkills.push(newSkill);
      }
    });

    // Add new messages if they don't exist
    additionalMessages.forEach(newMessage => {
      if (!allMessages.find(m => m.id === newMessage.id)) {
        allMessages.push(newMessage);
      }
    });

    // Add new reviews if they don't exist
    additionalReviews.forEach(newReview => {
      if (!allReviews.find(r => r.id === newReview.id)) {
        allReviews.push(newReview);
      }
    });

    // Write updated data back to files
    fs.writeFileSync(usersPath, JSON.stringify(allUsers, null, 2));
    fs.writeFileSync(skillsPath, JSON.stringify(allSkills, null, 2));
    fs.writeFileSync(messagesPath, JSON.stringify(allMessages, null, 2));
    fs.writeFileSync(reviewsPath, JSON.stringify(allReviews, null, 2));

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Total Users: ${allUsers.length}`);
    console.log(`🎯 Total Skills: ${allSkills.length}`);
    console.log(`💬 Total Messages: ${allMessages.length}`);
    console.log(`⭐ Total Reviews: ${allReviews.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };