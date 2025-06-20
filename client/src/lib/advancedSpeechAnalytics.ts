interface SpeechAnalytics {
  transcript: string;
  confidence: number;
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  wordDetails: Array<{
    word: string;
    confidence: number;
    duration: number;
    timestamp: number;
  }>;
  speakingRate: number;
  fillerWords: Array<{
    word: string;
    timestamp: number;
    confidence: number;
  }>;
  topics: Array<{
    topic: string;
    relevance: number;
  }>;
  overallQuality: number;
  voiceCharacteristics: {
    energy: number;
    clarity: number;
    variation: number;
  };
  suggestions: Array<{
    category: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export class AdvancedSpeechAnalytics {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private onAnalyticsCallback?: (analytics: SpeechAnalytics) => void;
  private recordingStartTime = 0;
  private chunkCounter = 0;

  constructor(onAnalytics?: (analytics: SpeechAnalytics) => void) {
    this.onAnalyticsCallback = onAnalytics;
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        } 
      });

      // Check for supported MIME types
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/mp4;codecs=mp4a.40.2',
        'audio/wav',
        'audio/webm'
      ];

      let supportedMimeType = 'audio/webm';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          supportedMimeType = mimeType;
          break;
        }
      }

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
        audioBitsPerSecond: 128000
      });

      this.audioChunks = [];
      this.isRecording = true;
      this.recordingStartTime = Date.now();
      this.chunkCounter = 0;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          console.log(`Audio chunk captured: ${event.data.size} bytes`);
        }
      };

      this.mediaRecorder.onstop = async () => {
        if (this.audioChunks.length > 0) {
          await this.processAudioForAnalytics();
        }
      };

      // Record in 4-second chunks for real-time processing
      this.mediaRecorder.start();
      
      // Process chunks every 4 seconds
      const processInterval = setInterval(async () => {
        if (this.isRecording && this.mediaRecorder?.state === 'recording') {
          this.mediaRecorder.stop();
          
          // Short delay before starting next chunk
          setTimeout(() => {
            if (this.isRecording && this.mediaRecorder) {
              this.mediaRecorder.start();
            }
          }, 200);
        } else {
          clearInterval(processInterval);
        }
      }, 4000);

      console.log('Advanced speech recording started with analytics');

    } catch (error) {
      console.error('Error starting advanced recording:', error);
      throw new Error('Microphone access required for speech analytics');
    }
  }

  async stopRecording(): Promise<void> {
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    // Stop all audio tracks
    if (this.mediaRecorder?.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    console.log('Advanced speech recording stopped');
  }

  private async processAudioForAnalytics(): Promise<void> {
    if (this.audioChunks.length === 0) return;

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    this.audioChunks = [];
    this.chunkCounter++;

    try {
      console.log(`Processing audio chunk ${this.chunkCounter}: ${audioBlob.size} bytes`);

      // Convert to base64 for API transmission
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = this.arrayBufferToBase64(arrayBuffer);

      // Send to our backend for processing with OpenAI Whisper
      const response = await fetch('/api/deepgram-transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          options: {
            language: 'en',
            response_format: 'verbose_json',
            timestamp_granularities: ['word', 'segment']
          }
        })
      });

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return;
      }

      const result = await response.json();
      
      if (result.transcript && result.transcript.trim()) {
        const analytics = this.generateComprehensiveAnalytics(result);
        console.log('Speech analytics generated:', analytics);
        this.onAnalyticsCallback?.(analytics);
      }

    } catch (error) {
      console.error('Error processing audio analytics:', error);
      // Continue without analytics rather than failing
    }
  }

  private generateComprehensiveAnalytics(apiResult: any): SpeechAnalytics {
    const transcript = apiResult.transcript || '';
    const speakingMetrics = apiResult.speakingMetrics || {};
    const words = speakingMetrics.totalWords || transcript.split(' ').length;
    const duration = speakingMetrics.duration || 4; // 4-second chunks
    
    // Calculate speaking rate
    const speakingRate = duration > 0 ? Math.round((words / duration) * 60) : 0;

    // Analyze filler words with timestamps
    const fillerWordsList = ['um', 'uh', 'er', 'ah', 'like', 'so', 'you know', 'i mean', 'basically', 'literally'];
    const detectedFillers = (speakingMetrics.fillerWords || []).map((filler: string, index: number) => ({
      word: filler,
      timestamp: Date.now() - this.recordingStartTime + (index * 500),
      confidence: Math.random() * 30 + 70 // Simulated confidence for filler detection
    }));

    // Word-level analysis
    const wordDetails = transcript.split(' ').map((word, index) => ({
      word: word.trim(),
      confidence: speakingMetrics.averageConfidence || 85,
      duration: 0.5,
      timestamp: index * 0.5
    }));

    // Topic extraction (simple keyword-based)
    const topicKeywords = [
      { topic: 'Business', keywords: ['business', 'company', 'profit', 'revenue', 'strategy', 'market'] },
      { topic: 'Technology', keywords: ['technology', 'digital', 'software', 'data', 'innovation', 'tech'] },
      { topic: 'Leadership', keywords: ['leadership', 'team', 'manage', 'vision', 'goal', 'inspire'] },
      { topic: 'Education', keywords: ['education', 'learning', 'student', 'teach', 'knowledge', 'skill'] },
      { topic: 'Health', keywords: ['health', 'wellness', 'fitness', 'medical', 'therapy', 'care'] },
      { topic: 'Finance', keywords: ['finance', 'money', 'investment', 'budget', 'cost', 'financial'] }
    ];

    const detectedTopics = topicKeywords
      .map(({ topic, keywords }) => {
        const matches = keywords.filter(keyword => 
          transcript.toLowerCase().includes(keyword)
        ).length;
        return {
          topic,
          relevance: Math.min(1, matches / keywords.length * 3)
        };
      })
      .filter(topic => topic.relevance > 0.2)
      .sort((a, b) => b.relevance - a.relevance);

    // Voice characteristics analysis
    const voiceCharacteristics = {
      energy: Math.min(100, Math.max(30, speakingRate * 0.6 + Math.random() * 20)),
      clarity: speakingMetrics.averageConfidence || 85,
      variation: Math.random() * 40 + 60 // Simulated variation score
    };

    // Overall quality calculation
    const confidenceScore = speakingMetrics.averageConfidence || 85;
    const fillerPenalty = Math.max(0.7, 1 - (detectedFillers.length / words) * 3);
    const pacePenalty = speakingRate > 80 && speakingRate < 200 ? 1 : 0.8;
    const overallQuality = Math.round(confidenceScore * fillerPenalty * pacePenalty);

    // Generate contextual suggestions
    const suggestions = this.generateContextualSuggestions(
      speakingRate, 
      detectedFillers.length, 
      confidenceScore, 
      transcript
    );

    return {
      transcript,
      confidence: confidenceScore,
      sentiment: apiResult.sentiment || { score: 0, label: 'neutral' },
      wordDetails,
      speakingRate,
      fillerWords: detectedFillers,
      topics: detectedTopics,
      overallQuality,
      voiceCharacteristics,
      suggestions
    };
  }

  private generateContextualSuggestions(
    speakingRate: number, 
    fillerCount: number, 
    confidence: number, 
    transcript: string
  ): Array<{ category: string; message: string; priority: 'high' | 'medium' | 'low' }> {
    const suggestions = [];

    // Speaking rate suggestions
    if (speakingRate > 180) {
      suggestions.push({
        category: 'Pacing',
        message: 'Consider slowing down slightly for better comprehension',
        priority: 'medium' as const
      });
    } else if (speakingRate < 120 && speakingRate > 0) {
      suggestions.push({
        category: 'Energy',
        message: 'Increase your pace to maintain audience engagement',
        priority: 'medium' as const
      });
    }

    // Filler word suggestions
    if (fillerCount > 3) {
      suggestions.push({
        category: 'Clarity',
        message: 'Try pausing instead of using filler words for more polished delivery',
        priority: 'high' as const
      });
    }

    // Confidence suggestions
    if (confidence < 70) {
      suggestions.push({
        category: 'Confidence',
        message: 'Speak more clearly and project your voice for better impact',
        priority: 'high' as const
      });
    }

    // Content suggestions
    if (transcript.length > 50 && !transcript.includes('because') && !transcript.includes('therefore')) {
      suggestions.push({
        category: 'Structure',
        message: 'Add logical connectors to strengthen your argument flow',
        priority: 'low' as const
      });
    }

    return suggestions;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}