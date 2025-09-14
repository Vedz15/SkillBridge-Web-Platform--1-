import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Star, 
  Plus, 
  MessageCircle, 
  DollarSign, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Bot,
  Sparkles
} from "lucide-react";

interface GuruDashboardProps {
  user: any;
  onLogout: () => void;
  onOpenChat: (recipientId: string, recipientName: string) => void;
}

export function GuruDashboard({ user, onLogout, onOpenChat }: GuruDashboardProps) {
  const [skills, setSkills] = useState([
    {
      id: '1',
      title: 'Web Development with React',
      description: 'Complete guide to modern React development including hooks, state management, and deployment.',
      category: 'Technology',
      price: '₹500/hour',
      availability: 'Weekdays 6-9 PM',
      rating: 4.8,
      studentsCount: 23,
      status: 'active'
    },
    {
      id: '2',
      title: 'Guitar Lessons for Beginners',
      description: 'Learn acoustic guitar from basics to intermediate level. Includes chord progressions and popular songs.',
      category: 'Music',
      price: '₹300/hour',
      availability: 'Weekends',
      rating: 4.9,
      studentsCount: 15,
      status: 'active'
    }
  ]);

  const [requests] = useState([
    {
      id: '1',
      studentName: 'Priya Sharma',
      skillRequested: 'Web Development with React',
      message: 'Hi! I\'m a complete beginner and would love to learn React. When can we start?',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      id: '2',
      studentName: 'Arjun Patel',
      skillRequested: 'Guitar Lessons for Beginners',
      message: 'Looking for weekend guitar classes. Are you available on Saturdays?',
      timestamp: '1 day ago',
      status: 'pending'
    }
  ]);

  const [newSkill, setNewSkill] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    availability: ''
  });

  const [showAddSkill, setShowAddSkill] = useState(false);

  const handleAddSkill = () => {
    const skill = {
      id: Date.now().toString(),
      ...newSkill,
      rating: 0,
      studentsCount: 0,
      status: 'active'
    };
    setSkills([...skills, skill]);
    setNewSkill({ title: '', description: '', category: '', price: '', availability: '' });
    setShowAddSkill(false);
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  const stats = [
    { label: 'Total Students', value: '38', icon: Users },
    { label: 'Total Earnings', value: '₹25,000', icon: DollarSign },
    { label: 'Average Rating', value: '4.8', icon: Star },
    { label: 'Active Skills', value: skills.length.toString(), icon: Sparkles }
  ];

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
              <h1 className="text-xl">SkillBridge - Guru Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Avatar>
                <AvatarFallback className="bg-orange-500 text-white">
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
                  <AvatarFallback className="bg-orange-500 text-white text-xl">
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
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      🧙‍♂️ Guru
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8 (156 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <stat.icon className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList>
            <TabsTrigger value="skills">My Skills</TabsTrigger>
            <TabsTrigger value="requests">Student Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Your Skills</h3>
              <Dialog open={showAddSkill} onOpenChange={setShowAddSkill}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    <DialogDescription>
                      Create a new skill listing to attract students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="skill-title">Skill Title</Label>
                      <Input
                        id="skill-title"
                        placeholder="e.g., Piano Lessons for Beginners"
                        value={newSkill.title}
                        onChange={(e) => setNewSkill({...newSkill, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="skill-description">Description</Label>
                      <Textarea
                        id="skill-description"
                        placeholder="Describe what you'll teach and your teaching approach..."
                        value={newSkill.description}
                        onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="skill-category">Category</Label>
                      <Select value={newSkill.category} onValueChange={(value) => setNewSkill({...newSkill, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="languages">Languages</SelectItem>
                          <SelectItem value="arts">Arts & Crafts</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="cooking">Cooking</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="skill-price">Price per Hour</Label>
                      <Input
                        id="skill-price"
                        placeholder="e.g., ₹500/hour"
                        value={newSkill.price}
                        onChange={(e) => setNewSkill({...newSkill, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="skill-availability">Availability</Label>
                      <Input
                        id="skill-availability"
                        placeholder="e.g., Weekdays 6-9 PM"
                        value={newSkill.availability}
                        onChange={(e) => setNewSkill({...newSkill, availability: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAddSkill} className="w-full bg-orange-500 hover:bg-orange-600">
                      Add Skill
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {skills.map((skill) => (
                <Card key={skill.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{skill.title}</span>
                          <Badge variant="outline">{skill.category}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {skill.description}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{skill.price}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{skill.availability}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{skill.studentsCount} students</span>
                        </div>
                        {skill.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{skill.rating}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={skill.status === 'active' ? 'default' : 'secondary'}>
                        {skill.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <h3 className="text-lg">Student Requests</h3>
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.studentName}</CardTitle>
                        <CardDescription>
                          Interested in: {request.skillRequested}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{request.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{request.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{request.timestamp}</span>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onOpenChat(request.id, request.studentName)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-lg">Analytics & Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-2">₹25,000</div>
                  <p className="text-sm text-green-600">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Skill</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg mb-2">Web Development with React</div>
                  <p className="text-sm text-gray-600">23 active students</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <h3 className="text-lg">AI-Powered Tools</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>AI Profile Builder</span>
                  </CardTitle>
                  <CardDescription>
                    Generate professional skill descriptions automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate Profile Content</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Review Summarizer</span>
                  </CardTitle>
                  <CardDescription>
                    Get AI-generated summaries of your student reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Summarize Reviews</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}