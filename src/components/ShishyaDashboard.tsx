import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Search, 
  MapPin, 
  Star, 
  MessageCircle, 
  Calendar,
  Filter,
  Bot,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Sparkles,
  Heart
} from "lucide-react";

interface ShishyaDashboardProps {
  user: any;
  onLogout: () => void;
  onOpenChat: (recipientId: string, recipientName: string) => void;
}

export function ShishyaDashboard({ user, onLogout, onOpenChat }: ShishyaDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const [gurus] = useState([
    {
      id: '1',
      name: 'Rajesh Kumar',
      title: 'Web Development with React',
      category: 'Technology',
      location: 'Mumbai, Maharashtra',
      distance: '2.5 km',
      rating: 4.8,
      reviews: 156,
      price: '₹500/hour',
      availability: 'Weekdays 6-9 PM',
      students: 23,
      experience: '5+ years',
      image: null,
      tags: ['React', 'JavaScript', 'Node.js']
    },
    {
      id: '2',
      name: 'Priya Sharma',
      title: 'Classical Indian Dance',
      category: 'Arts',
      location: 'Delhi, Delhi',
      distance: '1.2 km',
      rating: 4.9,
      reviews: 89,
      price: '₹400/hour',
      availability: 'Weekends',
      students: 31,
      experience: '8+ years',
      image: null,
      tags: ['Bharatanatyam', 'Kathak', 'Performance']
    },
    {
      id: '3',
      name: 'Amit Patel',
      title: 'Guitar Lessons for All Levels',
      category: 'Music',
      location: 'Pune, Maharashtra',
      distance: '3.1 km',
      rating: 4.7,
      reviews: 124,
      price: '₹300/hour',
      availability: 'Evenings',
      students: 18,
      experience: '6+ years',
      image: null,
      tags: ['Acoustic Guitar', 'Electric Guitar', 'Music Theory']
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      title: 'Yoga & Meditation',
      category: 'Fitness',
      location: 'Bangalore, Karnataka',
      distance: '4.2 km',
      rating: 4.9,
      reviews: 201,
      price: '₹250/hour',
      availability: 'Mornings',
      students: 45,
      experience: '10+ years',
      image: null,
      tags: ['Hatha Yoga', 'Meditation', 'Pranayama']
    }
  ]);

  const [myLearning] = useState([
    {
      id: '1',
      guruName: 'Rajesh Kumar',
      skillTitle: 'Web Development with React',
      progress: 65,
      nextSession: 'Tomorrow 7:00 PM',
      totalSessions: 8,
      completedSessions: 5
    },
    {
      id: '2',
      guruName: 'Sneha Reddy',
      skillTitle: 'Yoga & Meditation',
      progress: 30,
      nextSession: 'Today 6:00 AM',
      totalSessions: 12,
      completedSessions: 4
    }
  ]);

  const [favorites] = useState(['1', '4']);

  const filteredGurus = gurus.filter(guru => {
    const matchesSearch = guru.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guru.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guru.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || guru.category.toLowerCase() === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || guru.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = ['all', 'technology', 'music', 'arts', 'fitness', 'languages', 'cooking'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">S</span>
              </div>
              <h1 className="text-xl">SkillBridge - Shishya Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Avatar>
                <AvatarFallback className="bg-purple-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={onLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-purple-500 text-white text-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      👨‍🎓 Shishya
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{myLearning.length} Active Learning</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList>
            <TabsTrigger value="discover">Discover Gurus</TabsTrigger>
            <TabsTrigger value="learning">My Learning ({myLearning.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Find Your Perfect Guru</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search skills, gurus, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>AI Recommendations for You</span>
                </CardTitle>
                <CardDescription>
                  Based on your interests and learning goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-purple-300 text-purple-700">React Development</Badge>
                  <Badge variant="outline" className="border-purple-300 text-purple-700">Yoga & Meditation</Badge>
                  <Badge variant="outline" className="border-purple-300 text-purple-700">Guitar Lessons</Badge>
                  <Badge variant="outline" className="border-purple-300 text-purple-700">Data Science</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Guru Listings */}
            <div className="grid gap-6">
              {filteredGurus.map((guru) => (
                <Card key={guru.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-orange-500 text-white">
                            {guru.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{guru.name}</CardTitle>
                          <CardDescription className="text-base mb-2">
                            {guru.title}
                          </CardDescription>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{guru.location}</span>
                              <span>({guru.distance})</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{guru.rating} ({guru.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={favorites.includes(guru.id) ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(guru.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {guru.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{guru.price}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{guru.availability}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{guru.students} students</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onOpenChat(guru.id, guru.name)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                          Book Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <h3 className="text-lg">My Active Learning</h3>
            <div className="space-y-4">
              {myLearning.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.skillTitle}</CardTitle>
                        <CardDescription>with {course.guruName}</CardDescription>
                      </div>
                      <Badge variant="outline">{course.progress}% Complete</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{course.completedSessions}/{course.totalSessions} sessions</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Next session: {course.nextSession}</span>
                        </div>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onOpenChat(course.id, course.guruName)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat with Guru
                          </Button>
                          <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <h3 className="text-lg">Your Favorite Gurus</h3>
            <div className="grid gap-6">
              {gurus.filter(guru => favorites.includes(guru.id)).map((guru) => (
                <Card key={guru.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-orange-500 text-white">
                            {guru.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{guru.name}</CardTitle>
                          <CardDescription className="text-base mb-2">
                            {guru.title}
                          </CardDescription>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{guru.rating} ({guru.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{guru.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onOpenChat(guru.id, guru.name)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                        Book Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <h3 className="text-lg">AI-Powered Learning Tools</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>AI Skill Matcher</span>
                  </CardTitle>
                  <CardDescription>
                    Get personalized guru recommendations based on your goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Find My Perfect Match</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>AI Chat Translator</span>
                  </CardTitle>
                  <CardDescription>
                    Break language barriers with real-time translation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Enable Translation</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Learning Path Generator</span>
                  </CardTitle>
                  <CardDescription>
                    AI creates personalized learning roadmaps for your goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate My Path</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>Smart Review Helper</span>
                  </CardTitle>
                  <CardDescription>
                    AI helps you write meaningful reviews for your gurus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Write Better Reviews</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}