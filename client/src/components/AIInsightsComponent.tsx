import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNeuralAnalysis, useUserProgress } from '@/hooks/useGraphQLQuery';

// AI Insights Component - Focused on Connections and Feedback
const AIInsightsAnalytics = ({ userId }: { userId?: string }) => {
  const { data: practiceData } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: !!userId
  });

  const { data: neuralAnalysisData, isLoading: neuralLoading } = useNeuralAnalysis(userId || '');
  const { data: userProgressData, isLoading: progressLoading } = useUserProgress(userId || '');
  
  const sessions = Array.isArray(practiceData) ? practiceData : [];
  
  // Generate connection-based insights rather than statistics
  const generateConnectionInsights = () => {
    if (sessions.length === 0) {
      return [
        {
          type: 'welcome',
          title: 'Ready to Analyze Your Speaking',
          content: 'Complete your first practice session and I\'ll identify patterns in your speaking style, connect performance indicators, and provide personalized coaching insights.',
          icon: '🎯',
          actionable: true,
          priority: 'high'
        }
      ];
    }

    const insights = [];
    const recentSessions = sessions.slice(-5);
    
    // Connection-based analysis instead of raw statistics
    if (sessions.length >= 2) {
      const latest = sessions[sessions.length - 1];
      const previous = sessions[sessions.length - 2];
      
      // Connect confidence changes to specific behaviors
      const confidenceChange = (latest.confidenceScore || 0) - (previous.confidenceScore || 0);
      const fillerChange = (latest.fillerWords?.length || 0) - (previous.fillerWords?.length || 0);
      const paceChange = (latest.averageWPM || 0) - (previous.averageWPM || 0);
      
      if (confidenceChange > 0.1 && fillerChange < 0) {
        insights.push({
          type: 'connection',
          title: 'Confidence Boost Detected',
          content: 'Your confidence increased as you reduced filler words. This shows your brain is making the connection between cleaner speech and self-assurance. Keep focusing on pausing instead of using fillers.',
          icon: '🔗',
          actionable: true,
          priority: 'high'
        });
      }
      
      if (paceChange > 0 && confidenceChange > 0) {
        insights.push({
          type: 'pattern',
          title: 'Energy-Confidence Loop',
          content: 'When you speak with more energy (faster pace), your confidence naturally rises. Your optimal speaking rhythm seems to unlock your best performance. Practice maintaining this energetic pace.',
          icon: '⚡',
          actionable: true,
          priority: 'medium'
        });
      }
    }

    // Multi-session pattern recognition
    if (sessions.length >= 3) {
      const clarityScores = recentSessions.map(s => s.voiceClarity || 0);
      const engagementScores = recentSessions.map(s => s.engagementScore || 0);
      
      // Check for clarity-engagement correlation
      const clarityTrend = clarityScores[clarityScores.length - 1] - clarityScores[0];
      const engagementTrend = engagementScores[engagementScores.length - 1] - engagementScores[0];
      
      if (clarityTrend > 0.1 && engagementTrend > 0.1) {
        insights.push({
          type: 'discovery',
          title: 'Speaking Clarity Unlocks Engagement',
          content: 'I\'ve noticed that as your speech becomes clearer, your natural charisma and engagement shine through. Your authentic personality emerges when you speak with precision.',
          icon: '✨',
          actionable: true,
          priority: 'high'
        });
      }
    }

    // Behavioral pattern insights
    if (sessions.length >= 4) {
      const timePatterns = sessions.map(s => ({
        hour: new Date(s.timestamp || Date.now()).getHours(),
        performance: (s.confidenceScore || 0) * 0.3 + (s.voiceClarity || 0) * 0.4 + (s.engagementScore || 0) * 0.3
      }));
      
      // Find peak performance times
      const morningPerf = timePatterns.filter(t => t.hour >= 6 && t.hour < 12).reduce((sum, t) => sum + t.performance, 0);
      const afternoonPerf = timePatterns.filter(t => t.hour >= 12 && t.hour < 18).reduce((sum, t) => sum + t.performance, 0);
      const eveningPerf = timePatterns.filter(t => t.hour >= 18 || t.hour < 6).reduce((sum, t) => sum + t.performance, 0);
      
      const bestTime = morningPerf > afternoonPerf && morningPerf > eveningPerf ? 'morning' :
                      afternoonPerf > eveningPerf ? 'afternoon' : 'evening';
      
      if (bestTime === 'morning' && morningPerf > 0) {
        insights.push({
          type: 'timing',
          title: 'Morning Voice Advantage',
          content: 'Your speaking performance peaks in the morning hours. Your voice is fresh, your mind is clear, and your delivery is most impactful. Schedule important conversations during this golden window.',
          icon: '🌅',
          actionable: true,
          priority: 'medium'
        });
      }
    }

    // Improvement momentum insights
    if (sessions.length >= 5) {
      const recentAvg = recentSessions.reduce((sum, s) => sum + (s.confidenceScore || 0), 0) / recentSessions.length;
      const earlyAvg = sessions.slice(0, Math.min(3, sessions.length)).reduce((sum, s) => sum + (s.confidenceScore || 0), 0) / Math.min(3, sessions.length);
      
      if (recentAvg > earlyAvg + 0.15) {
        insights.push({
          type: 'growth',
          title: 'Accelerating Development',
          content: 'Your recent sessions show faster improvement than your initial ones. You\'ve hit your stride and developed effective practice habits. Your brain is now wired for continued speaking growth.',
          icon: '🚀',
          actionable: false,
          priority: 'high'
        });
      }
    }

    // Personalized coaching connections
    if (sessions.length >= 3) {
      const avgClarity = recentSessions.reduce((sum, s) => sum + (s.voiceClarity || 0), 0) / recentSessions.length;
      const avgPace = recentSessions.reduce((sum, s) => sum + (s.averageWPM || 0), 0) / recentSessions.length;
      const avgEngagement = recentSessions.reduce((sum, s) => sum + (s.engagementScore || 0), 0) / recentSessions.length;
      
      if (avgClarity > 0.7 && avgEngagement > 0.6) {
        insights.push({
          type: 'strength',
          title: 'Natural Communicator Profile',
          content: 'You combine clear articulation with natural engagement - a powerful combination that indicates strong communication instincts. Build on this foundation by adding more storytelling elements.',
          icon: '🎭',
          actionable: true,
          priority: 'medium'
        });
      }
      
      if (avgPace > 0 && avgPace < 140) {
        insights.push({
          type: 'opportunity',
          title: 'Energy Amplification Opportunity',
          content: 'Your thoughtful speaking pace shows you care about being understood. Now experiment with adding bursts of higher energy to captivate your audience while maintaining your natural clarity.',
          icon: '🔥',
          actionable: true,
          priority: 'high'
        });
      }
    }

    // Default insights if no specific patterns detected
    if (insights.length === 0 && sessions.length > 0) {
      insights.push({
        type: 'observation',
        title: 'Building Your Speaking Foundation',
        content: 'You\'re in the important foundation-building phase. Each session is creating neural pathways that will define your speaking style. Stay consistent and patterns will emerge.',
        icon: '🏗️',
        actionable: true,
        priority: 'medium'
      });
    }

    return insights.slice(0, 4); // Limit to 4 most relevant insights
  };

  const connectionInsights = generateConnectionInsights();

  return (
    <div className="space-y-4">
      {/* AI Status */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">AI Pattern Recognition</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {sessions.length > 0 ? 'Active Analysis' : 'Ready to Learn'}
        </Badge>
      </div>

      {/* Connection-based Insights */}
      <div className="space-y-3">
        {connectionInsights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border ${
              insight.priority === 'high' ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' :
              insight.priority === 'medium' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' :
              'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{insight.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800 text-sm">{insight.title}</h4>
                  {insight.priority === 'high' && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      Key Insight
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{insight.content}</p>
                {insight.actionable && (
                  <div className="flex items-center gap-1 mt-2">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Actionable Insight</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Learning Status */}
      {sessions.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-gray-800">AI Learning Progress</h4>
          </div>
          <p className="text-sm text-gray-600">
            The AI has analyzed {sessions.length} of your sessions and identified {connectionInsights.length} meaningful patterns in your speaking development.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInsightsAnalytics;
