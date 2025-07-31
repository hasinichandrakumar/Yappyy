// Peppy AI Coach - Deep Learning Parrot Coach with Hyperpersonalization
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Brain, TrendingUp, Target, Sparkles, Heart, 
  Award, MessageCircle, BarChart3, Zap, Star,
  ChevronRight, Play, Pause, Volume2, Mic, LogIn, Home, User
} from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
// Removed Rive React wrapper - using native Rive canvas instead

// Peppy Parrot Native Rive Component
const PeppyParrot = ({ isAnimated = true, mood = 'happy', size = 'large' }: { 
  isAnimated?: boolean; 
  mood?: 'happy' | 'thinking' | 'excited' | 'encouraging' | 'proud' | 'thoughtful'; 
  size?: 'small' | 'medium' | 'large' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveInstanceRef = useRef<any>(null);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32', 
    large: 'w-48 h-48'
  };

  const sizePixels = {
    small: { width: 80, height: 80 },
    medium: { width: 128, height: 128 },
    large: { width: 192, height: 192 }
  };

  useEffect(() => {
    if (canvasRef.current && typeof window !== 'undefined' && (window as any).rive) {
      console.log('🎯 Initializing Rive animation...');
      
      const canvas = canvasRef.current;
      const { width, height } = sizePixels[size];
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      try {
        // Cleanup previous instance
        if (riveInstanceRef.current) {
          riveInstanceRef.current.cleanup();
        }

        // Create new Rive instance using the native canvas API
        riveInstanceRef.current = new (window as any).rive.Rive({
          src: '/assets/bird-4_1752167343494.riv',
          canvas: canvas,
          autoplay: true,
          onLoad: () => {
            console.log('🚀 Rive animation loaded successfully!');
            if (riveInstanceRef.current) {
              riveInstanceRef.current.resizeDrawingSurfaceToCanvas();
            }
          },
          onLoadError: (error: any) => {
            console.error('❌ Rive animation load error:', error);
          }
        });
        
      } catch (error) {
        console.error('❌ Error creating Rive instance:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (riveInstanceRef.current) {
        riveInstanceRef.current.cleanup();
        riveInstanceRef.current = null;
      }
    };
  }, [size]);

  return (
    <div className={`${sizeClasses[size]} mx-auto ${isAnimated ? 'transition-transform duration-300 hover:scale-110' : ''}`}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
};

interface PeppyPersonality {
  adaptiveStyle: 'encouraging' | 'challenging' | 'analytical' | 'nurturing';
  userPreferences: {
    feedbackTone: 'positive' | 'balanced' | 'direct';
    focusAreas: string[];
    motivationStyle: 'achievement' | 'growth' | 'connection';
  };
  learningModel: {
    sessionPatterns: any[];
    progressTrends: any[];
    personalizedInsights: any[];
  };
}

interface NeuralNetworkAnalysis {
  confidenceScore: number;
  improvementVelocity: number;
  personalizedGoals: {
    shortTerm: { goal: string; progress: number; priority: 'high' | 'medium' | 'low' }[];
    mediumTerm: { goal: string; progress: number; priority: 'high' | 'medium' | 'low' }[];
    longTerm: { goal: string; progress: number; priority: 'high' | 'medium' | 'low' }[];
  };
  adaptiveRecommendations: string[];
  encouragementMessages: string[];
  personalityInsights: {
    communicationStyle: string;
    strengthsProfile: string[];
    growthAreas: string[];
  };
}

interface PeppyResponse {
  message: string;
  emotion: 'excited' | 'encouraging' | 'proud' | 'thoughtful' | 'supportive';
  personalizedTips: string[];
  progressCelebration?: string;
  nextStepGuidance: string;
}

import { useAuth } from '@/hooks/useAuth';

export default function PeppyAICoach() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [peppyPersonality, setPeppyPersonality] = useState<PeppyPersonality>({
    adaptiveStyle: 'encouraging',
    userPreferences: {
      feedbackTone: 'positive',
      focusAreas: ['confidence', 'clarity', 'engagement'],
      motivationStyle: 'growth'
    },
    learningModel: {
      sessionPatterns: [],
      progressTrends: [],
      personalizedInsights: []
    }
  });

  const [neuralAnalysis, setNeuralAnalysis] = useState<NeuralNetworkAnalysis | null>(null);
  const [peppyResponse, setPeppyResponse] = useState<PeppyResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [peppyAnimation, setPeppyAnimation] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const queryClient = useQueryClient();

  // Get user sessions for personalization
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  // Get user progress data
  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    enabled: true
  });

  // Deep learning analysis mutation
  const analyzeWithPeppyMutation = useMutation({
    mutationFn: async (analysisData: any) => {
      return apiRequest('/api/peppy-deep-learning-analysis', {
        method: 'POST',
        body: JSON.stringify({
          sessions: sessions || [],
          userProgress: userProgress || {},
          personalityProfile: peppyPersonality,
          analysisType: 'comprehensive_neural_network',
          adaptiveRequest: analysisData
        })
      });
    },
    onSuccess: (data) => {
      setNeuralAnalysis(data.neuralAnalysis);
      setPeppyResponse(data.peppyResponse);
      setPeppyAnimation('excited');
      setTimeout(() => setPeppyAnimation('idle'), 2000);
    }
  });

  // Peppy conversation mutation
  const conversationMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/peppy-conversation', {
        method: 'POST',
        body: JSON.stringify({
          message,
          conversationHistory,
          userPersonality: peppyPersonality,
          currentProgress: neuralAnalysis,
          sessions: sessions?.slice(-3) || []
        })
      });
    },
    onSuccess: (data) => {
      const newConversation = {
        id: Date.now(),
        userMessage,
        peppyResponse: data.response,
        timestamp: new Date(),
        emotion: data.emotion
      };
      setConversationHistory(prev => [...prev, newConversation]);
      setUserMessage('');
      setPeppyAnimation(data.emotion);
      setTimeout(() => setPeppyAnimation('idle'), 2000);
    }
  });

  // Initialize Peppy analysis on component mount
  useEffect(() => {
    if (sessions && sessions.length > 0 && !neuralAnalysis && !isAnalyzing) {
      // Auto-trigger analysis after a brief delay to let the UI render
      const timer = setTimeout(() => {
        handleInitialAnalysis();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sessions, neuralAnalysis, isAnalyzing]);

  // Update Peppy's personality based on user interactions
  useEffect(() => {
    if (sessions && sessions.length > 3) {
      const sessionPatterns = analyzeSessions(sessions);
      setPeppyPersonality(prev => ({
        ...prev,
        learningModel: {
          ...prev.learningModel,
          sessionPatterns,
          progressTrends: calculateProgressTrends(sessions)
        }
      }));
    }
  }, [sessions]);

  const handleInitialAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await analyzeWithPeppyMutation.mutateAsync({
        type: 'initial_comprehensive_analysis',
        focus: 'full_personality_assessment'
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeSessions = (sessions: any[]) => {
    // Neural network pattern analysis
    return sessions.map(session => ({
      sessionId: session.id,
      patterns: {
        confidenceProgression: session.overallScore || 0,
        speakingPace: session.wpm || 0,
        engagementLevel: session.engagementScore || 0,
        improvementAreas: session.improvementAreas || []
      },
      personalizedMetrics: {
        voiceConfidence: session.voiceClarity || 0,
        bodyLanguage: session.postureScore || 0,
        contentQuality: session.contentScore || 0
      }
    }));
  };

  const calculateProgressTrends = (sessions: any[]) => {
    const recent = sessions.slice(-5);
    return {
      overallImprovement: recent.reduce((acc, s) => acc + (s.overallScore || 0), 0) / recent.length,
      consistencyScore: calculateConsistency(recent),
      strengthsEmergence: identifyEmergingStrengths(recent),
      adaptiveRecommendations: generateAdaptiveRecommendations(recent)
    };
  };

  const calculateConsistency = (sessions: any[]) => {
    if (sessions.length < 2) return 0;
    const scores = sessions.map(s => s.overallScore || 0);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((acc, score) => acc + Math.pow(score - average, 2), 0) / scores.length;
    return Math.max(0, 100 - Math.sqrt(variance));
  };

  const identifyEmergingStrengths = (sessions: any[]) => {
    const strengths = sessions.flatMap(s => s.strengths || []);
    const strengthCounts = strengths.reduce((acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(strengthCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([strength]) => strength);
  };

  const generateAdaptiveRecommendations = (sessions: any[]) => {
    const latestSession = sessions[sessions.length - 1];
    const recommendations = [];
    
    if (latestSession?.overallScore < 70) {
      recommendations.push("Focus on building foundational confidence through shorter practice sessions");
    }
    if (latestSession?.wpm < 120) {
      recommendations.push("Practice dynamic speaking exercises to increase energy and pace");
    }
    if (latestSession?.engagementScore < 75) {
      recommendations.push("Work on audience connection through storytelling techniques");
    }
    
    return recommendations;
  };

  const handleConversation = async () => {
    if (userMessage.trim() && !conversationMutation.isPending) {
      try {
        await conversationMutation.mutateAsync(userMessage);
      } catch (error) {
        console.error('Conversation failed:', error);
        // Show user-friendly error message
        const errorConversation = {
          id: Date.now(),
          userMessage,
          peppyResponse: {
            message: "I'm having trouble connecting right now. Please try again in a moment!",
            emotion: 'thoughtful',
            personalizedTips: [],
            nextStepGuidance: "Check your connection and try again."
          },
          timestamp: new Date(),
          emotion: 'thoughtful'
        };
        setConversationHistory(prev => [...prev, errorConversation]);
        setUserMessage('');
      }
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input logic would go here
  };

  const getPeppyAvatarStyle = () => {
    const baseStyle = "w-24 h-24 rounded-full border-4 border-blue-200 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold transition-all duration-300";
    
    switch(peppyAnimation) {
      case 'excited': return baseStyle + " animate-bounce scale-110";
      case 'encouraging': return baseStyle + " animate-pulse";
      case 'proud': return baseStyle + " scale-105 ring-4 ring-yellow-300";
      case 'thoughtful': return baseStyle + " animate-pulse";
      default: return baseStyle;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch(emotion) {
      case 'excited': return 'text-yellow-600';
      case 'encouraging': return 'text-green-600';
      case 'proud': return 'text-purple-600';
      case 'thoughtful': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (sessionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Peppy is analyzing your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Authentication Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Yappyy
            </h2>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Beta
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.firstName || "User"} 
                      className="w-8 h-8 rounded-full border-2 border-blue-200 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(user.firstName || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName || user.email?.split('@')[0] || "User"}
                    </span>
                    {user.id === 'demo-user-123' && (
                      <span className="text-xs text-gray-500">Demo User</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.sessionStorage.setItem('loggedOut', 'true');
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                >
                  <Home className="w-4 h-4" />
                  Logout
                </Button>
                {user.id === 'demo-user-123' && (
                  <Button
                    onClick={() => window.location.href = '/api/auth/google'}
                    className="flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <SiGoogle className="w-4 h-4" />
                    Try Google Sign-In
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome to Yappyy!</p>
                  <p className="text-xs text-gray-500">Sign in to save your progress</p>
                </div>
                <Button
                  onClick={() => window.location.href = '/api/auth/google'}
                  className="flex items-center gap-3 bg-white text-gray-700 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  <SiGoogle className="w-5 h-5 text-red-500" />
                  Sign in with Google
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Peppy Header */}
        <div className="text-center mb-16 relative overflow-hidden">
          {/* Enhanced background decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-6000"></div>
          </div>
          
          <motion.div 
            className="relative mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="relative flex justify-center">
              <div className="relative">
                <PeppyParrot isAnimated={true} mood={peppyAnimation as any} size="large" />
                {/* Enhanced multilayer glow effects */}
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
                <div className="absolute -inset-12 bg-gradient-to-r from-cyan-300 via-violet-400 to-rose-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
                {/* Floating sparkles */}
                <div className="absolute -top-6 -right-6 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-pink-400 rounded-full animate-ping animation-delay-500"></div>
                <div className="absolute top-1/2 -right-8 w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-1000"></div>

                <motion.div 
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🧠
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet Peppy
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-4 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Your Revolutionary Deep Learning AI Speech Coach
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Badge className="px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <Brain className="w-4 h-4 mr-2" />
              Neural Network v3.0 • Multi-Modal Analysis • Transformer Models
            </Badge>
          </motion.div>
        </div>

        {/* Enhanced Analysis Loading State */}
        {!neuralAnalysis && !isAnalyzing && sessions && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 overflow-hidden bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-xl">
              <CardContent className="text-center py-12 relative">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                  }}></div>
                </div>
                
                <motion.div 
                  className="mx-auto mb-6 relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <PeppyParrot isAnimated={true} mood="thinking" size="medium" />
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Peppy is Ready for Deep Analysis!</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
                  Let me analyze your speaking patterns using advanced neural networks, transformer models, and LSTM networks for the most personalized coaching experience
                </p>
                
                <Button 
                  onClick={handleInitialAnalysis} 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Brain className="w-6 h-6 mr-3" />
                  Activate Neural Analysis
                  <Sparkles className="w-5 h-5 ml-3" />
                </Button>
                
                <div className="flex justify-center gap-8 mt-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    8 Attention Heads
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    LSTM Networks
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                    Transformer Models
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column - Enhanced Peppy Chat & Personality */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Enhanced Live Conversation with Peppy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="relative">
                      <MessageCircle className="w-6 h-6" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    Chat with Peppy
                    <Badge className="ml-auto bg-white/20 text-white border-white/30">
                      Live AI
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                <div className="space-y-4">
                  
                  {/* Peppy's Latest Response */}
                  {peppyResponse && (
                    <motion.div 
                      className="bg-blue-50 p-4 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 flex-shrink-0">
                          <PeppyParrot isAnimated={false} mood={peppyResponse.emotion as any} size="small" />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium mb-1 ${getEmotionColor(peppyResponse.emotion)}`}>
                            Peppy feels {peppyResponse.emotion}
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{peppyResponse.message}</p>
                          {peppyResponse.personalizedTips.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-gray-600">Personalized Tips:</div>
                              {peppyResponse.personalizedTips.map((tip, idx) => (
                                <div key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                  <Sparkles className="w-3 h-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                                  {tip}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Conversation History */}
                  {conversationHistory.length > 0 && (
                    <div className="max-h-48 overflow-y-auto space-y-3 mb-4">
                      {conversationHistory.slice(-5).map((conv) => (
                        <div key={conv.id} className="space-y-2">
                          <div className="bg-gray-100 p-4 rounded-lg text-sm max-w-full">
                            <span className="font-medium">You:</span> {conv.userMessage}
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg text-sm max-w-full">
                            <span className="font-medium text-blue-600">Peppy:</span> {conv.peppyResponse.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="border-t pt-5 mt-5">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleConversation()}
                          placeholder="Ask Peppy anything about your progress..."
                          className="flex-1 p-4 border-2 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white min-h-[50px]"
                        />
                        <Button 
                          size="lg" 
                          onClick={handleVoiceInput}
                          variant={isListening ? "default" : "outline"}
                          className="px-4 py-4 border-2 hover:scale-105 transition-all duration-200 min-h-[50px]"
                        >
                          <Mic className="w-5 h-5" />
                        </Button>
                        <Button 
                          size="lg" 
                          onClick={handleConversation}
                          disabled={!userMessage.trim() || conversationMutation.isPending}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-h-[50px]"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Neural Feedback System */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    Neural Network Feedback
                    <Badge className="ml-auto bg-white/20 text-white border-white/30">
                      Deep Learning
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {neuralAnalysis ? (
                    <div className="space-y-6">
                      {/* Performance Overview */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {neuralAnalysis.confidenceScore}%
                          </div>
                          <div className="text-xs text-gray-600">Confidence</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {neuralAnalysis.improvementVelocity}%
                          </div>
                          <div className="text-xs text-gray-600">Growth Rate</div>
                        </div>
                      </div>

                      {/* Key Insights */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
                          <Sparkles className="w-4 h-4" />
                          AI Analysis
                        </div>
                        
                        {/* Communication Style Feedback */}
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="text-sm font-medium text-purple-800 mb-2">Communication Style</div>
                          <p className="text-sm text-purple-700">
                            {neuralAnalysis.personalityInsights.communicationStyle}
                          </p>
                        </div>

                        {/* Strengths */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Your Strengths
                          </div>
                          <div className="space-y-1">
                            {neuralAnalysis.personalityInsights.strengthsProfile.slice(0, 2).map((strength, idx) => (
                              <div key={idx} className="text-sm text-green-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                {strength}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Growth Areas */}
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Focus Areas
                          </div>
                          <div className="space-y-1">
                            {neuralAnalysis.personalityInsights.growthAreas.slice(0, 2).map((area, idx) => (
                              <div key={idx} className="text-sm text-yellow-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                {area}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Top Recommendations */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Next Steps
                          </div>
                          <div className="space-y-1">
                            {neuralAnalysis.adaptiveRecommendations.slice(0, 2).map((rec, idx) => (
                              <div key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2 text-sm">Neural feedback will appear here</p>
                      <p className="text-xs text-gray-500">Advanced AI insights ready after analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Neural Analysis & Progress */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Enhanced Neural Network Analysis */}
            {neuralAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <Brain className="w-6 h-6" />
                      Deep Learning Analysis
                      <Badge className="ml-auto bg-white/20 text-white border-white/30">
                        Confidence: {neuralAnalysis.confidenceScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                  <Tabs defaultValue="feedback" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="feedback">Feedback</TabsTrigger>
                      <TabsTrigger value="goals">Goals</TabsTrigger>
                      <TabsTrigger value="insights">Insights</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="feedback" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        {/* Detailed AI Feedback */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Neural Network Analysis
                          </div>
                          <div className="space-y-3">
                            <div className="text-sm text-blue-700">
                              <strong>Confidence Pattern:</strong> Your speaking confidence has increased by {neuralAnalysis.improvementVelocity}% based on neural analysis of voice patterns, body language, and content structure.
                            </div>
                            <div className="text-sm text-blue-700">
                              <strong>Communication Style:</strong> {neuralAnalysis.personalityInsights.communicationStyle}
                            </div>
                          </div>
                        </div>

                        {/* Actionable Recommendations */}
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            AI Recommendations
                          </div>
                          <div className="space-y-2">
                            {neuralAnalysis.adaptiveRecommendations.map((rec, idx) => (
                              <div key={idx} className="text-sm text-green-700 flex items-start gap-2">
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Encouragement */}
                        {neuralAnalysis.encouragementMessages.length > 0 && (
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                            <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                              <Heart className="w-4 h-4" />
                              AI Motivation
                            </div>
                            <p className="text-sm text-purple-700 italic">
                              "{neuralAnalysis.encouragementMessages[0]}"
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="goals" className="space-y-6 mt-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" />
                            Short-term Goals
                          </h4>
                          <div className="space-y-3">
                            {neuralAnalysis.personalizedGoals.shortTerm.map((goal, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium flex-1 mr-4">{goal.goal}</span>
                                <div className="flex items-center gap-3">
                                  <Progress value={goal.progress} className="w-24 h-2" />
                                  <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                                    {goal.priority}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-yellow-500" />
                            Medium-term Goals
                          </h4>
                          <div className="space-y-3">
                            {neuralAnalysis.personalizedGoals.mediumTerm.map((goal, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium flex-1 mr-4">{goal.goal}</span>
                                <div className="flex items-center gap-3">
                                  <Progress value={goal.progress} className="w-24 h-2" />
                                  <Badge variant={goal.priority === 'high' ? 'destructive' : 'secondary'}>
                                    {goal.priority}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="progress" className="space-y-6 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <div className="text-3xl font-bold text-blue-600 mb-3">
                            {neuralAnalysis.improvementVelocity}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Improvement Velocity</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="text-3xl font-bold text-green-600 mb-3">
                            {neuralAnalysis.confidenceScore}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Neural Confidence</div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="insights" className="space-y-6 mt-4">
                      <div className="space-y-6">
                        <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="font-semibold text-purple-800 mb-3">Communication Style</div>
                          <p className="text-sm text-purple-700 leading-relaxed">
                            {neuralAnalysis.personalityInsights.communicationStyle}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              Strengths Profile
                            </div>
                            <ul className="text-sm text-green-700 space-y-2">
                              {neuralAnalysis.personalityInsights.strengthsProfile.map((strength, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                            <div className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Growth Areas
                            </div>
                            <ul className="text-sm text-yellow-700 space-y-2">
                              {neuralAnalysis.personalityInsights.growthAreas.map((area, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <TrendingUp className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="recommendations" className="space-y-6 mt-4">
                      <div className="space-y-4">
                        {neuralAnalysis.adaptiveRecommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200">
                            <ChevronRight className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-blue-800 leading-relaxed font-medium">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Encouragement & Motivation */}
            {neuralAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Peppy's Encouragement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {neuralAnalysis.encouragementMessages.map((message, idx) => (
                      <motion.div
                        key={idx}
                        className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🦜</span>
                          <p className="text-sm text-purple-800">{message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            size="lg" 
            onClick={handleInitialAnalysis}
            disabled={isAnalyzing || analyzeWithPeppyMutation.isPending}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {isAnalyzing || analyzeWithPeppyMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Peppy is thinking...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Get Fresh Analysis
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.location.href = '/practice'}
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Practice Session
          </Button>
        </div>
      </div>
    </div>
  );
}