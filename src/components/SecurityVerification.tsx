import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { mockApiService } from '../services/mockApi';
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Upload, 
  Eye, 
  Lock, 
  CreditCard, 
  Phone, 
  Mail,
  FileText,
  Star,
  Users
} from 'lucide-react';

interface SecurityVerificationProps {
  onBack: () => void;
}

interface VerificationStatus {
  identity: 'pending' | 'verified' | 'rejected';
  phone: 'pending' | 'verified' | 'rejected';
  email: 'pending' | 'verified' | 'rejected';
  payment: 'pending' | 'verified' | 'rejected';
  background: 'pending' | 'verified' | 'rejected';
}

interface TrustScore {
  overall: number;
  identity: number;
  reviews: number;
  activity: number;
  response: number;
}

export function SecurityVerification({ onBack }: SecurityVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    identity: 'pending',
    phone: 'verified',
    email: 'verified',
    payment: 'pending',
    background: 'pending'
  });

  const [trustScore, setTrustScore] = useState<TrustScore>({
    overall: 85,
    identity: 90,
    reviews: 95,
    activity: 80,
    response: 75
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'verify' | 'security' | 'trust'>('overview');
  const [documentType, setDocumentType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading verification data
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data would be loaded here
      } catch (error) {
        console.error('Failed to load verification data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const calculateOverallProgress = () => {
    const statuses = Object.values(verificationStatus);
    const verifiedCount = statuses.filter(status => status === 'verified').length;
    return (verifiedCount / statuses.length) * 100;
  };

  const handleDocumentUpload = async () => {
    if (!documentType) return;
    
    setLoading(true);
    try {
      // Simulate document upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationStatus(prev => ({
        ...prev,
        identity: 'verified'
      }));
    } catch (error) {
      console.error('Document upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSetup = async () => {
    if (!paymentMethod) return;
    
    setLoading(true);
    try {
      // Simulate payment setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVerificationStatus(prev => ({
        ...prev,
        payment: 'verified'
      }));
    } catch (error) {
      console.error('Payment setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Security Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Verification Progress</span>
            <span className="font-medium">{Math.round(calculateOverallProgress())}% Complete</span>
          </div>
          <Progress value={calculateOverallProgress()} className="h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationStatus.phone)}
                  <span>Phone Verification</span>
                </div>
                <Badge className={getStatusColor(verificationStatus.phone)}>
                  {verificationStatus.phone}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationStatus.email)}
                  <span>Email Verification</span>
                </div>
                <Badge className={getStatusColor(verificationStatus.email)}>
                  {verificationStatus.email}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationStatus.identity)}
                  <span>Identity Verification</span>
                </div>
                <Badge className={getStatusColor(verificationStatus.identity)}>
                  {verificationStatus.identity}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationStatus.payment)}
                  <span>Payment Security</span>
                </div>
                <Badge className={getStatusColor(verificationStatus.payment)}>
                  {verificationStatus.payment}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationStatus.background)}
                  <span>Background Check</span>
                </div>
                <Badge className={getStatusColor(verificationStatus.background)}>
                  {verificationStatus.background}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Trust Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-600 mb-2">{trustScore.overall}/100</div>
            <p className="text-gray-600">Excellent Trust Rating</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Identity Verification</span>
              <div className="flex items-center space-x-2">
                <Progress value={trustScore.identity} className="w-20 h-2" />
                <span className="text-sm font-medium">{trustScore.identity}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>User Reviews</span>
              <div className="flex items-center space-x-2">
                <Progress value={trustScore.reviews} className="w-20 h-2" />
                <span className="text-sm font-medium">{trustScore.reviews}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Platform Activity</span>
              <div className="flex items-center space-x-2">
                <Progress value={trustScore.activity} className="w-20 h-2" />
                <span className="text-sm font-medium">{trustScore.activity}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Response Rate</span>
              <div className="flex items-center space-x-2">
                <Progress value={trustScore.response} className="w-20 h-2" />
                <span className="text-sm font-medium">{trustScore.response}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      {/* Identity Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Identity Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Upload a government-issued ID to verify your identity and build trust with other users.</p>
          
          <div className="space-y-4">
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers-license">Driver's License</SelectItem>
                <SelectItem value="national-id">National ID Card</SelectItem>
                <SelectItem value="voter-id">Voter ID Card</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</p>
            </div>
            
            <Button 
              onClick={handleDocumentUpload} 
              disabled={!documentType || loading}
              className="w-full"
            >
              {loading ? 'Uploading...' : 'Verify Identity'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Set up secure payment methods for safe transactions.</p>
          
          <div className="space-y-4">
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank-account">Bank Account</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Digital Wallet</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Card/Account Number" />
              <Input placeholder="Expiry/IFSC" />
            </div>
            
            <Button 
              onClick={handlePaymentSetup} 
              disabled={!paymentMethod || loading}
              className="w-full"
            >
              {loading ? 'Setting up...' : 'Setup Payment Security'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Privacy Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Profile Visibility</h4>
                <p className="text-sm text-gray-600">Control who can see your profile</p>
              </div>
              <Select defaultValue="public">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Contact Information</h4>
                <p className="text-sm text-gray-600">Show phone and email to others</p>
              </div>
              <Select defaultValue="verified">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Location Sharing</h4>
                <p className="text-sm text-gray-600">Share your location with potential matches</p>
              </div>
              <Select defaultValue="approximate">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">Exact</SelectItem>
                  <SelectItem value="approximate">Approximate</SelectItem>
                  <SelectItem value="city">City Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Security Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">End-to-End Encryption</h4>
                  <p className="text-sm text-gray-600">All messages are encrypted</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Extra security for your account</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Secure Payment Processing</h4>
                  <p className="text-sm text-gray-600">PCI DSS compliant payments</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Protected</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Report & Block System</h4>
                  <p className="text-sm text-gray-600">Report suspicious activity</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTrust = () => (
    <div className="space-y-6">
      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Community Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Respectful Communication</h4>
              <p className="text-sm text-blue-800">Maintain professional and respectful communication with all users.</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Authentic Profiles</h4>
              <p className="text-sm text-green-800">Use real information and photos to build trust in the community.</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Quality Service</h4>
              <p className="text-sm text-purple-800">Deliver high-quality services and maintain professional standards.</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Timely Response</h4>
              <p className="text-sm text-orange-800">Respond to messages and requests in a timely manner.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Always verify the identity of users before meeting in person</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Meet in public places for initial consultations</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Use the platform's built-in payment system for transactions</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Report any suspicious behavior or inappropriate content</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Keep personal financial information private</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto w-full">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
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
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Secure & Trusted Platform
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your safety and security are our top priorities. Manage your verification status, 
              privacy settings, and trust score to build confidence in the SkillBridge community.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <div className="flex space-x-1">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Button>
                <Button
                  variant={activeTab === 'verify' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('verify')}
                >
                  Verification
                </Button>
                <Button
                  variant={activeTab === 'security' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </Button>
                <Button
                  variant={activeTab === 'trust' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('trust')}
                >
                  Trust & Safety
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'verify' && renderVerification()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'trust' && renderTrust()}
          </div>
        </div>
      </main>
    </div>
  );
}