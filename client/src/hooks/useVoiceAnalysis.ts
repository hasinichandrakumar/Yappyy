import { useState, useEffect, useRef } from 'react';

interface VoiceMetrics {
  modulation: {
    score: number;
    pitchVariation: number;
    volumeVariation: number;
    speakingRate: number;
    rhythmStability: number;
    intonationRange: number;
    dynamicRange: number;
    melodicContour: number;
  };
  clarity: {
    score: number;
    pronunciation: number;
    articulation: number;
    steadiness: number;
    consonantClarity: number;
    vowelFormants: number;
    phonemeAccuracy: number;
    syllableStress: number;
    coArticulation: number;
  };
  confidence: {
    score: number;
    steadyPace: number;
    pausePattern: number;
    volumeControl: number;
    pitchStability: number;
    speechFluency: number;
    hesitationRatio: number;
    fillerWordFrequency: number;
    utteranceCompleteness: number;
  };
  sentiment: {
    score: number;
    valence: number;
    arousal: number;
    dominance: number;
    emotionalVariability: number;
    expressiveness: number;
    emotionalCongruence: number;
    voiceWarmth: number;
  };
}

interface AudioFeatures {
  pitch: number[];
  volume: number[];
  spectrum: Float32Array;
  zeroCrossings: number;
  mfcc: Float32Array;
  formants: number[];
  harmonics: number[];
  spectralMoments: {
    centroid: number;
    spread: number;
    skewness: number;
    kurtosis: number;
  };
  breathingMarkers: {
    intensity: number;
    duration: number;
    pattern: number[];
  };
  phonemeSegments: {
    type: 'consonant' | 'vowel' | 'silence';
    start: number;
    end: number;
    features: number[];
  }[];
  prosodyFeatures: {
    f0Contour: number[];
    energy: number[];
    duration: number[];
  };
  voiceQuality: {
    jitter: number;
    shimmer: number;
    hnr: number; // Harmonic-to-Noise Ratio
    snr: number; // Signal-to-Noise Ratio
  };
}

