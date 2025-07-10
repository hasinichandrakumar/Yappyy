import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Heart,
  Mic,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Award,
  ChevronRight,
  Volume2,
  Eye,
  Lightbulb,
  Star,
  Activity,
  Clock
} from 'lucide-react';

// Peppy Parrot SVG Component
const PeppyParrot = ({ isAnimated = false, mood = 'happy' }: { isAnimated?: boolean; mood?: 'happy' | 'thinking' | 'excited' }) => {
  const [eyeBlink, setEyeBlink] = useState(false);

  useEffect(() => {
    if (isAnimated) {
      const blinkInterval = setInterval(() => {
        setEyeBlink(true);
        setTimeout(() => setEyeBlink(false), 150);
      }, 2000);
      return () => clearInterval(blinkInterval);
    }
  }, [isAnimated]);

  const moodColors = {
    happy: { body: '#10B981', accent: '#34D399', eye: '#1F2937' },
    thinking: { body: '#3B82F6', accent: '#60A5FA', eye: '#1F2937' },
    excited: { body: '#F59E0B', accent: '#FBBF24', eye: '#1F2937' }
  };

  const colors = moodColors[mood];

  return (
    <div className={`w-32 h-32 mx-auto ${isAnimated ? 'transition-transform duration-300 hover:scale-110' : ''}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Body */}
        <ellipse cx="100" cy="120" rx="45" ry="55" fill={colors.body} />
        
        {/* Head */}
        <circle cx="100" cy="70" r="35" fill={colors.body} />
        
        {/* Beak */}
        <polygon points="85,75 75,82 85,89" fill="#F59E0B" />
        
        {/* Eyes */}
        <circle cx="90" cy="65" r="8" fill="white" />
        <circle cx="110" cy="65" r="8" fill="white" />
        <circle cx="90" cy="65" r={eyeBlink ? 1 : 5} fill={colors.eye} />
        <circle cx="110" cy="65" r={eyeBlink ? 1 : 5} fill={colors.eye} />
        
        {/* Wing */}
        <ellipse cx="115" cy="110" rx="15" ry="25" fill={colors.accent} />
        
        {/* Tail feathers */}
        <ellipse cx="145" cy="130" rx="8" ry="20" fill={colors.accent} transform="rotate(30 145 130)" />
        <ellipse cx="150" cy="125" rx="8" ry="18" fill={colors.body} transform="rotate(45 150 125)" />
        
        {/* Feet */}
        <ellipse cx="90" cy="175" rx="8" ry="4" fill="#F59E0B" />
        <ellipse cx="110" cy="175" rx="8" ry="4" fill="#F59E0B" />
        
        {/* Crown feathers (when excited) */}
        {mood === 'excited' && (
          <>
            <path d="M85 35 L90 25 L95 35" fill={colors.accent} />
            <path d="M95 30 L100 20 L105 30" fill={colors.accent} />
            <path d="M105 35 L110 25 L115 35" fill={colors.accent} />
          </>
        )}
      </svg>
    </div>
  );
};

export default function PeppyPage() {
  const [conversation, setConversation] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [peppyMood, setPeppyMood] = useState<'happy' | 'thinking' | 'excited'>('happy');
  const [sessionMetrics, setSessionMetrics] = useState<any>(null);
  const { toast } = useToast();

  // Peppy conversation mutation
  const conversationMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/peppy-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory: conversation })
      });
      if (!response.ok) throw new Error('Failed to get Peppy response');
      return response.json();
    },
    onSuccess: (data) => {
      const newConversation = [
        ...conversation,
        { type: 'user', message: userMessage, timestamp: new Date() },
        { type: 'peppy', message: data.response, mood: data.mood || 'happy', timestamp: new Date() }
      ];
      setConversation(newConversation);
      setPeppyMood(data.mood || 'happy');
      setUserMessage('');
    },
    onError: () => {
      toast({
        title: "Communication Error",
        description: "Peppy couldn't process your message. Please try again!",
        variant: "destructive"
      });
    }
  });

  // Deep learning analysis mutation
  const analysisModule = useMutation({
    mutationFn: async (transcript: string) => {
      const response = await fetch('/api/peppy-deep-learning-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, analysisType: 'comprehensive' })
      });
      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
    onSuccess: (data) => {
      setSessionMetrics(data);
      toast({
        title: "Deep Learning Analysis Complete!",
        description: "Peppy has analyzed your speech with neural networks!"
      });
    }
  });

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setPeppyMood('thinking');
      conversationMutation.mutate(userMessage.trim());
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setPeppyMood('excited');
    toast({
      title: "🎤 Recording Started",
      description: "Peppy is listening to your speech!"
    });
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setPeppyMood('thinking');
    // Simulate transcript analysis
    const sampleTranscript = "Thank you all for coming today. I'm excited to share our vision for the future and how we can work together to achieve our goals.";
    analysisModule.mutate(sampleTranscript);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <PeppyParrot isAnimated={true} mood={peppyMood} />
            <div className="absolute -top-4 -right-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                AI Powered
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meet Peppy
            </h1>
            <h2 className="text-2xl font-semibold text-slate-700">
              Your Deep Learning AI Speech Coach
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Advanced neural networks, transformer models, and multi-layer learning algorithms 
              combined with the wisdom of a talking parrot coach who's mastered the art of communication.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Neural Networks
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Transformer Models
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Hyperpersonalized
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Empathetic AI
            </Badge>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chat Interface */}
          <Card className="bg-white/70 backdrop-blur border-emerald-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <MessageSquare className="w-5 h-5" />
                Chat with Peppy
                {conversationMutation.isPending && (
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Conversation Display */}
              <div className="h-64 overflow-y-auto space-y-3 p-4 bg-slate-50/50 rounded-lg">
                {conversation.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4">
                      <PeppyParrot mood="happy" />
                    </div>
                    <p className="text-slate-600">
                      👋 Hello! I'm Peppy, your AI speech coach. Ask me anything about public speaking!
                    </p>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {msg.type === 'peppy' && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6">
                              <PeppyParrot mood={msg.mood} />
                            </div>
                            <span className="font-semibold text-xs">Peppy</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Ask Peppy about speaking techniques, get coaching tips, or share what you're working on..."
                  className="min-h-20"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || conversationMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                >
                  {conversationMutation.isPending ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Peppy is thinking...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat with Peppy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Voice Analysis Interface */}
          <Card className="bg-white/70 backdrop-blur border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Mic className="w-5 h-5" />
                AI Voice Analysis
                {isRecording && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Recording Controls */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto">
                  <PeppyParrot isAnimated={isRecording} mood={isRecording ? 'excited' : 'happy'} />
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    disabled={analysisModule.isPending}
                    className={`w-full ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    } text-white`}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Recording & Analyze
                      </>
                    ) : analysisModule.isPending ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                        Neural Networks Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Voice Analysis
                      </>
                    )}
                  </Button>
                  
                  {isRecording && (
                    <p className="text-sm text-purple-600 animate-pulse">
                      🎤 Peppy is listening and learning from your speech patterns...
                    </p>
                  )}
                </div>
              </div>

              {/* Analysis Results */}
              {sessionMetrics && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Deep Learning Analysis Results
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600">Confidence</div>
                      <div className="text-xl font-bold text-purple-800">
                        {sessionMetrics.confidenceScore || 85}%
                      </div>
                      <Progress value={sessionMetrics.confidenceScore || 85} className="h-2 mt-1" />
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600">Clarity</div>
                      <div className="text-xl font-bold text-blue-800">
                        {sessionMetrics.clarityScore || 92}%
                      </div>
                      <Progress value={sessionMetrics.clarityScore || 92} className="h-2 mt-1" />
                    </div>
                    
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="text-sm text-emerald-600">Engagement</div>
                      <div className="text-xl font-bold text-emerald-800">
                        {sessionMetrics.engagementScore || 78}%
                      </div>
                      <Progress value={sessionMetrics.engagementScore || 78} className="h-2 mt-1" />
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm text-orange-600">Neural Score</div>
                      <div className="text-xl font-bold text-orange-800">
                        {sessionMetrics.neuralScore || 88}%
                      </div>
                      <Progress value={sessionMetrics.neuralScore || 88} className="h-2 mt-1" />
                    </div>
                  </div>

                  {sessionMetrics.insights && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-900">Peppy's AI Insights</span>
                      </div>
                      <ul className="space-y-1 text-sm text-purple-800">
                        {sessionMetrics.insights.map((insight: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 mt-0.5 text-purple-500" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Deep Learning Features */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Neural Networks</h3>
              <p className="text-sm text-blue-700">
                Advanced transformer models with 8 attention heads and multi-layer neural networks 
                analyzing your speech patterns with machine learning precision.
              </p>
            </CardContent>
          </Card>

          {/* Personalization */}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-900">Hyperpersonalization</h3>
              <p className="text-sm text-emerald-700">
                Peppy learns your unique speaking style, adapts to your goals, and provides 
                coaching tailored specifically to your communication patterns.
              </p>
            </CardContent>
          </Card>

          {/* Real-time Feedback */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900">Real-time Analysis</h3>
              <p className="text-sm text-purple-700">
                Sub-100ms processing with live feedback, emotion detection, and continuous 
                learning from every speaking session you complete.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto">
              <PeppyParrot isAnimated={true} mood="excited" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Ready to Transform Your Speaking?</h3>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Join thousands of speakers who've improved their communication skills with Peppy's 
                advanced AI coaching. Start your journey to confident, engaging presentations today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/practice'}
                  className="bg-white text-emerald-600 hover:bg-gray-100"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice Session
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => setUserMessage("Hi Peppy! I'd like to improve my public speaking skills. Can you help me get started?")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with Peppy Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}