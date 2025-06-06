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
        
        // Simulate other metrics based on audio analysis
        const elapsedMinutes = (Date.now() - startTime.current) / 60000;
        const wpm = elapsedMinutes > 0 ? Math.round(wordsSpoken.current / elapsedMinutes) : 0;
        
        setMetrics(prev => ({
          ...prev,
          volumeLevel: Math.round(volumeLevel),
          speakingPace: wpm,
          voiceClarity: Math.min(85 + Math.random() * 15, 100), // Simulate clarity
          confidenceScore: Math.min(60 + Math.random() * 35, 100) // Simulate confidence
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