export function useVoiceAnalysis() {
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    modulation: {
      score: 0,
      pitchVariation: 0,
      volumeVariation: 0,
      speakingRate: 0,
      rhythmStability: 0,
      intonationRange: 0,
      dynamicRange: 0,
      melodicContour: 0
    },
    clarity: {
      score: 0,
      pronunciation: 0,
      articulation: 0,
      steadiness: 0,
      consonantClarity: 0,
      vowelFormants: 0,
      phonemeAccuracy: 0,
      syllableStress: 0,
      coArticulation: 0
    },
    confidence: {
      score: 0,
      steadyPace: 0,
      pausePattern: 0,
      volumeControl: 0,
      pitchStability: 0,
      speechFluency: 0,
      hesitationRatio: 0,
      fillerWordFrequency: 0,
      utteranceCompleteness: 0
    },
    sentiment: {
      score: 0,
      valence: 0,
      arousal: 0,
      dominance: 0,
      emotionalVariability: 0,
      expressiveness: 0,
      emotionalCongruence: 0,
      voiceWarmth: 0
    }
  });

  const audioContext = useRef<AudioContext | null>(null);
  const analyzer = useRef<AnalyserNode | null>(null);
  const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
  const featuresBuffer = useRef<AudioFeatures[]>([]);
  const BUFFER_SIZE = 2048;
  const SAMPLE_RATE = 44100;

  useEffect(() => {
    initializeAudioProcessing();
    return () => cleanup();
  }, []);

  const initializeAudioProcessing = async () => {
    try {
      audioContext.current = new AudioContext();
      analyzer.current = audioContext.current.createAnalyser();
      analyzer.current.fftSize = 2048;
      
      scriptProcessor.current = audioContext.current.createScriptProcessor(BUFFER_SIZE, 1, 1);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.current.createMediaStreamSource(stream);
      
      source.connect(analyzer.current);
      analyzer.current.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);

      scriptProcessor.current.onaudioprocess = processAudioData;
    } catch (error) {
      console.error('Failed to initialize audio processing:', error);
    }
  };

  const processAudioData = (event: AudioProcessingEvent) => {
    if (!analyzer.current) return;

    const inputData = event.inputBuffer.getChannelData(0);
    const features = extractAudioFeatures(inputData);
    updateFeaturesBuffer(features);
    analyzeVoice();
  };

  const extractAudioFeatures = (audioData: Float32Array): AudioFeatures => {
    const frequencyData = new Float32Array(analyzer.current!.frequencyBinCount);
    analyzer.current!.getFloatFrequencyData(frequencyData);

    const pitch = calculatePitch(audioData);
    const volume = calculateVolume(audioData);
    const mfcc = calculateMFCC(frequencyData);
    const formants = extractFormants(frequencyData);
    const harmonics = extractHarmonics(frequencyData);
    const spectralMoments = calculateSpectralMoments(frequencyData);
    const voiceQuality = calculateVoiceQuality(audioData, pitch);
    const breathingMarkers = detectBreathingMarkers(audioData, volume);
    const phonemeSegments = segmentPhonemes(audioData, mfcc);
    const prosodyFeatures = extractProsodyFeatures(pitch, volume);

    return {
      pitch,
      volume,
      spectrum: frequencyData,
      zeroCrossings: calculateZeroCrossings(audioData),
      mfcc,
      formants,
      harmonics,
      spectralMoments,
      breathingMarkers,
      phonemeSegments,
      prosodyFeatures,
      voiceQuality
    };
  };

  const analyzeVoice = () => {
    if (featuresBuffer.current.length < 2) return;

    const features = featuresBuffer.current;
    
    // Calculate clarity metrics
    const pronunciation = calculatePronunciationScore(features);
    const articulation = calculateArticulationScore(features);
    const steadiness = calculateSteadinessScore(features);
    const consonantClarity = calculateConsonantClarity(features);
    const vowelFormants = calculateVowelFormants(features);
    const phonemeAccuracy = calculatePhonemeAccuracy(features);
    const syllableStress = calculateSyllableStress(features);
    const coArticulation = calculateCoArticulation(features);

    const clarityScore = (
      pronunciation * 0.2 +
      articulation * 0.2 +
      steadiness * 0.15 +
      consonantClarity * 0.15 +
      vowelFormants * 0.1 +
      phonemeAccuracy * 0.1 +
      syllableStress * 0.05 +
      coArticulation * 0.05
    );

    // Calculate confidence metrics
    const steadyPace = calculateSteadyPace(features);
    const pausePattern = calculatePausePattern(features);
    const volumeControl = calculateVolumeControl(features);
    const pitchStability = calculatePitchStability(features);
    const speechFluency = calculateSpeechFluency(features);
    const hesitationRatio = calculateHesitationRatio(features);
    const fillerWordFrequency = calculateFillerWordFrequency(features);
    const utteranceCompleteness = calculateUtteranceCompleteness(features);

    const confidenceScore = (
      steadyPace * 0.2 +
      pausePattern * 0.15 +
      volumeControl * 0.15 +
      pitchStability * 0.15 +
      speechFluency * 0.15 +
      hesitationRatio * 0.1 +
      fillerWordFrequency * 0.05 +
      utteranceCompleteness * 0.05
    );

    setMetrics(prev => ({
      ...prev,
      clarity: {
        score: clarityScore * 100,
        pronunciation: pronunciation * 100,
        articulation: articulation * 100,
        steadiness: steadiness * 100,
        consonantClarity: consonantClarity * 100,
        vowelFormants: vowelFormants * 100,
        phonemeAccuracy: phonemeAccuracy * 100,
        syllableStress: syllableStress * 100,
        coArticulation: coArticulation * 100
      },
      confidence: {
        score: confidenceScore * 100,
        steadyPace: steadyPace * 100,
        pausePattern: pausePattern * 100,
        volumeControl: volumeControl * 100,
        pitchStability: pitchStability * 100,
        speechFluency: speechFluency * 100,
        hesitationRatio: hesitationRatio * 100,
        fillerWordFrequency: fillerWordFrequency * 100,
        utteranceCompleteness: utteranceCompleteness * 100
      }
    }));
  };

  // Clarity calculation functions
  const calculatePronunciationScore = (features: AudioFeatures[]): number => {
    const mfccStability = features.reduce((sum, f) => sum + calculateMFCCStability([f]), 0) / features.length;
    const formantAccuracy = features.reduce((sum, f) => sum + calculateFormantAccuracy(f), 0) / features.length;
    return (mfccStability + formantAccuracy) / 2;
  };

  const calculateArticulationScore = (features: AudioFeatures[]): number => {
    const spectralFlux = features.reduce((sum, f) => sum + calculateSpectralFlux(f), 0) / features.length;
    const consonantStrength = features.reduce((sum, f) => {
      const consonants = f.phonemeSegments.filter(p => p.type === 'consonant');
      return sum + (consonants.length > 0 ? calculateConsonantStrength(consonants) : 0);
    }, 0) / features.length;
    return (spectralFlux + consonantStrength) / 2;
  };

  const calculateSteadinessScore = (features: AudioFeatures[]): number => {
    const pitchStability = 1 - calculateVariation(features.flatMap(f => f.pitch)) / 50;
    const volumeStability = 1 - calculateVariation(features.flatMap(f => f.volume)) / 0.3;
    return (pitchStability + volumeStability) / 2;
  };

  const calculateConsonantClarity = (features: AudioFeatures[]): number => {
    return features.reduce((sum, f) => {
      const consonants = f.phonemeSegments.filter(p => p.type === 'consonant');
      return sum + (consonants.length > 0 ? calculateConsonantStrength(consonants) : 0);
    }, 0) / features.length;
  };

  const calculateVowelFormants = (features: AudioFeatures[]): number => {
    return features.reduce((sum, f) => {
      const vowels = f.phonemeSegments.filter(p => p.type === 'vowel');
      return sum + (vowels.length > 0 ? calculateVowelQuality(vowels, f.formants) : 0);
    }, 0) / features.length;
  };

  // Confidence calculation functions
  const calculateSteadyPace = (features: AudioFeatures[]): number => {
    const zeroCrossings = features.map(f => f.zeroCrossings);
    const variation = calculateVariation(zeroCrossings);
    return Math.max(0, 1 - variation / 500);
  };

  const calculatePausePattern = (features: AudioFeatures[]): number => {
    let pauseCount = 0;
    let validPauseCount = 0;
    let isPause = false;
    const volumes = features.flatMap(f => f.volume);
    
    for (let i = 0; i < volumes.length; i++) {
      if (volumes[i] < 0.1) {
        if (!isPause) {
          pauseCount++;
          isPause = true;
        }
      } else {
        if (isPause) {
          if (i - pauseCount > 10 && i - pauseCount < 50) {
            validPauseCount++;
          }
          isPause = false;
        }
      }
    }

    return Math.min(1, validPauseCount / 5);
  };

  const calculateVolumeControl = (features: AudioFeatures[]): number => {
    const volumes = features.flatMap(f => f.volume);
    const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const normalizedVolumes = volumes.map(v => v / mean);
    return Math.max(0, 1 - calculateVariation(normalizedVolumes) / 0.5);
  };

  const calculatePitchStability = (features: AudioFeatures[]): number => {
    const pitches = features.flatMap(f => f.pitch);
    const variation = calculateVariation(pitches);
    return Math.max(0, 1 - variation / 30);
  };

  const calculateSpeechFluency = (features: AudioFeatures[]): number => {
    const phonemeRates = features.map(f => f.phonemeSegments.length / (BUFFER_SIZE / SAMPLE_RATE));
    const normalizedRates = phonemeRates.map(rate => rate / 15); // Normalize to typical speech rate
    return Math.min(1, normalizedRates.reduce((a, b) => a + b, 0) / normalizedRates.length);
  };

  const calculateHesitationRatio = (features: AudioFeatures[]): number => {
    let hesitationCount = 0;
    let totalSegments = 0;
    
    features.forEach(f => {
      const segments = f.phonemeSegments;
      totalSegments += segments.length;
      
      for (let i = 1; i < segments.length; i++) {
        if (segments[i].type === 'silence' && segments[i-1].type === 'silence') {
          hesitationCount++;
        }
      }
    });
    
    return Math.max(0, 1 - (hesitationCount / Math.max(1, totalSegments)));
  };

  // Helper functions
  const calculateVariation = (values: number[]): number => {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const calculateSpectralFlux = (features: AudioFeatures): number => {
    let flux = 0;
    for (let i = 1; i < features.spectrum.length; i++) {
      flux += Math.pow(features.spectrum[i] - features.spectrum[i-1], 2);
    }
    return Math.sqrt(flux);
  };

  const calculateConsonantStrength = (consonants: { features: number[] }[]): number => {
    return consonants.reduce((sum, c) => sum + Math.abs(c.features[0]), 0) / consonants.length;
  };

  const calculateVowelQuality = (vowels: { features: number[] }[], formants: number[]): number => {
    if (formants.length < 2) return 0;
    const f1f2ratio = formants[1] / formants[0];
    return Math.min(1, f1f2ratio / 2.5);
  };

  const calculateFormantAccuracy = (features: AudioFeatures): number => {
    if (features.formants.length < 3) return 0;
    const f1 = features.formants[0];
    const f2 = features.formants[1];
    const f3 = features.formants[2];
    
    // Check if formants are in typical ranges for speech
    const f1Score = f1 >= 200 && f1 <= 1000 ? 1 : 0;
    const f2Score = f2 >= 800 && f2 <= 2500 ? 1 : 0;
    const f3Score = f3 >= 2000 && f3 <= 4000 ? 1 : 0;
    
    return (f1Score + f2Score + f3Score) / 3;
  };

  const calculateMFCCStability = (features: AudioFeatures[]): number => {
    if (features.length < 2) return 0;
    
    const variations = [];
    for (let i = 1; i < features.length; i++) {
      let diff = 0;
      for (let j = 0; j < features[i].mfcc.length; j++) {
        diff += Math.pow(features[i].mfcc[j] - features[i-1].mfcc[j], 2);
      }
      variations.push(Math.sqrt(diff));
    }
    
    return Math.max(0, 1 - calculateVariation(variations) / 10);
  };

  const calculateFillerWordFrequency = (features: AudioFeatures[]): number => {
    // This would require integration with speech recognition
    // For now, return a placeholder based on pause patterns
    return calculatePausePattern(features);
  };

  const calculateUtteranceCompleteness = (features: AudioFeatures[]): number => {
    // This would require integration with speech recognition
    // For now, return a score based on speech fluency and pause patterns
    return (calculateSpeechFluency(features) + calculatePausePattern(features)) / 2;
  };

  const cleanup = () => {
    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
    }
    if (analyzer.current) {
      analyzer.current.disconnect();
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
  };

  return {
    metrics,
    isInitialized: !!audioContext.current
  };
}