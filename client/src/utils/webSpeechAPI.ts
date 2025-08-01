declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechAnalysisResult {
  transcript: string;
  confidence: number;
  interimResults: string[];
  languageDetected: string;
  speechRate: number;
  isStillSpeaking: boolean;
}

interface SpeechMetrics {
  wordsPerMinute: number;
  averageConfidence: number;
  totalPauses: number;
  speechDuration: number;
  silenceDuration: number;
  voiceActivity: number; // Percentage of time speaking
}

export class WebSpeechAnalyzer {
  private recognition: any = null;
  private isActive = false;
  private startTime = 0;
  private speechSegments: Array<{ text: string; confidence: number; timestamp: number }> = [];
  private pauseDetectionTimer: NodeJS.Timeout | null = null;
  private lastSpeechTime = 0;
  private totalPauses = 0;
  private speechDuration = 0;
  private silenceDuration = 0;

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): boolean {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('⚠️ Web Speech API not supported in this browser');
        return false;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;

      console.log('✅ Web Speech API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Web Speech API:', error);
      return false;
    }
  }

  startAnalysis(
    onResult: (result: SpeechAnalysisResult) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError?.('Speech recognition not available');
      return false;
    }

    if (this.isActive) {
      console.warn('Speech analysis already active');
      return false;
    }

    try {
      this.resetMetrics();
      this.startTime = Date.now();
      this.lastSpeechTime = this.startTime;
      this.isActive = true;

      this.recognition.onresult = (event: any) => {
        const results = Array.from(event.results);
        const finalResults = results.filter((result: any) => result.isFinal);
        const interimResults = results.filter((result: any) => !result.isFinal);

        // Process final results
        finalResults.forEach((result: any, index: number) => {
          const transcript = result[0].transcript;
          const confidence = result[0].confidence || 0.8; // Fallback if confidence not available
          
          this.speechSegments.push({
            text: transcript,
            confidence,
            timestamp: Date.now()
          });

          // Update speech timing
          this.lastSpeechTime = Date.now();
          this.speechDuration += this.estimateSpeechDuration(transcript);
        });

        // Calculate current speech rate
        const currentText = (results[results.length - 1] as any)?.[0]?.transcript || '';
        const speechRate = this.calculateSpeechRate();

        // Detect language (basic detection based on common words)
        const languageDetected = this.detectLanguage(currentText);

        const analysisResult: SpeechAnalysisResult = {
          transcript: finalResults.map((r: any) => r[0].transcript).join(' '),
          confidence: finalResults.length > 0 ? 
            finalResults.reduce((sum: number, r: any) => sum + (r[0].confidence || 0.8), 0) / finalResults.length : 0,
          interimResults: interimResults.map((r: any) => r[0].transcript),
          languageDetected,
          speechRate,
          isStillSpeaking: interimResults.length > 0
        };

        onResult(analysisResult);

        // Reset pause detection timer
        this.resetPauseTimer();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onError?.(event.error);
      };

      this.recognition.onend = () => {
        if (this.isActive) {
          // Restart if still active (for continuous recognition)
          try {
            this.recognition?.start();
          } catch (error) {
            console.warn('Failed to restart speech recognition:', error);
          }
        }
      };

      this.recognition.start();
      this.startPauseDetection();
      
      console.log('🎤 Web Speech API analysis started');
      return true;

    } catch (error) {
      console.error('❌ Failed to start speech analysis:', error);
      onError?.('Failed to start speech recognition');
      return false;
    }
  }

  stopAnalysis(): SpeechMetrics {
    if (!this.isActive) {
      return this.getEmptyMetrics();
    }

    this.isActive = false;
    
    try {
      this.recognition?.stop();
    } catch (error) {
      console.warn('Error stopping speech recognition:', error);
    }

    if (this.pauseDetectionTimer) {
      clearTimeout(this.pauseDetectionTimer);
      this.pauseDetectionTimer = null;
    }

    const totalDuration = Date.now() - this.startTime;
    this.silenceDuration = totalDuration - this.speechDuration;

    const metrics: SpeechMetrics = {
      wordsPerMinute: this.calculateWordsPerMinute(),
      averageConfidence: this.calculateAverageConfidence(),
      totalPauses: this.totalPauses,
      speechDuration: this.speechDuration,
      silenceDuration: this.silenceDuration,
      voiceActivity: totalDuration > 0 ? (this.speechDuration / totalDuration) * 100 : 0
    };

    console.log('🎤 Web Speech API analysis stopped', metrics);
    return metrics;
  }

  private resetMetrics(): void {
    this.speechSegments = [];
    this.totalPauses = 0;
    this.speechDuration = 0;
    this.silenceDuration = 0;
  }

  private resetPauseTimer(): void {
    if (this.pauseDetectionTimer) {
      clearTimeout(this.pauseDetectionTimer);
    }
    
    this.startPauseDetection();
  }

  private startPauseDetection(): void {
    // Detect pauses longer than 1 second
    this.pauseDetectionTimer = setTimeout(() => {
      if (this.isActive && Date.now() - this.lastSpeechTime > 1000) {
        this.totalPauses++;
        this.silenceDuration += Date.now() - this.lastSpeechTime;
      }
    }, 1000);
  }

  private calculateSpeechRate(): number {
    const totalWords = this.speechSegments.reduce((sum, segment) => 
      sum + segment.text.split(' ').length, 0);
    const totalTimeMinutes = (Date.now() - this.startTime) / 60000;
    
    return totalTimeMinutes > 0 ? totalWords / totalTimeMinutes : 0;
  }

  private calculateWordsPerMinute(): number {
    const totalWords = this.speechSegments.reduce((sum, segment) => 
      sum + segment.text.split(' ').filter(word => word.length > 0).length, 0);
    const totalTimeMinutes = this.speechDuration / 60000;
    
    return totalTimeMinutes > 0 ? totalWords / totalTimeMinutes : 0;
  }

  private calculateAverageConfidence(): number {
    if (this.speechSegments.length === 0) return 0;
    
    const totalConfidence = this.speechSegments.reduce((sum, segment) => 
      sum + segment.confidence, 0);
    
    return totalConfidence / this.speechSegments.length;
  }

  private estimateSpeechDuration(text: string): number {
    // Estimate based on average speaking rate (150 WPM = 2.5 words per second)
    const words = text.split(' ').filter(word => word.length > 0).length;
    return (words / 2.5) * 1000; // Convert to milliseconds
  }

  private detectLanguage(text: string): string {
    // Simple language detection based on common words
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'];
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no'];
    const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir'];

    const words = text.toLowerCase().split(/\s+/);
    
    let englishCount = 0;
    let spanishCount = 0;
    let frenchCount = 0;

    words.forEach(word => {
      if (englishWords.includes(word)) englishCount++;
      if (spanishWords.includes(word)) spanishCount++;
      if (frenchWords.includes(word)) frenchCount++;
    });

    if (englishCount >= spanishCount && englishCount >= frenchCount) return 'en-US';
    if (spanishCount >= frenchCount) return 'es-ES';
    if (frenchCount > 0) return 'fr-FR';
    
    return 'en-US'; // Default to English
  }

  private getEmptyMetrics(): SpeechMetrics {
    return {
      wordsPerMinute: 0,
      averageConfidence: 0,
      totalPauses: 0,
      speechDuration: 0,
      silenceDuration: 0,
      voiceActivity: 0
    };
  }

  isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  getFullTranscript(): string {
    return this.speechSegments.map(segment => segment.text).join(' ');
  }
}