import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Bot, 
  Send, 
  Lightbulb, 
  BookOpen, 
  Users, 
  MapPin,
  Clock,
  Star,
  MessageSquare,
  Zap,
  Sparkles
} from 'lucide-react';

interface AIAssistantProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export function AIAssistant({ onBack }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your SkillBridge AI Assistant. I can help you find the perfect mentor, suggest learning paths, answer questions about skills, and provide personalized recommendations. What would you like to explore today?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Find a React mentor near me",
        "What skills are trending?",
        "Help me create a learning plan",
        "Show me top-rated yoga instructors"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): { content: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase();
    
    if (input.includes('react') || input.includes('javascript') || input.includes('web development')) {
      return {
        content: "Great choice! React is one of the most in-demand skills. I found several excellent React mentors on SkillBridge:\n\n🌟 **Rajesh Kumar** - 5.0 rating, 150+ sessions\n• Specializes in React hooks, Redux, and component architecture\n• Available for 1-on-1 sessions in Mumbai\n• ₹1,500/hour\n\n🌟 **Priya Sharma** - 4.9 rating, 200+ sessions\n• Full-stack development with React & Node.js\n• Group workshops available\n• ₹1,200/hour\n\nWould you like me to help you book a session or find more mentors?",
        suggestions: [
          "Book a session with Rajesh",
          "Find React group workshops",
          "Show me JavaScript fundamentals",
          "Compare mentor pricing"
        ]
      };
    }
    
    if (input.includes('yoga') || input.includes('wellness') || input.includes('meditation')) {
      return {
        content: "Wonderful! Yoga and wellness are perfect for both physical and mental well-being. Here are some top-rated instructors:\n\n🧘‍♀️ **Sarah Johnson** - 4.9 rating, Certified Yoga Alliance\n• Hatha, Vinyasa, and Meditation specialist\n• Available for home visits in Delhi\n• ₹800/session\n\n🧘‍♂️ **Amit Verma** - 4.8 rating, 10+ years experience\n• Therapeutic yoga and stress relief\n• Online and in-person classes\n• ₹600/session\n\nI can also suggest a personalized wellness routine based on your goals!",
        suggestions: [
          "Book a trial yoga session",
          "Find meditation classes",
          "Create wellness routine",
          "Show nearby instructors"
        ]
      };
    }
    
    if (input.includes('cooking') || input.includes('chef') || input.includes('recipe')) {
      return {
        content: "Delicious choice! Cooking is such a rewarding skill. I've found some amazing culinary mentors:\n\n👨‍🍳 **Maria Garcia** - 5.0 rating, Professional Chef\n• Spanish cuisine, paella, and tapas specialist\n• Hands-on cooking workshops\n• ₹2,000/workshop\n\n👩‍🍳 **Ravi Patel** - 4.8 rating, Street Food Expert\n• Indian street food and regional cuisines\n• Small group classes available\n• ₹1,000/session\n\nWhat type of cuisine interests you most?",
        suggestions: [
          "Book a cooking workshop",
          "Learn Indian cuisine",
          "Find vegetarian cooking",
          "Show baking classes"
        ]
      };
    }
    
    if (input.includes('trending') || input.includes('popular') || input.includes('demand')) {
      return {
        content: "Here are the most trending skills on SkillBridge right now:\n\n📈 **Top Tech Skills:**\n• React & Next.js Development\n• Python & AI/ML\n• Cloud Computing (AWS, Azure)\n• Mobile App Development\n\n🎨 **Creative Skills:**\n• UI/UX Design\n• Digital Marketing\n• Content Creation\n• Photography\n\n💼 **Professional Skills:**\n• Public Speaking\n• Leadership & Management\n• Financial Planning\n• Language Learning\n\nThese skills have 40%+ more demand compared to last quarter!",
        suggestions: [
          "Find AI/ML mentors",
          "Learn UI/UX design",
          "Explore digital marketing",
          "Show skill pricing trends"
        ]
      };
    }
    
    if (input.includes('plan') || input.includes('path') || input.includes('roadmap')) {
      return {
        content: "I'd love to help create a personalized learning plan! To give you the best recommendations, I need to understand:\n\n🎯 **Your Goals:**\n• Career advancement\n• Personal enrichment\n• New hobby/passion\n• Professional certification\n\n⏰ **Time Commitment:**\n• How many hours per week?\n• Preferred session length?\n• Timeline for achieving goals?\n\n💰 **Budget Range:**\n• Comfortable investment per month?\n\nBased on this, I can suggest the perfect mentors and create a structured learning journey for you!",
        suggestions: [
          "I want career advancement",
          "Looking for a new hobby",
          "Need professional certification",
          "Help with time management"
        ]
      };
    }
    
    // Default response
    return {
      content: "I understand you're looking for guidance! I can help you with:\n\n🔍 **Finding Mentors:** Search by skill, location, rating, or price\n📚 **Skill Recommendations:** Trending skills and career paths\n📅 **Session Planning:** Schedule management and learning plans\n💬 **Platform Help:** How to use SkillBridge features\n⭐ **Reviews & Ratings:** Find the best-rated mentors\n\nWhat specific area would you like me to help you with?",
      suggestions: [
        "Find mentors near me",
        "What skills should I learn?",
        "Help with booking sessions",
        "Show platform features"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const quickActions = [
    { icon: Users, label: "Find Mentors", action: "Show me available mentors" },
    { icon: MapPin, label: "Near Me", action: "Find mentors near my location" },
    { icon: Star, label: "Top Rated", action: "Show highest rated mentors" },
    { icon: BookOpen, label: "Skills", action: "What skills are trending?" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bot className="h-6 w-6 text-purple-600" />
            <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
          </div>
          <h1 className="text-xl">AI Assistant</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent 
                className="p-4 text-center"
                onClick={() => handleSuggestionClick(action.action)}
              >
                <action.icon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">{action.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <span>Chat with AI Assistant</span>
              <Badge variant="secondary" className="ml-auto">
                <Zap className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.type === 'user' ? 'U' : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                        
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium">Suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything about skills, mentors, or learning..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}