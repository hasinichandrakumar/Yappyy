import { enhancedAnalytics } from './enhanced-analytics-engine';

interface SessionAnalytics {
  enhanced: any;
  webSpeech: any;
  performance: any;
  webrtc: any;
  system: any;
}

export class AnalyticsIntegrator {
  constructor() {
    console.log('🔬 Analytics Integrator initialized');
  }

  async processSessionData(sessionData: {
    transcript: string;
    duration: number;
    webSpeechMetrics?: any;
    performanceMetrics?: any;
    webrtcQuality?: any;
    systemInfo?: any;
  }): Promise<SessionAnalytics> {
    
    console.log('🔍 Processing comprehensive session analytics...');
    
    // Enhanced content analysis using new libraries
    const enhancedAnalysis = await enhancedAnalytics.analyzeContent(sessionData.transcript);
    
    // Combine all analytics sources
    const analytics: SessionAnalytics = {
      enhanced: enhancedAnalysis,
      webSpeech: sessionData.webSpeechMetrics || null,
      performance: sessionData.performanceMetrics || null,
      webrtc: sessionData.webrtcQuality || null,
      system: sessionData.systemInfo || null
    };

    console.log('✅ Session analytics processing complete', {
      hasEnhanced: !!analytics.enhanced,
      hasWebSpeech: !!analytics.webSpeech,
      hasPerformance: !!analytics.performance,
      hasWebRTC: !!analytics.webrtc,
      hasSystem: !!analytics.system
    });

    return analytics;
  }

  generateAnalyticsInsights(analytics: SessionAnalytics): string[] {
    const insights: string[] = [];

    // Enhanced content insights
    if (analytics.enhanced?.content) {
      const content = analytics.enhanced.content;
      
      if (content.readabilityScore > 80) {
        insights.push('✅ Excellent readability - your content is easy to follow');
      } else if (content.readabilityScore < 50) {
        insights.push('📖 Consider simplifying complex sentences for better clarity');
      }

      if (content.sentimentScore > 0.3) {
        insights.push('😊 Positive and engaging tone detected');
      } else if (content.sentimentScore < -0.3) {
        insights.push('⚖️ Consider balancing negative content with positive elements');
      }

      if (content.formalityScore > 80) {
        insights.push('🎩 Very formal communication style - great for professional settings');
      } else if (content.formalityScore < 30) {
        insights.push('💬 Casual communication style - ensure it matches your audience');
      }

      if (content.lexicalDiversity > 0.7) {
        insights.push('📚 Rich vocabulary usage enhances your message');
      }
    }

    // Web Speech API insights
    if (analytics.webSpeech) {
      const speech = analytics.webSpeech;
      
      if (speech.averageConfidence > 0.8) {
        insights.push('🎯 Clear speech recognition - excellent articulation');
      } else if (speech.averageConfidence < 0.6) {
        insights.push('🗣️ Work on articulation for clearer speech delivery');
      }

      if (speech.voiceActivity > 80) {
        insights.push('⚡ High voice activity - engaging presentation style');
      } else if (speech.voiceActivity < 50) {
        insights.push('🔊 Consider increasing speaking time vs. pauses');
      }

      if (speech.wordsPerMinute > 180) {
        insights.push('🏃 Speaking pace is quite fast - consider slowing down');
      } else if (speech.wordsPerMinute < 120) {
        insights.push('🐌 Speaking pace is slow - consider increasing energy');
      }
    }

    // Performance insights
    if (analytics.performance?.realTime) {
      const perf = analytics.performance.realTime;
      
      if (perf.memoryUsage > 50 * 1024 * 1024) {
        insights.push('💾 High system memory usage detected during session');
      }

      if (perf.connectionLatency > 200) {
        insights.push('📡 Network latency may affect real-time feedback quality');
      }
    }

    // WebRTC quality insights
    if (analytics.webrtc?.overall) {
      const quality = analytics.webrtc.overall;
      
      if (quality.qualityScore > 90) {
        insights.push('📹 Excellent video/audio connection quality');
      } else if (quality.qualityScore < 70) {
        insights.push('⚠️ Connection quality issues may affect session reliability');
      }
    }

    return insights;
  }

  getMetricsSummary(analytics: SessionAnalytics): {
    totalMetrics: number;
    workingAPIs: string[];
    analyticsScore: number;
  } {
    const workingAPIs: string[] = [];
    let totalMetrics = 0;

    if (analytics.enhanced) {
      workingAPIs.push('Enhanced Content Analysis');
      totalMetrics += 10; // Content metrics count
    }

    if (analytics.webSpeech) {
      workingAPIs.push('Web Speech API');
      totalMetrics += 6; // Speech metrics count
    }

    if (analytics.performance) {
      workingAPIs.push('Performance API');
      totalMetrics += 8; // Performance metrics count
    }

    if (analytics.webrtc) {
      workingAPIs.push('WebRTC Quality Monitor');
      totalMetrics += 12; // WebRTC metrics count
    }

    if (analytics.system) {
      workingAPIs.push('System Analytics');
      totalMetrics += 8; // System metrics count
    }

    const analyticsScore = Math.min(100, (workingAPIs.length / 5) * 100);

    return {
      totalMetrics,
      workingAPIs,
      analyticsScore
    };
  }
}

export const analyticsIntegrator = new AnalyticsIntegrator();