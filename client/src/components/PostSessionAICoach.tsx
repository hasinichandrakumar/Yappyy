import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  MessageSquare, 
  User, 
  Volume2, 
  Target, 
  TrendingUp, 
  Eye, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Mic,
  BookOpen,
  Award,
  Star
} from 'lucide-react';

interface PostSessionData {
  sessionName: string;
  sessionPurpose: string;
  sessionType: 'general' | 'roleplay';
  selectedRoleplay?: string;
  transcript: string;
  duration: number;
  wordCount: number;
  fillerWords: string[];
  avgWPM: number;
  eyeContactScore: number;
  postureScore: number;
  voiceClarity: number;
  confidenceScore: number;
}

interface ContentAnalysis {
  purposeAlignment: number;
  structureScore: number;
  clarityScore: number;
  engagementScore: number;
  persuasivenessScore: number;
  overallContentScore: number;
}

interface VoiceCoachFeedback {
  clarity: {
    score: number;
    feedback: string;
    exercises: string[];
  };
  pace: {
    score: number;
    feedback: string;
    exercises: string[];
  };
  volume: {
    score: number;
    feedback: string;
    exercises: string[];
  };
  intonation: {
    score: number;
    feedback: string;
    exercises: string[];
  };
}

interface BodyLanguageFeedback {
  eyeContact: {
    score: number;
    feedback: string;
    tips: string[];
  };
  posture: {
    score: number;
    feedback: string;
    tips: string[];
  };
  gestures: {
    score: number;
    feedback: string;
    tips: string[];
  };
  presence: {
    score: number;
    feedback: string;
    tips: string[];
  };
}

interface PostSessionAICoachProps {
  sessionData?: PostSessionData;
}

