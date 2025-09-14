import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  X, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Bot,
  Languages,
  Star,
  Calendar,
  Video,
  Phone
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'ai';
  translated?: boolean;
}

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  currentUser: any;
  onClose: () => void;
}

export function ChatInterface({ recipientId, recipientName, currentUser, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'system',
      senderName: 'System',
      content: `Chat started with ${recipientName}. Feel free to discuss your learning goals and schedule!`,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'system'
    },
    {
      id: '2',
      senderId: recipientId,
      senderName: recipientName,
      content: 'Hi! Thanks for your interest in my React course. What\'s your current experience level?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      type: 'text'
    },
    {
      id: '3',
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: 'Hello! I\'m a complete beginner but very motivated to learn. I have some basic HTML/CSS knowledge.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      type: 'text'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response after a short delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: recipientId,
        senderName: recipientName,
        content: 'That sounds great! I think we can start with React fundamentals. When would you like to schedule our first session?',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleAiAssist = () => {
    const aiMessage: Message = {
      id: Date.now().toString(),
      senderId: 'ai',
      senderName: 'AI Assistant',
      content: 'Based on your conversation, I suggest asking about:\n• Preferred learning schedule\n• Course duration and structure\n• Prerequisites and materials needed\n• Practice projects included',
      timestamp: new Date(),
      type: 'ai'
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isCurrentUser = (senderId: string) => senderId === currentUser.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Chat Header */}
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-orange-500 text-white">
                  {recipientName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{recipientName}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* AI Tools Bar */}
        <div className="px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAiAssist}
              className={`${isAiEnabled ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTranslationEnabled(!isTranslationEnabled)}
              className={`${isTranslationEnabled ? 'bg-green-100 text-green-700' : ''}`}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'system' && (
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      {message.content}
                    </Badge>
                  </div>
                )}
                
                {message.type === 'ai' && (
                  <div className="flex justify-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">AI Assistant</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                )}

                {message.type === 'text' && (
                  <div className={`flex ${isCurrentUser(message.senderId) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-md ${isCurrentUser(message.senderId) ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className={`text-xs ${isCurrentUser(message.senderId) ? 'bg-purple-500' : 'bg-orange-500'} text-white`}>
                          {message.senderName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg px-3 py-2 ${
                        isCurrentUser(message.senderId) 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${isCurrentUser(message.senderId) ? 'text-purple-100' : 'text-gray-500'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                          {isTranslationEnabled && (
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                              <Languages className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 border rounded-lg px-3 py-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="border-0 focus:ring-0 focus:outline-none"
                />
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2 mt-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Rate Session
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}