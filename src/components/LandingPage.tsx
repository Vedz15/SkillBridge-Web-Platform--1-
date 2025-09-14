import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { mockApiService } from "../services/mockApi";
import { Star, Users, MapPin, MessageCircle, Shield, Zap } from "lucide-react";

interface LandingPageProps {
  onBecomeGuru: () => void;
  onBecomeShishya: () => void;
  onFeatureClick: (feature: string) => void;
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onLoginClick: () => void;
}

export function LandingPage({ onBecomeGuru, onBecomeShishya, onFeatureClick, onFeaturesClick, onHowItWorksClick, onLoginClick }: LandingPageProps) {

  const handleFeatureClick = (feature: string) => {
    // Navigate to feature page instead of showing alert
    onFeatureClick(feature);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white">S</span>
            </div>
            <span className="text-xl">SkillBridge</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onFeaturesClick}>Features</Button>
            <Button variant="ghost" onClick={onHowItWorksClick}>How it Works</Button>
            <Button variant="outline" onClick={onLoginClick}>Login</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                  Connecting Knowledge & Growth
                </Badge>
                <h1 className="text-4xl lg:text-6xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-orange-600 underline">
                  SkillBridge
                </h1>
                <h2 className="text-xl lg:text-2xl text-gray-600">
                  Bridging Skills, Connecting People
                </h2>
                <p className="text-lg text-gray-600 max-w-lg">
                  Join as a Guru to share knowledge and earn, or as a Shishya to learn from experts nearby. 
                  Transform skills into opportunities.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={onBecomeGuru}
                >
                  Become a Guru
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50"
                  onClick={onBecomeShishya}
                >
                  Become a Shishya
                  <Users className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>10k+ Active Users</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Verified Profiles</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1631061184412-b18f5fb1dc70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdW4lMjBjb2xvcmZ1bCUyMGNhcnRvb24lMjBsZWFybmluZyUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NTc4NDk4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fun colorful cartoon learning illustration"
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
              />
              <div 
                className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-110"
                onClick={() => onFeatureClick('chat')}
              >
                <MessageCircle className="h-6 w-6 text-orange-500" />
              </div>
              <div 
                className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-110"
                onClick={() => onFeatureClick('location')}
              >
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl lg:text-4xl">How SkillBridge Works</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes skill sharing seamless, secure, and rewarding for everyone.
            </p>
          </div>



          <div className="text-center mb-8">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              ✅ Interactive Demo - Click any feature card below to see live data!
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-orange-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFeatureClick('match')}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h4>Smart Matching</h4>
                <p className="text-gray-600">AI connects you with the perfect mentor or learner based on skills, location, and goals.</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFeatureClick('location')}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h4>Location-Based</h4>
                <p className="text-gray-600">Find experts nearby or connect virtually. Flexible learning that fits your lifestyle.</p>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFeatureClick('verify')}>
              <CardContent 
                className="p-6 text-center space-y-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onFeatureClick('verify')}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4>Secure & Trusted</h4>
                <p className="text-gray-600">Verified profiles, secure payments, and built-in chat ensure safe interactions.</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFeatureClick('chat')}>
              <CardContent 
                className="p-6 text-center space-y-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onFeatureClick('chat')}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h4>Real-time Chat</h4>
                <p className="text-gray-600">Built-in messaging with AI translation breaks down language barriers.</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFeatureClick('reviews')}>
              <CardContent 
                className="p-6 text-center space-y-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onFeatureClick('reviews')}
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <h4>Review System</h4>
                <p className="text-gray-600">Rate and review experiences to build trust and help others choose the right mentor.</p>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFeatureClick('assistant')}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h4>AI Assistant</h4>
                <p className="text-gray-600">Get personalized recommendations and support from our intelligent chatbot.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <h3 className="text-3xl lg:text-4xl">Ready to Start Your Journey?</h3>
          <p className="text-xl opacity-90">
            Join thousands of Gurus and Shishyas already transforming their lives through skill sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-orange-600"
              onClick={onBecomeGuru}
            >
              Start Teaching Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-orange-600"
              onClick={onBecomeShishya}
            >
              Find Your Mentor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white">S</span>
            </div>
            <span className="text-xl text-white">SkillBridge</span>
          </div>
          <p className="text-sm">© 2025 SkillBridge. Bridging skills, connecting people across India.</p>
        </div>
      </footer>
    </div>
  );
}