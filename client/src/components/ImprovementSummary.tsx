import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Star,
  Zap,
  Brain
} from "lucide-react";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { apiRequest } from "@/lib/queryClient";

interface ImprovementArea {
  category: string;
  priority: 'high' | 'medium' | 'low';
  currentScore: number;
  targetScore: number;
  issue: string;
  howToImprove: string[];
  timeToImprove: string;
  practiceExercises: string[];
}

interface AIAnalysis {
  overallAssessment: string;
  topPriorities: ImprovementArea[];
  strengthsToMaintain: string[];
  quickWins: string[];
  longTermGoals: string[];
}

export default function ImprovementSummary() {
  const { speakingPace, voiceClarity, confidenceScore, volumeLevel } = useVoiceAnalysis();
  const { transcript, wordCount } = useSpeechRecognition();
  const { posture, gesture, eyeContact } = useMediaPipe();

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    overallAssessment: "",
    topPriorities: [],
    strengthsToMaintain: [],
    quickWins: [],
    longTermGoals: []
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);

  const generateImprovementPlan = async () => {
    setIsAnalyzing(true);
    try {
      // Compile all current metrics
      const allMetrics = {
        voice: {
          speakingPace,
          voiceClarity,
          confidenceScore,
          volumeLevel
        },
        speech: {
          transcript: transcript?.slice(-500) || "",
          wordCount,
          sessionTime
        },
        bodyLanguage: {
          posture: posture || "unknown",
          gesture: gesture || "unknown", 
          eyeContact: eyeContact || "unknown"
        }
      };

      const response = await apiRequest('POST', '/api/generate-improvement-plan', {
        metrics: allMetrics,
        sessionData: {
          duration: sessionTime,
          wordCount
        }
      });

      const result = await response.json();
      setAiAnalysis(result);
      setLastAnalysisTime(Date.now());
    } catch (error) {
      console.error('Failed to generate improvement plan:', error);
      // Provide fallback analysis based on current metrics
      generateFallbackAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFallbackAnalysis = () => {
    const priorities: ImprovementArea[] = [];

    // Analyze speaking pace
    if (speakingPace < 120 || speakingPace > 160) {
      priorities.push({
        category: "Speaking Pace",
        priority: speakingPace < 100 || speakingPace > 180 ? 'high' : 'medium',
        currentScore: speakingPace >= 120 && speakingPace <= 160 ? 85 : 45,
        targetScore: 85,
        issue: speakingPace < 120 ? "Speaking too slowly, may lose audience attention" : "Speaking too fast, reducing comprehension",
        howToImprove: [
          speakingPace < 120 ? "Practice speaking with more energy and urgency" : "Slow down and emphasize key points",
          "Use a metronome app to practice consistent pacing",
          "Record yourself and analyze pace variations",
          "Practice with tongue twisters to improve articulation"
        ],
        timeToImprove: "1-2 weeks with daily practice",
        practiceExercises: [
          "Read aloud for 10 minutes daily at target pace",
          "Practice presentations with a timer",
          "Use breathing exercises to control pace"
        ]
      });
    }

    // Analyze voice clarity
    if (voiceClarity < 80) {
      priorities.push({
        category: "Voice Clarity",
        priority: voiceClarity < 60 ? 'high' : 'medium',
        currentScore: voiceClarity,
        targetScore: 85,
        issue: "Unclear articulation affecting message delivery",
        howToImprove: [
          "Practice proper mouth positioning for consonants",
          "Slow down speech to improve enunciation",
          "Warm up vocal cords before speaking",
          "Focus on finishing word endings clearly"
        ],
        timeToImprove: "2-3 weeks with vocal exercises",
        practiceExercises: [
          "Daily tongue twisters and articulation drills",
          "Read poetry aloud focusing on clarity",
          "Practice vowel and consonant exercises"
        ]
      });
    }

    // Analyze confidence
    if (confidenceScore < 70) {
      priorities.push({
        category: "Confidence & Presence",
        priority: confidenceScore < 50 ? 'high' : 'medium',
        currentScore: confidenceScore,
        targetScore: 80,
        issue: "Low confidence affecting audience engagement",
        howToImprove: [
          "Practice power poses before presentations",
          "Prepare thoroughly to reduce anxiety",
          "Start with smaller, friendly audiences",
          "Use positive self-talk and visualization"
        ],
        timeToImprove: "3-4 weeks with consistent practice",
        practiceExercises: [
          "Record daily affirmations",
          "Practice in front of mirror",
          "Join speaking groups or clubs"
        ]
      });
    }

    // Analyze body language
    if (posture !== 'good' || gesture !== 'open' || eyeContact !== 'good') {
      priorities.push({
        category: "Body Language",
        priority: 'medium',
        currentScore: 60,
        targetScore: 85,
        issue: "Body language not supporting verbal message effectively",
        howToImprove: [
          "Maintain straight posture with shoulders back",
          "Use open hand gestures to appear welcoming",
          "Practice sustained eye contact with individuals",
          "Avoid fidgeting or closed-off positions"
        ],
        timeToImprove: "2-3 weeks with mindful practice",
        practiceExercises: [
          "Practice presentations with body language focus",
          "Use video recording to analyze gestures",
          "Wall exercises for posture improvement"
        ]
      });
    }

    // Sort by priority
    priorities.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setAiAnalysis({
      overallAssessment: `Based on your current session, you show ${priorities.length === 0 ? 'strong' : 'developing'} presentation skills. ${priorities.length > 0 ? `Focus on ${priorities[0].category.toLowerCase()} for the most immediate impact.` : 'Continue practicing to maintain your excellent form.'}`,
      topPriorities: priorities.slice(0, 3),
      strengthsToMaintain: [
        ...(speakingPace >= 120 && speakingPace <= 160 ? ["Optimal speaking pace"] : []),
        ...(voiceClarity >= 80 ? ["Clear voice articulation"] : []),
        ...(confidenceScore >= 70 ? ["Strong confidence level"] : []),
        ...(posture === 'good' ? ["Good posture maintenance"] : [])
      ],
      quickWins: [
        "Take three deep breaths before starting",
        "Stand with feet shoulder-width apart",
        "Make eye contact with different audience sections",
        "Use hand gestures to emphasize key points"
      ],
      longTermGoals: [
        "Develop signature storytelling style",
        "Master advanced rhetorical techniques",
        "Build compelling presentation structures",
        "Cultivate authentic stage presence"
      ]
    });
  };

  // Auto-generate analysis when metrics change significantly
  useEffect(() => {
    const now = Date.now();
    if (transcript && transcript.length > 100 && now - lastAnalysisTime > 60000) {
      generateImprovementPlan();
    }
  }, [transcript, speakingPace, voiceClarity, confidenceScore]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'low': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Target;
      case 'low': return TrendingUp;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-cyan-600" />
              <span className="text-cyan-900 font-heading tracking-tight">AI Improvement Summary</span>
            </div>
            <Button 
              onClick={generateImprovementPlan}
              disabled={isAnalyzing}
              className="bg-cyan-600 text-white hover:bg-cyan-700"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {aiAnalysis.overallAssessment && (
          <CardContent>
            <div className="p-4 bg-white/70 rounded-lg border border-cyan-200">
              <h4 className="font-heading text-cyan-900 mb-2">Overall Assessment</h4>
              <p className="font-body text-cyan-800">{aiAnalysis.overallAssessment}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Priority Improvements */}
      {aiAnalysis.topPriorities.length > 0 && (
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-red-600" />
              <span>Priority Improvements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiAnalysis.topPriorities.map((area, index) => {
              const PriorityIcon = getPriorityIcon(area.priority);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <PriorityIcon className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-heading text-gray-900 tracking-tight">{area.category}</h3>
                    </div>
                    <Badge className={getPriorityColor(area.priority)}>
                      {area.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium font-heading text-gray-900 mb-2">Current vs Target</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current: {area.currentScore}%</span>
                          <span>Target: {area.targetScore}%</span>
                        </div>
                        <Progress value={area.currentScore} className="h-2" />
                        <p className="text-sm text-gray-600">{area.issue}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Time to Improve</h4>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm font-medium text-gray-700">{area.timeToImprove}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span>How to Improve</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {area.howToImprove.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start space-x-2">
                          <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Practice Exercises</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {area.practiceExercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-800">{exercise}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Quick Wins & Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiAnalysis.quickWins.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Zap className="w-5 h-5" />
                <span>Quick Wins</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiAnalysis.quickWins.map((win, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">{win}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {aiAnalysis.strengthsToMaintain.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Star className="w-5 h-5" />
                <span>Strengths to Maintain</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiAnalysis.strengthsToMaintain.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Long-term Goals */}
      {aiAnalysis.longTermGoals.length > 0 && (
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Long-term Development Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiAnalysis.longTermGoals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-800">{goal}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}