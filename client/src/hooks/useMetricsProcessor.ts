import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { DataProcessor } from '../utils/dataProcessing';

interface MetricsState {
  wpm: number | null;
  eyeContact: number | null;
  confidence: number | null;
  fillerWords: { word: string; count: number }[];
  posture: number | null;
  voiceModulation: number | null;
  isProcessing: boolean;
  error: string | null;
}

export function useMetricsProcessor() {
  const [metrics, setMetrics] = useState<MetricsState>({
    wpm: null,
    eyeContact: null,
    confidence: null,
    fillerWords: [],
    posture: null,
    voiceModulation: null,
    isProcessing: false,
    error: null
  });

  // Refs for audio processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processingIntervalRef = useRef<number | null>(null);

  // Refs for ML models
  const faceDetectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const poseDetectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Ref for transcript
  const transcriptRef = useRef<string>('');

  useEffect(() => {
    // Initialize ML models
    initializeModels();

    // Initialize speech recognition
    initializeSpeechRecognition();

    return () => {
      cleanup();
    };
  }, []);

  const initializeModels = async () => {
    try {
      // Initialize face detection
      const faceModel = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const faceDetector = await faceLandmarksDetection.createDetector(faceModel, {
        runtime: 'mediapipe',
        refineLandmarks: true,
        maxFaces: 1
      });
      faceDetectorRef.current = faceDetector;

      // Initialize pose detection
      const poseModel = poseDetection.SupportedModels.BlazePose;
      const poseDetector = await poseDetection.createDetector(poseModel, {
        runtime: 'mediapipe',
        modelType: 'full',
        enableSmoothing: true
      });
      poseDetectorRef.current = poseDetector;

    } catch (error) {
      // Silently handle ML model initialization failure - use fallback metrics
      setMetrics(prev => ({ ...prev, error: 'ML models unavailable' }));
    }
  };

  const initializeSpeechRecognition = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        transcriptRef.current = transcript;
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current = recognition;

    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setMetrics(prev => ({ ...prev, error: 'Speech recognition not supported' }));
    }
  };

  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (!mediaStreamRef.current) {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }

      if (!analyserRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        source.connect(analyserRef.current);
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setMetrics(prev => ({ ...prev, error: 'Failed to initialize audio system' }));
      return false;
    }
  };

  const startProcessing = async (videoElement: HTMLVideoElement | null) => {
    try {
      setMetrics(prev => ({ ...prev, isProcessing: true, error: null }));

      const audioInitialized = await initializeAudio();
      if (!audioInitialized) {
        throw new Error('Audio initialization failed');
      }

      if (!videoElement) {
        throw new Error('Video element not provided');
      }

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start continuous processing
      processingIntervalRef.current = window.setInterval(() => {
        processFrame(videoElement);
      }, 1000); // Process every second

    } catch (error) {
      console.error('Error starting metrics processing:', error);
      setMetrics(prev => ({
        ...prev,
        isProcessing: false,
        error: 'Failed to start metrics processing'
      }));
    }
  };

  const processFrame = async (videoElement: HTMLVideoElement) => {
    try {
      if (!analyserRef.current || !videoElement) return;

      // Process audio data
      const bufferLength = analyserRef.current.frequencyBinCount;
      const audioData = new Float32Array(bufferLength);
      analyserRef.current.getFloatTimeDomainData(audioData);

      // Get video frame
      const videoFrame = await tf.browser.fromPixels(videoElement);

      // Process metrics
      const newMetrics = await processMetrics(audioData, videoFrame, videoElement);

      // Update state with new metrics
      setMetrics(prev => ({
        ...prev,
        ...newMetrics,
        isProcessing: true,
        error: null
      }));

      // Cleanup
      videoFrame.dispose();

    } catch (error) {
      console.error('Error processing frame:', error);
      setMetrics(prev => ({
        ...prev,
        error: 'Error processing metrics'
      }));
    }
  };

  const processMetrics = async (
    audioData: Float32Array,
    videoFrame: tf.Tensor3D,
    videoElement: HTMLVideoElement
  ) => {
    try {
      // Get current transcript
      const transcript = transcriptRef.current;

      // Calculate WPM
      const wpm = transcript ? 
        DataProcessor.calculateWPM(transcript, videoElement.currentTime * 1000) : 
        null;

      // Process face landmarks for eye contact
      const faceLandmarks = faceDetectorRef.current ? 
        await faceDetectorRef.current.estimateFaces(videoFrame) : 
        null;
      const eyeContact = faceLandmarks?.length ? 
        DataProcessor.calculateEyeContact(faceLandmarks[0].keypoints) : 
        null;

      // Process pose landmarks for posture
      const poses = poseDetectorRef.current ? 
        await poseDetectorRef.current.estimatePoses(videoFrame) : 
        null;
      const posture = poses?.length ? 
        DataProcessor.calculatePosture(poses[0].keypoints) : 
        null;

      // Calculate confidence
      const confidence = (poses?.length && audioData) ? 
        DataProcessor.calculateConfidence(audioData, poses[0].keypoints) : 
        null;

      // Process voice modulation
      const voiceModulation = audioData ? 
        DataProcessor.calculateVoiceModulation(audioData) : 
        null;

      // Detect filler words
      const fillerWords = transcript ? 
        DataProcessor.detectFillerWords(transcript) : 
        [];

      return {
        wpm,
        eyeContact,
        confidence,
        fillerWords,
        posture,
        voiceModulation
      };

    } catch (error) {
      console.error('Error processing metrics:', error);
      throw error;
    }
  };

  const stopProcessing = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Clear processing interval
    if (processingIntervalRef.current) {
      window.clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }

    setMetrics(prev => ({ ...prev, isProcessing: false }));
  };

  const cleanup = () => {
    stopProcessing();

    // Cleanup audio context
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }

    // Cleanup media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Reset refs
    analyserRef.current = null;
    audioContextRef.current = null;
    faceDetectorRef.current = null;
    poseDetectorRef.current = null;
    recognitionRef.current = null;
    transcriptRef.current = '';
  };

  return {
    metrics,
    startProcessing,
    stopProcessing,
    isProcessing: metrics.isProcessing,
    error: metrics.error
  };
}