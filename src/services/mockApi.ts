// Mock API service to simulate backend responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Mock data
const mockUsers = [
  {
    id: "guru1",
    name: "Priya Sharma",
    email: "priya@example.com",
    userType: "guru",
    skills: ["Yoga", "Meditation"],
    hourly_rate: 800,
    location: "Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    distance_km: 2.5,
    rating: 4.9,
    reviews_count: 89
  },
  {
    id: "guru2", 
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    userType: "guru",
    skills: ["Cooking", "Indian Cuisine"],
    hourly_rate: 600,
    location: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    distance_km: 5.2,
    rating: 4.7,
    reviews_count: 156
  },
  {
    id: "guru3",
    name: "Anita Patel",
    email: "anita@example.com", 
    userType: "guru",
    skills: ["Music", "Classical Singing"],
    hourly_rate: 1200,
    location: "Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    distance_km: 1.8,
    rating: 4.8,
    reviews_count: 72
  }
];

const mockMessages = [
  {
    id: "msg1",
    from_user_id: "guru1",
    to_user_id: "shishya1",
    message: "Hi! I'd be happy to help you with yoga practice.",
    timestamp: "2024-01-15T10:30:00Z",
    from_name: "Priya Sharma"
  },
  {
    id: "msg2",
    from_user_id: "shishya1", 
    to_user_id: "guru2",
    message: "What cooking techniques do you specialize in?",
    timestamp: "2024-01-15T11:45:00Z",
    from_name: "Amit Singh"
  }
];

const mockReviews = [
  {
    id: "rev1",
    guru_id: "guru1",
    shishya_id: "shishya1",
    rating: 5,
    review: "Excellent yoga instructor! Very patient and knowledgeable.",
    timestamp: "2024-01-10T14:20:00Z",
    shishya_name: "Amit Singh"
  },
  {
    id: "rev2",
    guru_id: "guru2", 
    shishya_id: "shishya2",
    rating: 4,
    review: "Great cooking lessons. Learned authentic recipes!",
    timestamp: "2024-01-12T16:30:00Z", 
    shishya_name: "Neha Gupta"
  }
];

// Mock API functions
export const mockApiService = {
  // Smart Matching
  async getMatches(skills?: string, lat?: number, lng?: number, limit = 3): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    return {
      success: true,
      message: "Smart matching completed successfully",
      data: {
        recommended_gurus: mockUsers.slice(0, limit),
        total_matches: mockUsers.length,
        algorithm_version: "v2.1"
      }
    };
  },

  // Location-based search
  async getLocationResults(lat?: number, lng?: number, radius = 25, limit = 5): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: "Location-based search completed",
      data: {
        nearby_gurus: mockUsers.slice(0, limit),
        search_radius_km: radius,
        center_location: { lat, lng }
      }
    };
  },

  // Verification system
  async getVerificationStats(): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: "Platform security stats retrieved",
      data: {
        platform_stats: {
          verified_users: 1247,
          verification_rate: "94%",
          background_checks: "Active",
          security_score: "A+"
        }
      }
    };
  },

  // Chat system
  async getChatData(limit = 5): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      success: true,
      message: "Chat system is active",
      data: {
        messages: mockMessages.slice(0, limit),
        active_conversations: 23,
        encryption_status: "End-to-end encrypted"
      }
    };
  },

  // Review system
  async getReviewsData(): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: "Review system data retrieved",
      data: {
        recent_reviews: mockReviews,
        platform_stats: {
          total_reviews: 2847,
          average_rating: "4.7",
          verified_reviews: "98%"
        }
      }
    };
  },

  // AI Assistant
  async getAssistantData(userType = "shishya"): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 550));
    
    const tips = userType === "guru" 
      ? [
          "Complete your profile with certificates",
          "Set competitive hourly rates", 
          "Respond to messages within 2 hours"
        ]
      : [
          "Define your learning goals clearly",
          "Read guru reviews before booking",
          "Prepare questions for your sessions"
        ];
    
    return {
      success: true,
      message: "AI Assistant recommendations ready",
      data: {
        onboarding_tips: tips,
        ai_version: "GPT-4 Enhanced",
        personalization_score: "87%"
      }
    };
  },

  // Health check
  async checkHealth(): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      message: "Mock API service is running",
      data: {
        status: "online",
        version: "1.0.0",
        uptime: "99.9%"
      }
    };
  }
};