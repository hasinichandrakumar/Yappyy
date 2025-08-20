import express from 'express';
import { createServer } from 'http';

const app = express();
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Simple test server is working',
    timestamp: new Date().toISOString()
  });
});

// Filler detection endpoint
app.post('/api/detect-enhanced-fillers', (req, res) => {
  try {
    const { transcript, duration = 0 } = req.body;
    
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid transcript provided',
        success: false 
      });
    }

    // Simple filler detection
    const fillerPatterns = ['um', 'uh', 'er', 'ah', 'eh', 'mm', 'hmm', 'like', 'so', 'well', 'okay', 'right', 'actually', 'basically'];
    const words = transcript.toLowerCase().split(/\s+/);
    const fillerCounts: Record<string, number> = {};
    const detectedFillers: string[] = [];

    words.forEach(word => {
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
      if (fillerPatterns.includes(cleanWord)) {
        fillerCounts[cleanWord] = (fillerCounts[cleanWord] || 0) + 1;
        detectedFillers.push(cleanWord);
      }
    });

    const response = {
      success: true,
      totalFillers: detectedFillers.length,
      fillerTypes: fillerCounts,
      fillerWords: detectedFillers,
      wordsPerMinute: duration > 0 ? Math.round((words.length / duration) * 60) : 0,
      wordCount: words.length,
      clarity: Math.max(0, 100 - (detectedFillers.length / words.length) * 100),
      confidence: Math.min(100, Math.max(0, 50 + (100 - (detectedFillers.length / words.length) * 100) * 0.5)),
      detectionMethod: 'simple',
      accuracyScore: 0.85,
      analysisMetadata: {
        transcriptLength: transcript.length,
        sessionDuration: duration,
        analysisTimestamp: new Date().toISOString(),
        engineVersion: 'simple-1.0.0'
      }
    };

    console.log('✅ Simple filler detection complete:', {
      totalFillers: detectedFillers.length,
      wordsPerMinute: response.wordsPerMinute,
      clarity: response.clarity
    });

    res.json(response);
  } catch (error: any) {
    console.error('❌ Simple filler detection error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to perform filler detection',
      details: error.message 
    });
  }
});

const server = createServer(app);
const port = 5000;

server.listen(port, () => {
  console.log(`🚀 Simple test server running on port ${port}`);
  console.log(`✅ Test endpoint: http://localhost:${port}/api/test`);
  console.log(`✅ Filler detection: POST http://localhost:${port}/api/detect-enhanced-fillers`);
});
