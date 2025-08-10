// Advanced Emotional Impact Analysis Engine
// Speaker-focused assessments through acoustic analysis, body language, and contextual evaluation

export interface EmotionalImpactAnalysis {
  overallEmotionalScore: number; // 0-100
  acousticAnalysis: {
    pitchVariation: number; // 0-100 - emotional expressiveness through pitch changes
    volumeDynamics: number; // 0-100 - emotional engagement through volume control
    speechRateEmotions: number; // 0-100 - emotional state reflected in pacing
    voiceQualityMarkers: number; // 0-100 - emotional authenticity in voice
    emotionalRange: number; // 0-100 - breadth of emotional expression
  };
  bodyLanguageImpact: {
    gestureExpressiveness: number; // 0-100 - emotional communication through gestures
    facialExpressionRange: number; // 0-100 - facial emotional variety
    eyeContactEmotions: number; // 0-100 - emotional connection through eye contact
    postureEmotionalState: number; // 0-100 - body posture reflecting emotional state
    movementEnergy: number; // 0-100 - physical energy conveying emotions
  };
  contextualEmotionalFit: {
    topicEmotionalAlignment: number; // 0-100 - emotional appropriateness for content
    audienceEmotionalResonance: number; // 0-100 - emotional connection with audience type
    settingAppropriateEmotions: number; // 0-100 - emotional suitability for environment
    purposeEmotionalEffectiveness: number; // 0-100 - emotions supporting speech goals
  };
  emotionalJourney: {
    openingEmotionalHook: number; // 0-100 - emotional engagement from start
    emotionalProgression: number; // 0-100 - emotional arc throughout speech
    peakEmotionalMoments: number; // 0-100 - creation of emotional climaxes
    emotionalClosing: number; // 0-100 - emotional resonance in conclusion
  };
  detailedEmotionalInsights: {
    primaryEmotions: string[]; // Detected primary emotional tones
    emotionalTransitions: string[]; // How emotions shifted throughout
    authenticityMarkers: string[]; // Indicators of genuine emotional expression
    improvementAreas: string[]; // Specific areas for emotional enhancement
  };
}

export class EmotionalImpactAnalyzer {
  
  public analyzeEmotionalImpact(
    transcript: string,
    audioMetrics: any,
    bodyLanguageData: any,
    purpose: string,
    duration: number
  ): EmotionalImpactAnalysis {
    
    // Acoustic emotion analysis
    const acousticAnalysis = this.analyzeAcousticEmotions(audioMetrics, transcript);
    
    // Body language emotional assessment
    const bodyLanguageImpact = this.analyzeBodyLanguageEmotions(bodyLanguageData, transcript);
    
    // Contextual emotional alignment
    const contextualEmotionalFit = this.analyzeContextualEmotions(transcript, purpose);
    
    // Emotional journey mapping
    const emotionalJourney = this.analyzeEmotionalJourney(transcript, duration);
    
    // Generate detailed emotional insights
    const detailedEmotionalInsights = this.generateEmotionalInsights(
      transcript, 
      acousticAnalysis, 
      bodyLanguageImpact, 
      purpose
    );
    
    // Calculate overall emotional score
    const overallEmotionalScore = this.calculateOverallEmotionalScore({
      acousticAnalysis,
      bodyLanguageImpact,
      contextualEmotionalFit,
      emotionalJourney
    });
    
    return {
      overallEmotionalScore,
      acousticAnalysis,
      bodyLanguageImpact,
      contextualEmotionalFit,
      emotionalJourney,
      detailedEmotionalInsights
    };
  }
  
  private analyzeAcousticEmotions(audioMetrics: any, transcript: string) {
    // Pitch variation analysis for emotional expressiveness
    const pitchVariation = this.analyzePitchEmotions(audioMetrics);
    
    // Volume dynamics for emotional engagement
    const volumeDynamics = this.analyzeVolumeEmotions(audioMetrics);
    
    // Speech rate emotional markers
    const speechRateEmotions = this.analyzeSpeechRateEmotions(audioMetrics, transcript);
    
    // Voice quality emotional indicators
    const voiceQualityMarkers = this.analyzeVoiceQualityEmotions(audioMetrics);
    
    // Emotional range assessment
    const emotionalRange = this.calculateEmotionalRange(audioMetrics, transcript);
    
    return {
      pitchVariation,
      volumeDynamics,
      speechRateEmotions,
      voiceQualityMarkers,
      emotionalRange
    };
  }
  
