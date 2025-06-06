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
  BookOpen
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
  const { transcript, wordCount, sessionTime } = useSpeechRecognition();
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
      style: "Warm, Authentic, Empowering",
      keyTechniques: ["Personal vulnerability", "Audience connection", "Emotional storytelling", "Uplifting messages"],
      signature: "You get a... You get a...",
      difficulty: "intermediate",
      avatar: "💫",
      color: "bg-purple-600"
    },
    {
      id: "watson",
      name: "Emma Watson",
      title: "The Thoughtful Advocate",
      style: "Intelligent, Passionate, Clear",
      keyTechniques: ["Logical structure", "Personal conviction", "Data with emotion", "Call to action"],
      signature: "We need to change...",
      difficulty: "intermediate",
      avatar: "📚",
      color: "bg-green-600"
    },
    {
      id: "musk",
      name: "Elon Musk",
      title: "The Bold Innovator",
      style: "Direct, Technical, Ambitious",
      keyTechniques: ["Technical simplification", "Bold predictions", "Candid honesty", "Future focus"],
      signature: "This is going to be insane...",
      difficulty: "beginner",
      avatar: "🚀",
      color: "bg-red-600"
    },
    {
      id: "branson",
      name: "Richard Branson",
      title: "The Adventurous Entrepreneur",
      style: "Casual, Fun, Authentic",
      keyTechniques: ["Conversational tone", "Adventure stories", "Humor", "Risk-taking narratives"],
      signature: "Screw it, let's do it!",
      difficulty: "beginner",
      avatar: "🎈",
      color: "bg-orange-600"
    }
  ];

  const generateSpeechDNA = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis based on current metrics
    setTimeout(() => {
      const dnaProfile: SpeechDNAProfile = {
        personality: generatePersonality(),
        primaryStyle: generatePrimaryStyle(),
        strengths: generateStrengths(),
        characteristics: {
          pace: speakingPace < 120 ? "slow" : speakingPace > 160 ? "fast" : "medium",
          energy: confidenceScore < 60 ? "calm" : confidenceScore > 80 ? "energetic" : "moderate",
          humor: transcript.includes("!") ? "funny" : transcript.includes("?") ? "light" : "serious",
          storytelling: wordCount > 100 ? "vivid" : wordCount > 50 ? "narrative" : "factual"
        },
        famousSpeaker: generateFamousSpeaker(),
        confidence: confidenceScore,
        uniqueTraits: generateUniqueTraits()
      };
      
      setSpeechDNA(dnaProfile);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generatePersonality = () => {
    const personalities = [
      "The Confident Communicator",
      "The Thoughtful Analyst", 
      "The Energetic Motivator",
      "The Steady Educator",
      "The Passionate Advocate",
      "The Charismatic Storyteller"
    ];
    return personalities[Math.floor(Math.random() * personalities.length)];
  };

  const generatePrimaryStyle = () => {
    const styles = [
      "Fast, funny storyteller",
      "Calm, analytical presenter",
      "Energetic, motivational speaker",
      "Thoughtful, educational communicator",
      "Passionate, persuasive advocate",
      "Warm, engaging conversationalist"
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  };

  const generateStrengths = () => {
    const allStrengths = [
      "Clear articulation",
      "Engaging storytelling",
      "Strong vocal presence",
      "Natural rhythm",
      "Authentic delivery",
      "Compelling examples",
      "Confident posture",
      "Effective pausing",
      "Emotional connection",
      "Logical structure"
    ];
    return allStrengths.slice(0, 3 + Math.floor(Math.random() * 3));
  };

  const generateFamousSpeaker = () => {
    const speakers = [
      "Steve Jobs for your bold vision",
      "Barack Obama for your thoughtful delivery", 
      "Oprah Winfrey for your warmth",
      "Tony Robbins for your energy",
      "Emma Watson for your conviction",
      "Neil deGrasse Tyson for your clarity"
    ];
    return speakers[Math.floor(Math.random() * speakers.length)];
  };

  const generateUniqueTraits = () => {
    const traits = [
      "Natural pause timing",
      "Expressive hand gestures",
      "Compelling voice modulation",
      "Strong eye contact",
      "Authentic enthusiasm",
      "Clear message structure",
      "Engaging questions",
      "Memorable examples"
    ];
    return traits.slice(0, 2 + Math.floor(Math.random() * 2));
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
                <Dna className="w-6 h-6 text-purple-600" />
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
                    disabled={isAnalyzing || !transcript}
                    className="gradient-bg text-white hover:opacity-90 purple-glow"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Speech DNA
                      </>
                    )}
                  </Button>
                  {!transcript && (
                    <p className="text-sm text-gray-500 mt-2">
                      Start speaking in a practice session to enable analysis
                    </p>
                  )}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="font-medium text-gray-900">Pace</div>
                      <div className="text-sm text-gray-600 capitalize">{speechDNA.characteristics.pace}</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl mb-2">🔥</div>
                      <div className="font-medium text-gray-900">Energy</div>
                      <div className="text-sm text-gray-600 capitalize">{speechDNA.characteristics.energy}</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl mb-2">😄</div>
                      <div className="font-medium text-gray-900">Humor</div>
                      <div className="text-sm text-gray-600 capitalize">{speechDNA.characteristics.humor}</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl mb-2">📖</div>
                      <div className="font-medium text-gray-900">Stories</div>
                      <div className="text-sm text-gray-600 capitalize">{speechDNA.characteristics.storytelling}</div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="font-heading text-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      Your Speaking Strengths
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {speechDNA.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                          <Crown className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-800">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unique Traits */}
                  <div>
                    <h4 className="font-heading text-gray-900 mb-3 flex items-center">
                      <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                      Your Unique Traits
                    </h4>
                    <div className="space-y-2">
                      {speechDNA.uniqueTraits.map((trait, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-purple-50 rounded">
                          <Dna className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-800">{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={generateSpeechDNA}
                    variant="outline"
                    className="w-full purple-border hover:bg-purple-50"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Regenerate Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characters" className="space-y-6">
          {/* Character Selection */}
          <Card className="gradient-card purple-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="gradient-text font-heading">Choose Your Speaking Style</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Train like a world-class speaker. Pick a character and master their signature techniques.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.map((character) => (
                  <Card 
                    key={character.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedPersona === character.id 
                        ? 'ring-2 ring-purple-500 bg-purple-50' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedPersona(character.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 ${character.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                          {character.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-heading text-gray-900">{character.name}</h3>
                            <Badge className={getDifficultyColor(character.difficulty)}>
                              {character.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{character.title}</p>
                          <p className="text-sm font-medium text-gray-800 mb-3">{character.style}</p>
                          <div className="text-xs text-gray-500 italic">"{character.signature}"</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Character Details */}
          {selectedPersona && (
            <Card className="gradient-card purple-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span className="gradient-text font-heading">
                    Training with {characters.find(c => c.id === selectedPersona)?.name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const character = characters.find(c => c.id === selectedPersona);
                  if (!character) return null;
                  
                  return (
                    <>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                        <h4 className="font-heading text-gray-900 mb-2">Master These Techniques:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {character.keyTechniques.map((technique, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-700">{technique}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full gradient-bg text-white hover:opacity-90 purple-glow">
                          <Mic className="w-4 h-4 mr-2" />
                          Start {character.name} Training Session
                        </Button>
                        <Button variant="outline" className="w-full purple-border hover:bg-purple-50">
                          <LineChart className="w-4 h-4 mr-2" />
                          View Training Progress
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}