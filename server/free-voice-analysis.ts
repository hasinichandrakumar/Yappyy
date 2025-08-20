// Free Voice Analysis Engine - Using Open Source Libraries
interface FreeVoiceAnalysis {
  sentiment: {
    score: number;
    label: string;
    confidence: number;
  };
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
    disgust: number;
  };
  confidence: number;
  clarity: number;
  professionalism: number;
}

export class FreeVoiceAnalysisEngine {
  private emotionPipeline: any;
  private isInitialized = false;

  constructor() {
    this.isInitialized = true;
    
    // Initialize HuggingFace models asynchronously (may fail gracefully)
    this.initializeEngines();
  }

  private async initializeEngines(): Promise<void> {
    // Run initialization in background without blocking server startup
    setTimeout(async () => {
      try {
        // Try to initialize HuggingFace Transformers emotion pipeline
        const { pipeline } = await import('@xenova/transformers');
        this.emotionPipeline = await pipeline(
          'audio-classification',
          'speechbrain/emotion-recognition-wav2vec2-IEMOCAP'
        );
        console.log('🎵 HuggingFace emotion pipeline loaded successfully');
      } catch (modelError) {
        console.log('⚠️ HuggingFace emotion model unavailable, using fallback analysis');
        this.emotionPipeline = null;
      }
      
      console.log('🆓 Free Voice Analysis Engine initialization completed');
    }, 100); // Initialize after server is running
  }

  async analyzeTranscript(transcript: string): Promise<FreeVoiceAnalysis> {
    if (!transcript || transcript.trim().length === 0) {
      return this.getFallbackAnalysis();
    }

    try {
      // Calculate confidence based on transcript characteristics
      const confidence = this.calculateConfidenceFromText(transcript);
      const clarity = this.calculateClarityFromText(transcript);
      const professionalism = this.calculateProfessionalismFromText(transcript);
      
      // Emotion analysis from text patterns
      const emotions = this.analyzeEmotionsFromText(transcript);
      
      // Simple sentiment analysis based on text characteristics
      const sentiment = this.analyzeSentimentFromText(transcript);

      return {
        sentiment,
        emotions,
        confidence,
        clarity,
        professionalism
      };
    } catch (error) {
      console.error('❌ Free voice analysis error:', error);
      return this.getFallbackAnalysis();
    }
  }

  async analyzeAudioBuffer(audioBuffer: Buffer): Promise<FreeVoiceAnalysis> {
    if (!this.isInitialized) {
      console.warn('🔄 Free voice analysis not ready, using fallback analysis');
      return this.getFallbackAnalysis();
    }

    if (!this.emotionPipeline) {
      console.warn('🔄 Emotion pipeline unavailable, using enhanced fallback analysis');
      return this.getEnhancedFallbackAnalysis();
    }

    try {
      // Convert audio buffer for emotion recognition
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const emotionResult = await this.emotionPipeline(audioBlob);
      
      // Process emotion results
      const emotions = this.processEmotionResults(emotionResult);
      
      return {
        sentiment: {
          score: emotions.joy > 0.5 ? emotions.joy : -emotions.sadness,
          label: this.getDominantEmotion(emotions),
          confidence: Math.max(...Object.values(emotions) as number[])
        },
        emotions,
        confidence: this.calculateConfidenceFromEmotions(emotions),
        clarity: this.calculateClarityFromAudio(emotions),
        professionalism: this.calculateProfessionalismFromEmotions(emotions)
      };
    } catch (error) {
      console.error('❌ Free audio analysis error:', error);
      return this.getFallbackAnalysis();
    }
  }

  private calculateConfidenceFromText(transcript: string): number {
    if (!transcript) return 0;
    
    // Analyze text patterns for confidence indicators
    const confidenceWords = ['confident', 'sure', 'certain', 'definitely', 'absolutely'];
    const uncertainWords = ['maybe', 'perhaps', 'might', 'possibly', 'unsure'];
    const fillerWords = ['um', 'uh', 'like', 'you know', 'basically'];
    
    let score = 70; // Base confidence score
    
    // Boost for confidence words
    confidenceWords.forEach(word => {
      if (transcript.toLowerCase().includes(word)) score += 5;
    });
    
    // Reduce for uncertainty and fillers
    uncertainWords.forEach(word => {
      if (transcript.toLowerCase().includes(word)) score -= 8;
    });
    
    fillerWords.forEach(word => {
      const count = (transcript.toLowerCase().match(new RegExp(word, 'g')) || []).length;
      score -= count * 3;
    });
    
    // Sentence structure analysis
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    
    if (avgLength > 50) score += 10; // Well-structured sentences
    if (avgLength < 20) score -= 5; // Too short/fragmented
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateClarityFromText(transcript: string): number {
    if (!transcript) return 0;
    
    // Analyze for clarity indicators
    const words = transcript.split(' ').filter(w => w.length > 0);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    let clarity = 75; // Base clarity score
    
    // Well-structured vocabulary
    if (avgWordLength > 4.5) clarity += 10;
    if (avgWordLength < 3) clarity -= 10;
    
    // Complete sentences
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 2) clarity += 5;
    
    // Repetition analysis
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const repetitionRatio = uniqueWords.size / words.length;
    clarity += (repetitionRatio * 20);
    
    return Math.max(0, Math.min(100, clarity));
  }

