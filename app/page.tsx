'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Zap, Copy, Check } from 'lucide-react';

export default function Home() {
  const [sessionId, setSessionId] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const createNewSession = () => {
    const newSessionId = nanoid(8);
    router.push(`/chat/${newSessionId}`);
  };

  const joinSession = () => {
    if (sessionId.trim()) {
      router.push(`/chat/${sessionId.trim()}`);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-8 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Real-Time
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Typing Chat</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience instant communication with character-by-character real-time typing. 
            No buttons, no delays—just pure, seamless conversation.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Sync</h3>
              <p className="text-gray-600 text-sm">See every keystroke in real-time as you type</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Two-Way Chat</h3>
              <p className="text-gray-600 text-sm">Both users can type simultaneously</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Registration</h3>
              <p className="text-gray-600 text-sm">Share a link and start chatting instantly</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Start Chatting</CardTitle>
              <CardDescription className="text-gray-600">
                Create a new session or join an existing one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={createNewSession}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create New Chat Session
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter session ID to join"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && joinSession()}
                  className="h-12 text-center text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  onClick={joinSession}
                  disabled={!sessionId.trim()}
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Join Session
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Share your session link with anyone to start a real-time conversation
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time connection ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}