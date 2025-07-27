import { useState, useEffect, useRef } from 'react';

interface VoiceAnalysisResult {
  voiceClarity: number;
  confidenceScore: number;
  volumeLevel: number;
  pitch: number;
  stability: number;
  articulationScore: number;
  speechClarityIndex: number;
  startVoiceAnalysis: () => void;
  stopVoiceAnalysis: () => void;
  updateWordCount: (count: number) => void;
}

export function useVoiceAnalysis(): VoiceAnalysisResult {
  const [voiceClarity, setVoiceClarity] = useState<number>(0);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [stability, setStability] = useState<number>(0);
  const [articulationScore, setArticulationScore] = useState<number>(0);
  const [speechClarityIndex, setSpeechClarityIndex] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();

  // Voice analysis history for stability calculation
  const pitchHistoryRef = useRef<number[]>([]);
  const volumeHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    initializeAudioAnalysis();

    return () => {
      cleanup();
    };
  }, []);

  const initializeAudioAnalysis = async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Configure analyser for faster processing
      analyserRef.current.fftSize = 1024; // Smaller for faster processing
      analyserRef.current.smoothingTimeConstant = 0.3; // Less smoothing for faster response
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Connect audio nodes
      microphoneRef.current.connect(analyserRef.current);

      // Start analysis
      analyzeAudio();
    } catch (error) {
      console.error('Error initializing voice analysis:', error);
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) {
      return;
    }

    // Get frequency data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate real voice metrics from audio data
    const volume = calculateVolumeLevel(dataArrayRef.current);
    const pitchData = calculatePitchDetection(dataArrayRef.current);
    const clarity = calculateVoiceClarity(dataArrayRef.current, volume);
    const confidence = calculateConfidenceFromVoice(volume, pitchData.frequency, clarity);
    const voiceStability = calculateVoiceStability();
    const articulation = calculateArticulationFromSpectrum(dataArrayRef.current);
    const speechClarity = calculateSpeechClarityFromAudio(dataArrayRef.current, articulation);
    
    // Update voice metrics with real audio analysis
    setVolumeLevel(Math.round(volume));
    setPitch(Math.round(pitchData.frequency));
    setVoiceClarity(Math.round(clarity));
    setConfidenceScore(Math.round(confidence));
    setStability(Math.round(voiceStability));
    setArticulationScore(Math.round(articulation));
    setSpeechClarityIndex(Math.round(speechClarity));

    // Update history for stability calculation
    updateHistory(volume, pitchData.frequency);

    // Continue analysis
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Real audio analysis calculation methods
  const calculateVolumeLevel = (dataArray: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const volumeLevel = Math.min(100, (average / 128) * 100);
    
    // Only return volume when actually detected
    return volumeLevel > 5 ? volumeLevel : 0;
  };

  const calculatePitchDetection = (dataArray: Uint8Array): { frequency: number; clarity: number } => {
    // Find peak frequency using simple peak detection
    let maxValue = 0;
    let maxIndex = 0;
    
    // Focus on human speech range (80-500 Hz)
    const minBin = Math.floor((80 * dataArray.length * 2) / (audioContextRef.current?.sampleRate || 44100));
    const maxBin = Math.floor((500 * dataArray.length * 2) / (audioContextRef.current?.sampleRate || 44100));
    
    for (let i = minBin; i < Math.min(maxBin, dataArray.length); i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const frequency = (maxIndex * sampleRate) / (2 * dataArray.length);
    const clarity = Math.min(100, (maxValue / 255) * 100);
    
    return { 
      frequency: frequency > 50 ? frequency : 0, 
      clarity: maxValue > 30 ? clarity : 0
    };
  };

  const calculateVoiceClarity = (dataArray: Uint8Array, volume: number): number => {
    if (volume < 10) return 0;
    
    // Calculate spectral clarity - higher frequencies indicate clearer consonants
    let highFreqEnergy = 0;
    let totalEnergy = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      totalEnergy += dataArray[i];
      if (i > dataArray.length * 0.3) { // Higher frequency bins
        highFreqEnergy += dataArray[i];
      }
    }
    
    const clarityRatio = totalEnergy > 0 ? (highFreqEnergy / totalEnergy) : 0;
    return Math.min(100, clarityRatio * 200); // Scale to 0-100
  };

  const calculateConfidenceFromVoice = (volume: number, pitch: number, clarity: number): number => {
    if (volume < 10) return 0;
    
    // Voice confidence based on stable volume, reasonable pitch, and clarity
    const volumeScore = Math.min(100, volume);
    const pitchScore = (pitch > 80 && pitch < 400) ? 100 : 50;
    const clarityScore = clarity;
    
    return Math.round((volumeScore * 0.4 + pitchScore * 0.3 + clarityScore * 0.3));
  };

  const calculateVoiceStability = (): number => {
    const pitchHistory = pitchHistoryRef.current;
    const volumeHistory = volumeHistoryRef.current;
    
    if (pitchHistory.length < 5 || volumeHistory.length < 5) return 0;
    
    // Calculate variance in pitch and volume
    const pitchVariance = calculateVariance(pitchHistory.slice(-10));
    const volumeVariance = calculateVariance(volumeHistory.slice(-10));
    
    // Lower variance = higher stability
    const pitchStability = Math.max(0, 100 - pitchVariance);
    const volumeStability = Math.max(0, 100 - volumeVariance);
    
    return Math.round((pitchStability + volumeStability) / 2);
  };

  const calculateArticulationFromSpectrum = (dataArray: Uint8Array): number => {
    // Articulation score based on high-frequency content (2-8kHz range for consonants)
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const binSize = sampleRate / (dataArray.length * 2);
    
    let articulationEnergy = 0;
    let totalEnergy = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const freq = i * binSize;
      totalEnergy += dataArray[i];
      
      // Focus on consonant frequency range (2000-8000 Hz)
      if (freq >= 2000 && freq <= 8000) {
        articulationEnergy += dataArray[i];
      }
    }
    
    if (totalEnergy < 50) return 0; // No significant audio
    
    const articulationRatio = articulationEnergy / totalEnergy;
    return Math.min(100, articulationRatio * 300); // Enhanced weighting for articulation
  };

  const calculateSpeechClarityFromAudio = (dataArray: Uint8Array, articulation: number): number => {
    if (articulation < 10) return 0;
    
    // Speech clarity combines articulation with spectral balance
    let lowFreqEnergy = 0;
    let midFreqEnergy = 0;
    let highFreqEnergy = 0;
    
    const third = Math.floor(dataArray.length / 3);
    
    for (let i = 0; i < dataArray.length; i++) {
      if (i < third) {
        lowFreqEnergy += dataArray[i];
      } else if (i < third * 2) {
        midFreqEnergy += dataArray[i];
      } else {
        highFreqEnergy += dataArray[i];
      }
    }
    
    const totalEnergy = lowFreqEnergy + midFreqEnergy + highFreqEnergy;
    if (totalEnergy < 50) return 0;
    
    // Good speech clarity has balanced energy across frequencies
    const balance = 1 - Math.abs(0.33 - (midFreqEnergy / totalEnergy));
    const clarityIndex = (articulation * 0.7 + balance * 100 * 0.3);
    
    return Math.min(100, clarityIndex);
  };

  const calculateVariance = (values: number[]): number => {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  };

  const updateHistory = (volume: number, pitch: number): void => {
    // Keep last 20 values for stability calculation
    pitchHistoryRef.current.push(pitch);
    volumeHistoryRef.current.push(volume);
    
    if (pitchHistoryRef.current.length > 20) {
      pitchHistoryRef.current = pitchHistoryRef.current.slice(-20);
    }
    if (volumeHistoryRef.current.length > 20) {
      volumeHistoryRef.current = volumeHistoryRef.current.slice(-20);
    }
  };

  const calculateVolume = (dataArray: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    return Math.min(100, (average / 128) * 100);
  };

  const calculatePitchFast = (dataArray: Uint8Array): { frequency: number; clarity: number } => {
    // Simplified pitch detection for speed
    let maxValue = 0;
    let maxIndex = 0;
    
    // Find peak frequency bin (simplified approach)
    for (let i = 10; i < Math.min(dataArray.length / 4, 200); i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const frequency = (maxIndex * sampleRate) / (2 * dataArray.length);
    const clarity = Math.min(100, (maxValue / 255) * 100);
    
    return { 
      frequency: Math.round(frequency), 
      clarity: clarity 
    };
  };

  const calculatePitch = (dataArray: Uint8Array): { frequency: number; clarity: number } => {
    // Find the fundamental frequency using autocorrelation
    const correlatedSignal = autoCorrelate(dataArray);
    
    if (correlatedSignal === -1) {
      return { frequency: 0, clarity: 0 };
    }

    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const frequency = sampleRate / correlatedSignal;
    
    // Calculate clarity based on harmonic content
    const clarity = calculateHarmonicClarity(dataArray, frequency);
    
    return { 
      frequency: Math.round(frequency), 
      clarity: Math.min(100, clarity * 100) 
    };
  };

  const autoCorrelate = (buffer: Uint8Array): number => {
    const SIZE = buffer.length;
    const sumOfSquares = buffer.reduce((sum, val) => sum + val * val, 0);
    
    if (sumOfSquares === 0) return -1;

    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = Math.sqrt(sumOfSquares / SIZE);
    
    if (rms < 0.01) return -1; // Too quiet

    let lastCorrelation = 1;
    
    for (let offset = Math.floor(SIZE / 8); offset < SIZE / 2; offset++) {
      let correlation = 0;
      
      for (let i = 0; i < SIZE - offset; i++) {
        correlation += Math.abs((buffer[i] - 128) * (buffer[i + offset] - 128));
      }
      
      correlation = correlation / (SIZE - offset);
      
      if (correlation > 0.9 * lastCorrelation) {
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      }
      
      lastCorrelation = correlation;
    }
    
    if (bestCorrelation > 0.2) {
      return bestOffset;
    }
    
    return -1;
  };

  const calculateHarmonicClarity = (dataArray: Uint8Array, fundamentalFreq: number): number => {
    if (fundamentalFreq === 0) return 0;

    // Analyze harmonic content for voice clarity
    let harmonicStrength = 0;
    let noiseLevel = 0;

    // Check for harmonics at 2f, 3f, 4f
    const harmonics = [2, 3, 4];
    const binSize = (audioContextRef.current?.sampleRate || 44100) / 2 / dataArray.length;

    harmonics.forEach(harmonic => {
      const harmonicFreq = fundamentalFreq * harmonic;
      const bin = Math.round(harmonicFreq / binSize);
      
      if (bin < dataArray.length) {
        harmonicStrength += dataArray[bin];
      }
    });

    // Calculate noise level (energy not in harmonic frequencies)
    for (let i = 0; i < dataArray.length; i++) {
      const freq = i * binSize;
      const isHarmonic = harmonics.some(h => 
        Math.abs(freq - fundamentalFreq * h) < binSize * 2
      );
      
      if (!isHarmonic && freq > fundamentalFreq) {
        noiseLevel += dataArray[i];
      }
    }

    const signalToNoise = harmonicStrength / (noiseLevel + 1);
    return Math.min(1, signalToNoise / 10);
  };

  const calculateConfidenceFast = (volume: number, pitch: number): number => {
    // Fast confidence calculation
    let confidence = 0;

    // Volume contribution (optimal range 20-80)
    if (volume >= 20 && volume <= 80) {
      confidence += 40;
    } else if (volume >= 10 && volume <= 90) {
      confidence += 20;
    }

    // Pitch contribution (human voice range roughly 80-1000 Hz)
    if (pitch >= 80 && pitch <= 1000) {
      confidence += 30;
    } else if (pitch >= 50 && pitch <= 1200) {
      confidence += 15;
    }

    // Quick stability check (last 5 values only)
    const recentVolumes = volumeHistoryRef.current.slice(-5);
    if (recentVolumes.length >= 3) {
      const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length;
      const isStable = recentVolumes.every(v => Math.abs(v - avgVolume) < 20);
      if (isStable) confidence += 30;
    }

    return Math.min(100, confidence);
  };

  // Calculate articulation score using acoustic analysis
  const calculateArticulationScore = (dataArray: Uint8Array, volume: number, pitchData: any): number => {
    if (volume < 10) return 0; // No speech detected
    
    // Analyze frequency spectrum for consonant clarity markers
    let articulationScore = 0;
    
    // High-frequency energy indicates crisp consonants (2-8kHz range)
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const nyquist = sampleRate / 2;
    const binSize = nyquist / dataArray.length;
    
    let highFreqEnergy = 0;
    let totalEnergy = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const frequency = i * binSize;
      totalEnergy += dataArray[i];
      
      // Consonant clarity range (2-8kHz)
      if (frequency >= 2000 && frequency <= 8000) {
        highFreqEnergy += dataArray[i];
      }
    }
    
    // Calculate articulation from high-frequency content
    const highFreqRatio = totalEnergy > 0 ? (highFreqEnergy / totalEnergy) : 0;
    articulationScore = Math.min(100, highFreqRatio * 400); // Scale to 0-100
    
    // Pitch stability contributes to articulation clarity
    const pitchStability = pitchData.clarity || 0;
    articulationScore = (articulationScore * 0.7) + (pitchStability * 0.3);
    
    // Volume consistency affects articulation
    if (volume >= 30 && volume <= 80) {
      articulationScore += 10; // Bonus for optimal volume
    }
    
    return Math.min(100, Math.max(0, articulationScore));
  };

  // Calculate speech clarity index combining multiple factors
  const calculateSpeechClarityIndex = (dataArray: Uint8Array, articulation: number): number => {
    if (articulation === 0) return 0;
    
    // Spectral clarity analysis
    let spectralClarity = 0;
    let spectralBalance = 0;
    
    // Analyze spectral distribution for speech clarity
    const quarterPoint = Math.floor(dataArray.length / 4);
    const midPoint = Math.floor(dataArray.length / 2);
    const threeQuarterPoint = Math.floor(dataArray.length * 3 / 4);
    
    // Low frequencies (vowels) 
    const lowEnergy = dataArray.slice(0, quarterPoint).reduce((sum, val) => sum + val, 0);
    // Mid frequencies (formants)
    const midEnergy = dataArray.slice(quarterPoint, midPoint).reduce((sum, val) => sum + val, 0);
    // High frequencies (consonants)
    const highEnergy = dataArray.slice(midPoint, threeQuarterPoint).reduce((sum, val) => sum + val, 0);
    
    const totalSpectralEnergy = lowEnergy + midEnergy + highEnergy;
    
    if (totalSpectralEnergy > 0) {
      // Good speech has balanced spectral energy with emphasis on mid frequencies
      const lowRatio = lowEnergy / totalSpectralEnergy;
      const midRatio = midEnergy / totalSpectralEnergy;
      const highRatio = highEnergy / totalSpectralEnergy;
      
      // Optimal ratios for clear speech
      const optimalBalance = Math.abs(lowRatio - 0.4) + Math.abs(midRatio - 0.4) + Math.abs(highRatio - 0.2);
      spectralBalance = Math.max(0, 100 - (optimalBalance * 200));
    }
    
    // Combine articulation and spectral balance
    const clarityIndex = (articulation * 0.6) + (spectralBalance * 0.4);
    
    return Math.min(100, Math.max(0, clarityIndex));
  };

  const calculateConfidence = (volume: number, pitch: number): number => {
    // Confidence based on consistent volume and stable pitch
    let confidence = 0;

    // Volume contribution (optimal range 20-80)
    if (volume >= 20 && volume <= 80) {
      confidence += 40;
    } else if (volume >= 10 && volume <= 90) {
      confidence += 20;
    }

    // Pitch contribution (human voice range roughly 80-1000 Hz)
    if (pitch >= 80 && pitch <= 1000) {
      confidence += 30;
    } else if (pitch >= 50 && pitch <= 1200) {
      confidence += 15;
    }

    // Stability contribution
    const recentVolumes = volumeHistoryRef.current.slice(-10);
    const recentPitches = pitchHistoryRef.current.slice(-10);

    if (recentVolumes.length >= 5) {
      const volumeVariance = calculateVariance(recentVolumes);
      const pitchVariance = calculateVariance(recentPitches);

      // Lower variance = higher stability = higher confidence
      if (volumeVariance < 100) confidence += 15;
      if (pitchVariance < 2500) confidence += 15;
    }

    return Math.min(100, confidence);
  };

  const calculateStabilityFast = (): number => {
    const recentVolumes = volumeHistoryRef.current.slice(-10);
    const recentPitches = pitchHistoryRef.current.slice(-10);

    if (recentVolumes.length < 5) return 0;

    // Fast stability calculation using range instead of variance
    const volumeRange = Math.max(...recentVolumes) - Math.min(...recentVolumes);
    const pitchRange = Math.max(...recentPitches) - Math.min(...recentPitches);

    const volumeStability = Math.max(0, 100 - volumeRange);
    const pitchStability = Math.max(0, 100 - (pitchRange / 10));

    return (volumeStability + pitchStability) / 2;
  };

  const calculateStability = (): number => {
    const recentVolumes = volumeHistoryRef.current.slice(-20);
    const recentPitches = pitchHistoryRef.current.slice(-20);

    if (recentVolumes.length < 10) return 0;

    const volumeStability = 100 - Math.min(100, calculateVariance(recentVolumes) / 2);
    const pitchStability = 100 - Math.min(100, calculateVariance(recentPitches) / 50);

    return (volumeStability + pitchStability) / 2;
  };



  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  return {
    voiceClarity,
    confidenceScore,
    volumeLevel,
    pitch,
    stability,
    articulationScore,
    speechClarityIndex,
    startVoiceAnalysis: () => {
      initializeAudioAnalysis();
    },
    stopVoiceAnalysis: cleanup,
    updateWordCount: (count: number) => {
      // Update confidence based on active speaking
      if (count > 0) {
        setConfidenceScore(prev => Math.min(95, prev + 5));
      }
    }
  };
}