  private analyzeBodyLanguageEmotions(bodyLanguageData: any, transcript: string) {
    // Gesture emotional expressiveness
    const gestureExpressiveness = this.analyzeGestureEmotions(bodyLanguageData);
    
    // Facial expression emotional range
    const facialExpressionRange = this.analyzeFacialEmotions(bodyLanguageData);
    
    // Eye contact emotional connection
    const eyeContactEmotions = this.analyzeEyeContactEmotions(bodyLanguageData);
    
    // Posture emotional state
    const postureEmotionalState = this.analyzePostureEmotions(bodyLanguageData);
    
    // Movement energy
    const movementEnergy = this.analyzeMovementEmotions(bodyLanguageData);
    
    return {
      gestureExpressiveness,
      facialExpressionRange,
      eyeContactEmotions,
      postureEmotionalState,
      movementEnergy
    };
  }
  
  private analyzeContextualEmotions(transcript: string, purpose: string) {
    const words = transcript.toLowerCase();
    
    // Topic emotional alignment
    const topicEmotionalAlignment = this.analyzeTopicEmotionalFit(words, purpose);
    
    // Audience emotional resonance
    const audienceEmotionalResonance = this.analyzeAudienceEmotionalConnection(words, purpose);
    
    // Setting appropriate emotions
    const settingAppropriateEmotions = this.analyzeSettingEmotionalFit(words, purpose);
    
    // Purpose emotional effectiveness
    const purposeEmotionalEffectiveness = this.analyzePurposeEmotionalAlignment(words, purpose);
    
    return {
      topicEmotionalAlignment,
      audienceEmotionalResonance,
      settingAppropriateEmotions,
      purposeEmotionalEffectiveness
    };
  }
  
  private analyzeEmotionalJourney(transcript: string, duration: number) {
    const totalLength = transcript.length;
    
    // Divide speech into segments for emotional arc analysis
    const opening = transcript.substring(0, Math.floor(totalLength * 0.25));
    const middle = transcript.substring(Math.floor(totalLength * 0.25), Math.floor(totalLength * 0.75));
    const closing = transcript.substring(Math.floor(totalLength * 0.75));
    
    const openingEmotionalHook = this.analyzeOpeningEmotions(opening);
    const emotionalProgression = this.analyzeEmotionalProgression(transcript);
    const peakEmotionalMoments = this.identifyEmotionalPeaks(middle);
    const emotionalClosing = this.analyzeClosingEmotions(closing);
    
    return {
      openingEmotionalHook,
      emotionalProgression,
      peakEmotionalMoments,
      emotionalClosing
    };
  }
  
  // Acoustic analysis methods
  private analyzePitchEmotions(audioMetrics: any): number {
    // High-activity emotions (happiness, excitement) = higher pitch variation
    // Low-activity emotions (sadness, calm) = lower pitch variation
    const pitchRange = audioMetrics?.pitchRange || 50;
    const pitchVariability = audioMetrics?.pitchVariability || 50;
    
    // More variation indicates stronger emotional expression
    return Math.min((pitchRange + pitchVariability) / 2, 100);
  }
  
  private analyzeVolumeEmotions(audioMetrics: any): number {
    // Dynamic volume changes indicate emotional engagement
    const volumeRange = audioMetrics?.volumeRange || 50;
    const volumeVariability = audioMetrics?.volumeVariability || 50;
    
    return Math.min((volumeRange + volumeVariability) / 2, 100);
  }
  
  private analyzeSpeechRateEmotions(audioMetrics: any, transcript: string): number {
    const wordsPerMinute = audioMetrics?.wordsPerMinute || 150;
    const speechVariability = audioMetrics?.speechVariability || 50;
    
    // Optimal emotional range: 140-180 WPM with good variation
    let rateScore = 100 - Math.abs(wordsPerMinute - 160) * 2;
    rateScore = Math.max(rateScore, 20);
    
    // Add variation bonus
    return Math.min(rateScore + speechVariability * 0.3, 100);
  }
  
  private analyzeVoiceQualityEmotions(audioMetrics: any): number {
    // Voice clarity and warmth indicate emotional authenticity
    const clarity = audioMetrics?.clarity || 70;
    const warmth = audioMetrics?.warmth || 70;
    const confidence = audioMetrics?.confidence || 70;
    
    return (clarity + warmth + confidence) / 3;
  }
  
  private calculateEmotionalRange(audioMetrics: any, transcript: string): number {
    // Analyze emotional vocabulary and vocal variety
    const emotionalWords = this.countEmotionalWords(transcript);
    const vocalVariety = audioMetrics?.variety || 50;
    
    return Math.min((emotionalWords * 5 + vocalVariety) / 2, 100);
  }
  
