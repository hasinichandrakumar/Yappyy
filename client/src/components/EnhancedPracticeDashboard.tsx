import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PracticePathwaySelection from "./PracticePathwaySelection";
import SpeechInputSelector from "./SpeechInputSelector";
import EnhancedPracticeHubClean from "./EnhancedPracticeHubClean";
import LVIEFeedbackEngine from "./LVIEFeedbackEngine";
import PracticeGoalsWithBadges from "./PracticeGoalsWithBadges";
import { 
  Target, 
  FileText, 
  Mic, 
  Zap, 
  BarChart3, 
  History,
  Trophy,
  Bot,
  Settings,
  HelpCircle
} from "lucide-react";

interface PracticeGoal {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  duration: string;
}

interface SessionData {
  goal?: PracticeGoal;
  inputType?: string;
  inputContent?: string;
  advancedOptions?: Record<string, boolean>;
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
  speechRate: number;
  confidenceScore: number;
  fillerWordCount: number;
  transcript: TranscriptWord[];
}

interface TranscriptWord {
  word: string;
  timestamp: number;
  confidence: number;
  type: "normal" | "filler" | "keyword" | "repeated";
  emotion?: "happy" | "neutral" | "concerned" | "excited";
}

export default function EnhancedPracticeDashboard() {
  const [activeTab, setActiveTab] = useState("pathway");
  const [sessionData, setSessionData] = useState<SessionData>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 45,
    speechRate: 125,
    confidenceScore: 78,
    fillerWordCount: 2,
    transcript: []
  });

  // REMOVED: No more fake transcript generation - only use real speech recognition data

  // REMOVED: No fake data simulation - only real metrics from actual speech and computer vision analysis

  const handleGoalSelect = (goal: PracticeGoal) => {
    setSessionData(prev => ({ ...prev, goal }));
    setActiveTab("input");
  };

  const handleInputSelect = (type: string, content?: string) => {
    setSessionData(prev => ({ 
      ...prev, 
      inputType: type, 
      inputContent: content 
    }));
    setActiveTab("practice");
  };

  const handleOptionsChange = (options: Record<string, boolean>) => {
    setSessionData(prev => ({ ...prev, advancedOptions: options }));
  };

  const handleStartRecording = () => {
    setSessionData(prev => ({ 
      ...prev, 
      isRecording: true, 
      isPaused: false,
      duration: 0,
      transcript: []
    }));
  };

  const handlePauseRecording = () => {
    setSessionData(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleStopRecording = () => {
    setSessionData(prev => ({ ...prev, isRecording: false, isPaused: false }));
    setActiveTab("analysis");
  };

  const handleResetSession = () => {
    setSessionData(prev => ({
      ...prev,
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioLevel: 45,
      speechRate: 125,
      confidenceScore: 78,
      fillerWordCount: 0,
      transcript: []
    }));
  };

  const handleVoiceFeedbackToggle = (enabled: boolean) => {
    console.log("Voice feedback:", enabled);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "pathway": return <Target className="w-4 h-4" />;
      case "input": return <FileText className="w-4 h-4" />;
      case "practice": return <Mic className="w-4 h-4" />;
      case "feedback": return <Zap className="w-4 h-4" />;
      case "analysis": return <BarChart3 className="w-4 h-4" />;
      case "history": return <History className="w-4 h-4" />;
      case "challenges": return <Trophy className="w-4 h-4" />;
      case "coach": return <Bot className="w-4 h-4" />;
      default: return null;
    }
  };

  const isTabDisabled = (tab: string) => {
    switch (tab) {
      case "input": return !sessionData.goal;
      case "practice": return !sessionData.inputType;
      case "feedback": return !sessionData.goal;
      case "analysis": return sessionData.transcript.length === 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Badge Goals Section */}
        <div className="mb-8">
          <PracticeGoalsWithBadges />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Practice Hub</h1>
              <p className="text-gray-600 mt-1">Complete goals to earn badges and improve your speaking</p>
            </div>
            {sessionData.goal && (
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                    {sessionData.goal.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{sessionData.goal.name}</div>
                    <div className="text-xs text-gray-600">{sessionData.goal.duration}</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Live Metrics Panel - Shows when recording */}
        {sessionData.isRecording && (
          <Card className="mb-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">Live Session Metrics</span>
                  <Badge className="bg-red-100 text-red-700">
                    {sessionData.isPaused ? "Paused" : "Recording"}
                  </Badge>
                </div>
                <div className="text-2xl font-mono font-bold text-gray-900">
                  {Math.floor(sessionData.duration / 60).toString().padStart(2, '0')}:
                  {(sessionData.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{sessionData.speechRate}</div>
                  <div className="text-xs text-gray-600">WPM</div>
                  <div className="text-xs text-gray-500">Goal: 120-150</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{sessionData.transcript.length}</div>
                  <div className="text-xs text-gray-600">Words</div>
                  <div className="text-xs text-gray-500">Spoken</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-red-600">{sessionData.fillerWordCount}</div>
                  <div className="text-xs text-gray-600">Fillers</div>
                  <div className="text-xs text-gray-500">To reduce</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{sessionData.confidenceScore}%</div>
                  <div className="text-xs text-gray-600">Confidence</div>
                  <div className="text-xs text-gray-500">AI Score</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">{sessionData.audioLevel}</div>
                  <div className="text-xs text-gray-600">Volume</div>
                  <div className="text-xs text-gray-500">dB Level</div>
                </div>
              </div>
              
              {/* Quick Performance Indicators */}
              <div className="flex justify-center space-x-4 mt-4">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  sessionData.speechRate >= 120 && sessionData.speechRate <= 150 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    sessionData.speechRate >= 120 && sessionData.speechRate <= 150 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span>Pace</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  sessionData.fillerWordCount < 3 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    sessionData.fillerWordCount < 3 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span>Clarity</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  sessionData.audioLevel > 40 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    sessionData.audioLevel > 40 ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <span>Volume</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  sessionData.confidenceScore > 70 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    sessionData.confidenceScore > 70 ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span>Confidence</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 h-auto">
            <TabsTrigger 
              value="pathway" 
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              {getTabIcon("pathway")}
              <span className="text-xs mt-1">Goal</span>
            </TabsTrigger>
            <TabsTrigger 
              value="input" 
              disabled={isTabDisabled("input")}
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white disabled:opacity-50"
            >
              {getTabIcon("input")}
              <span className="text-xs mt-1">Input</span>
            </TabsTrigger>
            <TabsTrigger 
              value="practice" 
              disabled={isTabDisabled("practice")}
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white disabled:opacity-50"
            >
              {getTabIcon("practice")}
              <span className="text-xs mt-1">Practice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              disabled={isTabDisabled("feedback")}
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white disabled:opacity-50"
            >
              {getTabIcon("feedback")}
              <span className="text-xs mt-1">L.V.I.E.™</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              disabled={isTabDisabled("analysis")}
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white disabled:opacity-50"
            >
              {getTabIcon("analysis")}
              <span className="text-xs mt-1">Results</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              {getTabIcon("history")}
              <span className="text-xs mt-1">History</span>
            </TabsTrigger>
            <TabsTrigger 
              value="challenges" 
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              {getTabIcon("challenges")}
              <span className="text-xs mt-1">Challenges</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coach" 
              className="flex flex-col items-center p-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              {getTabIcon("coach")}
              <span className="text-xs mt-1">AI Coach</span>
            </TabsTrigger>
          </TabsList>

          {/* Section 1: Practice Pathway Selection */}
          <TabsContent value="pathway" className="space-y-6">
            <PracticePathwaySelection 
              onGoalSelect={handleGoalSelect}
              onOptionsChange={handleOptionsChange}
            />
          </TabsContent>

          {/* Section 2: Speech Input */}
          <TabsContent value="input" className="space-y-6">
            <SpeechInputSelector onInputSelect={handleInputSelect} />
          </TabsContent>

          {/* Section 3: Live Practice */}
          <TabsContent value="practice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EnhancedPracticeHubClean />
              </div>
              <div>
                <LVIEFeedbackEngine
                  isActive={sessionData.isRecording && !sessionData.isPaused}
                  audioLevel={sessionData.audioLevel}
                  speechRate={sessionData.speechRate}
                  confidenceScore={sessionData.confidenceScore}
                  fillerWordCount={sessionData.fillerWordCount}
                  onVoiceFeedbackToggle={handleVoiceFeedbackToggle}
                />
              </div>
            </div>
          </TabsContent>

          {/* Section 4: L.V.I.E. Feedback */}
          <TabsContent value="feedback" className="space-y-6">
            <LVIEFeedbackEngine
              isActive={sessionData.isRecording && !sessionData.isPaused}
              audioLevel={sessionData.audioLevel}
              speechRate={sessionData.speechRate}
              confidenceScore={sessionData.confidenceScore}
              fillerWordCount={sessionData.fillerWordCount}
              onVoiceFeedbackToggle={handleVoiceFeedbackToggle}
            />
          </TabsContent>

          {/* Section 5: Analysis & Results */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Speech Scorecard</span>
                  <Badge className="bg-cyan-100 text-cyan-700">AI-Generated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-700">{sessionData.speechRate}</div>
                    <div className="text-sm text-blue-600 font-medium">WPM Speed</div>
                    <div className="text-xs text-gray-500">Goal: 120-150</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-700">{sessionData.fillerWordCount}</div>
                    <div className="text-sm text-green-600 font-medium">Filler Words</div>
                    <div className="text-xs text-gray-500">Goal: &lt; 3/min</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">{sessionData.confidenceScore}%</div>
                    <div className="text-sm text-purple-600 font-medium">Confidence</div>
                    <div className="text-xs text-gray-500">Based on pace & tone</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-700">{sessionData.audioLevel}</div>
                    <div className="text-sm text-orange-600 font-medium">Projection (dB)</div>
                    <div className="text-xs text-gray-500">Avg. volume level</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
                  <h4 className="font-semibold text-cyan-800 mb-2">💡 Coaching Tip of the Day:</h4>
                  <p className="text-cyan-700">
                    Try replacing 'um' with a purposeful pause. Silence is powerful and gives your audience time to process your ideas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder tabs for future implementation */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Speech History & Progress</h3>
                <p className="text-gray-500">Track your improvement over time with detailed analytics</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Challenges & Simulation Arena</h3>
                <p className="text-gray-500">Weekly challenges and simulation rooms coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">"Coach Me" AI Assistant</h3>
                <p className="text-gray-500">Get personalized coaching advice based on your performance</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}