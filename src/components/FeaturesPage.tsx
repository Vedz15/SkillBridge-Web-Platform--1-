import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  MapPin, 
  MessageCircle, 
  Shield, 
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Globe,
  Award,
  Smartphone,
  Brain,
  Lock,
  Heart,
  Lightbulb
} from 'lucide-react';

interface FeaturesPageProps {
  onBack: () => void;
  onFeatureClick: (feature: string) => void;
}

export function FeaturesPage({ onBack, onFeatureClick }: FeaturesPageProps) {
  const coreFeatures = [
    {
      id: 'match',
      icon: Users,
      title: 'Smart Matching',
      description: 'AI-powered algorithm connects you with the perfect mentor or learner based on skills, location, availability, and learning goals.',
      color: 'orange',
      benefits: ['99% compatibility rate', 'Instant recommendations', 'Continuous learning'],
      status: 'available'
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Find experts nearby or connect virtually. Interactive map shows mentors in your area with real-time availability.',
      color: 'purple',
      benefits: ['GPS-enabled search', 'Real-time locations', 'Flexible distance filters'],
      status: 'available'
    },
    {
      id: 'verify',
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Comprehensive verification system ensures safe interactions with identity checks, skill validation, and secure payments.',
      color: 'green',
      benefits: ['Identity verification', 'Skill certifications', 'Secure payments'],
      status: 'available'
    },
    {
      id: 'chat',
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Built-in messaging with AI translation, file sharing, and video calling capabilities to break down communication barriers.',
      color: 'blue',
      benefits: ['AI translation', 'File sharing', 'Video calling'],
      status: 'available'
    },
    {
      id: 'reviews',
      icon: Star,
      title: 'Review System',
      description: 'Comprehensive rating and feedback system helps build trust and helps users choose the right mentors for their learning journey.',
      color: 'yellow',
      benefits: ['Verified reviews', 'Detailed feedback', 'Trust scores'],
      status: 'available'
    },
    {
      id: 'assistant',
      icon: Zap,
      title: 'AI Assistant',
      description: 'Intelligent chatbot provides personalized recommendations, learning paths, and 24/7 support for your skill development journey.',
      color: 'indigo',
      benefits: ['24/7 support', 'Personalized paths', 'Smart recommendations'],
      status: 'available'
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Smart calendar integration with automatic timezone detection and conflict resolution.',
      color: 'emerald'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Advanced analytics to track learning progress and skill development over time.',
      color: 'rose'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Available in 12+ languages with real-time translation capabilities.',
      color: 'cyan'
    },
    {
      icon: Award,
      title: 'Skill Certifications',
      description: 'Official certificates and badges for completed learning milestones.',
      color: 'amber'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design works seamlessly across all devices and platforms.',
      color: 'violet'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'AI-powered learning paths that adapt to your pace and learning style.',
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; border: string; hover: string } } = {
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-50' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-50' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-50' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-50' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', hover: 'hover:bg-yellow-50' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', hover: 'hover:bg-indigo-50' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:bg-emerald-50' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200', hover: 'hover:bg-rose-50' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:bg-cyan-50' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', hover: 'hover:bg-amber-50' },
      violet: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200', hover: 'hover:bg-violet-50' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', hover: 'hover:bg-pink-50' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white">S</span>
          </div>
          <h1 className="text-xl">SkillBridge Features</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700 hover:from-orange-200 hover:to-purple-200">
            Complete Platform Overview
          </Badge>
          <h2 className="text-3xl lg:text-5xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
            Everything You Need to Learn & Teach
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            SkillBridge combines cutting-edge AI technology with human expertise to create the most comprehensive 
            skill-sharing platform. Discover, learn, and grow with features designed for modern learners and educators.
          </p>
        </div>

        {/* Core Interactive Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl mb-4">Interactive Core Features</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on any feature below to experience live demonstrations with real data
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-700 mt-4">
              ✅ All features are fully functional - try them now!
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature) => {
              const colors = getColorClasses(feature.color);
              const Icon = feature.icon;
              
              return (
                <Card 
                  key={feature.id}
                  className={`${colors.border} ${colors.hover} transition-all cursor-pointer hover:shadow-lg hover:scale-105`}
                  onClick={() => onFeatureClick(feature.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Live Demo
                      </Badge>
                    </div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-800">Key Benefits:</p>
                      <div className="space-y-1">
                        {feature.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Try {feature.title} →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Additional Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl mb-4">Additional Platform Features</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Supporting features that make SkillBridge the most comprehensive learning platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const colors = getColorClasses(feature.color);
              const Icon = feature.icon;
              
              return (
                <Card key={index} className={`${colors.border} ${colors.hover} transition-all`}>
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <h4 className="font-medium mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Platform Stats */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-orange-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl lg:text-3xl">Platform Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">10,000+</div>
                    <p className="text-orange-100">Active Users</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">500+</div>
                    <p className="text-orange-100">Expert Mentors</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">50+</div>
                    <p className="text-orange-100">Skill Categories</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">4.9⭐</div>
                    <p className="text-orange-100">Average Rating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl mb-4">Built with Modern Technology</h3>
            <p className="text-gray-600">Powered by cutting-edge tools for the best user experience</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'AI/ML', description: 'Smart matching & recommendations', icon: Brain },
              { name: 'Real-time', description: 'Instant messaging & updates', icon: Zap },
              { name: 'Security', description: 'End-to-end encryption', icon: Lock },
              { name: 'UX/UI', description: 'Intuitive & accessible design', icon: Heart }
            ].map((tech, index) => {
              const Icon = tech.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h4 className="font-medium mb-2">{tech.name}</h4>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="border-2 border-gradient-to-r from-orange-500 to-purple-600">
            <CardContent className="p-8">
              <Lightbulb className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h3 className="text-2xl lg:text-3xl mb-4">Ready to Start Learning?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of learners and educators who are already transforming their lives through SkillBridge. 
                Every feature you see here is ready to use today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={onBack}
                >
                  Get Started Now
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onFeatureClick('match')}
                >
                  Try Smart Matching
                  <Users className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}