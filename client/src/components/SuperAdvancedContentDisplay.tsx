import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Star,
  Trophy
} from "lucide-react";

interface SuperAdvancedContentDisplayProps {
  analysis: any;
  purposeFeedback: any;
  className?: string;
}

const SuperAdvancedContentDisplay: React.FC<SuperAdvancedContentDisplayProps> = ({ 
  analysis, 
  purposeFeedback, 
  className = "" 
}) => {
  if (!analysis) {
    return (
      <div className={`p-6 text-center text-gray-500 ${className}`}>
        <Brain className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p>Start speaking to get super advanced content analysis</p>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Performance Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold">Super Advanced Analysis</span>
            </div>
            <Badge className={`text-lg px-4 py-2 font-bold ${getGradeColor(analysis.overall.grade)}`}>
              {analysis.overall.score}% ({analysis.overall.grade})
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-purple-600">{analysis.overall.score}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-blue-600">{Math.round(analysis.overall.confidence * 100)}%</div>
              <div className="text-sm text-gray-600">AI Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-green-600">{analysis.purposeAlignment.score}%</div>
              <div className="text-sm text-gray-600">Purpose Alignment</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-sm">Analysis Framework:</span>
            </div>
            <p className="text-sm text-gray-700">{analysis.purposeAlignment.framework}</p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(analysis.advancedMetrics).map(([metric, data]: [string, any]) => (
          <Card key={metric} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                <Badge 
                  variant="outline"
                  className={`${getScoreColor(data.score)} border-current`}
                >
                  {data.score}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={data.score} className="mb-3" />
              <p className="text-sm text-gray-600 mb-2">{data.analysis}</p>
              {data.recommendations.length > 0 && (
                <div className="space-y-1">
                  {data.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rhetorical Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            Rhetorical & Linguistic Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Persuasion Techniques</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.rhetoricalAnalysis.persuasionTechniques.map((technique: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {technique}
                  </Badge>
                ))}
              </div>
              
              <h4 className="font-semibold mb-2">Credibility Factors</h4>
              <div className="space-y-1">
                {analysis.rhetoricalAnalysis.credibilityFactors.map((factor: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Linguistic Quality</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Complexity Level</span>
                  <Badge variant="outline">{analysis.linguisticAnalysis.complexityLevel}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vocabulary</span>
                  <Badge variant="outline">{analysis.linguisticAnalysis.vocabularySophistication}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sentence Variety</span>
                  <Badge variant="outline">{analysis.linguisticAnalysis.sentenceVariety}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Transitions</span>
                  <Badge variant="outline">{analysis.linguisticAnalysis.transitionQuality}%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Audience Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.audienceImpact.engagementLevel}%</div>
              <div className="text-sm text-gray-600">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analysis.audienceImpact.comprehensibilityScore}%</div>
              <div className="text-sm text-gray-600">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.audienceImpact.actionLikelihood}%</div>
              <div className="text-sm text-gray-600">Action Likelihood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysis.competitiveAnalysis.industryStandard}</div>
              <div className="text-sm text-gray-600">Industry Std</div>
            </div>
          </div>
          
          {analysis.audienceImpact.memorabilityFactors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Memorable Elements</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.audienceImpact.memorabilityFactors.map((factor: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purpose-Specific Feedback */}
      {purposeFeedback && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Purpose-Specific Expert Feedback
              <Badge variant="outline" className="ml-2">{purposeFeedback.purpose}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">{purposeFeedback.focus}</p>
                <Badge className={getGradeColor(purposeFeedback.grade)}>
                  {purposeFeedback.grade} - {purposeFeedback.score}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Key Questions
                  </h4>
                  <div className="space-y-2">
                    {purposeFeedback.keyQuestions?.slice(0, 3).map((question: string, idx: number) => (
                      <div key={idx} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        {question}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    Improvement Actions
                  </h4>
                  <div className="space-y-1">
                    {purposeFeedback.suggestedImprovements?.slice(0, 3).map((improvement: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitive Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            Competitive Benchmarking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Industry Comparison</span>
            <Badge variant="outline" className="text-sm">
              {analysis.competitiveAnalysis.benchmarkComparison}
            </Badge>
          </div>
          
          <div className="relative">
            <Progress 
              value={(analysis.overall.score / analysis.competitiveAnalysis.industryStandard) * 100} 
              className="mb-2" 
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Your Score: {analysis.overall.score}%</span>
              <span>Industry: {analysis.competitiveAnalysis.industryStandard}%</span>
            </div>
          </div>
          
          {analysis.competitiveAnalysis.differentiationFactors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Differentiation Factors</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.competitiveAnalysis.differentiationFactors.map((factor: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdvancedContentDisplay;