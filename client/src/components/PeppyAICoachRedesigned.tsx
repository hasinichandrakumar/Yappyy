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

// Personalized Insights Component
const PersonalizedInsights = ({ userId }: { userId?: string }) => {
  const insights = [
    {
      type: 'trend',
      title: 'Confidence Growth',
      message: 'Your confidence has improved 34% over the last 3 weeks! You\'re speaking with more authority during presentations.',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      type: 'pattern',
      title: 'Speaking Pattern',
      message: 'I notice you tend to speak faster when discussing technical topics. Try pausing more between key points.',
      icon: Brain,
      color: 'text-blue-600'
    },
    {
      type: 'strength',
      title: 'Your Strength',
      message: 'Your storytelling ability is exceptional! You naturally use vivid imagery and emotional connection.',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <div className="flex items-start gap-3">
            <insight.icon className={`w-5 h-5 ${insight.color} mt-1`} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{insight.message}</p>
            </div>
          </div>
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

// Coaching Goal Buttons
const CoachingGoals = ({ onGoalSelect }: { onGoalSelect: (goal: string) => void }) => {
  const goals = [
    { id: 'confidence', label: 'Build Confidence', icon: Heart, color: 'bg-red-100 text-red-700' },
    { id: 'presentation', label: 'Presentation Skills', icon: Target, color: 'bg-blue-100 text-blue-700' },
    { id: 'storytelling', label: 'Storytelling', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
    { id: 'conversation', label: 'Conversation Skills', icon: MessageCircle, color: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {goals.map((goal, index) => (
        <motion.button
          key={goal.id}
          onClick={() => onGoalSelect(goal.id)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium hover:scale-105 transition-all ${goal.color}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <goal.icon className="w-4 h-4" />
          {goal.label}
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
      text: "Hi! I'm Peppy, your personal AI speech coach! 🎯 I'm here to help you become a more confident and effective speaker. What would you like to work on today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentCoachingMode, setCurrentCoachingMode] = useState('conversation');
  const [isTyping, setIsTyping] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<string | null>(null);



  const handleGoalSelection = (goal: string) => {
    setCurrentGoal(goal);
    
    const goalMessages = {
      confidence: "Excellent choice! Building confidence is crucial for effective speaking. Based on your recent sessions, I've noticed you're most confident when telling personal stories. Let's leverage that strength. What specific situation makes you feel nervous when speaking?",
      presentation: "Great! I've analyzed your presentation style over the past month. Your slides are well-structured, but I notice you tend to rush through transitions. Would you like to practice smoother slide transitions or work on engaging your audience better?",
      storytelling: "Perfect! You already have natural storytelling instincts - I've seen how you use vivid details in your practice sessions. Let's enhance your narrative arc and emotional connection. What story would you like to work on today?",
      conversation: "Wonderful! I've noticed you're great at listening but sometimes hesitate to join conversations. Based on your personality profile, you prefer thoughtful responses. Let's practice conversation starters that feel authentic to you."
    };

    const goalMessage = {
      id: Date.now(),
      text: goalMessages[goal as keyof typeof goalMessages] || "Let me help you with that specific goal!",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, goalMessage]);
  };

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

    // Simulate personalized AI response based on user history and patterns
    setTimeout(() => {
      const personalizedResponses = [
        "Based on your progress over the last 2 weeks, I can see you're becoming more comfortable with eye contact. That's a 28% improvement! Let's build on this momentum...",
        "I remember you mentioned feeling nervous about Q&A sessions last month. Your recent practice shows you're handling unexpected questions much better. Your pause-and-think technique is working well.",
        "Your vocal variety has improved significantly since we started working together. I notice you naturally lower your voice for emphasis now - that's excellent instinctual coaching!",
        "Looking at your speaking patterns, you're most engaged when discussing topics you're passionate about. Your energy level jumps 40% and your gestures become more natural. Let's channel that energy into all your presentations."
      ];
      
      const randomResponse = personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
      
      const aiResponse = {
        id: Date.now() + 1,
        text: randomResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Coaching Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <PeppyParrot mood="encouraging" size="small" isAnimated={true} />
                  <div>
                    <h3 className="text-lg font-semibold">Your Personal Speech Coach</h3>
                    <p className="text-purple-100 text-sm">Personalized coaching based on your unique patterns</p>
                  </div>
                  {currentGoal && (
                    <Badge className="bg-white/20 text-white ml-auto">
                      {currentGoal.charAt(0).toUpperCase() + currentGoal.slice(1)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {!currentGoal && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">What would you like to work on today?</h4>
                    <CoachingGoals onGoalSelect={handleGoalSelection} />
                  </div>
                )}
                
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
                      <span>Peppy is analyzing your patterns...</span>
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
                      placeholder="Share your speaking challenges or ask for personalized advice..."
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

          {/* Sidebar with Personalized Insights */}
          <div className="space-y-6">
            {/* Your Progress Trends */}
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="w-5 h-5" />
                  Your Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PersonalizedInsights userId={user?.id} />
              </CardContent>
            </Card>

            {/* Weekly Focus */}
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Target className="w-5 h-5" />
                  This Week's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">Reduce Filler Words</h4>
                    <p className="text-sm text-blue-600">Target: &lt;3 "um"s per minute</p>
                    <Progress value={75} className="h-2 mt-2" />
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-1">Eye Contact</h4>
                    <p className="text-sm text-green-600">Target: 70% audience engagement</p>
                    <Progress value={85} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Coaching Actions */}
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Play className="w-4 h-4 mr-2" />
                    Practice Session
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Update Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}