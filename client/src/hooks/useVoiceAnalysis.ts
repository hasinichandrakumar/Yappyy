import { useState, useRef, useCallback, useEffect } from "react";

interface VoiceMetrics {
  speakingPace: number;
  voiceClarity: number;
  confidenceScore: number;
  volumeLevel: number;
  fillerWords: number;
  pauseCount: number;
}

export function useVoiceAnalysis() {
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    speakingPace: 0,
    voiceClarity: 0,
    confidenceScore: 0,
    volumeLevel: 0,
    fillerWords: 0,
    pauseCount: 0
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const animationFrame = useRef<number | null>(null);
  const wordsSpoken = useRef<number>(0);
  const startTime = useRef<number>(0);

  const startVoiceAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      
      analyser.current.fftSize = 256;
      
      setIsAnalyzing(true);
      startTime.current = Date.now();
      
      // Start analyzing audio data
      const analyzeAudio = () => {
        if (!analyser.current || !isAnalyzing) return;
        
        const bufferLength = analyser.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.current.getByteFrequencyData(dataArray);
        
        // Calculate volume level
        const sum = dataArray.reduce((acc, value) => acc + value, 0);
        const averageVolume = sum / bufferLength;
        const volumeLevel = Math.min((averageVolume / 128) * 100, 100);
        
        // Calculate voice clarity based on frequency distribution
        const clarityAnalysis = () => {
          // Human speech fundamental frequencies typically range from 85-255 Hz (male) and 165-265 Hz (female)
          // Important consonant frequencies are in 2-8 kHz range
          const lowFreqs = dataArray.slice(0, Math.floor(bufferLength * 0.1)); // ~0-1 kHz
          const speechFreqs = dataArray.slice(Math.floor(bufferLength * 0.1), Math.floor(bufferLength * 0.4)); // ~1-4 kHz
          const consonantFreqs = dataArray.slice(Math.floor(bufferLength * 0.2), Math.floor(bufferLength * 0.7)); // ~2-7 kHz
          
          const lowAvg = lowFreqs.reduce((acc, val) => acc + val, 0) / lowFreqs.length;
          const speechAvg = speechFreqs.reduce((acc, val) => acc + val, 0) / speechFreqs.length;
          const consonantAvg = consonantFreqs.reduce((acc, val) => acc + val, 0) / consonantFreqs.length;
          
          // Calculate signal-to-noise ratio for clarity
          const signalStrength = Math.max(speechAvg, consonantAvg);
          const noiseLevel = lowAvg;
          const snr = noiseLevel > 0 ? signalStrength / noiseLevel : signalStrength;
          
          // Calculate frequency distribution balance
          const totalEnergy = dataArray.reduce((acc, val) => acc + val, 0);
          const speechRatio = totalEnergy > 0 ? (speechAvg * speechFreqs.length) / totalEnergy : 0;
          const consonantRatio = totalEnergy > 0 ? (consonantAvg * consonantFreqs.length) / totalEnergy : 0;
          
          // Combine metrics for overall clarity score
          const snrScore = Math.min(snr * 20, 50); // SNR contribution (0-50)
          const balanceScore = (speechRatio + consonantRatio) * 100; // Frequency balance (0-50)
          
          return Math.min(Math.max(snrScore + balanceScore, 0), 100);
        };
        
        // Calculate confidence based on volume consistency and frequency stability
        const confidenceAnalysis = () => {
          const volumeConsistency = 100 - (Math.abs(averageVolume - 64) * 1.5); // Penalty for too quiet/loud
          const frequencyStability = dataArray.reduce((acc, val, idx) => {
            const prevVal = idx > 0 ? dataArray[idx - 1] : val;
            return acc + Math.abs(val - prevVal);
          }, 0) / bufferLength;
          
          const stabilityScore = Math.max(0, 100 - frequencyStability * 2);
          return Math.min((volumeConsistency + stabilityScore) / 2, 100);
        };
        
        const elapsedMinutes = (Date.now() - startTime.current) / 60000;
        const wpm = elapsedMinutes > 0 ? Math.round(wordsSpoken.current / elapsedMinutes) : 0;
        
        setMetrics(prev => ({
          ...prev,
          volumeLevel: Math.round(volumeLevel),
          speakingPace: wpm,
          voiceClarity: Math.round(clarityAnalysis()),
          confidenceScore: Math.round(confidenceAnalysis())
        }));
        
        animationFrame.current = requestAnimationFrame(analyzeAudio);
      };
      
      analyzeAudio();
    } catch (error) {
      console.error("Failed to start voice analysis:", error);
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
