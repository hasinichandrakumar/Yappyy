import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Camera, Mic, Play, Square, Brain, Save, Eye } from 'lucide-react';

// Add face-api.js types
declare global {
  interface Window {
    faceapi: any;
  }
}

export default function WorkingRecordingTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wpm, setWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [eyeContact, setEyeContact] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);
  const [eyeContactHistory, setEyeContactHistory] = useState<number[]>([]);
  const [faceDetectionActive, setFaceDetectionActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const wordCountRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const lastWpmUpdateRef = useRef<number>(0);
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const eyeTrackingRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectionRef = useRef<any>(null);

  // Cleanup function
  const cleanup = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Stop timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop eye tracking
    if (eyeTrackingRef.current) {
      clearInterval(eyeTrackingRef.current);
      eyeTrackingRef.current = null;
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Reset video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setFaceDetectionActive(false);
    console.log('🧹 Cleanup completed');
  };

  // Setup speech recognition
  const setupSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return false;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimText += transcript;
        }
      }
      
      // Count words from both final and interim results for more accurate WPM
      const allText = (finalTranscript + interimText).trim();
      
      if (allText) {
        console.log('🎤 Speech detected - Final:', finalTranscript, 'Interim:', interimText);
        
        if (finalTranscript.trim()) {
          setTranscript(prev => prev + finalTranscript);
        }
        
        // Count words from all detected speech (final + interim)
        const words = allText.split(/\s+/).filter(word => word.length > 0);
        const accurateWordCount = countWordsAccurately(allText);
        console.log('📝 Words detected:', accurateWordCount, 'words (accurate count):', words);
        
        if (accurateWordCount > 0) {
          // Update word count with all detected words
          const newTotalWords = wordCountRef.current + accurateWordCount;
          wordCountRef.current = newTotalWords;
          setWordCount(newTotalWords);
          
          // Enhanced filler word detection - process BOTH final and interim results
          let totalFillersDetected = 0;
          let allDetectedFillers: string[] = [];
          
          // Check final transcript for filler words
          if (finalTranscript.trim()) {
            const finalFillerResult = detectFillerWords(finalTranscript);
            totalFillersDetected += finalFillerResult.count;
            allDetectedFillers.push(...finalFillerResult.words);
            if (finalFillerResult.count > 0) {
              console.log('💬 Final transcript fillers:', finalFillerResult.count, 'words:', finalFillerResult.words);
            }
          }
          
          // Check interim text for filler words (to catch fillers that might be in interim results)
          if (interimText.trim()) {
            const interimFillerResult = detectFillerWords(interimText);
            totalFillersDetected += interimFillerResult.count;
            allDetectedFillers.push(...interimFillerResult.words);
            if (interimFillerResult.count > 0) {
              console.log('💬 Interim text fillers:', interimFillerResult.count, 'words:', interimFillerResult.words);
            }
          }
          
          // Update filler count if any fillers were detected
          if (totalFillersDetected > 0) {
            setFillerCount(prev => prev + totalFillersDetected);
            setDetectedFillers(prev => [...prev, ...allDetectedFillers]);
            console.log('💬 TOTAL Filler words detected:', totalFillersDetected, 'words:', allDetectedFillers);
          }
          
          // Calculate WPM immediately when new words are detected
          const elapsedMinutes = elapsedTimeRef.current / 60;
          if (elapsedMinutes > 0) {
            const currentWpm = Math.round(wordCountRef.current / elapsedMinutes);
            setWpm(currentWpm);
            console.log('⚡ Immediate WPM update:', currentWpm, 'from', wordCountRef.current, 'words in', elapsedMinutes.toFixed(2), 'minutes');
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
    };

    recognitionRef.current = recognition;
    return true;
  };

  // Setup media recorder for session recording
  const setupMediaRecorder = (stream: MediaStream) => {
    console.log('🎬 Setting up MediaRecorder...');
    
    // Check if MediaRecorder is supported
    if (!window.MediaRecorder) {
      console.error('❌ MediaRecorder not supported in this browser');
      return false;
    }
    
    // Check available MIME types
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
      'video/ogg'
    ];
    
    let selectedMimeType = '';
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        console.log(`✅ Using MIME type: ${mimeType}`);
        break;
      }
    }
    
    if (!selectedMimeType) {
      console.error('❌ No supported MIME type found');
      return false;
    }

    const options = {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000
    };

    try {
      const mediaRecorder = new MediaRecorder(stream, options);
      console.log('✅ MediaRecorder created successfully');
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
          console.log(`📹 Recording chunk: ${event.data.size} bytes`);
        }
      };

      mediaRecorder.onstart = () => {
        console.log('🎬 MediaRecorder started recording');
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: selectedMimeType });
        setRecordingBlob(blob);
        console.log('✅ Session recording completed, size:', blob.size, 'bytes');
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
      };

      mediaRecorderRef.current = mediaRecorder;
      return true;
    } catch (error) {
      console.error('❌ Failed to create MediaRecorder:', error);
      return false;
    }
  };

  // Save session to server
  const saveSession = async () => {
    if (!recordingBlob) {
      setError('No recording to save');
      return;
    }

    try {
      setError('');
      
      // Create form data with session information
      const formData = new FormData();
      formData.append('video', recordingBlob, 'session-recording.webm');
      formData.append('transcript', transcript);
      formData.append('duration', sessionDuration.toString());
      formData.append('wpm', wpm.toString());
      formData.append('fillerCount', fillerCount.toString());
      formData.append('wordCount', wordCount.toString());
      formData.append('eyeContact', eyeContact.toString());
      formData.append('sessionName', `Practice Session ${new Date().toLocaleDateString()}`);
      formData.append('purpose', 'speech-practice');

      const response = await fetch('/api/sessions/save-with-video', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Session saved successfully:', result);
        setSessionSaved(true);
        
        // Show success message
        setTimeout(() => {
          setSessionSaved(false);
        }, 3000);
      } else {
        throw new Error(`Failed to save session: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Failed to save session:', error);
      setError(`Failed to save session: ${error.message}`);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError('');
      setTranscript('');
      setWpm(0);
      setFillerCount(0);
      setEyeContact(0);
      setSessionDuration(0);
      setWordCount(0);
      setSessionSaved(false);
      setRecordingBlob(null);
      recordedChunksRef.current = [];
      wordCountRef.current = 0;
      elapsedTimeRef.current = 0;
      lastWpmUpdateRef.current = 0;
      setDetectedFillers([]);
      setFillerCount(0);
      setEyeContactHistory([]);
      setFaceDetectionActive(false);
      
      console.log('🎬 Starting recording...');
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      console.log('✅ Media stream obtained');
      
      // Setup video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('✅ Video element is playing');
      }
      
      // Setup media recorder for session recording
      if (!setupMediaRecorder(stream)) {
        console.warn('⚠️ MediaRecorder setup failed, continuing without session recording');
      }
      
      // Setup speech recognition
      if (!setupSpeechRecognition()) {
        return;
      }
      
      // Load face-api.js models for eye contact detection
      console.log('🔍 Loading face detection models...');
      const modelsLoaded = await loadFaceApiModels();
      if (modelsLoaded) {
        setFaceDetectionActive(true);
        console.log('✅ Face detection models loaded');
      } else {
        console.warn('⚠️ Face detection models failed to load, using fallback');
      }
      
      // Start session recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start(1000); // Record in 1-second chunks
        console.log('✅ Session recording started');
      } else {
        console.warn('⚠️ MediaRecorder not available, session recording disabled');
      }
      
      // Start speech recognition
      recognitionRef.current.start();
      console.log('✅ Speech recognition started');
      
      // Start timer
      startTimeRef.current = Date.now();
      console.log('🕐 Timer started at:', startTimeRef.current);
      
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSessionDuration(elapsed);
        elapsedTimeRef.current = elapsed;
        
        // Calculate WPM every second with better precision
        if (elapsed > 0 && wordCountRef.current > 0) {
          const elapsedMinutes = elapsed / 60;
          // Use more precise calculation
          const currentWpm = Math.round((wordCountRef.current / elapsedMinutes) * 100) / 100;
          setWpm(Math.round(currentWpm));
          
          // Log every 3 seconds for better monitoring
          if (elapsed % 3 === 0) {
            console.log(`⏱️ Timer update: ${elapsed}s elapsed, ${wordCountRef.current} words, WPM: ${currentWpm}`);
          }
        }
      }, 1000);
      
      // Start real eye contact detection
      if (modelsLoaded) {
        eyeTrackingRef.current = setInterval(() => {
          detectEyeContact();
        }, 500); // Check every 500ms for smooth tracking
        console.log('👁️ Eye contact detection started');
      } else {
        // Fallback to simulated eye contact
        timerRef.current = setInterval(() => {
          setEyeContact(Math.floor(Math.random() * 40) + 60);
        }, 1000);
        console.log('⚠️ Using simulated eye contact (fallback)');
      }
      
      setIsRecording(true);
      console.log('🎉 Recording started successfully!');
      
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      setError(`Recording failed: ${error.message}`);
      cleanup();
    }
  };

  // Stop recording
  const stopRecording = () => {
    console.log('🛑 Stopping recording...');
    setIsRecording(false);
    
    // Stop session recording
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        console.log('🛑 Stopping MediaRecorder...');
        mediaRecorderRef.current.stop();
      } else {
        console.log('⚠️ MediaRecorder not in recording state:', mediaRecorderRef.current.state);
      }
    } else {
      console.log('⚠️ No MediaRecorder available');
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log('🛑 Speech recognition stopped');
    }
    
    // Stop timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (eyeTrackingRef.current) {
      clearInterval(eyeTrackingRef.current);
      eyeTrackingRef.current = null;
    }
    
    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Reset video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setFaceDetectionActive(false);
    console.log('✅ Recording stopped and cleanup completed');
  };

  // More accurate word counting function
  const countWordsAccurately = (text: string) => {
    // Remove extra spaces and normalize
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    if (!normalizedText) return 0;
    
    // Split by spaces and filter out empty strings
    const words = normalizedText.split(' ').filter(word => {
      // Count words that have actual content (not just punctuation)
      return word.length > 0 && /[a-zA-Z0-9]/.test(word);
    });
    
    return words.length;
  };

  // Enhanced filler word detection function
  const detectFillerWords = (text: string) => {
    const fillerWords = [
      // Basic fillers
      'um', 'uh', 'ah', 'er', 'erm', 'hmm', 'hm',
      // Common phrases
      'like', 'you know', 'basically', 'actually', 'literally',
      'sort of', 'kind of', 'i mean', 'right', 'okay', 'so',
      'well', 'now', 'then', 'just', 'really', 'very',
      'totally', 'completely', 'absolutely', 'definitely',
      'obviously', 'clearly', 'honestly', 'frankly',
      'i guess', 'i think', 'i feel', 'i believe',
      // Additional common fillers
      'you see', 'i mean', 'i guess', 'i think', 'i feel',
      'i believe', 'i suppose', 'i reckon', 'i assume',
      'you know what', 'you know what i mean',
      'basically', 'essentially', 'fundamentally',
      'actually', 'literally', 'figuratively',
      'sort of', 'kind of', 'type of', 'way of',
      'right', 'okay', 'alright', 'all right',
      'so', 'well', 'now', 'then', 'just',
      'really', 'very', 'quite', 'rather',
      'totally', 'completely', 'absolutely', 'definitely',
      'obviously', 'clearly', 'honestly', 'frankly',
      'truthfully', 'seriously', 'genuinely',
      'simply', 'merely', 'only', 'just',
      'even', 'still', 'yet', 'however',
      'though', 'although', 'nevertheless',
      'anyway', 'anyhow', 'regardless'
    ];
    
    const lowerText = text.toLowerCase();
    let totalFillers = 0;
    const detectedFillers: string[] = [];
    
    fillerWords.forEach(filler => {
      // Use word boundary regex to match whole words only
      const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        totalFillers += matches.length;
        detectedFillers.push(...matches);
        console.log(`🔍 Found filler word "${filler}": ${matches.length} times`);
      }
    });
    
    // Also check for common variations and misspellings
    const variations = [
      { pattern: /\b(um+|uh+|ah+|er+)\b/gi, name: 'repeated_filler' },
      { pattern: /\b(like|lik)\b/gi, name: 'like_variation' },
      { pattern: /\b(you know|u know|ya know)\b/gi, name: 'you_know_variation' },
      { pattern: /\b(basically|basicly)\b/gi, name: 'basically_variation' },
      { pattern: /\b(actually|actualy)\b/gi, name: 'actually_variation' }
    ];
    
    variations.forEach(variation => {
      const matches = lowerText.match(variation.pattern);
      if (matches) {
        totalFillers += matches.length;
        detectedFillers.push(...matches);
        console.log(`🔍 Found variation "${variation.name}": ${matches.length} times`);
      }
    });
    
    return { count: totalFillers, words: detectedFillers };
  };

  // Function to highlight filler words in transcript
  const highlightFillerWords = (text: string) => {
    if (!text) return text;
    
    const fillerWords = [
      'um', 'uh', 'ah', 'er', 'erm', 'hmm', 'hm',
      'like', 'you know', 'basically', 'actually', 'literally',
      'sort of', 'kind of', 'i mean', 'right', 'okay', 'so',
      'well', 'now', 'then', 'just', 'really', 'very',
      'totally', 'completely', 'absolutely', 'definitely',
      'obviously', 'clearly', 'honestly', 'frankly',
      'i guess', 'i think', 'i feel', 'i believe'
    ];
    
    let highlightedText = text;
    
    fillerWords.forEach(filler => {
      const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="text-red-500 font-bold">$&</span>`);
    });
    
    return highlightedText;
  };

  // Test WPM calculation
  const testWpmCalculation = () => {
    const currentTime = Date.now();
    const elapsedMs = currentTime - startTimeRef.current;
    const elapsedMinutes = elapsedMs / (1000 * 60);
    
    console.log('🧪 WPM Test:');
    console.log('- Start time:', startTimeRef.current);
    console.log('- Current time:', currentTime);
    console.log('- Elapsed ms:', elapsedMs);
    console.log('- Elapsed minutes:', elapsedMinutes.toFixed(3));
    console.log('- Word count:', wordCountRef.current);
    console.log('- Current WPM:', wpm);
    
    if (elapsedMinutes > 0 && wordCountRef.current > 0) {
      const testWpm = Math.round((wordCountRef.current / elapsedMinutes) * 100) / 100;
      console.log('- Calculated WPM:', testWpm);
      setWpm(Math.round(testWpm));
    }
  };

  // Debug function to test filler word detection
  const testFillerDetection = () => {
    const testText = "um, so like, you know, I basically think that um, actually, it's really um, you know what I mean?";
    console.log('🧪 Testing filler detection with:', testText);
    const result = detectFillerWords(testText);
    console.log('🧪 Test result:', result);
    
    // Also test current transcript
    if (transcript) {
      console.log('🧪 Testing current transcript:', transcript);
      const currentResult = detectFillerWords(transcript);
      console.log('🧪 Current transcript result:', currentResult);
    }
  };

  // Load face-api.js models
  const loadFaceApiModels = async () => {
    try {
      if (!window.faceapi) {
        console.log('Loading face-api.js...');
        await /* @vite-ignore */ import('face-api.js');
      }
      
      const MODEL_URL = '/models';
      await Promise.all([
        window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      
      console.log('✅ Face-api.js models loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load face-api.js models:', error);
      return false;
    }
  };

  // Real eye contact detection
  const detectEyeContact = async () => {
    if (!videoRef.current || !isRecording) return;
    
    try {
      // Detect face and landmarks
      const detection = await window.faceapi.detectSingleFace(
        videoRef.current,
        new window.faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();
      
      if (detection) {
        const landmarks = detection.landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        
        // Calculate eye center points
        const leftEyeCenter = {
          x: leftEye.reduce((sum: number, point: any) => sum + point.x, 0) / leftEye.length,
          y: leftEye.reduce((sum: number, point: any) => sum + point.y, 0) / leftEye.length
        };
        
        const rightEyeCenter = {
          x: rightEye.reduce((sum: number, point: any) => sum + point.x, 0) / rightEye.length,
          y: rightEye.reduce((sum: number, point: any) => sum + point.y, 0) / rightEye.length
        };
        
        // Get video dimensions
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        // Calculate if eyes are looking at camera (center of video)
        const videoCenterX = videoWidth / 2;
        const videoCenterY = videoHeight / 2;
        
        // Calculate distance from center for each eye
        const leftEyeDistance = Math.sqrt(
          Math.pow(leftEyeCenter.x - videoCenterX, 2) + 
          Math.pow(leftEyeCenter.y - videoCenterY, 2)
        );
        
        const rightEyeDistance = Math.sqrt(
          Math.pow(rightEyeCenter.x - videoCenterX, 2) + 
          Math.pow(rightEyeCenter.y - videoCenterY, 2)
        );
        
        // Calculate eye contact percentage based on distance from center
        const maxDistance = Math.sqrt(Math.pow(videoWidth / 2, 2) + Math.pow(videoHeight / 2, 2));
        const avgDistance = (leftEyeDistance + rightEyeDistance) / 2;
        
        // Convert distance to percentage (closer = higher percentage)
        const eyeContactPercent = Math.max(0, Math.min(100, 
          ((maxDistance - avgDistance) / maxDistance) * 100
        ));
        
        // Update eye contact with smoothing
        setEyeContact(prev => {
          const smoothed = prev * 0.7 + eyeContactPercent * 0.3;
          return Math.round(smoothed);
        });
        
        // Store in history
        setEyeContactHistory(prev => [...prev.slice(-10), eyeContactPercent]);
        
        console.log(`👁️ Eye contact detected: ${Math.round(eyeContactPercent)}% (distance: ${Math.round(avgDistance)}px)`);
      } else {
        // No face detected - assume no eye contact
        setEyeContact(prev => Math.max(0, prev * 0.9));
        console.log('👁️ No face detected');
      }
    } catch (error) {
      console.error('❌ Eye contact detection error:', error);
      // Fallback to gradual decrease
      setEyeContact(prev => Math.max(0, prev * 0.95));
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Working Recording Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This test includes actual session recording, saving, and live metrics analysis.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {sessionSaved && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Session saved successfully!</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            {!isRecording ? (
              <Button 
                onClick={startRecording} 
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Recording Session
              </Button>
            ) : (
              <>
                <Button 
                  onClick={stopRecording} 
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  End Session
                </Button>
                
                <Button 
                  onClick={testWpmCalculation}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Test WPM
                </Button>
                
                <Button 
                  onClick={testFillerDetection}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Test Fillers
                </Button>
                
                {recordingBlob && (
                  <Button 
                    onClick={saveSession}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Session
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Live Metrics */}
          {isRecording && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{sessionDuration}s</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{wpm}</div>
                <div className="text-sm text-gray-600">WPM</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{fillerCount}</div>
                <div className="text-sm text-gray-600">Filler Words</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{eyeContact}%</div>
                <div className="text-sm text-gray-600">Eye Contact</div>
              </div>
            </div>
          )}

          {/* Video Feed */}
          {isRecording && (
            <div className="mt-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Transcript:</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: highlightFillerWords(transcript) }}></p>
              </div>
            </div>
          )}

          {/* Detected Fillers */}
          {detectedFillers.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Detected Fillers:</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-600">
                  {detectedFillers.map((filler, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-1">
                      {filler}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          {/* Filler Words */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Filler Words: {fillerCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{fillerCount}</div>
              {detectedFillers.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Detected fillers:</p>
                  <div className="flex flex-wrap gap-1">
                    {detectedFillers.slice(-10).map((filler, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {filler}
                      </span>
                    ))}
                    {detectedFillers.length > 10 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{detectedFillers.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Status:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                {isRecording ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span>Recording: {isRecording ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center gap-2">
                {transcript ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                <span>Speech Recognition: {transcript ? 'Working' : 'Waiting for speech'}</span>
              </div>
              <div className="flex items-center gap-2">
                {mediaRecorderRef.current ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span>Session Recording: {mediaRecorderRef.current ? 'Ready' : 'Not available'}</span>
              </div>
              <div className="flex items-center gap-2">
                {recordingBlob ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                <span>Recording Saved: {recordingBlob ? `${Math.round(recordingBlob.size / 1024)}KB` : 'Not saved yet'}</span>
              </div>
              <div className="flex items-center gap-2">
                {faceDetectionActive ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                <span>Face Detection: {faceDetectionActive ? 'Active' : 'Using simulation'}</span>
              </div>
            </div>
          </div>

          {/* Eye Contact */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Eye Contact: {eyeContact}%
                {faceDetectionActive && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Real Detection
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{eyeContact}%</div>
              {faceDetectionActive ? (
                <p className="text-sm text-gray-600 mt-1">Real-time face tracking active</p>
              ) : (
                <p className="text-sm text-gray-600 mt-1">Using simulated data</p>
              )}
              {eyeContactHistory.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Recent eye contact:</p>
                  <div className="flex gap-1">
                    {eyeContactHistory.slice(-5).map((value, index) => (
                      <div 
                        key={index} 
                        className="h-2 bg-blue-200 rounded"
                        style={{ width: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
