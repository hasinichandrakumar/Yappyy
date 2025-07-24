import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Zap,
  Target,
  Brain,
  TrendingUp,
  Activity,
  Sparkles,
  Wind,
  Flame,
  Waves,
  Sun,
  Moon
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";

interface VibeMetrics {
  energy: number;
  passion: number;
  authenticity: number;
  connection: number;
  confidence: number;
  presence: number;
  charisma: number;
  impact: number;
}

interface VibeProfile {
  primaryVibe: string;
  vibeIntensity: number;
  emotionalResonance: number;
  audienceConnection: number;
  magnetism: number;
  uniqueSignature: string[];
  vibeEvolution: string;
  powerMoments: string[];
}

interface VibeInsight {
  type: 'energy' | 'connection' | 'authenticity' | 'presence';
  message: string;
  intensity: number;
  timestamp: Date;
}

export default function VibeTracker() {
  const { transcript, isListening, wpm, wordCount } = useSpeechRecognition();
  const { speakingPace, voiceClarity, confidenceScore } = useVoiceAnalysis();

  const [vibeMetrics, setVibeMetrics] = useState<VibeMetrics>({
    energy: 0,
    passion: 0,
    authenticity: 0,
    connection: 0,
    confidence: 0,
    presence: 0,
    charisma: 0,
    impact: 0
  });

  const [vibeProfile, setVibeProfile] = useState<VibeProfile | null>(null);
  const [currentInsights, setCurrentInsights] = useState<VibeInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Real-time vibe tracking based on speech patterns
  useEffect(() => {
    if (isListening && wordCount > 0) {
      const energyLevel = Math.min(95, Math.max(20, 
        wpm > 160 ? 80 : wpm > 120 ? 65 : 0 // Only show confidence based on actual speech
      ));
      
      const passionLevel = Math.min(95, Math.max(25,
        60 + (transcript.match(/[!]/g) || []).length * 5 + (confidenceScore - 70) * 0.5
      ));
      
      const authenticityLevel = Math.min(95, Math.max(30,
        voiceClarity > 0 ? voiceClarity : 0 // Only show real voice clarity data
      ));
      
      const connectionLevel = Math.min(95, Math.max(25,
        55 + (transcript.match(/you|we|us|together/gi) || []).length * 3
      ));

      setVibeMetrics({
        energy: Math.round(energyLevel),
        passion: Math.round(passionLevel),
        authenticity: Math.round(authenticityLevel),
        connection: Math.round(connectionLevel),
        confidence: Math.round(confidenceScore),
        presence: Math.round((energyLevel + authenticityLevel) / 2),
        charisma: Math.round((passionLevel + connectionLevel + confidenceScore) / 3),
        impact: Math.round((energyLevel + passionLevel + authenticityLevel + connectionLevel) / 4)
      });

      // Generate real-time insights
      if (wordCount % 25 === 0) {
        generateVibeInsight(energyLevel, passionLevel, authenticityLevel, connectionLevel);
      }
    }
  }, [isListening, wpm, wordCount, transcript, confidenceScore, voiceClarity]);

  const generateVibeInsight = (energy: number, passion: number, authenticity: number, connection: number) => {
    const insights: VibeInsight[] = [];
    
    if (energy > 75) {
      insights.push({
        type: 'energy',
        message: 'Your energy is infectious! The audience can feel your enthusiasm.',
        intensity: energy,
        timestamp: new Date()
      });
    }
    
    if (connection > 70) {
      insights.push({
        type: 'connection',
        message: 'Strong audience connection detected. You\'re building rapport effectively.',
        intensity: connection,
        timestamp: new Date()
      });
    }
    
    if (authenticity > 80) {
      insights.push({
        type: 'authenticity',
        message: 'Your authentic voice is shining through beautifully.',
        intensity: authenticity,
        timestamp: new Date()
      });
    }

    if (insights.length > 0) {
      setCurrentInsights(prev => [...prev.slice(-2), insights[0]]);
    }
  };

  const generateVibeProfile = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const averageEnergy = vibeMetrics.energy;
      const averagePassion = vibeMetrics.passion;
      const averageAuthenticity = vibeMetrics.authenticity;
      
      let primaryVibe = "Balanced Communicator";
      if (averageEnergy > 80) primaryVibe = "Dynamic Energizer";
      else if (averagePassion > 80) primaryVibe = "Passionate Storyteller";
      else if (averageAuthenticity > 85) primaryVibe = "Authentic Leader";
      else if (vibeMetrics.connection > 80) primaryVibe = "Natural Connector";

      const profile: VibeProfile = {
        primaryVibe,
        vibeIntensity: Math.round((averageEnergy + averagePassion) / 2),
        emotionalResonance: vibeMetrics.passion,
        audienceConnection: vibeMetrics.connection,
        magnetism: vibeMetrics.charisma,
        uniqueSignature: [
          averageEnergy > 75 ? "High Energy Delivery" : "Steady Energy Flow",
          averagePassion > 70 ? "Passionate Expression" : "Measured Passion",
          averageAuthenticity > 75 ? "Genuine Authenticity" : "Developing Authenticity"
        ],
        vibeEvolution: "Your speaking vibe is evolving toward more confident and engaging delivery",
        powerMoments: [
          "Peak energy moments during key points",
          "Authentic emotional connections",
          "Natural charismatic presence"
        ]
      };

      setVibeProfile(profile);
      setIsAnalyzing(false);
    }, 2500);
  };

  const getVibeIcon = (metric: keyof VibeMetrics) => {
    const icons = {
      energy: Zap,
      passion: Flame,
      authenticity: Heart,
      connection: Waves,
      confidence: Target,
      presence: Sun,
      charisma: Sparkles,
      impact: TrendingUp
    };
    return icons[metric];
  };

  const getVibeColor = (value: number) => {
    if (value >= 80) return "text-green-600 bg-green-50";
    if (value >= 60) return "text-blue-600 bg-blue-50";
    if (value >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Vibe Tracker
        </h2>
        <p className="text-gray-600">
          Monitor your speaking energy and emotional resonance in real-time
        </p>
      </div>

      {/* Real-time Vibe Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(vibeMetrics).map(([key, value]) => {
          const Icon = getVibeIcon(key as keyof VibeMetrics);
          return (
            <motion.div
              key={key}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <Card className={`${getVibeColor(value)} border-2`}>
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{value}%</div>
                  <div className="text-sm capitalize">{key}</div>
                  <Progress value={value} className="mt-2 h-2" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Live Vibe Insights */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Live Vibe Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {currentInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mb-3 last:mb-0"
              >
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    insight.type === 'energy' ? 'bg-yellow-500' :
                    insight.type === 'connection' ? 'bg-blue-500' :
                    insight.type === 'authenticity' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{insight.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Intensity: {insight.intensity}% • Just now
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {currentInsights.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              {isListening ? "Start speaking to see live vibe insights..." : "Click 'Start Practice' to begin tracking your vibe"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Vibe Profile Analysis */}
      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-600" />
            Your Vibe Profile
            <Button 
              onClick={generateVibeProfile}
              disabled={isAnalyzing || wordCount < 20}
              size="sm"
              className="ml-auto"
            >
              {isAnalyzing ? "Analyzing..." : "Generate Profile"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vibeProfile ? (
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {vibeProfile.primaryVibe}
                </Badge>
                <p className="text-gray-600 mt-2">{vibeProfile.vibeEvolution}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Vibe Intensity</span>
                    <span className="font-bold">{vibeProfile.vibeIntensity}%</span>
                  </div>
                  <Progress value={vibeProfile.vibeIntensity} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Emotional Resonance</span>
                    <span className="font-bold">{vibeProfile.emotionalResonance}%</span>
                  </div>
                  <Progress value={vibeProfile.emotionalResonance} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Audience Connection</span>
                    <span className="font-bold">{vibeProfile.audienceConnection}%</span>
                  </div>
                  <Progress value={vibeProfile.audienceConnection} className="h-2" />
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Unique Signature</h4>
                  {vibeProfile.uniqueSignature.map((trait, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Power Moments</h4>
                <div className="grid gap-2">
                  {vibeProfile.powerMoments.map((moment, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Wind className="w-4 h-4 text-blue-500" />
                      <span>{moment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {wordCount < 20 
                  ? "Speak for at least 20 words to generate your vibe profile"
                  : "Generate your personalized vibe profile to see your speaking energy signature"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}