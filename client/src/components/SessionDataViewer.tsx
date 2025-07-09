// Session Data Viewer - Extract and analyze session transcripts and metrics
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, Download, BarChart3, Clock, Eye, 
  Volume2, Brain, Target, Copy, RefreshCw 
} from 'lucide-react';

interface SessionDataViewerProps {
  transcript: string;
  sessionDuration: number;
  metrics: any;
  contentAnalysis: any;
  isRecording: boolean;
  onContentAnalysisUpdate?: (analysis: any) => void;
}

export function SessionDataViewer({
  transcript,
  sessionDuration,
  metrics,
  contentAnalysis,
  isRecording,
  onContentAnalysisUpdate
}: SessionDataViewerProps) {
  const [selectedTab, setSelectedTab] = useState<string>('transcript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localContentAnalysis, setLocalContentAnalysis] = useState(contentAnalysis);
  
  // Use local state or prop
  const currentContentAnalysis = localContentAnalysis || contentAnalysis;

  // Calculate session statistics
  const wordCount = transcript.split(' ').filter(word => word.length > 0).length;
  const avgWordsPerMinute = sessionDuration > 0 ? Math.round((wordCount / (sessionDuration / 60000))) : 0;
  const sentenceCount = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(transcript);
  };

  const handleDownloadSession = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      duration: sessionDuration,
      transcript,
      metrics,
      contentAnalysis,
      statistics: {
        wordCount,
        avgWordsPerMinute,
        sentenceCount,
        avgWordsPerSentence
      }
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yappyy-session-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeContent = async () => {
    if (transcript.length < 10) return;
    
    setIsAnalyzing(true);
    try {
      // Force content analysis refresh
      const response = await fetch('/api/content-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          purpose: 'general',
          analysisType: 'comprehensive'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fresh content analysis:', data);
        
        // Transform API response to match component expectations
        if (data.success && data.analysis) {
          const transformedAnalysis = {
            overallScore: data.analysis.overallScore,
            structure: {
              clarity: data.analysis.structureScore,
              organization: data.analysis.structureScore,
              flow: data.analysis.coherenceScore
            },
            persuasiveness: {
              impact: data.analysis.persuasivenessScore,
              conviction: data.analysis.persuasivenessScore,
              callToAction: data.analysis.audienceAlignmentScore
            },
            coherence: {
              consistency: data.analysis.coherenceScore,
              logicalFlow: data.analysis.coherenceScore,
              topicRelevance: data.analysis.purposeAlignment
            },
            audienceAlignment: {
              appropriateness: data.analysis.audienceAlignmentScore,
              engagement: data.analysis.audienceAlignmentScore,
              relatability: data.analysis.purposeAlignment
            },
            feedback: data.analysis.keyInsights || [],
            strengths: data.analysis.strengths || [],
            improvements: data.analysis.improvementAreas || []
          };
          
          // Update parent component if callback provided, otherwise update local state
          if (onContentAnalysisUpdate) {
            onContentAnalysisUpdate(transformedAnalysis);
          } else {
            setLocalContentAnalysis(transformedAnalysis);
          }
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Session Analysis</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyTranscript} disabled={!transcript}>
            <Copy className="w-4 h-4 mr-1" />
            Copy Transcript
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadSession} disabled={!transcript}>
            <Download className="w-4 h-4 mr-1" />
            Export Session
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAnalyzeContent} 
            disabled={!transcript || isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Analyze Content
          </Button>
        </div>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
          <div className="text-lg font-bold">{Math.floor(sessionDuration / 60000)}:{String(Math.floor((sessionDuration % 60000) / 1000)).padStart(2, '0')}</div>
          <div className="text-xs text-gray-600">Duration</div>
        </Card>
        <Card className="p-3 text-center">
          <FileText className="w-5 h-5 mx-auto mb-1 text-green-600" />
          <div className="text-lg font-bold">{wordCount}</div>
          <div className="text-xs text-gray-600">Words</div>
        </Card>
        <Card className="p-3 text-center">
          <Volume2 className="w-5 h-5 mx-auto mb-1 text-purple-600" />
          <div className="text-lg font-bold">{avgWordsPerMinute}</div>
          <div className="text-xs text-gray-600">WPM</div>
        </Card>
        <Card className="p-3 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-orange-600" />
          <div className="text-lg font-bold">{avgWordsPerSentence}</div>
          <div className="text-xs text-gray-600">Words/Sentence</div>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Live Transcript</h3>
              <Badge variant={isRecording ? "default" : "secondary"}>
                {isRecording ? "Recording" : "Stopped"}
              </Badge>
            </div>
            
            <div className="border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto bg-gray-50">
              {transcript ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Transcript will appear here as you speak...
                </p>
              )}
            </div>
            
            <div className="mt-3 text-xs text-gray-600">
              {wordCount > 0 && (
                <span>
                  {wordCount} words • {sentenceCount} sentences • {avgWordsPerMinute} WPM
                </span>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {currentContentAnalysis ? (
            <div className="grid gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Content Analysis Results</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Structure</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Clarity</span>
                        <span>{currentContentAnalysis.structure?.clarity || 0}%</span>
                      </div>
                      <Progress value={currentContentAnalysis.structure?.clarity || 0} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Organization</span>
                        <span>{currentContentAnalysis.structure?.organization || 0}%</span>
                      </div>
                      <Progress value={currentContentAnalysis.structure?.organization || 0} className="h-2" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Persuasiveness</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impact</span>
                        <span>{currentContentAnalysis.persuasiveness?.impact || 0}%</span>
                      </div>
                      <Progress value={currentContentAnalysis.persuasiveness?.impact || 0} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Conviction</span>
                        <span>{currentContentAnalysis.persuasiveness?.conviction || 0}%</span>
                      </div>
                      <Progress value={currentContentAnalysis.persuasiveness?.conviction || 0} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Overall Score</h4>
                  <div className="flex items-center gap-3">
                    <Progress value={currentContentAnalysis.overallScore || 0} className="flex-1 h-3" />
                    <Badge variant="outline" className="text-lg">
                      {currentContentAnalysis.overallScore || 0}%
                    </Badge>
                  </div>
                </div>

                {currentContentAnalysis.feedback && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">AI Feedback</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <ul className="text-sm space-y-1">
                        {currentContentAnalysis.feedback.map((item: string, idx: number) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Content analysis will appear after you start speaking</p>
              <Button 
                variant="outline" 
                className="mt-3" 
                onClick={handleAnalyzeContent}
                disabled={transcript.length < 10}
              >
                Analyze Current Content
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Performance Metrics</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Voice Quality</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clarity</span>
                      <span>{Math.round(metrics.voice.clarity)}%</span>
                    </div>
                    <Progress value={metrics.voice.clarity} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Pace</span>
                      <span>{Math.round(metrics.voice.pace)}%</span>
                    </div>
                    <Progress value={metrics.voice.pace} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Body Language</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Eye Contact</span>
                      <span>{Math.round(metrics.bodyLanguage.eyeContactScore)}%</span>
                    </div>
                    <Progress value={metrics.bodyLanguage.eyeContactScore} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Posture</span>
                      <span>{Math.round(metrics.bodyLanguage.postureScore)}%</span>
                    </div>
                    <Progress value={metrics.bodyLanguage.postureScore} className="h-2" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Emotional Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(metrics.emotion).map(([emotion, value]) => (
                  <div key={emotion}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{emotion}</span>
                      <span>{Math.round(value as number)}%</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Export Session Data</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleCopyTranscript} disabled={!transcript}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Transcript
                </Button>
                
                <Button onClick={handleDownloadSession} disabled={!transcript}>
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Export Includes:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Complete transcript</li>
                  <li>• Performance metrics</li>
                  <li>• Content analysis results</li>
                  <li>• Session statistics</li>
                  <li>• Timestamp and duration</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}