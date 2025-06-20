interface DeepgramResponse {
  transcript: string;
  confidence: number;
  words: Array<{
    word: string;
    confidence: number;
    start: number;
    end: number;
    speaker?: number;
  }>;
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  topics?: Array<{
    topic: string;
    confidence: number;
  }>;
  summary?: string;
}

interface SpeechAnalytics {
  transcript: string;
  confidence: number;
  sentiment: {
    score: number;
    label: string;
  };
  wordDetails: Array<{
    word: string;
    confidence: number;
    duration: number;
  }>;
  speakingRate: number;
  fillerWords: string[];
  topics: string[];
  overallQuality: number;
}

export class DeepgramSpeechService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private onTranscriptCallback?: (analytics: SpeechAnalytics) => void;

  constructor(onTranscript?: (analytics: SpeechAnalytics) => void) {
    this.onTranscriptCallback = onTranscript;
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        if (this.audioChunks.length > 0) {
          await this.processAudioChunk();
        }
      };

      // Record in 3-second chunks for real-time processing
      this.mediaRecorder.start(3000);

      // Process chunks every 3 seconds
      const chunkInterval = setInterval(() => {
        if (this.isRecording && this.mediaRecorder?.state === 'recording') {
          this.mediaRecorder.stop();
          setTimeout(() => {
            if (this.isRecording) {
              this.mediaRecorder?.start(3000);
            }
          }, 100);
        } else {
          clearInterval(chunkInterval);
        }
      }, 3000);

    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Could not access microphone');
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
  }

  private async processAudioChunk(): Promise<void> {
    if (this.audioChunks.length === 0) return;

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    this.audioChunks = [];

    try {
      // Convert to WAV for better compatibility
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = this.arrayBufferToBase64(arrayBuffer);

      // Send to backend for Deepgram processing
      const response = await fetch('/api/deepgram-transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          options: {
            model: 'nova-2',
            language: 'en-US',
            punctuate: true,
            diarize: false,
            smart_format: true,
            sentiment: true,
            topics: true,
            confidence: true,
            timestamps: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DeepgramResponse = await response.json();
      
      if (result.transcript && result.transcript.trim()) {
        const analytics = this.processDeepgramResponse(result);
        this.onTranscriptCallback?.(analytics);
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      // Fallback to Web Speech API if Deepgram fails
      this.fallbackToWebSpeech();
    }
  }

  private processDeepgramResponse(response: DeepgramResponse): SpeechAnalytics {
    const words = response.words || [];
    const totalDuration = words.length > 0 ? 
      words[words.length - 1].end - words[0].start : 0;
    
    // Calculate speaking rate (words per minute)
    const speakingRate = totalDuration > 0 ? 
      (words.length / totalDuration) * 60 : 0;

    // Detect filler words
    const fillerWordsList = ['um', 'uh', 'er', 'ah', 'like', 'so', 'you know', 'i mean'];
    const fillerWords = words
      .filter(w => fillerWordsList.includes(w.word.toLowerCase()))
      .map(w => w.word);

    // Calculate overall quality based on confidence, speaking rate, and filler words
    const avgConfidence = words.reduce((sum, w) => sum + w.confidence, 0) / words.length || 0;
    const fillerPenalty = Math.max(0, 1 - (fillerWords.length / words.length) * 2);
    const ratePenalty = speakingRate > 0 && speakingRate < 200 && speakingRate > 80 ? 1 : 0.8;
    const overallQuality = Math.round((avgConfidence * fillerPenalty * ratePenalty) * 100);

    return {
      transcript: response.transcript,
      confidence: Math.round(avgConfidence * 100),
      sentiment: response.sentiment || { score: 0, label: 'neutral' },
      wordDetails: words.map(w => ({
        word: w.word,
        confidence: Math.round(w.confidence * 100),
        duration: w.end - w.start
      })),
      speakingRate: Math.round(speakingRate),
      fillerWords,
      topics: response.topics?.map(t => t.topic) || [],
      overallQuality
    };
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private fallbackToWebSpeech(): void {
    console.log('Falling back to Web Speech API');
    // Implement Web Speech API fallback if needed
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        
        if (transcript.trim()) {
          // Create basic analytics for fallback
          const words = transcript.split(' ').filter(w => w.trim());
          const analytics: SpeechAnalytics = {
            transcript,
            confidence: Math.round(event.results[event.resultIndex][0].confidence * 100) || 85,
            sentiment: { score: 0, label: 'neutral' },
            wordDetails: words.map(word => ({
              word,
              confidence: 85,
              duration: 0.5
            })),
            speakingRate: 150,
            fillerWords: words.filter(w => 
              ['um', 'uh', 'er', 'ah', 'like', 'so'].includes(w.toLowerCase())
            ),
            topics: [],
            overallQuality: 80
          };
          
          this.onTranscriptCallback?.(analytics);
        }
      };
      
      recognition.start();
    }
  }
}