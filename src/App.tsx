import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { GuruDashboard } from './components/GuruDashboard';
import { ShishyaDashboard } from './components/ShishyaDashboard';
import { ChatInterface } from './components/ChatInterface';
import { SmartMatching } from './components/SmartMatching';
import { LocationSearch } from './components/LocationSearch';
import { SecurityVerification } from './components/SecurityVerification';
import { RealTimeChatHub } from './components/RealTimeChatHub';
import { ReviewSystem } from './components/ReviewSystem';
import { AIAssistant } from './components/AIAssistant';
import { FeaturesPage } from './components/FeaturesPage';
import { LoginPage } from './components/LoginPage';

type Page = 'landing' | 'login' | 'guru-auth' | 'shishya-auth' | 'guru-dashboard' | 'shishya-dashboard' | 'smart-matching' | 'location-search' | 'security-verification' | 'real-time-chat' | 'review-system' | 'ai-assistant' | 'features';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  userType: 'guru' | 'shishya';
  isAuthenticated: boolean;
}

interface ChatState {
  isOpen: boolean;
  recipientId: string;
  recipientName: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    recipientId: '',
    recipientName: ''
  });

  const handleBecomeGuru = () => {
    setCurrentPage('guru-auth');
  };

  const handleBecomeShishya = () => {
    setCurrentPage('shishya-auth');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setUser(null);
  };

  const handleAuth = (userData: User) => {
    setUser(userData);
    if (userData.userType === 'guru') {
      setCurrentPage('guru-dashboard');
    } else {
      setCurrentPage('shishya-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    setChatState({ isOpen: false, recipientId: '', recipientName: '' });
  };

  const handleOpenChat = (recipientId: string, recipientName: string) => {
    setChatState({
      isOpen: true,
      recipientId,
      recipientName
    });
  };

  const handleCloseChat = () => {
    setChatState({ isOpen: false, recipientId: '', recipientName: '' });
  };

  const handleFeatureNavigation = (feature: string) => {
    switch (feature) {
      case 'match':
        setCurrentPage('smart-matching');
        break;
      case 'location':
        setCurrentPage('location-search');
        break;
      case 'verify':
        setCurrentPage('security-verification');
        break;
      case 'chat':
        setCurrentPage('real-time-chat');
        break;
      case 'reviews':
        setCurrentPage('review-system');
        break;
      case 'assistant':
        setCurrentPage('ai-assistant');
        break;
      default:
        console.log('Unknown feature:', feature);
    }
  };

  const handleFeaturesNavigation = () => {
    setCurrentPage('features');
  };

  const handleHowItWorksScroll = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLoginNavigation = () => {
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && (
        <LandingPage
          onBecomeGuru={handleBecomeGuru}
          onBecomeShishya={handleBecomeShishya}
          onFeatureClick={handleFeatureNavigation}
          onFeaturesClick={handleFeaturesNavigation}
          onHowItWorksClick={handleHowItWorksScroll}
          onLoginClick={handleLoginNavigation}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onBack={handleBackToLanding}
          onBecomeGuru={handleBecomeGuru}
          onBecomeShishya={handleBecomeShishya}
        />
      )}

      {currentPage === 'guru-auth' && (
        <AuthForm
          userType="guru"
          onBack={handleBackToLanding}
          onAuth={handleAuth}
        />
      )}

      {currentPage === 'shishya-auth' && (
        <AuthForm
          userType="shishya"
          onBack={handleBackToLanding}
          onAuth={handleAuth}
        />
      )}

      {currentPage === 'guru-dashboard' && user && (
        <GuruDashboard
          user={user}
          onLogout={handleLogout}
          onOpenChat={handleOpenChat}
        />
      )}

      {currentPage === 'shishya-dashboard' && user && (
        <ShishyaDashboard
          user={user}
          onLogout={handleLogout}
          onOpenChat={handleOpenChat}
        />
      )}

      {currentPage === 'smart-matching' && (
        <SmartMatching onBack={handleBackToLanding} />
      )}

      {currentPage === 'location-search' && (
        <LocationSearch onBack={handleBackToLanding} />
      )}

      {currentPage === 'security-verification' && (
        <SecurityVerification onBack={handleBackToLanding} />
      )}

      {currentPage === 'real-time-chat' && (
        <RealTimeChatHub onBack={handleBackToLanding} />
      )}

      {currentPage === 'review-system' && (
        <ReviewSystem onBack={handleBackToLanding} />
      )}

      {currentPage === 'ai-assistant' && (
        <AIAssistant onBack={handleBackToLanding} />
      )}

      {currentPage === 'features' && (
        <FeaturesPage 
          onBack={handleBackToLanding} 
          onFeatureClick={handleFeatureNavigation}
        />
      )}

      {chatState.isOpen && user && (
        <ChatInterface
          recipientId={chatState.recipientId}
          recipientName={chatState.recipientName}
          currentUser={user}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}