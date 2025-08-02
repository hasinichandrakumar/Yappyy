import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Mic, 
  MessageSquare, 
  Eye,
  Star,
  CheckCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';

interface PostSessionAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    sessionName: string;
    duration: number;
    transcript: string;
    averageWPM: number;
    confidenceScore: number;
    fillerWordCount: number;
    eyeContactScore: number;
    mainConcepts?: string[];
  };
  onViewFullAnalysis: () => void;
}

export default function PostSessionAnalyticsPopup({ 
  isOpen, 
  onClose, 
  sessionData,
  onViewFullAnalysis 
}: PostSessionAnalyticsProps) {
  
  // Extract main concepts from transcript
  const extractMainConcepts = (transcript: string): string[] => {
    if (!transcript || transcript.length < 10) return [];
    
    const words = transcript.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'our', 'their'];
    
    // Find meaningful words (3+ characters, not common words)
    const meaningfulWords = words.filter(word => 
      word.length >= 3 && 
      !commonWords.includes(word) &&
      /^[a-z]+$/.test(word)
    );
    
    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    meaningfulWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Get top 3-5 most frequent words as main concepts
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  };

  const mainConcepts = sessionData.mainConcepts || extractMainConcepts(sessionData.transcript);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOverallScore = () => {
    const scores = [
      sessionData.confidenceScore || 0,
      sessionData.eyeContactScore || 0,
      sessionData.averageWPM > 0 ? Math.min(100, (sessionData.averageWPM / 150) * 100) : 0
    ].filter(score => score > 0);
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  };

  const overallScore = getOverallScore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border border-blue-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            Session Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900">{sessionData.sessionName}</h3>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {formatDuration(sessionData.duration)}
                </Badge>
              </div>
              
              {/* Overall Performance Score */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Overall Performance</span>
                  </div>
                  <Progress value={overallScore} className="h-2 bg-blue-200" />
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {overallScore}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <Mic className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-800">
                {sessionData.averageWPM || 0}
              </div>
              <div className="text-xs text-emerald-600">WPM</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">
                {Math.round(sessionData.confidenceScore || 0)}%
              </div>
              <div className="text-xs text-purple-600">Confidence</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <MessageSquare className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">
                {sessionData.fillerWordCount || 0}
              </div>
              <div className="text-xs text-orange-600">Filler Words</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                {Math.round(sessionData.eyeContactScore || 0)}%
              </div>
              <div className="text-xs text-blue-600">Eye Contact</div>
            </div>
          </div>

          {/* Main Concepts */}
          {mainConcepts.length > 0 && (
            <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                  <h4 className="font-semibold text-slate-900">Main Topics Covered</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mainConcepts.map((concept, index) => (
                    <Badge 
                      key={index}
                      className="bg-slate-200 text-slate-800 border-slate-300"
                    >
                      {concept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Close
            </Button>
            
            <Button
              onClick={() => {
                onViewFullAnalysis();
                onClose();
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              View Full Analysis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}