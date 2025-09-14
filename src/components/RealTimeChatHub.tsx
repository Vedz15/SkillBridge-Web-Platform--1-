import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { mockApiService } from '../services/mockApi';
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Search, 
  Globe, 
  Users, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Settings,
  UserPlus,
  Filter,
  CheckCheck,
  Check,
  Circle,
  Languages,
  Volume2,
  Star,
  AlertCircle
} from 'lucide-react';

interface RealTimeChatHubProps {
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  originalContent?: string;
  translatedTo?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file' | 'voice';
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
  language?: string;
}

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  lastSeen?: string;
  skills: string[];
}

export function RealTimeChatHub({ onBack }: RealTimeChatHubProps) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'online' | 'groups'>('chats');
  const [translationLanguage, setTranslationLanguage] = useState('english');
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [realtimeInterval, setRealtimeInterval] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatData();
    startRealtimeUpdates();
    
    return () => {
      if (realtimeInterval) {
        clearInterval(realtimeInterval);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    setLoading(true);
    try {
      // Simulate loading chat data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock chat rooms
      setChatRooms([
        {
          id: '1',
          name: 'Rajesh Kumar',
          type: 'direct',
          participants: ['1', 'current'],
          lastMessage: 'Sure, I can help with your React project',
          lastMessageTime: '2 min ago',
          unreadCount: 2,
          isOnline: true,
          avatar: '',
          language: 'hindi'
        },
        {
          id: '2',
          name: 'Priya Sharma',
          type: 'direct',
          participants: ['2', 'current'],
          lastMessage: 'When can we schedule the cooking lesson?',
          lastMessageTime: '15 min ago',
          unreadCount: 0,
          isOnline: true,
          avatar: '',
          language: 'english'
        },
        {
          id: '3',
          name: 'Web Development Group',
          type: 'group',
          participants: ['1', '2', '3', 'current'],
          lastMessage: 'Check out this new framework!',
          lastMessageTime: '1 hour ago',
          unreadCount: 5,
          isOnline: false,
          avatar: ''
        },
        {
          id: '4',
          name: 'Amit Patel',
          type: 'direct',
          participants: ['4', 'current'],
          lastMessage: 'Thanks for the guitar lesson yesterday',
          lastMessageTime: '3 hours ago',
          unreadCount: 0,
          isOnline: false,
          avatar: '',
          language: 'gujarati'
        }
      ]);

      // Mock online users
      setOnlineUsers([
        {
          id: '5',
          name: 'Sarah Johnson',
          avatar: '',
          status: 'online',
          skills: ['Yoga', 'Meditation']
        },
        {
          id: '6',
          name: 'Michael Chen',
          avatar: '',
          status: 'away',
          lastSeen: '5 min ago',
          skills: ['Photography', 'Video Editing']
        },
        {
          id: '7',
          name: 'Lisa Anderson',
          avatar: '',
          status: 'online',
          skills: ['Language Learning', 'Spanish']
        },
        {
          id: '8',
          name: 'David Kumar',
          avatar: '',
          status: 'online',
          skills: ['Web Development', 'React']
        },
        {
          id: '9',
          name: 'Maria Garcia',
          avatar: '',
          status: 'busy',
          skills: ['Cooking', 'Baking']
        },
        {
          id: '10',
          name: 'Alex Thompson',
          avatar: '',
          status: 'online',
          skills: ['Music', 'Guitar']
        }
      ]);

    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    setLoading(true);
    try {
      // Simulate loading messages
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: '1',
          senderName: 'Rajesh Kumar',
          content: 'Hi! I saw your request for React help. I can definitely assist you.',
          originalContent: 'नमस्ते! मैंने React की मदद के लिए आपका अनुरोध देखा। मैं निश्चित रूप से आपकी सहायता कर सकता हूं।',
          translatedTo: 'english',
          timestamp: '10:30 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          senderId: 'current',
          senderName: 'You',
          content: 'That\'s great! I\'m working on a component library and need some guidance.',
          timestamp: '10:32 AM',
          status: 'delivered',
          type: 'text'
        },
        {
          id: '3',
          senderId: '1',
          senderName: 'Rajesh Kumar',
          content: 'Perfect! Component libraries are my specialty. What specific challenges are you facing?',
          originalContent: 'बिल्कुल सही! कंपोनेंट लाइब्रेरी मेरी विशेषता है। आप किन विशिष्ट चुनौतियों का सामना कर रहे हैं?',
          translatedTo: 'english',
          timestamp: '10:35 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '4',
          senderId: 'current',
          senderName: 'You',
          content: 'I\'m struggling with prop types and component composition. Can we set up a call?',
          timestamp: '10:37 AM',
          status: 'sent',
          type: 'text'
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat: ChatRoom) => {
    setSelectedChat(chat);
    loadMessages(chat.id);
    // Mark messages as read
    setChatRooms(prev => 
      prev.map(room => 
        room.id === chat.id ? { ...room, unreadCount: 0 } : room
      )
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessages(prev => 
      prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      )
    );

    // Simulate typing indicator and response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTyping(false);

    // Auto-translate if enabled
    let responseContent = "I understand! Let me help you with that.";
    let originalContent = undefined;
    let translatedTo = undefined;

    if (selectedChat.language && selectedChat.language !== 'english' && isTranslationEnabled) {
      originalContent = getTranslatedResponse(selectedChat.language);
      translatedTo = 'english';
    }

    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      senderId: selectedChat.participants[0],
      senderName: selectedChat.name,
      content: responseContent,
      originalContent,
      translatedTo,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      type: 'text'
    };

    setMessages(prev => [...prev, responseMessage]);
  };

  const getTranslatedResponse = (language: string) => {
    const responses = {
      hindi: 'मैं समझ गया! मैं इसमें आपकी मदद करता हूं।',
      gujarati: 'હું સમજી ગયો! મને તે સાથે તમારી મદદ કરવા દો.',
      spanish: '¡Entiendo! Déjame ayudarte con eso.',
      french: 'Je comprends! Laisse-moi t\'aider avec ça.'
    };
    return responses[language as keyof typeof responses] || responses.hindi;
  };

  const startRealtimeUpdates = () => {
    // Simulate real-time updates every 10-15 seconds
    const interval = setInterval(() => {
      simulateRealtimeActivity();
    }, Math.random() * 10000 + 10000); // 10-20 seconds
    
    setRealtimeInterval(interval);
  };

  const simulateRealtimeActivity = () => {
    const activities = [
      'new_message',
      'user_online',
      'user_offline',
      'typing_indicator'
    ];
    
    const activity = activities[Math.floor(Math.random() * activities.length)];
    
    switch (activity) {
      case 'new_message':
        simulateIncomingMessage();
        break;
      case 'user_online':
        simulateUserStatusChange('online');
        break;
      case 'user_offline':
        simulateUserStatusChange('offline');
        break;
      case 'typing_indicator':
        simulateTypingFromOthers();
        break;
    }
  };

  const simulateIncomingMessage = () => {
    // Only send messages to existing chats, not the currently selected one
    const otherChats = chatRooms.filter(chat => chat.id !== selectedChat?.id);
    if (otherChats.length === 0) return;
    
    const randomChat = otherChats[Math.floor(Math.random() * otherChats.length)];
    const incomingMessages = [
      "Hey! Are you available for a quick session?",
      "Thanks for the lesson yesterday, it was really helpful!",
      "Can we schedule our next session?",
      "I have a question about what we discussed.",
      "Looking forward to our next meeting!",
      "Just wanted to say thank you for your guidance.",
      "Are you free this weekend for a session?",
      "Can you help me with this project?"
    ];
    
    const randomMessage = incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
    
    // Update chat room with new message
    setChatRooms(prev => 
      prev.map(room => 
        room.id === randomChat.id ? {
          ...room,
          lastMessage: randomMessage,
          lastMessageTime: 'now',
          unreadCount: room.unreadCount + 1
        } : room
      )
    );
    
    // Add notification
    setNotifications(prev => [...prev, `New message from ${randomChat.name}`]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const simulateUserStatusChange = (status: 'online' | 'offline') => {
    setOnlineUsers(prev => {
      const updatedUsers = [...prev];
      const randomIndex = Math.floor(Math.random() * updatedUsers.length);
      
      if (status === 'online') {
        updatedUsers[randomIndex] = {
          ...updatedUsers[randomIndex],
          status: 'online'
        };
        setNotifications(prevNotifs => [...prevNotifs, `${updatedUsers[randomIndex].name} is now online`]);
      } else {
        updatedUsers[randomIndex] = {
          ...updatedUsers[randomIndex],
          status: 'away',
          lastSeen: 'Just now'
        };
      }
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 3000);
      
      return updatedUsers;
    });
  };

  const simulateTypingFromOthers = () => {
    if (selectedChat && Math.random() > 0.7) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  };

  const handleStartChatWithUser = (user: OnlineUser) => {
    // Check if chat already exists
    const existingChat = chatRooms.find(chat => 
      chat.name === user.name && chat.type === 'direct'
    );
    
    if (existingChat) {
      handleChatSelect(existingChat);
      setActiveTab('chats');
      return;
    }
    
    // Create new chat room
    const newChat: ChatRoom = {
      id: `chat-${Date.now()}`,
      name: user.name,
      type: 'direct',
      participants: [user.id, 'current'],
      lastMessage: '',
      lastMessageTime: 'now',
      unreadCount: 0,
      isOnline: user.status === 'online',
      avatar: user.avatar,
      language: 'english' // Default, could be enhanced with user preferences
    };
    
    setChatRooms(prev => [newChat, ...prev]);
    setMessages([]); // Clear messages for new chat
    setSelectedChat(newChat);
    setActiveTab('chats');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-300" />;
    }
  };

  const filteredChats = chatRooms.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOnlineUsers = onlineUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSidebar = () => (
    <div className="w-80 border-r bg-white flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <h2>Real-time Chat</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <Button
          variant={activeTab === 'chats' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('chats')}
          className="flex-1 rounded-none"
        >
          Chats
        </Button>
        <Button
          variant={activeTab === 'online' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('online')}
          className="flex-1 rounded-none"
        >
          Online
        </Button>
        <Button
          variant={activeTab === 'groups' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('groups')}
          className="flex-1 rounded-none"
        >
          Groups
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {activeTab === 'chats' && (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{chat.name}</h4>
                        <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {chat.language && (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            {chat.language}
                          </Badge>
                        )}
                        {chat.type === 'group' && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Group
                          </Badge>
                        )}
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'online' && (
            <div className="space-y-2">
              <div className="px-3 py-2 text-sm text-gray-600 border-b">
                {filteredOnlineUsers.filter(u => u.status === 'online').length} users online now
              </div>
              {filteredOnlineUsers
          .sort((a, b) => {
            if (a.status === 'online' && b.status !== 'online') return -1;
            if (a.status !== 'online' && b.status === 'online') return 1;
            return 0;
          })
          .map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-l-2 border-transparent hover:border-blue-200"
                  onClick={() => handleStartChatWithUser(user)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                        user.status === 'online' ? 'bg-green-500 animate-pulse' : 
                        user.status === 'away' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{user.name}</h4>
                        {user.status === 'online' && (
                          <span className="text-xs text-green-600">• Active now</span>
                        )}
                        {user.status === 'away' && user.lastSeen && (
                          <span className="text-xs text-gray-500">• {user.lastSeen}</span>
                        )}
                        {user.status === 'busy' && (
                          <span className="text-xs text-red-500">• Busy</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {user.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.skills.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Button 
                        size="sm" 
                        variant={user.status === 'online' ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartChatWithUser(user);
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      {user.status === 'online' && (
                        <span className="text-xs text-green-600">Available</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredOnlineUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-2">
              {filteredChats.filter(chat => chat.type === 'group').map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>
                        <Users className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{chat.name}</h4>
                      <p className="text-sm text-gray-600">{chat.participants.length} members</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderChatArea = () => {
    if (!selectedChat) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto" />
            <div>
              <h3 className="text-lg">Select a conversation</h3>
              <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                <div className="flex items-center space-x-2">
                  {selectedChat.isOnline ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Last seen 2 hours ago</span>
                  )}
                  {selectedChat.language && (
                    <Badge variant="outline" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      {selectedChat.language}
                    </Badge>
                  )}
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
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Translation Controls */}
          {isTranslationEnabled && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Auto-translation enabled</span>
                </div>
                <Select value={translationLanguage} onValueChange={setTranslationLanguage}>
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] space-y-1`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.senderId === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.originalContent && message.translatedTo && (
                      <div className="space-y-2">
                        <div className="text-xs opacity-75 flex items-center space-x-1">
                          <Languages className="h-3 w-3" />
                          <span>Translated from {selectedChat.language}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            title="Listen to original"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs opacity-75 italic border-l-2 border-white/30 pl-2">
                          {message.originalContent}
                        </p>
                        <Separator className="my-2" />
                      </div>
                    )}
                    <p>{message.content}</p>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs text-gray-500 ${
                    message.senderId === 'current' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{message.timestamp}</span>
                    {message.senderId === 'current' && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[40px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Mic className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {isTranslationEnabled && (
            <div className="mt-2 text-xs text-gray-500 flex items-center space-x-2">
              <AlertCircle className="h-3 w-3" />
              <span>Messages will be auto-translated for better communication</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Real-time Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-right"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm">{notification}</span>
            </div>
          </div>
        ))}
      </div>

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
          <div className="flex-1" />
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTranslationEnabled(!isTranslationEnabled)}
              className={isTranslationEnabled ? 'bg-blue-100 text-blue-700' : ''}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translation {isTranslationEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="h-[calc(100vh-4rem)] flex">
        {renderSidebar()}
        {renderChatArea()}
      </div>
    </div>
  );
}