export default function PostSessionAICoach({ sessionData }: PostSessionAICoachProps) {
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null);
  const [voiceFeedback, setVoiceFeedback] = useState<VoiceCoachFeedback | null>(null);
  const [bodyLanguageFeedback, setBodyLanguageFeedback] = useState<BodyLanguageFeedback | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    if (sessionData) {
      analyzeSession(sessionData);
    }
  }, [sessionData]);

  const analyzeSession = (data: PostSessionData) => {
    // Analyze content relevance to purpose
    const contentAnalysis = analyzeContentPurpose(data);
    setContentAnalysis(contentAnalysis);

    // Generate voice coaching feedback
    const voiceAnalysis = analyzeVoicePerformance(data);
    setVoiceFeedback(voiceAnalysis);

    // Generate body language feedback
    const bodyAnalysis = analyzeBodyLanguage(data);
    setBodyLanguageFeedback(bodyAnalysis);

    // Calculate overall score
    const overall = (contentAnalysis.overallContentScore + 
                    voiceAnalysis.clarity.score + 
                    bodyAnalysis.presence.score) / 3;
    setOverallScore(overall);
  };

  const analyzeContentPurpose = (data: PostSessionData): ContentAnalysis => {
    const words = data.transcript.toLowerCase().split(' ');
    const purposeWords = data.sessionPurpose.toLowerCase().split(' ');
    
    // Calculate purpose alignment based on keyword overlap and context
    let alignmentScore = 0;
    let keywordMatches = 0;
    
    purposeWords.forEach(word => {
      if (words.includes(word) && word.length > 3) {
        keywordMatches++;
      }
    });
    
    alignmentScore = Math.min(90, (keywordMatches / Math.max(purposeWords.length, 1)) * 100);

    // Analyze structure based on common speech patterns
    const hasOpening = /^(hello|hi|good morning|good afternoon|welcome|today|i'm here|let me)/i.test(data.transcript);
    const hasClosing = /(thank you|questions|conclusion|end|finally|in summary)/i.test(data.transcript);
    const hasTransitions = /(first|second|next|finally|however|therefore|in addition)/i.test(data.transcript);
    
    const structureScore = (hasOpening ? 30 : 0) + (hasClosing ? 30 : 0) + (hasTransitions ? 40 : 0);

    // Analyze clarity based on sentence structure and filler ratio
    const fillerRatio = data.fillerWords.length / Math.max(data.wordCount, 1);
    const clarityScore = Math.max(20, 100 - (fillerRatio * 200));

    // Analyze engagement based on varied vocabulary and questions
    const uniqueWords = new Set(words).size;
    const vocabularyRichness = (uniqueWords / Math.max(words.length, 1)) * 100;
    const hasQuestions = /\?/.test(data.transcript);
    const engagementScore = Math.min(100, vocabularyRichness * 1.5 + (hasQuestions ? 20 : 0));

    // Analyze persuasiveness based on strong language and examples
    const strongWords = ['must', 'should', 'will', 'can', 'because', 'evidence', 'proven', 'results'];
    const strongWordCount = strongWords.filter(word => words.includes(word)).length;
    const hasExamples = /(for example|such as|instance|case|study)/i.test(data.transcript);
    const persuasivenessScore = Math.min(100, (strongWordCount * 10) + (hasExamples ? 30 : 0));

    const overallContentScore = (alignmentScore + structureScore + clarityScore + engagementScore + persuasivenessScore) / 5;

    return {
      purposeAlignment: alignmentScore,
      structureScore,
      clarityScore,
      engagementScore,
      persuasivenessScore,
      overallContentScore
    };
  };

  const analyzeVoicePerformance = (data: PostSessionData): VoiceCoachFeedback => {
    // Clarity analysis
    const fillerRatio = data.fillerWords.length / Math.max(data.wordCount, 1);
    const clarityScore = Math.max(20, 100 - (fillerRatio * 300));
    
    let clarityFeedback = "";
    let clarityExercises: string[] = [];
    
    if (clarityScore >= 85) {
      clarityFeedback = "Excellent clarity! Your articulation is crisp and professional.";
      clarityExercises = ["Practice complex tongue twisters to maintain precision", "Record yourself reading technical content"];
    } else if (clarityScore >= 70) {
      clarityFeedback = "Good clarity with room for improvement in reducing filler words.";
      clarityExercises = ["Practice pausing instead of using filler words", "Record 2-minute speeches and count fillers"];
    } else {
      clarityFeedback = "Focus on clearer articulation and eliminating filler words significantly.";
      clarityExercises = ["Daily tongue twisters for 5 minutes", "Practice speaking slowly and deliberately", "Use a metronome to control pace"];
    }

    // Pace analysis
    let paceScore = 0;
    let paceFeedback = "";
    let paceExercises: string[] = [];
    
    if (data.avgWPM >= 130 && data.avgWPM <= 170) {
      paceScore = 90;
      paceFeedback = "Perfect speaking pace! You maintain an engaging rhythm.";
      paceExercises = ["Practice varying pace for emphasis", "Use dramatic pauses for impact"];
    } else if (data.avgWPM < 130) {
      paceScore = 60;
      paceFeedback = "Your pace is too slow. Increase energy and speaking speed.";
      paceExercises = ["Practice reading aloud at 150 WPM", "Use a timer to increase speaking velocity", "Practice high-energy presentations"];
    } else {
      paceScore = 65;
      paceFeedback = "You're speaking too fast. Slow down for better comprehension.";
      paceExercises = ["Practice breathing exercises between sentences", "Use deliberate pauses", "Record yourself and play back at slower speed"];
    }

    // Volume analysis (based on confidence score as proxy)
    const volumeScore = data.confidenceScore;
    let volumeFeedback = "";
    let volumeExercises: string[] = [];
    
    if (volumeScore >= 80) {
      volumeFeedback = "Strong vocal projection and confidence.";
      volumeExercises = ["Practice volume variations for emphasis", "Work on whisper-to-shout exercises"];
    } else {
      volumeFeedback = "Increase vocal projection and confidence.";
      volumeExercises = ["Practice diaphragmatic breathing", "Stand while speaking to improve projection", "Practice in larger spaces"];
    }

    // Intonation analysis
    const intonationScore = Math.min(100, data.voiceClarity + (data.wordCount > 100 ? 20 : 0));
    let intonationFeedback = "";
    let intonationExercises: string[] = [];
    
    if (intonationScore >= 80) {
      intonationFeedback = "Good vocal variety and expression.";
      intonationExercises = ["Practice emotional range exercises", "Work on storytelling inflection"];
    } else {
      intonationFeedback = "Add more vocal variety and emotional expression.";
      intonationExercises = ["Practice reading children's stories with expression", "Record news anchors and mimic their intonation", "Practice emphasizing different words in sentences"];
    }

    return {
      clarity: { score: clarityScore, feedback: clarityFeedback, exercises: clarityExercises },
      pace: { score: paceScore, feedback: paceFeedback, exercises: paceExercises },
      volume: { score: volumeScore, feedback: volumeFeedback, exercises: volumeExercises },
      intonation: { score: intonationScore, feedback: intonationFeedback, exercises: intonationExercises }
    };
  };

  const analyzeBodyLanguage = (data: PostSessionData): BodyLanguageFeedback => {
    // Eye contact analysis
    let eyeContactFeedback = "";
    let eyeContactTips: string[] = [];
    
    if (data.eyeContactScore >= 80) {
      eyeContactFeedback = "Excellent eye contact! You maintain strong connection with your audience.";
      eyeContactTips = ["Practice the triangle technique for large audiences", "Use eye contact to emphasize key points"];
    } else if (data.eyeContactScore >= 60) {
      eyeContactFeedback = "Good eye contact with room for improvement in consistency.";
      eyeContactTips = ["Practice the 3-second rule per person", "Use notes less frequently", "Practice with mirror or camera"];
    } else {
      eyeContactFeedback = "Significantly improve eye contact to build audience connection.";
      eyeContactTips = ["Start with friendly faces in audience", "Practice looking just above camera lens", "Use the lighthouse technique - sweep the room"];
    }

    // Posture analysis
    let postureFeedback = "";
    let postureTips: string[] = [];
    
    if (data.postureScore >= 80) {
      postureFeedback = "Strong, confident posture that commands attention.";
      postureTips = ["Practice dynamic movement", "Use posture to emphasize points"];
    } else if (data.postureScore >= 60) {
      postureFeedback = "Good posture with occasional lapses.";
      postureTips = ["Set posture reminders during practice", "Strengthen core muscles", "Practice wall exercises"];
    } else {
      postureFeedback = "Focus on improving posture for more confident presence.";
      postureTips = ["Stand against wall for 5 minutes daily", "Practice power poses before speaking", "Use video feedback for posture awareness"];
    }

    // Gestures analysis (estimated based on overall performance)
    const gestureScore = (data.eyeContactScore + data.postureScore) / 2;
    let gestureFeedback = "";
    let gestureTips: string[] = [];
    
    if (gestureScore >= 80) {
      gestureFeedback = "Natural and purposeful gestures enhance your message.";
      gestureTips = ["Practice gesture-speech synchronization", "Add more descriptive gestures"];
    } else {
      gestureFeedback = "Increase natural gesture usage to support your words.";
      gestureTips = ["Practice describing shapes and sizes with hands", "Use the gesture box technique", "Watch TED talks and mimic gestures"];
    }

    // Overall presence
    const presenceScore = (data.eyeContactScore + data.postureScore + data.confidenceScore) / 3;
    let presenceFeedback = "";
    let presenceTips: string[] = [];
    
    if (presenceScore >= 80) {
      presenceFeedback = "Commanding presence that engages and inspires confidence.";
      presenceTips = ["Work on stage presence for larger venues", "Practice authentic charisma"];
    } else {
      presenceFeedback = "Build stronger stage presence through confidence and body awareness.";
      presenceTips = ["Practice in front of mirrors", "Record yourself regularly", "Work on authentic confidence building"];
    }

    return {
      eyeContact: { score: data.eyeContactScore, feedback: eyeContactFeedback, tips: eyeContactTips },
      posture: { score: data.postureScore, feedback: postureFeedback, tips: postureTips },
      gestures: { score: gestureScore, feedback: gestureFeedback, tips: gestureTips },
      presence: { score: presenceScore, feedback: presenceFeedback, tips: presenceTips }
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  if (!sessionData) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Session Data</h3>
        <p className="text-gray-500">Complete a practice session to get detailed AI coaching feedback.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Session Performance Summary</span>
            </div>
            <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}>
              {(() => {
                const score = Number(overallScore);
                return isNaN(score) ? "0%" : `${Math.round(score)}%`;
              })()} Overall
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessionData.duration}s</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sessionData.wordCount}</div>
              <div className="text-sm text-gray-600">Words Spoken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sessionData.avgWPM}</div>
              <div className="text-sm text-gray-600">Average WPM</div>
            </div>
          </div>
          
          {sessionData.sessionPurpose && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Session Purpose</div>
              <div className="text-sm text-blue-700">{sessionData.sessionPurpose}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Content Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4" />
            <span>Voice Coach</span>
          </TabsTrigger>
          <TabsTrigger value="body" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Body Language</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Analysis Tab */}
        <TabsContent value="content" className="space-y-4">
          {contentAnalysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Content & Purpose Alignment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Purpose Alignment</span>
                        <span className={`font-medium ${getScoreColor(contentAnalysis.purposeAlignment)}`}>
                          {(() => {
                            const score = Number(contentAnalysis.purposeAlignment);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={contentAnalysis.purposeAlignment} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Speech Structure</span>
                        <span className={`font-medium ${getScoreColor(contentAnalysis.structureScore)}`}>
                          {(() => {
                            const score = Number(contentAnalysis.structureScore);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={contentAnalysis.structureScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Message Clarity</span>
                        <span className={`font-medium ${getScoreColor(contentAnalysis.clarityScore)}`}>
                          {(() => {
                            const score = Number(contentAnalysis.clarityScore);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={contentAnalysis.clarityScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Audience Engagement</span>
                        <span className={`font-medium ${getScoreColor(contentAnalysis.engagementScore)}`}>
                          {(() => {
                            const score = Number(contentAnalysis.engagementScore);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={contentAnalysis.engagementScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Persuasiveness</span>
                        <span className={`font-medium ${getScoreColor(contentAnalysis.persuasivenessScore)}`}>
                          {(() => {
                            const score = Number(contentAnalysis.persuasivenessScore);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={contentAnalysis.persuasivenessScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span>Content Improvement Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentAnalysis.purposeAlignment < 70 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Purpose Alignment</h4>
                        <p className="text-sm text-yellow-700 mb-2">Your content doesn't strongly align with your stated purpose.</p>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Include more specific examples related to your purpose</li>
                          <li>• Use keywords from your purpose statement throughout</li>
                          <li>• Create clear connections between points and your main goal</li>
                        </ul>
                      </div>
                    )}
                    
                    {contentAnalysis.structureScore < 70 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Speech Structure</h4>
                        <p className="text-sm text-red-700 mb-2">Improve your speech organization for better flow.</p>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Start with a clear opening that sets expectations</li>
                          <li>• Use transition phrases between main points</li>
                          <li>• End with a memorable conclusion that reinforces your message</li>
                        </ul>
                      </div>
                    )}
                    
                    {contentAnalysis.engagementScore < 70 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Audience Engagement</h4>
                        <p className="text-sm text-blue-700 mb-2">Make your content more engaging and interactive.</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Ask rhetorical questions to involve your audience</li>
                          <li>• Use varied vocabulary and avoid repetition</li>
                          <li>• Include personal stories or relevant examples</li>
                        </ul>
                      </div>
                    )}
                    
                    {contentAnalysis.persuasivenessScore < 70 && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-medium text-purple-800 mb-2">Persuasiveness</h4>
                        <p className="text-sm text-purple-700 mb-2">Strengthen your arguments with evidence and conviction.</p>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• Use stronger, more definitive language</li>
                          <li>• Include specific examples and case studies</li>
                          <li>• Support claims with credible evidence</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Voice Coach Tab */}
        <TabsContent value="voice" className="space-y-4">
          {voiceFeedback && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Clarity</span>
                      <Badge variant={voiceFeedback.clarity.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(voiceFeedback.clarity.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(voiceFeedback.clarity.score)}`}>
                          {(() => {
                            const score = Number(voiceFeedback.clarity.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={voiceFeedback.clarity.score} className="h-2" />
                      <p className="text-sm text-gray-600">{voiceFeedback.clarity.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Exercises:</h5>
                        {voiceFeedback.clarity.exercises.map((exercise, index) => (
                          <p key={index} className="text-xs text-gray-600">• {exercise}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Pace</span>
                      <Badge variant={voiceFeedback.pace.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(voiceFeedback.pace.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(voiceFeedback.pace.score)}`}>
                          {(() => {
                            const score = Number(voiceFeedback.pace.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={voiceFeedback.pace.score} className="h-2" />
                      <p className="text-sm text-gray-600">{voiceFeedback.pace.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Exercises:</h5>
                        {voiceFeedback.pace.exercises.map((exercise, index) => (
                          <p key={index} className="text-xs text-gray-600">• {exercise}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Volume & Projection</span>
                      <Badge variant={voiceFeedback.volume.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(voiceFeedback.volume.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(voiceFeedback.volume.score)}`}>
                          {(() => {
                            const score = Number(voiceFeedback.volume.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={voiceFeedback.volume.score} className="h-2" />
                      <p className="text-sm text-gray-600">{voiceFeedback.volume.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Exercises:</h5>
                        {voiceFeedback.volume.exercises.map((exercise, index) => (
                          <p key={index} className="text-xs text-gray-600">• {exercise}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Intonation & Expression</span>
                      <Badge variant={voiceFeedback.intonation.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(voiceFeedback.intonation.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(voiceFeedback.intonation.score)}`}>
                          {(() => {
                            const score = Number(voiceFeedback.intonation.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={voiceFeedback.intonation.score} className="h-2" />
                      <p className="text-sm text-gray-600">{voiceFeedback.intonation.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Exercises:</h5>
                        {voiceFeedback.intonation.exercises.map((exercise, index) => (
                          <p key={index} className="text-xs text-gray-600">• {exercise}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Body Language Tab */}
        <TabsContent value="body" className="space-y-4">
          {bodyLanguageFeedback && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Eye Contact</span>
                      <Badge variant={bodyLanguageFeedback.eyeContact.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(bodyLanguageFeedback.eyeContact.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(bodyLanguageFeedback.eyeContact.score)}`}>
                          {(() => {
                            const score = Number(bodyLanguageFeedback.eyeContact.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={bodyLanguageFeedback.eyeContact.score} className="h-2" />
                      <p className="text-sm text-gray-600">{bodyLanguageFeedback.eyeContact.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Tips:</h5>
                        {bodyLanguageFeedback.eyeContact.tips.map((tip, index) => (
                          <p key={index} className="text-xs text-gray-600">• {tip}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Posture</span>
                      <Badge variant={bodyLanguageFeedback.posture.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(bodyLanguageFeedback.posture.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(bodyLanguageFeedback.posture.score)}`}>
                          {(() => {
                            const score = Number(bodyLanguageFeedback.posture.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={bodyLanguageFeedback.posture.score} className="h-2" />
                      <p className="text-sm text-gray-600">{bodyLanguageFeedback.posture.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Tips:</h5>
                        {bodyLanguageFeedback.posture.tips.map((tip, index) => (
                          <p key={index} className="text-xs text-gray-600">• {tip}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Gestures</span>
                      <Badge variant={bodyLanguageFeedback.gestures.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(bodyLanguageFeedback.gestures.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(bodyLanguageFeedback.gestures.score)}`}>
                          {(() => {
                            const score = Number(bodyLanguageFeedback.gestures.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={bodyLanguageFeedback.gestures.score} className="h-2" />
                      <p className="text-sm text-gray-600">{bodyLanguageFeedback.gestures.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Tips:</h5>
                        {bodyLanguageFeedback.gestures.tips.map((tip, index) => (
                          <p key={index} className="text-xs text-gray-600">• {tip}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>Overall Presence</span>
                      <Badge variant={bodyLanguageFeedback.presence.score >= 80 ? "default" : "secondary"}>
                        {getScoreBadge(bodyLanguageFeedback.presence.score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className={`font-bold ${getScoreColor(bodyLanguageFeedback.presence.score)}`}>
                          {(() => {
                            const score = Number(bodyLanguageFeedback.presence.score);
                            return isNaN(score) ? "0%" : `${Math.round(score)}%`;
                          })()}
                        </span>
                      </div>
                      <Progress value={bodyLanguageFeedback.presence.score} className="h-2" />
                      <p className="text-sm text-gray-600">{bodyLanguageFeedback.presence.feedback}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium">Tips:</h5>
                        {bodyLanguageFeedback.presence.tips.map((tip, index) => (
                          <p key={index} className="text-xs text-gray-600">• {tip}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}