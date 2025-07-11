import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, Target, Sparkles, Heart, 
  Award, MessageCircle, BarChart3, Zap, Star,
  ChevronRight, Play, Pause, Volume2, Mic, 
  Send, Timer, Eye, Trophy, Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

// Enhanced Peppy Parrot Component with Multiple Moods
const PeppyParrot = ({ 
  mood = 'happy', 
  size = 'large',
  isAnimated = true 
}: { 
  mood?: 'happy' | 'thinking' | 'excited' | 'encouraging' | 'proud';
  size?: 'small' | 'medium' | 'large';
  isAnimated?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-40 h-40'
  };

  const sizePixels = {
    small: { width: 64, height: 64 },
    medium: { width: 96, height: 96 },
    large: { width: 160, height: 160 }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, 
            rgba(139, 92, 246, 0.3) 0%, 
            rgba(219, 39, 119, 0.2) 50%, 
            rgba(59, 130, 246, 0.1) 100%)`
        }}
        animate={{
          scale: isAnimated ? [1, 1.1, 1] : 1,
          opacity: isAnimated ? [0.6, 0.8, 0.6] : 0.6
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Peppy Canvas */}
      <canvas
        ref={canvasRef}
        className={`${sizeClasses[size]} relative z-10 drop-shadow-lg`}
        style={{
          filter: 'drop-shadow(0 8px 16px rgba(139, 92, 246, 0.3))'
        }}
      />
      
      {/* Mood Indicator */}
      <motion.div
        className="absolute -top-2 -right-2 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
          AI
        </div>
      </motion.div>
    </div>
  );
};

// Live Metrics Component
const LiveMetrics = () => {
  const [metrics, setMetrics] = useState({
    confidence: 85,
    clarity: 78,
    engagement: 92,
    pace: 76
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(metrics).map(([key, value]) => (
        <motion.div
          key={key}
          className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {key}
            </span>
            <span className="text-lg font-bold text-purple-600">
              {value}%
            </span>
          </div>
          <Progress value={value} className="h-2" />
        </motion.div>
      ))}
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ 
  message, 
  isUser = false, 
  timestamp 
}: { 
  message: string; 
  isUser?: boolean; 
  timestamp?: string;
}) => (
  <motion.div
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
      isUser 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
        : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-purple-200'
    }`}>
      <p className="text-sm leading-relaxed">{message}</p>
      {timestamp && (
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {timestamp}
        </p>
      )}
    </div>
  </motion.div>
);

// Quick Action Buttons
const QuickActions = ({ onActionClick }: { onActionClick: (action: string) => void }) => {
  const actions = [
    { id: 'practice', label: 'Start Practice', icon: Play },
    { id: 'feedback', label: 'Get Feedback', icon: MessageCircle },
    { id: 'analyze', label: 'Analyze Voice', icon: BarChart3 },
    { id: 'tips', label: 'Quick Tips', icon: Sparkles }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={() => onActionClick(action.id)}
          className="flex items-center gap-2 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-purple-700 hover:bg-white/80 border border-purple-200 transition-all"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </motion.button>
      ))}
    </div>
  );
};

export default function PeppyAICoachRedesigned() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Peppy, your AI speech coach! 🎯 Ready to improve your speaking skills together?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentTab, setCurrentTab] = useState('chat');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "Great question! Let me analyze that and provide personalized feedback based on your speech patterns...",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      practice: "Perfect! Let's start a practice session. Choose a topic you'd like to work on today.",
      feedback: "I'd love to give you feedback! Please record yourself speaking or ask me about a specific area.",
      analyze: "Great! I can analyze your voice patterns, pace, and clarity. Start speaking and I'll listen!",
      tips: "Here are 3 quick tips: 1) Speak slower for clarity 2) Use pauses effectively 3) Maintain eye contact!"
    };

    const actionMessage = {
      id: Date.now(),
      text: actionMessages[action as keyof typeof actionMessages] || "Let me help you with that!",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, actionMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="text-center py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PeppyParrot mood="happy" size="large" isAnimated={true} />
        </motion.div>
        
        <motion.h1
          className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mt-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Meet Peppy
        </motion.h1>
        
        <motion.p
          className="text-xl text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your Revolutionary Deep Learning AI Speech Coach
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm">
            <Brain className="w-4 h-4 mr-2" />
            Neural Network v3.0 • Multi-Modal Analysis • Transformer Models
          </Badge>
        </motion.div>
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-purple-200">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat with Peppy
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Live Analysis
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chat Area */}
              <div className="lg:col-span-2">
                <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <PeppyParrot mood="happy" size="small" isAnimated={true} />
                      <div>
                        <h3 className="text-lg font-semibold">Chat with Peppy</h3>
                        <p className="text-purple-100 text-sm">AI-powered speech coaching</p>
                      </div>
                      <Badge className="bg-green-500 text-white ml-auto">
                        Live AI
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <QuickActions onActionClick={handleQuickAction} />
                    
                    {/* Messages Area */}
                    <div className="h-96 overflow-y-auto mb-4 space-y-2">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message.text}
                          isUser={message.isUser}
                          timestamp={message.timestamp}
                        />
                      ))}
                      
                      {isTyping && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <PeppyParrot mood="thinking" size="small" />
                          <span>Peppy is typing...</span>
                          <motion.div
                            className="flex gap-1"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                          </motion.div>
                        </div>
                      )}
                    </div>
                    
                    {/* Input Area */}
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Ask Peppy anything about speech coaching..."
                          className="pr-12 bg-white/80 border-purple-200"
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-600"
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : ''}`} />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* AI Insights */}
                <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Brain className="w-5 h-5" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Your confidence has improved 23% this week!</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span>Focus on reducing filler words</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>Speaking pace is optimal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <BarChart3 className="w-5 h-5" />
                      Today's Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Session Time</span>
                          <span>15 min</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Goals Completed</span>
                          <span>3/5</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Live Analysis Tab */}
          <TabsContent value="live">
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Real-Time Speech Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LiveMetrics />
                <div className="mt-6 text-center">
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge className="bg-yellow-100 text-yellow-800">First Session Complete</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Week Streak</Badge>
                    <Badge className="bg-green-100 text-green-800">Confidence Boost</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">+23%</div>
                  <p className="text-sm text-gray-600">Overall confidence this week</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-blue-500" />
                    Practice Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.5h</div>
                  <p className="text-sm text-gray-600">Total practice time</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}