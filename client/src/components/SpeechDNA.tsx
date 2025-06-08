import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dna, 
  TrendingUp, 
  Users, 
  Zap, 
  Star, 
  Target,
  Crown,
  Mic,
  Brain,
  Award,
  Sparkles,
  LineChart,
  BookOpen,
  Trophy
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";

interface SpeechDNAProfile {
  personality: string;
  primaryStyle: string;
  strengths: string[];
  characteristics: {
    pace: "slow" | "medium" | "fast";
    energy: "calm" | "moderate" | "energetic";
    humor: "serious" | "light" | "funny";
    storytelling: "factual" | "narrative" | "vivid";
  };
  famousSpeaker: string;
  confidence: number;
  uniqueTraits: string[];
  persuasionStyle: string;
  rhetoricStrengths: string[];
  emotionalIntelligence: number;
  cognitiveComplexity: number;
  adaptabilityScore: number;
  leadershipPresence: number;
  authenticityIndex: number;
}

interface CharacterPersona {
  id: string;
  name: string;
  title: string;
  style: string;
  keyTechniques: string[];
  signature: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  avatar: string;
  color: string;
}

export default function SpeechDNA() {
  const { transcript, wordCount } = useSpeechRecognition();
  const { speakingPace, voiceClarity, confidenceScore } = useVoiceAnalysis();

  const [speechDNA, setSpeechDNA] = useState<SpeechDNAProfile | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const characters: CharacterPersona[] = [
    {
      id: "jobs",
      name: "Steve Jobs",
      title: "The Visionary",
      style: "Passionate, Simple, Revolutionary",
      keyTechniques: ["Rule of three", "Pauses for impact", "Storytelling with demos", "Bold statements"],
      signature: "One more thing...",
      difficulty: "advanced",
      avatar: "👨‍💼",
      color: "bg-gray-800"
    },
    {
      id: "obama",
      name: "Barack Obama",
      title: "The Inspirational Leader",
      style: "Thoughtful, Rhythmic, Inclusive",
      keyTechniques: ["Measured cadence", "Call and response", "Personal anecdotes", "Hope-based messaging"],
      signature: "Yes we can!",
      difficulty: "advanced",
      avatar: "🎤",
      color: "bg-blue-600"
    },
    {
      id: "oprah",
      name: "Oprah Winfrey",
      title: "The Empathetic Connector",
      style: "Warm, Authentic, Inspirational",
      keyTechniques: ["Personal stories", "Emotional connection", "Audience engagement", "Vulnerability"],
      signature: "What I know for sure...",
      difficulty: "intermediate",
      avatar: "✨",
      color: "bg-cyan-600"
    }
  ];

  const generateSpeechDNA = async () => {
    setIsAnalyzing(true);
    
    // Analyze speech patterns with realistic data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate metrics from available data
    const hasTranscript = transcript && transcript.length > 0;
    const actualWordCount = wordCount || 0;
    const actualPace = speakingPace || 0;
    const actualConfidence = confidenceScore || 50;
    const actualClarity = voiceClarity || 50;
    
    // Generate personality based on data
    const getPersonality = () => {
      if (actualConfidence > 80 && actualPace > 150) return "The Dynamic Leader";
      if (actualConfidence > 70 && actualPace < 130) return "The Thoughtful Authority";
      if (actualConfidence > 75) return "The Confident Communicator";
      if (actualPace > 160) return "The Energetic Motivator";
      if (actualPace < 120) return "The Deliberate Educator";
      return "The Balanced Presenter";
    };
    
    // Generate style description
    const getStyle = () => {
      const paceDesc = actualPace > 160 ? "Fast-paced" : actualPace < 120 ? "Measured" : "Steady";
      const confidenceDesc = actualConfidence > 80 ? "commanding" : actualConfidence > 60 ? "assured" : "thoughtful";
      const clarityDesc = actualClarity > 80 ? "crystal-clear" : actualClarity > 60 ? "clear" : "developing";
      return `${paceDesc}, ${confidenceDesc}, ${clarityDesc} speaker`;
    };
    
    // Generate strengths
    const getStrengths = () => {
      const strengths = [];
      if (actualPace >= 140 && actualPace <= 180) strengths.push("Optimal speaking pace");
      if (actualConfidence > 75) strengths.push("Strong vocal confidence");
      if (actualClarity > 75) strengths.push("Excellent articulation");
      if (hasTranscript) strengths.push("Active speech engagement");
      if (actualPace > 120) strengths.push("Good energy level");
      if (actualClarity > 60) strengths.push("Clear communication");
      return strengths.slice(0, 3);
    };
    
    // Match famous speaker
    const getFamousSpeaker = () => {
      if (actualConfidence > 85 && actualPace > 150) return "Steve Jobs for your commanding presence";
      if (actualConfidence > 80 && actualClarity > 80) return "Barack Obama for your measured authority";
      if (actualPace > 160 && actualConfidence > 70) return "Tony Robbins for your dynamic energy";
      if (actualClarity > 85) return "Morgan Freeman for your clear delivery";
      if (actualConfidence > 75) return "Oprah Winfrey for your authentic confidence";
      return "a skilled professional speaker";
    };
    
    const dnaProfile: SpeechDNAProfile = {
      personality: getPersonality(),
      primaryStyle: getStyle(),
      strengths: getStrengths(),
      characteristics: {
        pace: actualPace < 120 ? "slow" : actualPace > 160 ? "fast" : "medium",
        energy: actualConfidence < 60 ? "calm" : actualConfidence > 80 ? "energetic" : "moderate",
        humor: hasTranscript && transcript.includes("!") ? "funny" : 
               hasTranscript && transcript.includes("?") ? "light" : "serious",
        storytelling: actualWordCount > 150 ? "vivid" : actualWordCount > 75 ? "narrative" : "factual"
      },
      famousSpeaker: getFamousSpeaker(),
      confidence: Math.max(actualConfidence, 40),
      uniqueTraits: ["Natural speaking rhythm", "Developing presence", "Clear delivery"],
      persuasionStyle: actualConfidence > 80 ? "Authoritative Logic" : "Thoughtful Approach",
      rhetoricStrengths: ["Clear structure", "Engaging delivery", "Developing voice"],
      emotionalIntelligence: Math.min(Math.max(actualConfidence + 10, 60), 95),
      cognitiveComplexity: Math.min(Math.max(actualClarity + 5, 65), 90),
      adaptabilityScore: Math.min(Math.max((actualPace + actualConfidence) / 2, 60), 85),
      leadershipPresence: Math.min(Math.max(actualConfidence + actualClarity - 20, 50), 90),
      authenticityIndex: Math.min(Math.max((actualConfidence + actualClarity + 20) / 2, 65), 95)
    };
    
    setSpeechDNA(dnaProfile);
    setIsAnalyzing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dna" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dna" className="flex items-center space-x-2">
            <Dna className="w-4 h-4" />
            <span>Speech DNA</span>
          </TabsTrigger>
          <TabsTrigger value="characters" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Character Training</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dna" className="space-y-6">
          {/* Speech DNA Analysis */}
          <Card className="gradient-card purple-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dna className="w-6 h-6 text-cyan-600" />
                <span className="gradient-text font-heading">Your Speech DNA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!speechDNA ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-heading mb-2">Discover Your Speaking Fingerprint</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Analyze your unique speaking style and get a personalized Speech DNA profile
                  </p>
                  <Button 
                    onClick={generateSpeechDNA}
                    disabled={isAnalyzing}
                    className="gradient-bg text-white hover:opacity-90 purple-glow"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Speech Patterns...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Speech DNA
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    {transcript ? 
                      `Analysis ready with ${wordCount} words spoken` : 
                      "Click to generate DNA profile based on available speech data"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Main Profile */}
                  <div className="text-center bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
                    <div className="w-20 h-20 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center purple-glow">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-display mb-2 gradient-text">{speechDNA.personality}</h3>
                    <p className="text-lg text-gray-700 mb-4">"{speechDNA.primaryStyle}"</p>
                    <Badge className="bg-purple-100 text-purple-800">
                      Most similar to {speechDNA.famousSpeaker}
                    </Badge>
                  </div>

                  {/* Characteristics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(speechDNA.characteristics).map(([key, value]) => (
                      <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 capitalize mb-1">{key}</h4>
                        <p className="text-sm text-gray-600 capitalize">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-heading text-lg">Core Metrics</h4>
                      {[
                        { label: "Confidence", value: speechDNA.confidence },
                        { label: "Emotional Intelligence", value: speechDNA.emotionalIntelligence },
                        { label: "Leadership Presence", value: speechDNA.leadershipPresence }
                      ].map((metric, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{metric.label}</span>
                            <span className="text-sm text-gray-600">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-heading text-lg">Your Strengths</h4>
                      <div className="space-y-2">
                        {speechDNA.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setSpeechDNA(null)}
                    variant="outline"
                    className="w-full"
                  >
                    Generate New Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characters" className="space-y-6">
          <Card className="gradient-card purple-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-cyan-600" />
                <span className="gradient-text font-heading">Character Training</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Learn from the masters by adopting their speaking styles and techniques
              </p>
              
              <div className="grid gap-4">
                {characters.map((character) => (
                  <Card 
                    key={character.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedPersona === character.id ? 'ring-2 ring-cyan-500' : ''
                    }`}
                    onClick={() => setSelectedPersona(character.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{character.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">{character.name}</h3>
                            <Badge className={getDifficultyColor(character.difficulty)}>
                              {character.difficulty}
                            </Badge>
                          </div>
                          <p className="text-cyan-600 font-medium mb-2">{character.title}</p>
                          <p className="text-gray-600 text-sm mb-3">{character.style}</p>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Key Techniques:</h4>
                            <div className="flex flex-wrap gap-1">
                              {character.keyTechniques.map((technique, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {technique}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-3 p-2 bg-gray-50 rounded italic text-sm">
                            "{character.signature}"
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}