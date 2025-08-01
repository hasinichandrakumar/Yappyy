import { Request, Response } from 'express';
import { analyticsIntegrator } from './analytics-integrator';

export async function processEnhancedAnalytics(req: Request, res: Response) {
  try {
    const { transcript, duration, webSpeechMetrics, performanceMetrics, webrtcQuality, systemInfo } = req.body;

    console.log('🔬 Processing enhanced analytics request:', {
      transcriptLength: transcript?.length || 0,
      duration,
      hasWebSpeech: !!webSpeechMetrics,
      hasPerformance: !!performanceMetrics,
      hasWebRTC: !!webrtcQuality,
      hasSystem: !!systemInfo
    });

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ 
        error: 'Missing or invalid transcript',
        analytics: null,
        insights: [],
        summary: {
          totalMetrics: 0,
          workingAPIs: [],
          analyticsScore: 0
        }
      });
    }

    // Process the session data through the analytics integrator
    const analytics = await analyticsIntegrator.processSessionData({
      transcript,
      duration: duration || 0,
      webSpeechMetrics,
      performanceMetrics,
      webrtcQuality,
      systemInfo
    });

    // Generate insights based on the analytics
    const insights = analyticsIntegrator.generateAnalyticsInsights(analytics);
    
    // Get metrics summary
    const summary = analyticsIntegrator.getMetricsSummary(analytics);

    console.log('✅ Enhanced analytics processed successfully:', {
      insightsCount: insights.length,
      workingAPIs: summary.workingAPIs.length,
      analyticsScore: summary.analyticsScore
    });

    res.json({
      analytics,
      insights,
      summary,
      success: true
    });

  } catch (error) {
    console.error('❌ Error processing enhanced analytics:', error);
    
    res.status(500).json({
      error: 'Failed to process analytics',
      analytics: null,
      insights: [`Analysis temporarily unavailable - using core metrics only`],
      summary: {
        totalMetrics: 0,
        workingAPIs: [],
        analyticsScore: 0
      }
    });
  }
}