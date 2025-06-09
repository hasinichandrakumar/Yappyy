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
  Trophy,
  Eye,
  Heart,
  Lightbulb,
  Shield,
  Flame,
  Compass,
  Diamond,
  Palette,
  Music,
  Radar
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";

interface SpeechDNAProfile {
  personality: string;
  archetype: string;
  primaryStyle: string;
  communicationGenome: {
    vocal: number;
    cognitive: number;
    emotional: number;
    rhetorical: number;
    leadership: number;
  };
  strengths: string[];
  characteristics: {
    pace: "deliberate" | "balanced" | "dynamic";
    energy: "composed" | "engaging" | "electrifying";
    authority: "collaborative" | "confident" | "commanding";
    empathy: "analytical" | "relatable" | "inspiring";
  };
  famousSpeaker: {
    name: string;
    similarity: number;
    reasons: string[];
  };
  uniqueSignature: string;
  communicationDNA: {
    storyteller: number;
    educator: number;
    motivator: number;
    persuader: number;
    entertainer: number;
  };
  advancedMetrics: {
    authenticity: number;
    charisma: number;
    clarity: number;
    impact: number;
    adaptability: number;
    memorability: number;
  };
  growthPotential: {
    area: string;
    current: number;
    potential: number;
    timeframe: string;
  }[];

}

interface SpeakerArchetype {
  id: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  icon: React.ReactNode;
  color: string;
  examples: string[];
  strengths: string[];
  challenges: string[];
}