  // Body language analysis methods
  private analyzeGestureEmotions(bodyLanguageData: any): number {
    const gestureCount = bodyLanguageData?.gestureCount || 0;
    const gestureVariety = bodyLanguageData?.gestureVariety || 50;
    const gestureExpressiveness = bodyLanguageData?.expressiveness || 50;
    
    // Optimal: 8-15 gestures per minute with good variety
    const gestureRate = gestureCount / 5; // Assume 5-minute speech
    let gestureScore = gestureRate >= 8 && gestureRate <= 15 ? 80 : 60;
    
    return Math.min((gestureScore + gestureVariety + gestureExpressiveness) / 3, 100);
  }
  
  private analyzeFacialEmotions(bodyLanguageData: any): number {
    const facialExpressions = bodyLanguageData?.facialExpressions || {};
    const expressionVariety = Object.keys(facialExpressions).length;
    const dominantEmotion = bodyLanguageData?.dominantEmotion || 'neutral';
    
    // More variety in facial expressions indicates emotional range
    let varietyScore = Math.min(expressionVariety * 15, 80);
    let authenticityScore = dominantEmotion !== 'neutral' ? 80 : 60;
    
    return (varietyScore + authenticityScore) / 2;
  }
  
  private analyzeEyeContactEmotions(bodyLanguageData: any): number {
    const eyeContactPercentage = bodyLanguageData?.eyeContactPercentage || 60;
    const eyeContactVariability = bodyLanguageData?.eyeContactVariability || 50;
    
    // Optimal eye contact: 60-80% with natural variation
    let eyeScore = eyeContactPercentage >= 60 && eyeContactPercentage <= 80 ? 85 : 70;
    
    return Math.min((eyeScore + eyeContactVariability) / 2, 100);
  }
  
  private analyzePostureEmotions(bodyLanguageData: any): number {
    const postureScore = bodyLanguageData?.postureScore || 70;
    const postureChanges = bodyLanguageData?.postureChanges || 3;
    
    // Good posture with natural movement indicates confidence and engagement
    let movementScore = postureChanges >= 2 && postureChanges <= 6 ? 80 : 60;
    
    return (postureScore + movementScore) / 2;
  }
  
  private analyzeMovementEmotions(bodyLanguageData: any): number {
    const movementEnergy = bodyLanguageData?.movementEnergy || 50;
    const movementPurpose = bodyLanguageData?.movementPurpose || 50;
    
    return (movementEnergy + movementPurpose) / 2;
  }
  
  // Contextual analysis methods
  private analyzeTopicEmotionalFit(words: string, purpose: string): number {
    const emotionalWords = this.getEmotionalWordsForPurpose(purpose);
    const matchCount = emotionalWords.filter(word => words.includes(word)).length;
    
    return Math.min(matchCount * 10, 100);
  }
  
  private analyzeAudienceEmotionalConnection(words: string, purpose: string): number {
    const connectionWords = ['you', 'we', 'us', 'together', 'share', 'feel', 'understand'];
    const connectionCount = connectionWords.filter(word => words.includes(word)).length;
    
    return Math.min(connectionCount * 12, 100);
  }
  
  private analyzeSettingEmotionalFit(words: string, purpose: string): number {
    // Different purposes require different emotional appropriateness
    const appropriatenessScore = this.calculateEmotionalAppropriateness(words, purpose);
    return appropriatenessScore;
  }
  
  private analyzePurposeEmotionalAlignment(words: string, purpose: string): number {
    // Emotions should support the speech purpose
    return this.calculateEmotionalPurposeAlignment(words, purpose);
  }
  
  // Emotional journey analysis
  private analyzeOpeningEmotions(opening: string): number {
    const hookWords = ['imagine', 'feel', 'exciting', 'incredible', 'passion', 'love', 'hate', 'fear'];
    const hookCount = hookWords.filter(word => opening.toLowerCase().includes(word)).length;
    
    return Math.min(hookCount * 20, 100);
  }
  
  private analyzeEmotionalProgression(transcript: string): number {
    // Analyze how emotions build throughout the speech
    const segments = this.divideIntoSegments(transcript, 4);
    const emotionalIntensity = segments.map(segment => this.calculateSegmentEmotionalIntensity(segment));
    
    // Good progression shows emotional arc
    const hasProgression = this.detectEmotionalProgression(emotionalIntensity);
    return hasProgression ? 85 : 65;
  }
  
