import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { mockApiService } from '../services/mockApi';

interface ApiStatus {
  status: 'checking' | 'online' | 'offline' | 'error';
  message: string;
  responseTime?: number;
}

export function ApiHealthCheck() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: 'checking',
    message: 'Checking backend connection...'
  });

  const checkApiHealth = async () => {
    setApiStatus({ status: 'checking', message: 'Checking mock API service...' });
    
    const startTime = Date.now();
    
    try {
      const response = await mockApiService.checkHealth();
      const responseTime = Date.now() - startTime;
      
      setApiStatus({
        status: 'online',
        message: 'Mock API service is running (no backend server needed)',
        responseTime
      });
    } catch (error) {
      setApiStatus({
        status: 'error',
        message: 'Mock API service error'
      });
    }
  };

  useEffect(() => {
    checkApiHealth();
    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (apiStatus.status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (apiStatus.status) {
      case 'checking':
        return 'bg-blue-100 text-blue-700';
      case 'online':
        return 'bg-green-100 text-green-700';
      case 'offline':
        return 'bg-red-100 text-red-700';
      case 'error':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">

    </Card>
  );
}