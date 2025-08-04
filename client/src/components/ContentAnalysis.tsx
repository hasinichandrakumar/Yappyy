import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Brain,
  BarChart3,
  Zap,
  Eye,
  Heart,
  BookOpen,
  ArrowRight,
  Star,
  Quote
} from "lucide-react";

interface TranscriptSegment {
  timestamp: string;
  text: string;
  confidence: number;
  pace: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  fillerWords: string[];
  keyPhrases: string[];
}

interface ContentMetrics {
  structure: {
    introduction: number;
    body: number;
    conclusion: number;
    transitions: number;
    overall: number;
  };
  engagement: {
    storytelling: number;
    emotional_appeal: number;
    audience_connection: number;
    call_to_action: number;
    overall: number;
  };
  clarity: {
    word_choice: number;
    sentence_structure: number;
    logical_flow: number;
    key_message_clarity: number;
    overall: number;
  };
  persuasiveness: {
    evidence_support: number;
    credibility: number;
    logical_reasoning: number;
    emotional_resonance: number;
    overall: number;
  };
}

interface ContentInsights {
  keyStrengths: string[];
  improvementAreas: string[];
  suggestedChanges: Array<{
    type: 'addition' | 'modification' | 'removal';
    location: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  alternativePhrasings: Array<{
    original: string;
    suggested: string;
    reason: string;
  }>;
  rhetoricalDevices: Array<{
    device: string;
    usage: number;
    effectiveness: number;
    examples: string[];
  }>;
}

export default function ContentAnalysis() {
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [metrics, setMetrics] = useState<ContentMetrics | null>(null);
  const [insights, setInsights] = useState<ContentInsights | null>(null);
  const [activeTab, setActiveTab] = useState("transcript");
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  useEffect(() => {
    // Load comprehensive content analysis data
    const mockTranscript: TranscriptSegment[] = [
      {
        timestamp: "0:00",
        text: "Good morning everyone, thank you for joining me today.",
        confidence: 95,
        pace: 140,
        sentiment: 'positive',
        fillerWords: [],
        keyPhrases: ["thank you", "joining me"]
      },
      {
        timestamp: "0:05",
        text: "Um, I want to, uh, talk about the importance of, you know, effective communication.",
        confidence: 78,
        pace: 120,
        sentiment: 'neutral',
        fillerWords: ["Um", "uh", "you know"],
        keyPhrases: ["effective communication"]
      },
      {
        timestamp: "0:12",
        text: "Research shows that strong communication skills can increase your career prospects by up to 85%.",
        confidence: 92,
        pace: 155,
        sentiment: 'positive',
        fillerWords: [],
        keyPhrases: ["Research shows", "career prospects", "85%"]
      },
      {
        timestamp: "0:20",
        text: "Let me share three key strategies that have transformed how thousands of professionals communicate.",
        confidence: 89,
        pace: 145,
        sentiment: 'positive',
        fillerWords: [],
        keyPhrases: ["three key strategies", "thousands of professionals"]
      },
      {
        timestamp: "0:28",
        text: "First, like, the power of storytelling cannot be understated in, um, business presentations.",
        confidence: 82,
        pace: 135,
        sentiment: 'positive',
        fillerWords: ["like", "um"],
        keyPhrases: ["power of storytelling", "business presentations"]
      }
    ];

    const mockMetrics: ContentMetrics = {
      structure: {
        introduction: 85,
        body: 78,
        conclusion: 70,
        transitions: 82,
        overall: 79
      },
      engagement: {
        storytelling: 72,
        emotional_appeal: 68,
        audience_connection: 75,
        call_to_action: 65,
        overall: 70
      },
      clarity: {
        word_choice: 82,
        sentence_structure: 76,
        logical_flow: 80,
        key_message_clarity: 78,
        overall: 79
      },
      persuasiveness: {
        evidence_support: 88,
        credibility: 82,
        logical_reasoning: 85,
        emotional_resonance: 71,
        overall: 82
      }
    };

    const mockInsights: ContentInsights = {
      keyStrengths: [
        "Strong statistical evidence (85% career improvement claim)",
        "Clear structure with numbered strategies",
        "Professional opening and audience acknowledgment",
        "Credible research references"
      ],
      improvementAreas: [
        "Reduce filler words (um, uh, like, you know)",
        "Strengthen conclusion with clear call-to-action",
        "Add more emotional storytelling elements",
        "Improve transition between main points"
      ],
      suggestedChanges: [
        {
          type: 'modification',
          location: '0:05',
          suggestion: 'Replace "Um, I want to, uh, talk about" with "Today I\'ll discuss"',
          impact: 'high'
        },
        {
          type: 'addition',
          location: '0:28',
          suggestion: 'Add specific example after mentioning storytelling power',
          impact: 'medium'
        },
        {
          type: 'modification',
          location: '0:28',
          suggestion: 'Remove "like" and "um" - say "First, the power of storytelling cannot be understated in business presentations"',
          impact: 'high'
        }
      ],
      alternativePhrasings: [
        {
          original: "cannot be understated",
          suggested: "is absolutely crucial",
          reason: "More direct and impactful"
        },
        {
          original: "you know",
          suggested: "[remove entirely]",
          reason: "Filler word that weakens authority"
        }
      ],
      rhetoricalDevices: [
        {
          device: "Statistics",
          usage: 2,
          effectiveness: 90,
          examples: ["85% career improvement", "thousands of professionals"]
        },
        {
          device: "Rule of Three",
          usage: 1,
          effectiveness: 85,
          examples: ["three key strategies"]
        },
        {
          device: "Direct Address",
          usage: 3,
          effectiveness: 75,
          examples: ["thank you for joining me", "Let me share"]
        }
      ]
    };

    setTranscript(mockTranscript);
    setMetrics(mockMetrics);
    setInsights(mockInsights);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-100";
    if (confidence >= 80) return "text-blue-600 bg-blue-100";
    if (confidence >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 65) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-500 rotate-90" />;
    }
  };

  if (!metrics || !insights) return <div>Loading content analysis...</div>;

  return (
    <div className="space-y-6">
      {/* Content Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-purple-600" />
            <span>Content Analysis Overview</span>
          </CardTitle>
          <p className="text-purple-700">AI-powered analysis of your speech content, structure, and messaging effectiveness</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Structure', score: metrics.structure.overall, icon: BookOpen },
              { label: 'Engagement', score: metrics.engagement.overall, icon: Heart },
              { label: 'Clarity', score: metrics.clarity.overall, icon: Eye },
              { label: 'Persuasiveness', score: metrics.persuasiveness.overall, icon: Target }
            ].map((metric, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <metric.icon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                  {metric.score}%
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <Progress value={metric.score} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transcript" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Transcript</span>
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Structure</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Suggestions</span>
          </TabsTrigger>
        </TabsList>

        {/* Interactive Transcript */}
        <TabsContent value="transcript" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Transcript</CardTitle>
                  <p className="text-gray-600">Click on any segment for detailed analysis</p>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {transcript.map((segment, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedSegment === index 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSegment(index)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {segment.timestamp}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            {getSentimentIcon(segment.sentiment)}
                            <Badge className={getConfidenceColor(segment.confidence)}>
                              {segment.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-900 leading-relaxed">{segment.text}</p>
                        {segment.fillerWords.length > 0 && (
                          <div className="mt-2 flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-yellow-600">
                              Filler words: {segment.fillerWords.join(', ')}
                            </span>
                          </div>
                        )}
                        {segment.keyPhrases.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {segment.keyPhrases.map((phrase, phraseIndex) => (
                              <Badge key={phraseIndex} variant="secondary" className="text-xs">
                                {phrase}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Segment Details */}
            <div>
              {selectedSegment !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle>Segment Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Speaking Pace</h4>
                        <div className="flex items-center space-x-2">
                          <Progress value={Math.min(100, transcript[selectedSegment].pace / 2)} className="flex-1" />
                          <span className="text-sm font-medium">{transcript[selectedSegment].pace} WPM</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Confidence Level</h4>
                        <div className="flex items-center space-x-2">
                          <Progress value={transcript[selectedSegment].confidence} className="flex-1" />
                          <span className="text-sm font-medium">{transcript[selectedSegment].confidence}%</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Sentiment</h4>
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(transcript[selectedSegment].sentiment)}
                          <span className="text-sm capitalize">{transcript[selectedSegment].sentiment}</span>
                        </div>
                      </div>

                      {transcript[selectedSegment].fillerWords.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-yellow-600">Issues Found</h4>
                          <div className="space-y-1">
                            {transcript[selectedSegment].fillerWords.map((word, index) => (
                              <div key={index} className="text-sm text-yellow-600 flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Filler word: "{word}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Structure Analysis */}
        <TabsContent value="structure" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.structure).filter(([key]) => key !== 'overall').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize text-gray-700">{key.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={value} className="w-24" />
                        <span className={`font-medium ${getScoreColor(value)}`}>{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.engagement).filter(([key]) => key !== 'overall').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize text-gray-700">{key.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={value} className="w-24" />
                        <span className={`font-medium ${getScoreColor(value)}`}>{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Clarity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.clarity).filter(([key]) => key !== 'overall').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize text-gray-700">{key.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={value} className="w-24" />
                        <span className={`font-medium ${getScoreColor(value)}`}>{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Persuasiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.persuasiveness).filter(([key]) => key !== 'overall').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize text-gray-700">{key.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={value} className="w-24" />
                        <span className={`font-medium ${getScoreColor(value)}`}>{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>Key Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.keyStrengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <Star className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-700">
                  <Target className="w-5 h-5" />
                  <span>Improvement Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <span className="text-sm text-orange-800">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Rhetorical Devices Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insights.rhetoricalDevices.map((device, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{device.device}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Usage</span>
                          <span className="font-medium">{device.usage} times</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Effectiveness</span>
                          <span className={`font-medium ${getScoreColor(device.effectiveness)}`}>
                            {device.effectiveness}%
                          </span>
                        </div>
                        <Progress value={device.effectiveness} className="h-2" />
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">Examples:</p>
                          {device.examples.map((example, exIndex) => (
                            <div key={exIndex} className="flex items-start space-x-1">
                              <Quote className="w-3 h-3 text-gray-400 mt-0.5" />
                              <span className="text-xs text-gray-700">"{example}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Suggestions */}
        <TabsContent value="suggestions" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Improvements</CardTitle>
                <p className="text-gray-600">AI-generated recommendations to enhance your content</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.suggestedChanges.map((change, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            change.impact === 'high' ? 'bg-red-100 text-red-800' :
                            change.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {change.impact} impact
                          </Badge>
                          <Badge variant="outline">
                            {change.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{change.location}</span>
                      </div>
                      <p className="text-gray-900">{change.suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternative Phrasings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.alternativePhrasings.map((phrase, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-red-600 mb-1">Original</h4>
                          <p className="text-sm text-gray-700">"{phrase.original}"</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">Suggested</h4>
                          <p className="text-sm text-gray-700">"{phrase.suggested}"</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-700">{phrase.reason}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}