  private identifyEmotionalPeaks(middle: string): number {
    const peakWords = ['incredible', 'amazing', 'powerful', 'transformative', 'breakthrough', 'extraordinary'];
    const peakCount = peakWords.filter(word => middle.toLowerCase().includes(word)).length;
    
    return Math.min(peakCount * 25, 100);
  }
  
  private analyzeClosingEmotions(closing: string): number {
    const inspirationalWords = ['inspire', 'hope', 'future', 'change', 'believe', 'achieve', 'possible'];
    const closingCount = inspirationalWords.filter(word => closing.toLowerCase().includes(word)).length;
    
    return Math.min(closingCount * 18, 100);
  }
  
  // Helper methods
  private countEmotionalWords(transcript: string): number {
    const emotionalWords = [
      'feel', 'emotion', 'passion', 'love', 'hate', 'fear', 'joy', 'excited', 'angry', 'sad',
      'happy', 'frustrated', 'confident', 'nervous', 'proud', 'ashamed', 'grateful', 'hopeful'
    ];
    
    return emotionalWords.filter(word => transcript.toLowerCase().includes(word)).length;
  }
  
  private getEmotionalWordsForPurpose(purpose: string): string[] {
    const purposeEmotions = {
      'Sales Pitch': ['excited', 'confident', 'passionate', 'enthusiastic', 'compelling'],
      'Business Pitch': ['confident', 'passionate', 'excited', 'optimistic', 'determined'],
      'TED Talk': ['passionate', 'inspiring', 'moving', 'powerful', 'transformative'],
      'Academic Presentation': ['curious', 'thoughtful', 'engaged', 'analytical', 'insightful'],
      'Job Interview': ['confident', 'enthusiastic', 'passionate', 'motivated', 'excited'],
      'Public Speaking': ['inspiring', 'confident', 'passionate', 'engaging', 'powerful']
    };
    
    return purposeEmotions[purpose] || ['passionate', 'confident', 'engaging'];
  }
  
  private calculateEmotionalAppropriateness(words: string, purpose: string): number {
    // Professional contexts require controlled emotional expression
    const professionalPurposes = ['Sales Pitch', 'Business Pitch', 'Job Interview', 'Presentation'];
    const isProFessional = professionalPurposes.includes(purpose);
    
    if (isProFessional) {
      // Look for controlled passion rather than overwhelming emotion
      const professionalEmotions = ['confident', 'passionate', 'committed', 'enthusiastic'];
      const count = professionalEmotions.filter(word => words.includes(word)).length;
      return Math.min(count * 20, 100);
    } else {
      // More emotional range acceptable for TED Talks, Public Speaking
      const expressiveEmotions = ['feel', 'heart', 'soul', 'moving', 'powerful', 'transformative'];
      const count = expressiveEmotions.filter(word => words.includes(word)).length;
      return Math.min(count * 15, 100);
    }
  }
  
  private calculateEmotionalPurposeAlignment(words: string, purpose: string): number {
    // Emotions should match the speech goal
    switch (purpose) {
      case 'Sales Pitch':
        return this.hasEmotions(words, ['confident', 'excited', 'compelling']) ? 85 : 65;
      case 'TED Talk':
        return this.hasEmotions(words, ['inspiring', 'moving', 'powerful']) ? 90 : 60;
      case 'Academic Presentation':
        return this.hasEmotions(words, ['curious', 'thoughtful', 'engaged']) ? 80 : 70;
      default:
        return 75;
    }
  }
  
  private hasEmotions(words: string, emotions: string[]): boolean {
    return emotions.some(emotion => words.includes(emotion));
  }
  
  private divideIntoSegments(transcript: string, numSegments: number): string[] {
    const segmentLength = Math.floor(transcript.length / numSegments);
    const segments = [];
    
    for (let i = 0; i < numSegments; i++) {
      const start = i * segmentLength;
      const end = i === numSegments - 1 ? transcript.length : (i + 1) * segmentLength;
      segments.push(transcript.substring(start, end));
    }
    
    return segments;
  }
  
  private calculateSegmentEmotionalIntensity(segment: string): number {
    const emotionalWords = this.countEmotionalWords(segment);
    const intensityWords = ['very', 'extremely', 'incredibly', 'absolutely', 'completely'];
    const intensityCount = intensityWords.filter(word => segment.toLowerCase().includes(word)).length;
    
    return emotionalWords * 10 + intensityCount * 5;
  }
  
