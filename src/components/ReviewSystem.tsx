import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { mockApiService } from '../services/mockApi';
import { 
  ArrowLeft, 
  Star, 
  Filter, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  TrendingUp,
  Award,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Flag
} from 'lucide-react';

interface ReviewSystemProps {
  onBack: () => void;
}

interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  revieweeName: string;
  revieweeAvatar: string;
  rating: number;
  title: string;
  content: string;
  skillCategory: string;
  sessionType: 'individual' | 'group' | 'workshop';
  sessionDate: string;
  createdAt: string;
  isVerified: boolean;
  helpfulCount: number;
  reportCount: number;
  response?: {
    content: string;
    createdAt: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  topSkills: { skill: string; rating: number; count: number }[];
}

export function ReviewSystem({ onBack }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'top-rated' | 'my-reviews'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [isWritingReview, setIsWritingReview] = useState(false);

  useEffect(() => {
    const initializeData = () => {
      loadReviews();
      loadStats();
    };
    initializeData();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Load reviews immediately without delay for better performance
      const mockReviews: Review[] = [
        {
          id: '1',
          reviewerId: 'user1',
          reviewerName: 'Priya Sharma',
          reviewerAvatar: '',
          revieweeId: 'guru1',
          revieweeName: 'Rajesh Kumar',
          revieweeAvatar: '',
          rating: 5,
          title: 'Excellent React Mentor!',
          content: 'Rajesh helped me understand React hooks and component architecture in just 3 sessions. His teaching style is clear and patient. Highly recommended for anyone wanting to learn React development.',
          skillCategory: 'Web Development',
          sessionType: 'individual',
          sessionDate: '2024-01-15',
          createdAt: '2024-01-16',
          isVerified: true,
          helpfulCount: 12,
          reportCount: 0,
          response: {
            content: 'Thank you Priya! It was a pleasure helping you with React. Keep practicing and you\'ll be building amazing apps soon!',
            createdAt: '2024-01-17'
          }
        },
        {
          id: '2',
          reviewerId: 'user2',
          reviewerName: 'Amit Patel',
          reviewerAvatar: '',
          revieweeId: 'guru2',
          revieweeName: 'Sarah Johnson',
          revieweeAvatar: '',
          rating: 5,
          title: 'Life-changing Yoga Sessions',
          content: 'Sarah\'s yoga classes have transformed my flexibility and mental well-being. Her approach combines traditional techniques with modern understanding. The breathing exercises alone have reduced my stress significantly.',
          skillCategory: 'Yoga & Wellness',
          sessionType: 'group',
          sessionDate: '2024-01-10',
          createdAt: '2024-01-12',
          isVerified: true,
          helpfulCount: 8,
          reportCount: 0
        },
        {
          id: '3',
          reviewerId: 'user3',
          reviewerName: 'Lisa Chen',
          reviewerAvatar: '',
          revieweeId: 'guru3',
          revieweeName: 'Carlos Rodriguez',
          revieweeAvatar: '',
          rating: 4,
          title: 'Great Guitar Lessons',
          content: 'Carlos is a skilled guitarist and teacher. He helped me learn fingerpicking techniques and music theory. Sometimes the sessions felt a bit rushed, but overall very satisfied with the progress.',
          skillCategory: 'Music',
          sessionType: 'individual',
          sessionDate: '2024-01-08',
          createdAt: '2024-01-10',
          isVerified: true,
          helpfulCount: 5,
          reportCount: 0
        },
        {
          id: '4',
          reviewerId: 'user4',
          reviewerName: 'David Kumar',
          reviewerAvatar: '',
          revieweeId: 'guru4',
          revieweeName: 'Maria Garcia',
          revieweeAvatar: '',
          rating: 5,
          title: 'Amazing Cooking Workshop',
          content: 'Maria\'s cooking workshop was incredible! Learned to make authentic Spanish paella and tapas. She shared family recipes and techniques passed down through generations. The hands-on experience was perfect.',
          skillCategory: 'Cooking',
          sessionType: 'workshop',
          sessionDate: '2024-01-05',
          createdAt: '2024-01-06',
          isVerified: true,
          helpfulCount: 15,
          reportCount: 0,
          response: {
            content: '¡Muchas gracias David! I\'m so happy you enjoyed the workshop. Keep practicing those techniques and soon you\'ll be cooking like a chef!',
            createdAt: '2024-01-07'
          }
        },
        {
          id: '5',
          reviewerId: 'user5',
          reviewerName: 'Alex Thompson',
          reviewerAvatar: '',
          revieweeId: 'guru5',
          revieweeName: 'Dr. Kavita Patel',
          revieweeAvatar: '',
          rating: 4,
          title: 'Comprehensive Language Learning',
          content: 'Dr. Patel\'s Hindi lessons are well-structured and comprehensive. She uses a mix of traditional and modern teaching methods. Would appreciate more conversational practice, but the grammar foundation is solid.',
          skillCategory: 'Language Learning',
          sessionType: 'individual',
          sessionDate: '2024-01-03',
          createdAt: '2024-01-04',
          isVerified: true,
          helpfulCount: 7,
          reportCount: 0
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const mockStats: ReviewStats = {
        averageRating: 4.6,
        totalReviews: 847,
        ratingDistribution: {
          5: 542,
          4: 186,
          3: 89,
          2: 23,
          1: 7
        },
        topSkills: [
          { skill: 'Web Development', rating: 4.8, count: 156 },
          { skill: 'Yoga & Wellness', rating: 4.7, count: 134 },
          { skill: 'Cooking', rating: 4.6, count: 98 },
          { skill: 'Music', rating: 4.5, count: 87 },
          { skill: 'Language Learning', rating: 4.4, count: 76 }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const filteredAndSortedReviews = React.useMemo(() => {
    return reviews
      .filter(review => {
        if (filterCategory !== 'all' && review.skillCategory !== filterCategory) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return review.title.toLowerCase().includes(query) ||
                 review.content.toLowerCase().includes(query) ||
                 review.revieweeName.toLowerCase().includes(query) ||
                 review.skillCategory.toLowerCase().includes(query);
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'helpful':
            return b.helpfulCount - a.helpfulCount;
          case 'recent':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [reviews, filterCategory, searchQuery, sortBy]);

  const renderStarRating = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = [];
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${starSize} ${
            i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  const renderReviewCard = (review: Review) => (
    <Card key={review.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={review.reviewerAvatar} />
            <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{review.reviewerName}</h4>
                {review.isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <Badge variant="outline" className="text-xs">
                  {review.skillCategory}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {review.sessionType}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {renderStarRating(review.rating)}
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <h5 className="font-medium mb-2">{review.title}</h5>
            <p className="text-gray-700 mb-3">{review.content}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Session with {review.revieweeName}</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(review.sessionDate).toLocaleDateString()}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful ({review.helpfulCount})
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Flag className="h-3 w-3 mr-1" />
                  Report
                </Button>
              </div>
            </div>
            
            {review.response && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={review.revieweeAvatar} />
                    <AvatarFallback className="text-xs">{review.revieweeName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{review.revieweeName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(review.response.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.response.content}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatsOverview = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              {renderStarRating(Math.round(stats.averageRating), 'md')}
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.averageRating}</div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.totalReviews}</div>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.ratingDistribution[5] / stats.totalReviews) * 100)}%
            </div>
            <p className="text-sm text-gray-600">5-Star Reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.topSkills.length}</div>
            <p className="text-sm text-gray-600">Skill Categories</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!stats) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating] || 0;
              const percentage = (count / stats.totalReviews) * 100;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTopSkills = () => {
    if (!stats) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Top Rated Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topSkills.map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{skill.skill}</h4>
                    <p className="text-sm text-gray-600">{skill.count} reviews</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStarRating(Math.round(skill.rating))}
                  <span className="font-medium">{skill.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-yellow-600" />
          <h1 className="text-xl">Review System</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {renderStatsOverview()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search reviews..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Yoga & Wellness">Yoga & Wellness</SelectItem>
                      <SelectItem value="Cooking">Cooking</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Language Learning">Language Learning</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="helpful">Most Helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading reviews...</p>
                  </CardContent>
                </Card>
              ) : filteredAndSortedReviews.length > 0 ? (
                filteredAndSortedReviews.map(renderReviewCard)
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3>No reviews found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {renderRatingDistribution()}
            {renderTopSkills()}
            
            {/* Write Review CTA */}
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3>Share Your Experience</h3>
                <p className="text-gray-600 mb-4">Help others by sharing your learning journey and experiences with mentors.</p>
                <Button className="w-full" onClick={() => setIsWritingReview(true)}>
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}