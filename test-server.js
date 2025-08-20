const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));

// Simple health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server running' });
});

// Simple save session endpoint
app.post('/api/save-session', (req, res) => {
  try {
    const { sessionName, duration, transcript, averageWPM, fillerWords } = req.body;
    
    console.log('📝 Received session data:', {
      sessionName,
      duration,
      transcriptLength: transcript?.length || 0,
      averageWPM,
      fillerWords
    });
    
    // Simulate saving to database
    const sessionId = Date.now();
    
    res.json({ 
      success: true, 
      sessionId,
      sessionNumber: 1,
      message: 'Session saved successfully'
    });
  } catch (error) {
    console.error('❌ Save error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save session',
      details: error.message 
    });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`🚀 Test server running on port ${port}`);
  console.log(`✅ Health check: http://localhost:${port}/api/health`);
  console.log(`✅ Save endpoint: http://localhost:${port}/api/save-session`);
});