  private detectEmotionalProgression(intensities: number[]): boolean {
    // Check if there's a general upward trend or clear arc
    const hasArc = intensities.some((intensity, index) => 
      index > 0 && intensity > intensities[index - 1]
    );
    
    return hasArc;
  }
  
  private generateEmotionalInsights(
    transcript: string, 
    acousticAnalysis: any, 
    bodyLanguageImpact: any, 
    purpose: string
  ) {
    const primaryEmotions = this.identifyPrimaryEmotions(transcript, acousticAnalysis);
    const emotionalTransitions = this.identifyEmotionalTransitions(transcript);
    const authenticityMarkers = this.identifyAuthenticityMarkers(acousticAnalysis, bodyLanguageImpact);
    const improvementAreas = this.identifyEmotionalImprovements(
      transcript, 
      acousticAnalysis, 
      bodyLanguageImpact, 
      purpose
    );
    
    return {
      primaryEmotions,
      emotionalTransitions,
      authenticityMarkers,
      improvementAreas
    };
  }
  
  private identifyPrimaryEmotions(transcript: string, acousticAnalysis: any): string[] {
    const emotions = [];
    
    if (acousticAnalysis.pitchVariation > 70) emotions.push('Expressive');
    if (acousticAnalysis.voiceQualityMarkers > 75) emotions.push('Authentic');
    if (transcript.toLowerCase().includes('passion')) emotions.push('Passionate');
    if (transcript.toLowerCase().includes('confident')) emotions.push('Confident');
    if (transcript.toLowerCase().includes('excited')) emotions.push('Enthusiastic');
    
    return emotions.length > 0 ? emotions : ['Controlled', 'Professional'];
  }
  
  private identifyEmotionalTransitions(transcript: string): string[] {
    const transitions = [];
    
    if (transcript.includes('however') || transcript.includes('but')) {
      transitions.push('Contrasting emotional shift');
    }
    if (transcript.includes('exciting') || transcript.includes('incredible')) {
      transitions.push('Building excitement');
    }
    if (transcript.includes('imagine') || transcript.includes('picture')) {
      transitions.push('Emotional visualization');
    }
    
    return transitions.length > 0 ? transitions : ['Steady emotional tone'];
  }
  
  private identifyAuthenticityMarkers(acousticAnalysis: any, bodyLanguageImpact: any): string[] {
    const markers = [];
    
    if (acousticAnalysis.voiceQualityMarkers > 75) {
      markers.push('Genuine vocal expression');
    }
    if (bodyLanguageImpact.facialExpressionRange > 70) {
      markers.push('Natural facial expressions');
    }
    if (acousticAnalysis.pitchVariation > 65) {
      markers.push('Spontaneous vocal variety');
    }
    
    return markers.length > 0 ? markers : ['Developing emotional authenticity'];
  }
  
  private identifyEmotionalImprovements(
    transcript: string, 
    acousticAnalysis: any, 
    bodyLanguageImpact: any, 
    purpose: string
  ): string[] {
    const improvements = [];
    
    if (acousticAnalysis.emotionalRange < 60) {
      improvements.push('Expand emotional vocabulary and expression');
    }
    if (bodyLanguageImpact.gestureExpressiveness < 65) {
      improvements.push('Use more emotionally expressive gestures');
    }
    if (acousticAnalysis.pitchVariation < 55) {
      improvements.push('Increase vocal variety to convey emotions');
    }
    if (!transcript.toLowerCase().includes('feel') && !transcript.toLowerCase().includes('passion')) {
      improvements.push('Include more emotional language and personal connection');
    }
    
    return improvements.length > 0 ? improvements : ['Continue developing emotional range'];
  }
  
  private calculateOverallEmotionalScore(analysis: any): number {
    const acousticAvg = Object.values(analysis.acousticAnalysis).reduce((a: number, b: number) => a + b, 0) / 5;
    const bodyLanguageAvg = Object.values(analysis.bodyLanguageImpact).reduce((a: number, b: number) => a + b, 0) / 5;
    const contextualAvg = Object.values(analysis.contextualEmotionalFit).reduce((a: number, b: number) => a + b, 0) / 4;
    const journeyAvg = Object.values(analysis.emotionalJourney).reduce((a: number, b: number) => a + b, 0) / 4;
    
    return Math.round((acousticAvg + bodyLanguageAvg + contextualAvg + journeyAvg) / 4);
  }
}

export const emotionalImpactAnalyzer = new EmotionalImpactAnalyzer();