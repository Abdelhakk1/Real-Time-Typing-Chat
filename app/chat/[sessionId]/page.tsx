'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Users, 
  Wifi, 
  WifiOff,
  User,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  isTyping: boolean;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [myText, setMyText] = useState('');
  const [partnerText, setPartnerText] = useState('');
  const [copied, setCopied] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  const myTextareaRef = useRef<HTMLTextAreaElement>(null);
  const partnerTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Use the dedicated WebSocket server URL
    const socketUrl = 'https://realtime-chat-websocket-production.up.railway.app';
    console.log('Connecting to WebSocket server at:', socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: false,
      path: '/socket.io/',
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setConnectionError(false);
      newSocket.emit('join-session', sessionId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError(true);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    newSocket.on('user-joined', (data: { users: User[], currentUser: User }) => {
      console.log('User joined:', data);
      setUsers(data.users);
      setCurrentUser(data.currentUser);
    });

    newSocket.on('user-left', (data: { users: User[] }) => {
      console.log('User left:', data);
      setUsers(data.users);
    });

    newSocket.on('text-update', (data: { userId: string, text: string }) => {
      if (data.userId !== currentUser?.id) {
        setPartnerText(data.text);
      }
    });

    newSocket.on('typing-status', (data: { userId: string, isTyping: boolean }) => {
      setUsers(prev => prev.map(user => 
        user.id === data.userId ? { ...user, isTyping: data.isTyping } : user
      ));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const handleTextChange = (text: string) => {
    setMyText(text);
    
    if (socket && isConnected) {
      socket.emit('text-change', { 
        sessionId, 
        text,
        userId: currentUser?.id 
      });
      
      // Send typing status
      socket.emit('typing', { 
        sessionId, 
        isTyping: text.length > 0,
        userId: currentUser?.id 
      });
    }
  };

  const copySessionLink = async () => {
    try {
      const link = window.location.href;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const goHome = () => {
    router.push('/');
  };

  const getPartnerUser = () => {
    return users.find(user => user.id !== currentUser?.id);
  };

  const partner = getPartnerUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              onClick={goHome}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Real-Time Chat</h1>
              <p className="text-sm text-gray-600">Session: {sessionId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-400" : connectionError ? "bg-red-400" : "bg-yellow-400"
              )}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : connectionError ? 'Connection Error' : 'Connecting...'}
              </span>
            </div>

            <Button
              onClick={copySessionLink}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Share Link'}</span>
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="mb-6 p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {users.length} {users.length === 1 ? 'user' : 'users'} connected
                </span>
              </div>
              
              {users.map(user => (
                <Badge 
                  key={user.id} 
                  variant={user.id === currentUser?.id ? "default" : "secondary"}
                  className="flex items-center space-x-1"
                >
                  {user.id === currentUser?.id ? <User className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  <span>{user.id === currentUser?.id ? 'You' : user.name}</span>
                  {user.isTyping && <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse ml-1"></div>}
                </Badge>
              ))}
            </div>

            {partner && (
              <div className="text-sm text-gray-600">
                {partner.isTyping ? (
                  <span className="flex items-center space-x-2">
                    <span>{partner.name} is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </span>
                ) : (
                  <span>Connected to {partner.name}</span>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Connection Error Debug */}
        {connectionError && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <div className="text-red-800">
              <h3 className="font-semibold mb-2">Connection Issue</h3>
              <p className="text-sm mb-2">Unable to connect to the WebSocket server. This might be due to:</p>
              <ul className="text-sm list-disc list-inside mb-3 space-y-1">
                <li>Server maintenance or downtime</li>
                <li>Network connectivity issues</li>
                <li>Firewall blocking WebSocket connections</li>
              </ul>
              <Button 
                onClick={() => window.location.reload()} 
                size="sm" 
                variant="outline"
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Retry Connection
              </Button>
            </div>
          </Card>
        )}

        {/* Chat Interface */}
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-280px)] min-h-[400px]">
          {/* My Text Area */}
          <Card className="flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h2 className="font-semibold text-gray-900">Your Text</h2>
                <Badge variant="outline" className="text-xs">
                  {myText.length} characters
                </Badge>
              </div>
            </div>
            <div className="flex-1 p-4">
              <textarea
                ref={myTextareaRef}
                value={myText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Start typing here... Your partner will see it in real-time!"
                className="w-full h-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-lg leading-relaxed"
                disabled={!isConnected}
              />
            </div>
          </Card>

          {/* Partner's Text Area */}
          <Card className="flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h2 className="font-semibold text-gray-900">
                  {partner ? `${partner.name}'s Text` : "Waiting for partner..."}
                </h2>
                <Badge variant="outline" className="text-xs">
                  {partnerText.length} characters
                </Badge>
              </div>
            </div>
            <div className="flex-1 p-4">
              <textarea
                ref={partnerTextareaRef}
                value={partnerText}
                readOnly
                placeholder={
                  partner 
                    ? `Waiting for ${partner.name} to start typing...`
                    : "Share the session link for someone to join and start typing!"
                }
                className="w-full h-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-lg leading-relaxed bg-transparent"
              />
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Real-time typing chat • No registration required • Share the link to invite others
          </p>
        </div>
      </div>
    </div>
  );
}