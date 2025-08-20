import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Camera, Mic, Play, Square } from 'lucide-react';

export default function SimpleRecordingTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wpm, setWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [eyeContact, setEyeContact] = useState(0);
  const [error, setError] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup function
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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
      
      if (finalTranscript.trim()) {
        setTranscript(prev => prev + finalTranscript);
        
        // Calculate WPM
        const words = finalTranscript.trim().split(/\s+/).filter(word => word.length > 0);
        const elapsedMinutes = sessionDuration / 60;
        if (elapsedMinutes > 0) {
          const newWpm = Math.round(words.length / elapsedMinutes);
          setWpm(newWpm);
        }
        
        // Detect filler words
        const fillerWords = ['um', 'uh', 'ah', 'er', 'like', 'you know', 'basically', 'actually'];
        const lowerTranscript = finalTranscript.toLowerCase();
        let newFillers = 0;
        fillerWords.forEach(filler => {
          const regex = new RegExp(`\\b${filler}\\b`, 'gi');
          const matches = lowerTranscript.match(regex);
          if (matches) {
            newFillers += matches.length;
          }
        });
        setFillerCount(prev => prev + newFillers);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
    };

    recognitionRef.current = recognition;
    return true;
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
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      // Setup video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      // Setup speech recognition
      if (!setupSpeechRecognition()) {
        return;
      }
      
      // Start speech recognition
      recognitionRef.current.start();
      
      // Start timer
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSessionDuration(elapsed);
        
        // Simulate eye contact (random for testing)
        setEyeContact(Math.floor(Math.random() * 40) + 60);
      }, 1000);
      
      setIsRecording(true);
      
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      setError(`Recording failed: ${error.message}`);
      cleanup();
    }
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    cleanup();
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
            <Camera className="h-5 w-5" />
            <Mic className="h-5 w-5" />
            Simple Recording Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This test focuses on core recording functionality: camera, microphone, speech recognition, and live metrics.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={startRecording} 
              disabled={isRecording}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRecording ? 'Recording...' : 'Start Recording'}
            </Button>
            
            <Button 
              onClick={stopRecording} 
              disabled={!isRecording}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Recording
            </Button>
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
                <p className="text-sm">{transcript}</p>
              </div>
            </div>
          )}

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
                {wpm > 0 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                <span>WPM Calculation: {wpm > 0 ? `${wpm} WPM` : 'No speech detected'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

