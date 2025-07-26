// Alternative Speech Analysis APIs for Enhanced Voice Confidence Detection
// This file contains implementations for optional enhanced speech analysis services

export class AlternativeSpeechAPIs {
  private assemblyAI_API_KEY?: string;
  private hume_API_KEY?: string;

  constructor() {
    this.assemblyAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
    this.hume_API_KEY = process.env.HUME_API_KEY;
    
    console.log("🔌 Alternative Speech APIs initialized");
    if (this.assemblyAI_API_KEY) console.log("✅ AssemblyAI available ($50 free credits)");
    if (this.hume_API_KEY) console.log("✅ Hume AI available (10k chars/month free)");
  }

  // AssemblyAI Advanced Speech Analysis
  async analyzeWithAssemblyAI(audioBuffer: Buffer): Promise<any> {
    if (!this.assemblyAI_API_KEY) {
      console.log("ℹ️ AssemblyAI not configured - using Hugging Face instead");
      return null;
    }

    try {
      // Upload audio file
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'authorization': this.assemblyAI_API_KEY,
          'content-type': 'application/octet-stream'
        },
        body: audioBuffer
      });

      const { upload_url } = await uploadResponse.json();

      // Request transcription with sentiment analysis
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'authorization': this.assemblyAI_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: upload_url,
          sentiment_analysis: true,
          auto_highlights: true,
          speech_model: 'best'
        })
      });

      const transcript = await transcriptResponse.json();
      
      // Poll for completion
      const completedTranscript = await this.pollAssemblyAICompletion(transcript.id);
      
      return this.processAssemblyAIResults(completedTranscript);
    } catch (error) {
      console.error("❌ AssemblyAI analysis error:", error);
      return null;
    }
  }

  // Hume AI Expression Measurement Analysis
  async analyzeWithHumeAI(audioBuffer: Buffer): Promise<any> {
    if (!this.hume_API_KEY) {
      console.log("ℹ️ Hume AI not configured - using Hugging Face instead");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }));
      formData.append('models', JSON.stringify({
        prosody: {
          granularity: "utterance",
          identify_speakers: false
        }
      }));

      const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
        method: 'POST',
        headers: {
          'X-Hume-Api-Key': this.hume_API_KEY
        },
        body: formData
      });

      const job = await response.json();
      
      // Poll for completion
      const completedJob = await this.pollHumeAICompletion(job.job_id);
      
      return this.processHumeAIResults(completedJob);
    } catch (error) {
      console.error("❌ Hume AI analysis error:", error);
      return null;
    }
  }

  // Poll AssemblyAI transcription completion
  private async pollAssemblyAICompletion(transcriptId: string, maxAttempts = 30): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { 'authorization': this.assemblyAI_API_KEY! }
      });
      
      const transcript = await response.json();
      
      if (transcript.status === 'completed') {
        return transcript;
      } else if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Transcription timeout');
  }

  // Poll Hume AI job completion
  private async pollHumeAICompletion(jobId: string, maxAttempts = 30): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}`, {
        headers: { 'X-Hume-Api-Key': this.hume_API_KEY! }
      });
      
      const job = await response.json();
      
      if (job.state === 'COMPLETED') {
        // Get predictions
        const predictionsResponse = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}/predictions`, {
          headers: { 'X-Hume-Api-Key': this.hume_API_KEY! }
        });
        return await predictionsResponse.json();
      } else if (job.state === 'FAILED') {
        throw new Error(`Hume AI job failed: ${job.message}`);
      }
      
      // Wait 3 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    throw new Error('Hume AI job timeout');
  }

  // Process AssemblyAI results for confidence metrics
  private processAssemblyAIResults(transcript: any): any {
    const sentimentResults = transcript.sentiment_analysis_results || [];
    const highlights = transcript.auto_highlights_result?.results || [];
    
    // Analyze sentiment for confidence indicators
    const positiveSegments = sentimentResults.filter((s: any) => s.sentiment === 'POSITIVE').length;
    const negativeSegments = sentimentResults.filter((s: any) => s.sentiment === 'NEGATIVE').length;
    const neutralSegments = sentimentResults.filter((s: any) => s.sentiment === 'NEUTRAL').length;
    
    const confidenceFromSentiment = Math.floor(
      (positiveSegments * 80 + neutralSegments * 60 + negativeSegments * 30) / sentimentResults.length || 60
    );
    
    return {
      provider: 'assemblyai',
      confidence: {
        overall: confidenceFromSentiment,
        sentiment_based: true,
        positive_ratio: positiveSegments / (sentimentResults.length || 1),
        negative_ratio: negativeSegments / (sentimentResults.length || 1)
      },
      effectiveness: {
        clarity: transcript.confidence > 0.85 ? 85 : 65,
        highlights: highlights.length,
        key_phrases: highlights.slice(0, 3).map((h: any) => h.text)
      },
      text_analysis: {
        word_count: transcript.words?.length || 0,
        speaking_rate: this.calculateSpeakingRate(transcript),
        filler_word_ratio: this.detectFillerWords(transcript.text || '')
      }
    };
  }

  // Process Hume AI results for comprehensive emotion analysis
  private processHumeAIResults(predictions: any): any {
    const prosodyData = predictions[0]?.results?.predictions?.[0]?.models?.prosody?.grouped_predictions || [];
    
    if (prosodyData.length === 0) {
      return { provider: 'hume_ai', error: 'No prosody data available' };
    }
    
    const emotions = prosodyData[0]?.predictions?.[0]?.emotions || [];
    
    // Extract confidence-related emotions
    const confidence = emotions.find((e: any) => e.name === 'Confidence')?.score || 0.5;
    const assertiveness = emotions.find((e: any) => e.name === 'Assertiveness')?.score || 0.5;
    const enthusiasm = emotions.find((e: any) => e.name === 'Enthusiasm')?.score || 0.5;
    const anxiety = emotions.find((e: any) => e.name === 'Anxiety')?.score || 0.3;
    
    const overallConfidence = Math.floor(
      ((confidence + assertiveness + enthusiasm) * 100 - anxiety * 100) / 3
    );
    
    return {
      provider: 'hume_ai',
      confidence: {
        overall: Math.min(95, Math.max(25, overallConfidence)),
        assertiveness: Math.floor(assertiveness * 100),
        enthusiasm: Math.floor(enthusiasm * 100),
        anxiety_level: Math.floor(anxiety * 100)
      },
      modulation: {
        prosody_score: Math.floor((confidence + assertiveness) * 50),
        emotional_variety: emotions.length,
        top_emotions: emotions.slice(0, 5).map((e: any) => ({
          emotion: e.name,
          score: Math.floor(e.score * 100)
        }))
      },
      effectiveness: {
        buoyancy: emotions.find((e: any) => e.name === 'Buoyancy')?.score * 100 || 50,
        vocal_confidence: Math.floor((confidence + assertiveness) * 50),
        audience_impact: Math.floor((enthusiasm + confidence - anxiety) * 33)
      }
    };
  }

  // Calculate speaking rate from transcript
  private calculateSpeakingRate(transcript: any): number {
    const words = transcript.words?.length || 0;
    const durationSeconds = (transcript.audio_duration || 60) / 1000;
    const wordsPerMinute = Math.floor((words / durationSeconds) * 60);
    
    return wordsPerMinute;
  }

  // Detect filler words in transcript
  private detectFillerWords(text: string): number {
    const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'basically', 'actually'];
    const words = text.toLowerCase().split(/\s+/);
    const fillerCount = words.filter(word => fillerWords.includes(word)).length;
    
    return Math.floor((fillerCount / words.length) * 100);
  }

  // Get available API status
  getAvailableAPIs(): string[] {
    const available = ['huggingface']; // Always available
    
    if (this.assemblyAI_API_KEY) available.push('assemblyai');
    if (this.hume_API_KEY) available.push('hume_ai');
    
    return available;
  }

  // Check if enhanced APIs are available
  hasEnhancedAPIs(): boolean {
    return !!(this.assemblyAI_API_KEY || this.hume_API_KEY);
  }
}

export const alternativeSpeechAPIs = new AlternativeSpeechAPIs();