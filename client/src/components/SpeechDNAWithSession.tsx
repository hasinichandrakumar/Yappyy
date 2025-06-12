import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dna, 
  Star, 
  Sparkles, 
  TrendingUp, 
  User, 
  Brain, 
  Target, 
  Award,
  Zap,
  Heart,
  Shield,
  Compass,
  Crown,
  Flame
} from "lucide-react";

interface SpeechPersona {
  speakingStyle: string;
  communicationPersonality: string;
  strengthAreas: string[];
  growthAreas: string[];
  preferredPace: number;
  confidenceLevel: string;
  personaDescription: string;
}

export default function SpeechDNAWithSession() {
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const { data: persona } = useQuery({
    queryKey: ['/api/speech-persona'],
    enabled: true
  });

  const generatePersonaMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/speech-persona/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to generate persona');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/speech-persona'] });
    }
  });

  const generatePersona = async () => {
    setIsGenerating(true);
    try {
      await generatePersonaMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to generate persona:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePersonaFromSessions = (sessionData: any[]): SpeechPersona => {
    if (sessionData.length === 0) {
      return {
        speakingStyle: "Developing Speaker",
        communicationPersonality: "Emerging Communicator",
        strengthAreas: [],
        growthAreas: [],
        preferredPace: 120,
        confidenceLevel: "Building",
        personaDescription: "Ready to discover your unique speaking style through practice."
      };
    }

    const avgWpm = sessionData.reduce((sum, s) => sum + (s.wpm || 0), 0) / sessionData.length;
    const avgClarity = sessionData.reduce((sum, s) => sum + (s.voiceClarity || 0), 0) / sessionData.length;
    const avgOverall = sessionData.reduce((sum, s) => sum + (s.overallScore || 0), 0) / sessionData.length;
    const totalFillers = sessionData.reduce((sum, s) => sum + (s.fillerWords?.length || 0), 0);
    const avgFillerRate = totalFillers / Math.max(1, sessionData.reduce((sum, s) => sum + (s.wordCount || 0), 0)) * 100;

    // Determine speaking style based on pace and delivery
    const speakingStyle = (() => {
      if (avgWpm > 160) return avgClarity > 80 ? "Dynamic Presenter" : "Rapid Fire Communicator";
      if (avgWpm < 110) return avgClarity > 80 ? "Thoughtful Narrator" : "Deliberate Speaker";
      return avgClarity > 85 ? "Balanced Communicator" : "Steady Speaker";
    })();

    // Determine personality based on overall performance patterns
    const communicationPersonality = (() => {
      if (avgOverall > 85) return "Natural Leader";
      if (avgOverall > 75) return "Confident Communicator";
      if (avgOverall > 65) return "Developing Professional";
      if (avgOverall > 55) return "Emerging Speaker";
      return "Foundation Builder";
    })();

    // Identify strengths
    const strengthAreas = [];
    if (avgClarity > 80) strengthAreas.push("Clear Articulation");
    if (avgWpm >= 120 && avgWpm <= 150) strengthAreas.push("Optimal Pacing");
    if (avgFillerRate < 3) strengthAreas.push("Fluent Delivery");
    if (sessionData.some(s => s.eyeContactScore > 75)) strengthAreas.push("Audience Connection");
    if (sessionData.some(s => s.postureScore > 80)) strengthAreas.push("Confident Presence");
    if (sessionData.some(s => s.purpose)) strengthAreas.push("Purpose-Driven Communication");

    // Identify growth areas
    const growthAreas = [];
    if (avgClarity < 70) growthAreas.push("Voice Clarity");
    if (avgWpm < 100) growthAreas.push("Speaking Energy");
    if (avgWpm > 180) growthAreas.push("Pace Control");
    if (avgFillerRate > 5) growthAreas.push("Verbal Fluency");
    if (sessionData.every(s => (s.eyeContactScore || 0) < 60)) growthAreas.push("Eye Contact");
    if (sessionData.every(s => (s.postureScore || 0) < 70)) growthAreas.push("Body Language");

    // Determine confidence level
    const confidenceLevel = (() => {
      if (avgOverall > 80) return "High Confidence";
      if (avgOverall > 65) return "Growing Confidence";
      if (avgOverall > 50) return "Building Confidence";
      return "Developing Confidence";
    })();

    // Generate persona description
    const personaDescription = (() => {
      const styleDesc = {
        "Dynamic Presenter": "You're a high-energy speaker who captivates audiences with your rapid but clear delivery. Your dynamic style commands attention and keeps listeners engaged.",
        "Rapid Fire Communicator": "You speak with enthusiasm and speed, though focusing on clarity will help your passionate delivery land even stronger.",
        "Thoughtful Narrator": "You have a measured, contemplative speaking style that draws people in with your careful word choice and clear delivery.",
        "Deliberate Speaker": "You take your time to ensure your message is understood, showing respect for both your content and your audience.",
        "Balanced Communicator": "You've found the sweet spot of speaking - clear, well-paced, and engaging. Your natural balance makes you easy to listen to.",
        "Steady Speaker": "You have a consistent, reliable speaking style that builds trust through your measured approach."
      }[speakingStyle] || "You're developing your unique speaking style.";

      const personalityDesc = {
        "Natural Leader": "You demonstrate the communication skills that inspire and guide others.",
        "Confident Communicator": "You speak with authority and clarity that builds credibility.",
        "Developing Professional": "You're building the communication skills that will serve you well in professional settings.",
        "Emerging Speaker": "You're on a positive trajectory, developing skills that will make you a compelling speaker.",
        "Foundation Builder": "You're establishing the fundamental skills that will support your growth as a communicator."
      }[communicationPersonality] || "You're discovering your communication potential.";

      return `${styleDesc} ${personalityDesc} Your journey shows ${strengthAreas.length > 0 ? `particular strength in ${strengthAreas.slice(0, 2).join(' and ').toLowerCase()}` : 'developing foundational skills'}.`;
    })();

    return {
      speakingStyle,
      communicationPersonality,
      strengthAreas,
      growthAreas,
      preferredPace: Math.round(avgWpm),
      confidenceLevel,
      personaDescription
    };
  };

  const getPersonaIcon = (style: string) => {
    const iconMap: { [key: string]: any } = {
      "Dynamic Presenter": Crown,
      "Rapid Fire Communicator": Zap,
      "Thoughtful Narrator": Brain,
      "Deliberate Speaker": Shield,
      "Balanced Communicator": Star,
      "Steady Speaker": Compass,
      "Natural Leader": Crown,
      "Confident Communicator": Award,
      "Developing Professional": Target,
      "Emerging Speaker": Sparkles,
      "Foundation Builder": Heart
    };
    return iconMap[style] || User;
  };

  const getPersonaColor = (level: string) => {
    const colorMap: { [key: string]: string } = {
      "High Confidence": "text-green-600 bg-green-50",
      "Growing Confidence": "text-blue-600 bg-blue-50",
      "Building Confidence": "text-yellow-600 bg-yellow-50",
      "Developing Confidence": "text-purple-600 bg-purple-50"
    };
    return colorMap[level] || "text-gray-600 bg-gray-50";
  };

  // Generate persona if we have sessions but no persona
  useEffect(() => {
    if (Array.isArray(sessions) && sessions.length > 0 && !persona && !isGenerating) {
      generatePersona();
    }
  }, [sessions, persona, isGenerating]);

  const currentPersona = persona || (Array.isArray(sessions) ? generatePersonaFromSessions(sessions) : null);

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500 py-8">
            <Dna className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Discover Your Speech DNA</h3>
            <p className="text-sm mb-4">
              Complete your first practice session to unlock your personalized communication persona and discover your unique speaking style.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your First Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-blue-600 py-8">
            <div className="animate-spin w-12 h-12 mx-auto mb-3">
              <Dna className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-medium mb-2">Analyzing Your Speech DNA</h3>
            <p className="text-sm">
              Processing your practice sessions to create your personalized communication persona...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentPersona) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500 py-8">
            <Dna className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Ready to Generate Your Speech DNA</h3>
            <p className="text-sm mb-4">
              Create your personalized communication persona based on your practice sessions.
            </p>
            <Button onClick={generatePersona} disabled={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate My Speech DNA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const StyleIcon = getPersonaIcon(currentPersona.speakingStyle);
  const PersonalityIcon = getPersonaIcon(currentPersona.communicationPersonality);

  return (
    <div className="space-y-6">
      {/* Main Persona Card */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dna className="w-6 h-6 text-purple-600" />
            <span>Your Speech DNA</span>
            <Badge variant="default" className="bg-purple-600">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} analyzed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Persona Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/60">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <StyleIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Speaking Style</h3>
                    <p className="text-sm text-blue-700">{currentPersona.speakingStyle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <PersonalityIcon className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Communication Type</h3>
                    <p className="text-sm text-green-700">{currentPersona.communicationPersonality}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Persona Description */}
          <Card className="bg-white/60">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Your Unique Communication DNA</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentPersona.personaDescription}
              </p>
            </CardContent>
          </Card>

          {/* Confidence Level */}
          <Card className={`bg-white/60 ${getPersonaColor(currentPersona.confidenceLevel)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Confidence Level</h3>
                    <p className="text-sm">{currentPersona.confidenceLevel}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white/80">
                  {currentPersona.preferredPace} WPM
                </Badge>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Strengths and Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span>Your Superpowers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPersona.strengthAreas.length > 0 ? (
              <div className="space-y-2">
                {currentPersona.strengthAreas.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{strength}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Continue practicing to discover your natural strengths!</p>
            )}
          </CardContent>
        </Card>

        {/* Growth Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Growth Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPersona.growthAreas.length > 0 ? (
              <div className="space-y-2">
                {currentPersona.growthAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{area}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Your fundamentals are strong - focus on advanced techniques!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Regenerate Button */}
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={generatePersona} 
          disabled={isGenerating}
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Update My Speech DNA
        </Button>
      </div>
    </div>
  );
}