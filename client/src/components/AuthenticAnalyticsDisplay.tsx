import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Eye, Volume2, MessageSquare, TrendingUp, Target, BarChart3, CheckCircle } from 'lucide-react';

interface AuthenticMetrics {
  confidence: number;
  eyeContact: number;
  clarity: number;
  engagement: number;
  voiceConsistency: number;
  voiceQuality: number;
  contentQuality: number;
  deliveryPresence: number;
}

interface AuthenticAnalyticsDisplayProps {
  transcript: string;
  duration: number;
  isVisible: boolean;
}

export function AuthenticAnalyticsDisplay({ transcript, duration, isVisible }: AuthenticAnalyticsDisplayProps) {
  const [metrics, setMetrics] = useState<AuthenticMetrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && transcript && transcript.trim().length > 10 && duration > 5) {
      processAuthentic();
    }
  }, [transcript, duration, isVisible]);

  const processAuthentic = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/process-authentic-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, duration })
      });

      if (response.ok) {
        const result = await response.json();
        setMetrics(result.metrics);
        console.log('✅ Real metrics extracted from speech:', result.metrics);
      } else {
        throw new Error('Failed to process analytics');
      }
    } catch (err) {
      setError('Analytics processing unavailable');
      console.warn('Analytics processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible || (!transcript || transcript.trim().length < 10)) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No Speech Data</p>
            <p className="text-sm">Start speaking to see authentic performance metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Processing Analytics...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Analyzing your speech patterns...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !metrics) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Analysis Unavailable</p>
            <p className="text-sm">{error || 'Continue speaking to enable metrics'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Performance Breakdown
          <Badge variant="secondary" className="ml-auto">
            <CheckCircle className="w-3 h-3 mr-1" />
            Authentic Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { label: 'Confidence Level', value: metrics.confidence, icon: Brain },
            { label: 'Eye Contact', value: metrics.eyeContact, icon: Eye },
            { label: 'Clarity & Articulation', value: metrics.clarity, icon: Volume2 },
            { label: 'Engagement Level', value: metrics.engagement, icon: Target },
            { label: 'Voice Consistency', value: metrics.voiceConsistency, icon: TrendingUp }
          ].map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <div className="flex items-center gap-3 w-32">
                <div className="flex-1">
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                    style={{
                      background: `linear-gradient(to right, ${getProgressColor(metric.value)} ${metric.value}%, #e5e7eb ${metric.value}%)`
                    }}
                  />
                </div>
                <span className={`text-sm font-bold w-8 text-right ${getScoreColor(metric.value)}`}>
                  {metric.value}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-semibold mb-3">Detailed Analysis</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-lg font-bold ${getScoreColor(metrics.voiceQuality)}`}>
                {metrics.voiceQuality}%
              </div>
              <div className="text-xs text-gray-600">Voice Quality</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${getScoreColor(metrics.contentQuality)}`}>
                {metrics.contentQuality}%
              </div>
              <div className="text-xs text-gray-600">Content Quality</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${getScoreColor(metrics.deliveryPresence)}`}>
                {metrics.deliveryPresence}%
              </div>
              <div className="text-xs text-gray-600">Delivery & Presence</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}