import { useState, useEffect, useRef } from 'react';

interface VoiceAnalysisResult {
  voiceClarity: number;
  confidenceScore: number;
  volumeLevel: number;
  pitch: number;
  stability: number;
}

export function useVoiceAnalysis(): VoiceAnalysisResult {
  const [voiceClarity, setVoiceClarity] = useState<number>(0);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [stability, setStability] = useState<number>(0);

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

      // Configure analyser
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
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
    
    // Calculate volume level
    const volume = calculateVolume(dataArrayRef.current);
    setVolumeLevel(volume);

    // Calculate pitch and clarity
    const pitchData = calculatePitch(dataArrayRef.current);
    setPitch(pitchData.frequency);
    setVoiceClarity(pitchData.clarity);

    // Calculate confidence based on volume consistency and pitch stability
    const confidence = calculateConfidence(volume, pitchData.frequency);
    setConfidenceScore(confidence);

    // Calculate stability
    const voiceStability = calculateStability();
    setStability(voiceStability);

    // Update history
    updateHistory(volume, pitchData.frequency);

    // Continue analysis
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  const calculateVolume = (dataArray: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    return Math.min(100, (average / 128) * 100);
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

  const calculateStability = (): number => {
    const recentVolumes = volumeHistoryRef.current.slice(-20);
    const recentPitches = pitchHistoryRef.current.slice(-20);

    if (recentVolumes.length < 10) return 0;

    const volumeStability = 100 - Math.min(100, calculateVariance(recentVolumes) / 2);
    const pitchStability = 100 - Math.min(100, calculateVariance(recentPitches) / 50);

    return (volumeStability + pitchStability) / 2;
  };

  const calculateVariance = (values: number[]): number => {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    return squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const updateHistory = (volume: number, pitch: number) => {
    volumeHistoryRef.current.push(volume);
    pitchHistoryRef.current.push(pitch);

    // Keep only last 50 samples (about 2-3 seconds at 60fps)
    if (volumeHistoryRef.current.length > 50) {
      volumeHistoryRef.current.shift();
    }
    if (pitchHistoryRef.current.length > 50) {
      pitchHistoryRef.current.shift();
    }
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
    stability
  };
}