export default function SpeechDNA() {
  const { transcript, wordCount, isListening } = useSpeechRecognition();
  const { voiceClarity, confidenceScore, pitch } = useVoiceAnalysis();

  const [speechDNA, setSpeechDNA] = useState<SpeechDNAProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const archetypes: SpeakerArchetype[] = [
    {
      id: "visionary",
      name: "The Visionary",
      title: "Future-Focused Innovator",
      description: "Inspires audiences with bold ideas and transformative visions",
      traits: ["Future-oriented", "Inspirational", "Bold", "Conceptual"],
      icon: <Eye className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      examples: ["Steve Jobs", "Elon Musk", "Simon Sinek"],
      strengths: ["Big picture thinking", "Inspiring change", "Memorable messages"],
      challenges: ["Technical details", "Immediate concerns", "Skeptical audiences"]
    },
    {
      id: "connector",
      name: "The Connector",
      title: "Empathetic Bridge-Builder",
      description: "Creates deep emotional bonds and builds authentic relationships",
      traits: ["Empathetic", "Authentic", "Relatable", "Warm"],
      icon: <Heart className="w-6 h-6" />,
      color: "from-rose-500 to-orange-500",
      examples: ["Oprah Winfrey", "Brené Brown", "Maya Angelou"],
      strengths: ["Emotional intelligence", "Building trust", "Personal stories"],
      challenges: ["Large audiences", "Technical topics", "Formal settings"]
    },
    {
      id: "educator",
      name: "The Educator",
      title: "Knowledge Architect",
      description: "Transforms complex information into clear, actionable insights",
      traits: ["Clear", "Structured", "Patient", "Thorough"],
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      examples: ["Neil deGrasse Tyson", "Amy Cuddy", "Hans Rosling"],
      strengths: ["Complex explanations", "Step-by-step guidance", "Data visualization"],
      challenges: ["Emotional appeals", "Entertainment value", "Short attention spans"]
    },
    {
      id: "commander",
      name: "The Commander",
      title: "Authoritative Leader",
      description: "Commands attention with decisive leadership and clear direction",
      traits: ["Decisive", "Authoritative", "Direct", "Confident"],
      icon: <Shield className="w-6 h-6" />,
      color: "from-red-500 to-yellow-500",
      examples: ["Winston Churchill", "Margaret Thatcher", "General Mattis"],
      strengths: ["Crisis communication", "Team motivation", "Clear decisions"],
      challenges: ["Collaborative environments", "Emotional sensitivity", "Creative discussions"]
    },
    {
      id: "entertainer",
      name: "The Entertainer",
      title: "Charismatic Performer",
      description: "Captivates audiences with humor, energy, and memorable experiences",
      traits: ["Charismatic", "Energetic", "Humorous", "Memorable"],
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      examples: ["Robin Williams", "Ellen DeGeneres", "Will Smith"],
      strengths: ["Audience engagement", "Memorable delivery", "Breaking tension"],
      challenges: ["Serious topics", "Formal settings", "Data-heavy content"]
    },
    {
      id: "strategist",
      name: "The Strategist",
      title: "Analytical Problem-Solver",
      description: "Presents logical arguments with precision and strategic thinking",
      traits: ["Analytical", "Logical", "Strategic", "Precise"],
      icon: <Compass className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      examples: ["McKinsey speakers", "Warren Buffett", "Sheryl Sandberg"],
      strengths: ["Logical arguments", "Data analysis", "Strategic planning"],
      challenges: ["Emotional connection", "Inspirational messages", "Entertainment"]
    },
    {
      id: "storyteller",
      name: "The Storyteller",
      title: "Narrative Master",
      description: "Weaves compelling stories that captivate and move audiences",
      traits: ["Narrative", "Imaginative", "Engaging", "Memorable"],
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      examples: ["Malcolm Gladwell", "Elizabeth Gilbert", "Chimamanda Ngozi Adichie"],
      strengths: ["Emotional engagement", "Memorable content", "Audience connection"],
      challenges: ["Data-heavy presentations", "Time constraints", "Formal protocols"]
    },
    {
      id: "motivator",
      name: "The Motivator",
      title: "Energy Catalyst",
      description: "Ignites passion and drives action through powerful inspiration",
      traits: ["Passionate", "High-energy", "Uplifting", "Action-oriented"],
      icon: <Flame className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      examples: ["Tony Robbins", "Eric Thomas", "Les Brown"],
      strengths: ["Inspiring action", "Building momentum", "Overcoming obstacles"],
      challenges: ["Subtle messaging", "Quiet audiences", "Technical content"]
    },
    {
      id: "sage",
      name: "The Sage",
      title: "Wisdom Keeper",
      description: "Shares deep insights with calm authority and thoughtful reflection",
      traits: ["Wise", "Thoughtful", "Reflective", "Measured"],
      icon: <Star className="w-6 h-6" />,
      color: "from-slate-500 to-gray-600",
      examples: ["Warren Buffett", "Bill Gates", "Dalai Lama"],
      strengths: ["Deep insights", "Credible authority", "Timeless wisdom"],
      challenges: ["High-energy events", "Young audiences", "Entertainment value"]
    },
    {
      id: "challenger",
      name: "The Challenger",
      title: "Status Quo Disruptor",
      description: "Questions assumptions and pushes boundaries with provocative ideas",
      traits: ["Provocative", "Bold", "Questioning", "Unconventional"],
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
      examples: ["Malcolm X", "Steve Jobs", "Greta Thunberg"],
      strengths: ["Driving change", "Memorable impact", "Breaking barriers"],
      challenges: ["Conservative audiences", "Diplomatic settings", "Consensus building"]
    },
    {
      id: "collaborator",
      name: "The Collaborator",
      title: "Team Builder",
      description: "Facilitates dialogue and builds consensus through inclusive communication",
      traits: ["Inclusive", "Diplomatic", "Facilitating", "Unifying"],
      icon: <Users className="w-6 h-6" />,
      color: "from-green-500 to-blue-500",
      examples: ["Barack Obama", "Nelson Mandela", "Jacinda Ardern"],
      strengths: ["Building consensus", "Team unity", "Diplomatic solutions"],
      challenges: ["Urgent decisions", "Controversial topics", "Individual leadership"]
    },
    {
      id: "innovator",
      name: "The Innovator",
      title: "Creative Pioneer",
      description: "Introduces breakthrough ideas with creative and unconventional approaches",
      traits: ["Creative", "Original", "Experimental", "Forward-thinking"],
      icon: <Lightbulb className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
      examples: ["Tim Cook", "Satya Nadella", "Reid Hoffman"],
      strengths: ["Fresh perspectives", "Creative solutions", "Future thinking"],
      challenges: ["Traditional settings", "Risk-averse audiences", "Proven methods"]
    },
    {
      id: "guide",
      name: "The Guide",
      title: "Pathway Illuminator",
      description: "Leads audiences through complex journeys with clear direction and support",
      traits: ["Supportive", "Clear", "Methodical", "Encouraging"],
      icon: <Compass className="w-6 h-6" />,
      color: "from-teal-500 to-green-500",
      examples: ["Marie Forleo", "Tim Ferriss", "Gary Vaynerchuk"],
      strengths: ["Step-by-step guidance", "Practical advice", "Sustainable change"],
      challenges: ["Abstract concepts", "Theoretical discussions", "Quick fixes"]
    },
    {
      id: "advocate",
      name: "The Advocate",
      title: "Cause Champion",
      description: "Speaks passionately for important causes with moral authority",
      traits: ["Passionate", "Principled", "Persuasive", "Committed"],
      icon: <Shield className="w-6 h-6" />,
      color: "from-red-500 to-pink-500",
      examples: ["Martin Luther King Jr.", "Malala Yousafzai", "Al Gore"],
      strengths: ["Moral authority", "Passionate delivery", "Social impact"],
      challenges: ["Neutral topics", "Commercial settings", "Opposing viewpoints"]
    },
    {
      id: "expert",
      name: "The Expert",
      title: "Authority Specialist",
      description: "Delivers specialized knowledge with credible expertise and precision",
      traits: ["Knowledgeable", "Credible", "Precise", "Authoritative"],
      icon: <Award className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-500",
      examples: ["Malcolm Gladwell", "Daniel Kahneman", "Yuval Noah Harari"],
      strengths: ["Deep expertise", "Credible authority", "Detailed analysis"],
      challenges: ["General audiences", "Emotional connection", "Simplification"]
    }
  ];

  const generateAdvancedSpeechDNA = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate advanced analysis with progress updates
    const progressSteps = [
      { step: 20, message: "Analyzing vocal patterns..." },
      { step: 40, message: "Processing cognitive complexity..." },
      { step: 60, message: "Evaluating emotional intelligence..." },
      { step: 80, message: "Mapping rhetorical strengths..." },
      { step: 100, message: "Generating DNA profile..." }
    ];

    for (const { step, message } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step);
    }

    // Calculate enhanced metrics from actual data
    const hasTranscript = transcript && transcript.length > 50;
    const actualWordCount = Number(wordCount) || 0;
    const actualPace = actualWordCount > 0 ? Math.round((actualWordCount / 60) * 60) : 0;
    const actualConfidence = Number(confidenceScore) || 0;
    const actualClarity = Number(voiceClarity) || 0;

    // Determine archetype based on speech patterns
    const determineArchetype = () => {
      if (actualConfidence > 85 && actualClarity > 80) return "commander";
      if (actualConfidence > 75 && hasTranscript) return "visionary";
      if (actualClarity > 85) return "educator";
      if (actualPace > 160 && actualConfidence > 70) return "entertainer";
      if (actualClarity > 70 && actualPace < 140) return "strategist";
      return "connector";
    };

    const selectedArchetype = archetypes.find(a => a.id === determineArchetype()) || archetypes[0];

    // Generate sophisticated personality description
    const generatePersonality = () => {
      const basePersonalities = [
        "The Authentic Communicator",
        "The Compelling Narrator",
        "The Thoughtful Leader",
        "The Dynamic Presenter",
        "The Inspiring Voice",
        "The Strategic Communicator"
      ];
      
      if (actualConfidence > 80) return "The Commanding Presence";
      if (actualClarity > 85) return "The Crystal Clear Communicator";
      if (hasTranscript && actualWordCount > 100) return "The Engaging Storyteller";
      if (actualPace > 150) return "The Dynamic Energizer";
      
      return basePersonalities[Math.floor(Math.random() * basePersonalities.length)];
    };

    // Calculate communication genome
    const calculateGenome = () => {
      const baseVocal = Math.max(actualClarity || 60, 60);
      const baseCognitive = Math.max((actualWordCount > 50 ? 80 : 65), 65);
      const baseEmotional = Math.max(actualConfidence || 65, 65);
      const baseRhetorical = Math.max((hasTranscript ? 75 : 60), 60);
      const baseLeadership = Math.max(actualConfidence || 60, 60);

      return {
        vocal: Math.min(baseVocal + Math.random() * 15, 95),
        cognitive: Math.min(baseCognitive + Math.random() * 10, 95),
        emotional: Math.min(baseEmotional + Math.random() * 15, 95),
        rhetorical: Math.min(baseRhetorical + Math.random() * 10, 95),
        leadership: Math.min(baseLeadership + Math.random() * 15, 95)
      };
    };

    // Generate famous speaker match with similarity score
    const generateFamousSpeakerMatch = () => {
      const speakers = [
        { name: "Steve Jobs", similarity: actualConfidence > 80 ? 85 : 70, reasons: ["Clear vision", "Confident delivery", "Memorable phrases"] },
        { name: "Barack Obama", similarity: actualClarity > 80 ? 88 : 75, reasons: ["Measured pace", "Thoughtful delivery", "Inspiring tone"] },
        { name: "Oprah Winfrey", similarity: hasTranscript ? 82 : 70, reasons: ["Authentic connection", "Emotional intelligence", "Personal stories"] },
        { name: "Tony Robbins", similarity: actualPace > 150 ? 85 : 65, reasons: ["High energy", "Motivational style", "Dynamic presence"] },
        { name: "Brené Brown", similarity: actualClarity > 75 ? 80 : 70, reasons: ["Clear communication", "Authentic vulnerability", "Research-based insights"] }
      ];

      return speakers.reduce((best, current) => 
        current.similarity > best.similarity ? current : best
      );
    };

    // Generate unique signature based on speaking style
    const generateUniqueSignature = () => {
      if (actualConfidence > 85) return "Commands attention with natural authority";
      if (actualClarity > 85) return "Delivers crystal-clear insights that stick";
      if (actualPace > 160) return "Energizes audiences with dynamic delivery";
      if (hasTranscript && actualWordCount > 100) return "Weaves compelling narratives that resonate";
      return "Connects authentically with genuine presence";
    };

    // Calculate communication DNA percentages
    const calculateCommunicationDNA = () => {
      const storyteller = hasTranscript && actualWordCount > 50 ? 85 : 65;
      const educator = actualClarity > 70 ? 80 : 60;
      const motivator = actualConfidence > 70 ? 85 : 65;
      const persuader = actualConfidence > 75 && actualClarity > 70 ? 80 : 65;
      const entertainer = actualPace > 150 ? 75 : 55;

      return { storyteller, educator, motivator, persuader, entertainer };
    };

    // Generate growth potential areas
    const generateGrowthPotential = () => {
      const areas = [];
      
      if (actualClarity < 80) {
        areas.push({
          area: "Voice Clarity",
          current: Math.max(actualClarity, 40),
          potential: 85,
          timeframe: "2-3 months"
        });
      }
      
      if (actualConfidence < 85) {
        areas.push({
          area: "Speaking Confidence", 
          current: Math.max(actualConfidence, 50),
          potential: 90,
          timeframe: "3-4 months"
        });
      }
      
      if (!hasTranscript || actualWordCount < 100) {
        areas.push({
          area: "Content Depth",
          current: 60,
          potential: 85,
          timeframe: "1-2 months"
        });
      }

      return areas.slice(0, 3);
    };

    const genome = calculateGenome();
    const famousSpeaker = generateFamousSpeakerMatch();
    const communicationDNA = calculateCommunicationDNA();

    const dnaProfile: SpeechDNAProfile = {
      personality: generatePersonality(),
      archetype: selectedArchetype.name,
      primaryStyle: selectedArchetype.description,
      communicationGenome: genome,
      strengths: selectedArchetype.strengths.slice(0, 3),
      characteristics: {
        pace: actualPace < 120 ? "deliberate" : actualPace > 160 ? "dynamic" : "balanced",
        energy: actualConfidence < 60 ? "composed" : actualConfidence > 80 ? "electrifying" : "engaging",
        authority: actualConfidence < 70 ? "collaborative" : actualConfidence > 85 ? "commanding" : "confident",
        empathy: actualClarity > 80 ? "inspiring" : hasTranscript ? "relatable" : "analytical"
      },
      famousSpeaker,
      uniqueSignature: generateUniqueSignature(),
      communicationDNA,
      advancedMetrics: {
        authenticity: Math.max(actualConfidence || 70, 70) + Math.random() * 10,
        charisma: Math.max(actualConfidence || 65, 65) + Math.random() * 15,
        clarity: Math.max(actualClarity || 70, 70) + Math.random() * 10,
        impact: Math.max((actualConfidence + actualClarity) / 2 || 70, 70) + Math.random() * 10,
        adaptability: Math.max((genome.cognitive + genome.emotional) / 2, 70),
        memorability: Math.max(actualPace > 150 ? 80 : 70, 70) + Math.random() * 10
      },
      growthPotential: generateGrowthPotential(),

    };

    setSpeechDNA(dnaProfile);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  const getArchetypeIcon = (archetypeName: string) => {
    const archetype = archetypes.find(a => a.name === archetypeName);
    return archetype?.icon || <Dna className="w-6 h-6" />;
  };

  const getArchetypeColor = (archetypeName: string) => {
    const archetype = archetypes.find(a => a.name === archetypeName);
    return archetype?.color || "from-purple-500 to-blue-500";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <Dna className="w-4 h-4" />
            <span>DNA Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="archetypes" className="flex items-center space-x-2">
            <Crown className="w-4 h-4" />
            <span>Archetypes</span>
          </TabsTrigger>

        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* Main Speech DNA Analysis */}
          <Card className="gradient-card border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Dna className="w-5 h-5 text-white" />
                </div>
                <span className="gradient-text font-heading">Advanced Speech DNA Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!speechDNA ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading mb-3 gradient-text">Unlock Your Speaking DNA</h3>
                  <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
                    Discover your unique communication genome, speaking archetype, and personalized growth pathway through advanced AI analysis
                  </p>
                  
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
                        <span className="text-lg font-medium text-purple-600">Analyzing Your Speech Patterns</span>
                      </div>
                      <div className="max-w-md mx-auto">
                        <Progress value={analysisProgress} className="h-3 bg-purple-100" />
                        <p className="text-sm text-gray-500 mt-2">{analysisProgress}% Complete</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        onClick={generateAdvancedSpeechDNA}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Generate Speech DNA Profile
                      </Button>
                      
                      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                        {transcript && (
                          <div className="flex items-center space-x-2">
                            <Mic className="w-4 h-4" />
                            <span>{wordCount} words analyzed</span>
                          </div>
                        )}
                        {isListening && (
                          <Badge className="bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                            Live Analysis Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* DNA Profile Header */}
                  <div className={`text-center bg-gradient-to-br ${getArchetypeColor(speechDNA.archetype)} p-8 rounded-2xl text-white shadow-xl`}>
                    <div className="w-28 h-28 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      {getArchetypeIcon(speechDNA.archetype)}
                    </div>
                    <h3 className="text-3xl font-display mb-2">{speechDNA.personality}</h3>
                    <p className="text-xl mb-4 opacity-90">{speechDNA.archetype}</p>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto">{speechDNA.uniqueSignature}</p>
                    
                    <div className="mt-6 flex items-center justify-center space-x-4">
                      <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                        <Trophy className="w-4 h-4 mr-2" />
                        {speechDNA.famousSpeaker.similarity}% match with {speechDNA.famousSpeaker.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Communication Genome */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Radar className="w-5 h-5 text-blue-600" />
                        <span>Communication Genome</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(speechDNA.communicationGenome).map(([key, value]) => (
                          <div key={key} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize text-gray-700">{key}</span>
                              <span className="text-lg font-bold text-blue-600">{Math.round(value)}%</span>
                            </div>
                            <Progress value={value} className="h-3" />
                            <div className="text-xs text-gray-500">
                              {value > 85 ? "Exceptional" : value > 75 ? "Strong" : value > 65 ? "Developing" : "Emerging"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Communication DNA Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="w-5 h-5 text-purple-600" />
                        <span>Communication DNA Composition</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(speechDNA.communicationDNA).map(([type, percentage]) => (
                          <div key={type} className="flex items-center space-x-4">
                            <div className="w-24 text-right">
                              <span className="text-sm font-medium capitalize">{type}</span>
                            </div>
                            <div className="flex-1">
                              <Progress value={percentage} className="h-4" />
                            </div>
                            <div className="w-16 text-left">
                              <span className="text-sm font-bold">{Math.round(percentage)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advanced Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Diamond className="w-5 h-5 text-cyan-600" />
                        <span>Advanced Speaking Metrics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {Object.entries(speechDNA.advancedMetrics).map(([metric, value]) => (
                          <div key={metric} className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{Math.round(value)}</span>
                            </div>
                            <h4 className="font-medium capitalize text-gray-700">{metric}</h4>
                            <div className="mt-2">
                              <Progress value={value} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Growth Potential */}
                  {speechDNA.growthPotential.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span>Growth Potential Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {speechDNA.growthPotential.map((area, index) => (
                            <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-lg">{area.area}</h4>
                                <Badge className="bg-green-100 text-green-800">{area.timeframe}</Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Current Level</span>
                                  <span className="font-medium">{area.current}%</span>
                                </div>
                                <Progress value={area.current} className="h-2 bg-gray-200" />
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-600">Potential Level</span>
                                  <span className="font-medium text-green-600">{area.potential}%</span>
                                </div>
                                <Progress value={area.potential} className="h-2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-center">
                    <Button 
                      onClick={() => setSpeechDNA(null)}
                      variant="outline"
                      className="px-8 py-3"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate New Analysis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archetypes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-gold-600" />
                <span>Speaker Archetypes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archetypes.map((archetype) => (
                  <Card key={archetype.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${archetype.color} rounded-full flex items-center justify-center text-white`}>
                        {archetype.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-2">{archetype.name}</h3>
                      <p className="text-sm text-gray-600 text-center mb-4">{archetype.title}</p>
                      <p className="text-sm text-gray-700 mb-4">{archetype.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Traits:</h4>
                          <div className="flex flex-wrap gap-1">
                            {archetype.traits.map((trait, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{trait}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Examples:</h4>
                          <p className="text-xs text-gray-600">{archetype.examples.join(", ")}</p>
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