  private calculateProfessionalismFromText(transcript: string): number {
    if (!transcript) return 0;
    
    // Professional language indicators
    const professionalWords = [
      'please', 'thank you', 'appreciate', 'understand', 'analyze',
      'implement', 'strategy', 'objective', 'facilitate', 'optimize'
    ];
    const casualWords = ['yeah', 'gonna', 'wanna', 'kinda', 'sorta'];
    
    let score = 70;
    
    professionalWords.forEach(word => {
      if (transcript.toLowerCase().includes(word)) score += 3;
    });
    
    casualWords.forEach(word => {
      if (transcript.toLowerCase().includes(word)) score -= 5;
    });
    
    // Grammar structure
    if (transcript.includes('.') || transcript.includes('!')) score += 5;
    if (/^[A-Z]/.test(transcript)) score += 3; // Proper capitalization
    
    return Math.max(0, Math.min(100, score));
  }

  private analyzeEmotionsFromText(transcript: string): any {
    const emotionKeywords = {
      joy: ['happy', 'excited', 'great', 'excellent', 'amazing', 'wonderful'],
      anger: ['angry', 'frustrated', 'annoyed', 'upset', 'mad'],
      fear: ['worried', 'anxious', 'nervous', 'scared', 'concerned'],
      sadness: ['sad', 'disappointed', 'unfortunate', 'regret'],
      surprise: ['surprised', 'unexpected', 'wow', 'amazing'],
      disgust: ['terrible', 'awful', 'disgusting', 'horrible']
    };
    
    const emotions: any = {
      joy: 0,
      anger: 0,
      fear: 0,
      sadness: 0,
      surprise: 0,
      disgust: 0
    };
    
    const lowerTranscript = transcript.toLowerCase();
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerTranscript.includes(keyword)) {
          emotions[emotion] += 0.2;
        }
      });
    });
    
    // Normalize scores
    Object.keys(emotions).forEach(key => {
      emotions[key] = Math.min(1, emotions[key]);
    });
    
    return emotions;
  }

  private processEmotionResults(results: any): any {
    if (!results || !Array.isArray(results)) {
      return { joy: 0, anger: 0, fear: 0, sadness: 0, surprise: 0, disgust: 0 };
    }
    
    const emotions: any = { joy: 0, anger: 0, fear: 0, sadness: 0, surprise: 0, disgust: 0 };
    
    results.forEach((result: any) => {
      const label = result.label?.toLowerCase() || '';
      const score = result.score || 0;
      
      // Map SpeechBrain labels to emotion categories
      if (label.includes('happy') || label.includes('joy')) emotions.joy = score;
      if (label.includes('angry') || label.includes('anger')) emotions.anger = score;
      if (label.includes('fear') || label.includes('afraid')) emotions.fear = score;
      if (label.includes('sad') || label.includes('sadness')) emotions.sadness = score;
      if (label.includes('surprise')) emotions.surprise = score;
      if (label.includes('disgust')) emotions.disgust = score;
    });
    
    return emotions;
  }

  private calculateConfidenceFromEmotions(emotions: any): number {
    // Higher joy and lower fear/sadness indicate confidence
    const confidence = (emotions.joy * 40) + 
                     (emotions.surprise * 20) - 
                     (emotions.fear * 30) - 
                     (emotions.sadness * 20) + 50;
    
    return Math.max(0, Math.min(100, confidence));
  }

  private calculateClarityFromAudio(emotions: any): number {
    // Stable emotions typically indicate clearer speech
    const emotionVariance = Object.values(emotions).reduce((sum: number, val: any) => sum + Math.abs(val - 0.5), 0);
    const clarity = 80 - (emotionVariance * 30);
    
    return Math.max(0, Math.min(100, clarity));
  }

  private calculateProfessionalismFromEmotions(emotions: any): number {
    // Balanced emotions with controlled expression
    const professionalism = 70 + 
                           (emotions.joy * 15) - 
                           (emotions.anger * 25) - 
                           (emotions.fear * 15);
    
    return Math.max(0, Math.min(100, professionalism));
  }

  private getDominantEmotion(emotions: any): string {
    let maxEmotion = 'neutral';
    let maxScore = 0;
    
    Object.entries(emotions).forEach(([emotion, score]: [string, any]) => {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    });
    
    return maxEmotion;
  }

  private calculateConfidenceFromText(text: string): number {
    // Simple confidence scoring based on text characteristics
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    // Confidence indicators
    const confidentWords = [
      'definitely', 'certainly', 'absolutely', 'clearly', 'obviously',
      'undoubtedly', 'surely', 'indeed', 'truly', 'genuinely'
    ];
    
    const confidentWordCount = words.filter(word => 
      confidentWords.includes(word)
    ).length;
    
    // Hesitation indicators (penalty)
    const hesitationWords = ['um', 'uh', 'maybe', 'perhaps', 'possibly', 'might'];
    const hesitationCount = words.filter(word => 
      hesitationWords.includes(word)
    ).length;
    
    // Calculate confidence score
    const confidentRatio = confidentWordCount / totalWords;
    const hesitationPenalty = hesitationCount / totalWords;
    
    return Math.min(100, Math.max(0, (confidentRatio * 100) - (hesitationPenalty * 50) + 50));
  }

  private calculateClarityFromText(text: string): number {
    // Simple clarity scoring based on text characteristics
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    // Clarity indicators
    const clearWords = [
      'specifically', 'precisely', 'exactly', 'clearly', 'simply',
      'directly', 'straightforward', 'concrete', 'definite', 'explicit'
    ];
    
    const clearWordCount = words.filter(word => 
      clearWords.includes(word)
    ).length;
    
    // Vagueness indicators (penalty)
    const vagueWords = ['thing', 'stuff', 'something', 'somehow', 'sort of', 'kind of'];
    const vagueCount = words.filter(word => 
      vagueWords.includes(word)
    ).length;
    
    // Calculate clarity score
    const clearRatio = clearWordCount / totalWords;
    const vaguePenalty = vagueCount / totalWords;
    
    return Math.min(100, Math.max(0, (clearRatio * 100) - (vaguePenalty * 60) + 60));
  }

  private calculateProfessionalismFromText(text: string): number {
    // Simple professionalism scoring based on text characteristics
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    // Professional vocabulary indicators
    const professionalWords = [
      'therefore', 'consequently', 'furthermore', 'moreover', 'additionally',
      'specifically', 'particularly', 'notably', 'significantly', 'evidently',
      'consequently', 'accordingly', 'subsequently', 'previously', 'initially'
    ];
    
    const professionalWordCount = words.filter(word => 
      professionalWords.includes(word)
    ).length;
    
    // Filler word penalty
    const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
    const fillerWordCount = words.filter(word => 
      fillerWords.includes(word)
    ).length;
    
    // Calculate professionalism score
    const professionalRatio = professionalWordCount / totalWords;
    const fillerPenalty = Math.min(0.3, fillerWordCount / totalWords);
    
    return Math.min(100, Math.max(0, (professionalRatio * 100) - (fillerPenalty * 100)));
  }

  private analyzeSentimentFromText(text: string): { score: number; label: string; confidence: number } {
    // Simple sentiment analysis based on text characteristics
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords === 0) {
      return { score: 0, label: 'neutral', confidence: 0 };
    }
    
    // Positive words
    const positiveWords = [
      'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'brilliant',
      'outstanding', 'superb', 'terrific', 'awesome', 'perfect', 'ideal',
      'successful', 'effective', 'powerful', 'strong', 'confident', 'clear'
    ];
    
    // Negative words
    const negativeWords = [
      'terrible', 'awful', 'horrible', 'bad', 'poor', 'weak', 'confusing',
      'difficult', 'problem', 'issue', 'fail', 'failure', 'wrong', 'incorrect',
      'unclear', 'vague', 'uncertain', 'doubtful', 'worried', 'concerned'
    ];
    
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    // Calculate sentiment score (-1 to 1)
    const positiveRatio = positiveCount / totalWords;
    const negativeRatio = negativeCount / totalWords;
    const score = positiveRatio - negativeRatio;
    
    // Determine label
    let label = 'neutral';
    if (score > 0.1) label = 'positive';
    else if (score < -0.1) label = 'negative';
    
    // Calculate confidence based on word count and sentiment strength
    const confidence = Math.min(1, Math.abs(score) * 2 + (totalWords / 100));
    
    return { score, label, confidence };
  }

  private getFallbackAnalysis(): FreeVoiceAnalysis {
    return {
      sentiment: { score: 0, label: 'neutral', confidence: 0 },
      emotions: { joy: 0, anger: 0, fear: 0, sadness: 0, surprise: 0, disgust: 0 },
      confidence: 0,
      clarity: 0,
      professionalism: 0
    };
  }

  private getEnhancedFallbackAnalysis(): FreeVoiceAnalysis {
    // Provide baseline analysis when audio models are unavailable
    return {
      sentiment: { score: 50, label: 'neutral', confidence: 40 },
      emotions: { joy: 30, anger: 10, fear: 15, sadness: 10, surprise: 20, disgust: 5 },
      confidence: 50,
      clarity: 60,
      professionalism: 55
    };
  }
}

export const freeVoiceAnalysis = new FreeVoiceAnalysisEngine();