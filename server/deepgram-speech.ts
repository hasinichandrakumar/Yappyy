import { Request, Response } from 'express';
import { createClient } from '@deepgram/sdk';

// Free alternative: Using OpenAI Whisper API which has generous free limits
interface WhisperResponse {
  text: string;
  task: string;
  language: string;
  duration: number;
  segments: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  }>;
}

export async function transcribeWithAnalytics(req: Request, res: Response) {
  try {
    const { audio, options = {} } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // Use OpenAI Whisper for transcription (free with your existing API key)
    const transcriptionResult = await transcribeWithWhisper(audioBuffer);
    
    if (!transcriptionResult) {
      return res.status(500).json({ error: 'Transcription failed' });
    }

    // Analyze the transcription for additional insights
    const analytics = await analyzeTranscript(transcriptionResult);

    res.json({
      transcript: analytics.transcript,
      confidence: analytics.confidence,
      words: analytics.words,
      sentiment: analytics.sentiment,
      topics: analytics.topics,
      summary: analytics.summary,
      speakingMetrics: analytics.speakingMetrics
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Transcription service temporarily unavailable',
      fallback: true 
    });
  }
}

async function transcribeWithWhisper(audioBuffer: Buffer): Promise<WhisperResponse | null> {
  try {
    const formData = new FormData();
    
    // Create a File object from the buffer
    const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');
    formData.append('timestamp_granularities[]', 'segment');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error('OpenAI Whisper error:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Whisper transcription error:', error);
    return null;
  }
}

async function analyzeTranscript(whisperResult: WhisperResponse) {
  const text = whisperResult.text;
  const segments = whisperResult.segments || [];
  
  // Calculate word-level confidence and timing
  const words = text.split(' ').map((word, index) => {
    const segment = segments.find(s => s.text.includes(word));
    return {
      word: word,
      confidence: segment ? Math.round((1 - segment.no_speech_prob) * 100) : 85,
      start: segment?.start || 0,
      end: segment?.end || 0,
    };
  });

  // Calculate average confidence
  const avgConfidence = words.reduce((sum, w) => sum + w.confidence, 0) / words.length;

  // Detect filler words
  const fillerWords = ['um', 'uh', 'er', 'ah', 'like', 'so', 'you know', 'i mean', 'basically', 'literally'];
  const detectedFillers = words.filter(w => 
    fillerWords.includes(w.word.toLowerCase().replace(/[.,!?]/g, ''))
  );

  // Calculate speaking rate
  const totalDuration = whisperResult.duration || 1;
  const wordsPerMinute = (words.length / totalDuration) * 60;

  // Simple sentiment analysis based on keywords
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'enjoy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'problem', 'issue', 'difficult', 'hard'];
  
  const positiveCount = positiveWords.filter(pw => text.toLowerCase().includes(pw)).length;
  const negativeCount = negativeWords.filter(nw => text.toLowerCase().includes(nw)).length;
  
  let sentimentScore = 0;
  let sentimentLabel = 'neutral';
  
  if (positiveCount > negativeCount) {
    sentimentScore = Math.min(1, positiveCount / words.length * 10);
    sentimentLabel = 'positive';
  } else if (negativeCount > positiveCount) {
    sentimentScore = Math.max(-1, -negativeCount / words.length * 10);
    sentimentLabel = 'negative';
  }

  // Extract key topics (simple keyword extraction)
  const topicKeywords = ['presentation', 'meeting', 'project', 'team', 'goal', 'strategy', 'plan', 'results', 'data', 'analysis'];
  const detectedTopics = topicKeywords.filter(topic => 
    text.toLowerCase().includes(topic)
  ).map(topic => ({ topic, confidence: 0.8 }));

  // Generate simple summary for longer texts
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const summary = sentences.length > 3 
    ? sentences.slice(0, 2).join('. ') + '...'
    : text;

  return {
    transcript: text,
    confidence: Math.round(avgConfidence),
    words: words,
    sentiment: {
      score: sentimentScore,
      label: sentimentLabel
    },
    topics: detectedTopics,
    summary: summary,
    speakingMetrics: {
      wordsPerMinute: Math.round(wordsPerMinute),
      fillerWordCount: detectedFillers.length,
      fillerWords: detectedFillers.map(f => f.word),
      totalWords: words.length,
      duration: totalDuration,
      averageConfidence: Math.round(avgConfidence)
    }
  };
}