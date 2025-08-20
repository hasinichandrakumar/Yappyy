const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple server running' });
});

app.post('/api/save-session', (req, res) => {
  console.log('📝 Received save request:', req.body);
  res.json({ 
    success: true, 
    sessionId: Date.now(),
    message: 'Session saved successfully' 
  });
});

const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on port ${port}`);
});


