import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Fingerprint, 
  TrendingUp, 
  Brain, 
  Star, 
  Target,
  Zap,
  Activity,
  Award
} from "lucide-react";

interface SpeechFingerprintGeneratorProps {
  sessionCount: number;
}

interface FingerprintData {
  uniquenessScore: number;
  consistencyIndex: number;
  evolutionRate: number;
  dominantTraits: string[];
  speakingPattern: string;
  improvementVelocity: number;
}

export default function SpeechFingerprintGenerator({ sessionCount }: SpeechFingerprintGeneratorProps) {
  const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFingerprint = async () => {
    setIsGenerating(true);
    
    // Simulate fingerprint generation based on session data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const uniquenessScore = Math.min(95, Math.max(60, 70 + sessionCount * 2));
    const consistencyIndex = Math.min(95, Math.max(50, 60 + sessionCount * 1.5));
    const evolutionRate = Math.min(95, Math.max(40, sessionCount * 3));
    const improvementVelocity = Math.min(95, Math.max(45, 55 + sessionCount * 2.5));
    
    const traitOptions = [
      "Clear articulation",
      "Confident tone",
      "Measured pace",
      "Engaging delivery",
      "Strong presence",
      "Natural flow",
      "Expressive voice",
      "Good timing"
    ];
    
    const dominantTraits = traitOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4, Math.max(2, Math.floor(sessionCount / 3))));
    
    const patterns = [
      "Analytical Communicator",
      "Passionate Speaker",
      "Thoughtful Presenter",
      "Dynamic Storyteller",
      "Authoritative Voice",
      "Engaging Conversationalist"
    ];
    
    const speakingPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    setFingerprint({
      uniquenessScore,
      consistencyIndex,
      evolutionRate,
      dominantTraits,
      speakingPattern,
      improvementVelocity
    });
    
    setIsGenerating(false);
  };

  return (
    <Card className="gradient-card purple-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Fingerprint className="w-6 h-6 text-purple-600" />
          <span className="gradient-text font-heading">Speech Fingerprint</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!fingerprint ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
              <Fingerprint className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-heading mb-2">Generate Your Speech Fingerprint</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create a unique profile based on your {sessionCount} practice sessions
            </p>
            <Button 
              onClick={generateFingerprint}
              disabled={isGenerating}
              className="gradient-bg text-white hover:opacity-90 purple-glow"
            >
              {isGenerating ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Speech Patterns...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Fingerprint
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Fingerprint Display */}
            <div className="text-center bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
              <div className="w-20 h-20 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center purple-glow">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-display mb-2 gradient-text">{fingerprint.speakingPattern}</h3>
              <Badge className="bg-purple-100 text-purple-800">
                Uniqueness Score: {fingerprint.uniquenessScore}%
              </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  label: "Consistency", 
                  value: fingerprint.consistencyIndex, 
                  icon: Target,
                  description: "How consistent your speaking style is"
                },
                { 
                  label: "Evolution", 
                  value: fingerprint.evolutionRate, 
                  icon: TrendingUp,
                  description: "How much your style has developed"
                },
                { 
                  label: "Improvement", 
                  value: fingerprint.improvementVelocity, 
                  icon: Activity,
                  description: "Rate of skill development"
                },
                { 
                  label: "Uniqueness", 
                  value: fingerprint.uniquenessScore, 
                  icon: Star,
                  description: "How distinctive your style is"
                }
              ].map((metric, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <metric.icon className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-gray-900">{metric.label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dominant Traits */}
            <div className="space-y-3">
              <h4 className="font-heading text-lg">Dominant Traits</h4>
              <div className="flex flex-wrap gap-2">
                {fingerprint.dominantTraits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setFingerprint(null)}
              variant="outline"
              className="w-full"
            >
              Generate New Fingerprint
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}