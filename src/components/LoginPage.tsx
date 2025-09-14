import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ArrowLeft, Users, Zap } from "lucide-react";

interface LoginPageProps {
  onBack: () => void;
  onBecomeGuru: () => void;
  onBecomeShishya: () => void;
}

export function LoginPage({ onBack, onBecomeGuru, onBecomeShishya }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white">S</span>
            </div>
            <span className="text-xl">SkillBridge</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-20">
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Choose how you'd like to continue with SkillBridge
            </p>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            <Card className="border-orange-100 hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg">Continue as Guru</h3>
                    <p className="text-sm text-gray-600">Share your skills and earn</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={onBecomeGuru}
                >
                  Login as Guru
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg">Continue as Shishya</h3>
                    <p className="text-sm text-gray-600">Learn from experts nearby</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={onBecomeShishya}
                >
                  Login as Shishya
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500">
            <p>
              New to SkillBridge?{" "}
              <button 
                onClick={onBack}
                className="text-orange-600 hover:text-orange-700 underline"
              >
                Create an account from the homepage
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}