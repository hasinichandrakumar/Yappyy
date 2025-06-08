import { useState, useRef, useCallback, useEffect } from "react";

interface VoiceMetrics {
  speakingPace: number;
  voiceClarity: number;
  confidenceScore: number;
  volumeLevel: number;
  fillerWords: number;
  pauseCount: number;
  vocalVariety: number;
  pitchStability: number;
  resonance: number;
  breathControl: number;
}

interface AudioBuffer {
  data: Float32Array[];
  timestamps: number[];
  maxSize: number;
}

interface VocalAnalysisState {
  volumeHistory: number[];
  pitchHistory: number[];
  clarityHistory: number[];
  energyHistory: number[];
  silenceThreshold: number;
  speechDetected: boolean;
  lastSpeechTime: number;
  fundamentalFreqHistory: number[];
  formantHistory: number[][];
}

export function useVoiceAnalysis() {
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    speakingPace: 0,
    voiceClarity: 0,
    confidenceScore: 0,
    volumeLevel: 0,
    fillerWords: 0,
    pauseCount: 0,
    vocalVariety: 0,
    pitchStability: 0,
    resonance: 0,
    breathControl: 0
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const animationFrame = useRef<number | null>(null);
  const wordsSpoken = useRef<number>(0);
  const startTime = useRef<number>(0);
  
  // Advanced analysis state
  const analysisState = useRef<VocalAnalysisState>({
    volumeHistory: [],
    pitchHistory: [],
    clarityHistory: [],
    energyHistory: [],
    silenceThreshold: 30,
    speechDetected: false,
    lastSpeechTime: 0,
    fundamentalFreqHistory: [],
    formantHistory: []
  });
  
  const audioBuffer = useRef<AudioBuffer>({
    data: [],
    timestamps: [],
    maxSize: 100
  });

  // Advanced pitch detection using autocorrelation
  const detectFundamentalFrequency = (timeDomainData: Float32Array, sampleRate: number): number => {
    const minPeriod = Math.floor(sampleRate / 800); // 800 Hz max
    const maxPeriod = Math.floor(sampleRate / 50);  // 50 Hz min
    
    let bestCorrelation = 0;
    let bestPeriod = 0;
    
    for (let period = minPeriod; period < Math.min(maxPeriod, timeDomainData.length / 2); period++) {
      let correlation = 0;
      for (let i = 0; i < timeDomainData.length - period; i++) {
        correlation += timeDomainData[i] * timeDomainData[i + period];
      }
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }
    
    return bestPeriod > 0 ? sampleRate / bestPeriod : 0;
  };

  // Calculate spectral centroid for vocal brightness/clarity
  const calculateSpectralCentroid = (frequencyData: Uint8Array): number => {
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      const magnitude = frequencyData[i];
      const frequency = (i * 22050) / frequencyData.length; // Nyquist frequency approximation
      weightedSum += frequency * magnitude;
      magnitudeSum += magnitude;
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  };

  // Analyze formant frequencies for vocal clarity
  const analyzeFormants = (frequencyData: Uint8Array): number[] => {
    const formants: number[] = [];
    const peaks: Array<{freq: number, magnitude: number}> = [];
    
    // Find spectral peaks
    for (let i = 2; i < frequencyData.length - 2; i++) {
      if (frequencyData[i] > frequencyData[i-1] && 
          frequencyData[i] > frequencyData[i+1] && 
          frequencyData[i] > 50) { // Minimum threshold
        const frequency = (i * 22050) / frequencyData.length;
        if (frequency > 200 && frequency < 4000) { // Formant range
          peaks.push({ freq: frequency, magnitude: frequencyData[i] });
        }
      }
    }
    
    // Sort by magnitude and take top 3 formants
    peaks.sort((a, b) => b.magnitude - a.magnitude);
    for (let i = 0; i < Math.min(3, peaks.length); i++) {
      formants.push(peaks[i].freq);
    }
    
    return formants.sort((a, b) => a - b); // Sort by frequency
  };

  // Calculate vocal variety score
  const calculateVocalVariety = (): number => {
    const state = analysisState.current;
    if (state.pitchHistory.length < 10) return 50;
    
    const pitchRange = Math.max(...state.pitchHistory) - Math.min(...state.pitchHistory);
    const volumeRange = Math.max(...state.volumeHistory) - Math.min(...state.volumeHistory);
    
    // Calculate pitch variance
    const avgPitch = state.pitchHistory.reduce((a, b) => a + b, 0) / state.pitchHistory.length;
    const pitchVariance = state.pitchHistory.reduce((acc, pitch) => acc + Math.pow(pitch - avgPitch, 2), 0) / state.pitchHistory.length;
    
    // Normalize scores
    const pitchScore = Math.min((pitchRange / 100) * 50, 50); // 0-50 based on pitch range
    const volumeScore = Math.min((volumeRange / 30) * 30, 30); // 0-30 based on volume range  
    const varianceScore = Math.min(Math.sqrt(pitchVariance) / 10 * 20, 20); // 0-20 based on variance
    
    return Math.min(pitchScore + volumeScore + varianceScore, 100);
  };

  // Enhanced confidence analysis
  const calculateConfidenceScore = (
    volumeLevel: number, 
    pitchStability: number, 
    spectralCentroid: number,
    formants: number[]
  ): number => {
    const state = analysisState.current;
    
    // Volume confidence (consistent, audible level)
    const idealVolume = 65; // Target volume level
    const volumeDeviation = Math.abs(volumeLevel - idealVolume);
    const volumeConfidence = Math.max(0, 100 - (volumeDeviation * 2));
    
    // Pitch stability confidence
    const pitchConfidence = pitchStability;
    
    // Spectral confidence (clear, well-defined spectrum)
    const spectralConfidence = Math.min((spectralCentroid / 2000) * 100, 100);
    
    // Formant clarity confidence
    let formantConfidence = 50;
    if (formants.length >= 2) {
      // F1 should be 200-1000 Hz, F2 should be 800-3000 Hz for clear speech
      const f1InRange = formants[0] >= 200 && formants[0] <= 1000;
      const f2InRange = formants.length > 1 && formants[1] >= 800 && formants[1] <= 3000;
      const formantSeparation = formants.length > 1 ? formants[1] - formants[0] : 0;
      
      formantConfidence = (f1InRange ? 25 : 0) + (f2InRange ? 25 : 0) + 
                         Math.min((formantSeparation / 1000) * 50, 50);
    }
    
    // Speech continuity confidence
    const timeSinceLastSpeech = Date.now() - state.lastSpeechTime;
    const continuityConfidence = timeSinceLastSpeech < 2000 ? 100 : Math.max(0, 100 - (timeSinceLastSpeech / 100));
    
    // Weighted average of all confidence factors
    const totalConfidence = (
      volumeConfidence * 0.25 +
      pitchConfidence * 0.25 +
      spectralConfidence * 0.2 +
      formantConfidence * 0.15 +
      continuityConfidence * 0.15
    );
    
    return Math.round(Math.min(Math.max(totalConfidence, 0), 100));
  };

  const startVoiceAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 44100
        } 
      });
      mediaStream.current = stream;

      audioContext.current = new AudioContext({ sampleRate: 44100 });
      analyser.current = audioContext.current.createAnalyser();
      
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      
      // Higher resolution for better analysis
      analyser.current.fftSize = 2048;
      analyser.current.smoothingTimeConstant = 0.8;
      
      setIsAnalyzing(true);
      startTime.current = Date.now();
      
      const analyzeAudio = () => {
        if (!analyser.current || !audioContext.current) return;
        
        const bufferLength = analyser.current.frequencyBinCount;
        const frequencyData = new Uint8Array(bufferLength);
        const timeDomainData = new Float32Array(bufferLength);
        
        analyser.current.getByteFrequencyData(frequencyData);
        analyser.current.getFloatTimeDomainData(timeDomainData);
        
        // Store audio data for analysis
        const timestamp = Date.now();
        audioBuffer.current.data.push(new Float32Array(timeDomainData));
        audioBuffer.current.timestamps.push(timestamp);
        
        if (audioBuffer.current.data.length > audioBuffer.current.maxSize) {
          audioBuffer.current.data.shift();
          audioBuffer.current.timestamps.shift();
        }
        
        // Calculate volume level with RMS
        const rms = Math.sqrt(timeDomainData.reduce((acc, val) => acc + val * val, 0) / timeDomainData.length);
        const volumeLevel = Math.min(rms * 200, 100); // Scale to 0-100
        
        // Detect fundamental frequency
        const fundamentalFreq = detectFundamentalFrequency(timeDomainData, audioContext.current.sampleRate);
        
        // Calculate spectral centroid
        const spectralCentroid = calculateSpectralCentroid(frequencyData);
        
        // Analyze formants
        const formants = analyzeFormants(frequencyData);
        
        // Update analysis state
        const state = analysisState.current;
        state.volumeHistory.push(volumeLevel);
        state.pitchHistory.push(fundamentalFreq);
        state.fundamentalFreqHistory.push(fundamentalFreq);
        state.formantHistory.push(formants);
        
        // Keep history manageable
        if (state.volumeHistory.length > 50) {
          state.volumeHistory.shift();
          state.pitchHistory.shift();
          state.fundamentalFreqHistory.shift();
          state.formantHistory.shift();
        }
        
        // Detect speech activity
        const speechDetected = volumeLevel > state.silenceThreshold && fundamentalFreq > 50;
        if (speechDetected) {
          state.speechDetected = true;
          state.lastSpeechTime = timestamp;
        }
        
        // Calculate pitch stability
        let pitchStability = 50;
        if (state.fundamentalFreqHistory.length > 5) {
          const recentPitches = state.fundamentalFreqHistory.slice(-10);
          const avgPitch = recentPitches.reduce((a, b) => a + b, 0) / recentPitches.length;
          const pitchVariance = recentPitches.reduce((acc, pitch) => acc + Math.pow(pitch - avgPitch, 2), 0) / recentPitches.length;
          pitchStability = Math.max(0, 100 - Math.sqrt(pitchVariance) / 2);
        }
        
        // Calculate advanced metrics
        const vocalVariety = calculateVocalVariety();
        const confidenceScore = calculateConfidenceScore(volumeLevel, pitchStability, spectralCentroid, formants);
        
        // Calculate voice clarity based on formants and spectral quality
        let voiceClarity = 50;
        if (formants.length >= 2) {
          const formantClarity = Math.min((formants[1] - formants[0]) / 10, 50);
          const spectralClarity = Math.min(spectralCentroid / 30, 50);
          voiceClarity = Math.min(formantClarity + spectralClarity, 100);
        }
        
        // Calculate resonance (richness of harmonics)
        const harmonicEnergy = frequencyData.slice(0, Math.floor(bufferLength / 4)).reduce((acc, val) => acc + val, 0);
        const totalEnergy = frequencyData.reduce((acc, val) => acc + val, 0);
        const resonance = totalEnergy > 0 ? Math.min((harmonicEnergy / totalEnergy) * 200, 100) : 0;
        
        // Calculate breath control (consistency of volume and minimal unwanted pauses)
        let breathControl = 50;
        if (state.volumeHistory.length > 10) {
          const volumeConsistency = 100 - (Math.max(...state.volumeHistory.slice(-10)) - Math.min(...state.volumeHistory.slice(-10)));
          breathControl = Math.max(0, Math.min(volumeConsistency, 100));
        }
        
        // Calculate speaking pace
        const elapsedMinutes = (timestamp - startTime.current) / 60000;
        const wpm = elapsedMinutes > 0 ? Math.round(wordsSpoken.current / elapsedMinutes) : 0;
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          volumeLevel: Math.round(volumeLevel),
          speakingPace: wpm,
          voiceClarity: Math.round(voiceClarity),
          confidenceScore: Math.round(confidenceScore),
          vocalVariety: Math.round(vocalVariety),
          pitchStability: Math.round(pitchStability),
          resonance: Math.round(resonance),
          breathControl: Math.round(breathControl)
        }));
        
        // Continue analysis
        if (isAnalyzing) {
          animationFrame.current = requestAnimationFrame(analyzeAudio);
        }
      };
      
      analyzeAudio();
    } catch (error) {
      console.error("Failed to start voice analysis:", error);
      setIsAnalyzing(false);
    }
  }, [isAnalyzing]);

  const stopVoiceAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContext.current) {
      audioContext.current.close();
    }
    
    // Reset analysis state
    analysisState.current = {
      volumeHistory: [],
      pitchHistory: [],
      clarityHistory: [],
      energyHistory: [],
      silenceThreshold: 30,
      speechDetected: false,
      lastSpeechTime: 0,
      fundamentalFreqHistory: [],
      formantHistory: []
    };
  }, []);

  // Update word count when called externally
  const updateWordCount = useCallback((count: number) => {
    wordsSpoken.current = count;
  }, []);

  useEffect(() => {
    return () => {
      stopVoiceAnalysis();
    };
  }, [stopVoiceAnalysis]);

  return {
    ...metrics,
    isAnalyzing,
    startVoiceAnalysis,
    stopVoiceAnalysis,
    updateWordCount
  };
}