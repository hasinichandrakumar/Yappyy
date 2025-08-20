import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, Square, AlertCircle, CheckCircle } from 'lucide-react';

export default function MicrophoneDiagnostic() {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [browserSupport, setBrowserSupport] = useState({
    getUserMedia: false,
    webkitSpeechRecognition: false,
    SpeechRecognition: false
  });

  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check browser support on component mount
  useEffect(() => {
    setBrowserSupport({
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      webkitSpeechRecognition: !!('webkitSpeechRecognition' in window),
      SpeechRecognition: !!('SpeechRecognition' in window)
    });
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (browserSupport.webkitSpeechRecognition || browserSupport.SpeechRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setStatus('listening');
        setError('');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        setStatus('error');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setStatus('stopped');
      };
    }
  }, [browserSupport]);

  const testMicrophone = async () => {
    try {
      setStatus('requesting');
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      setStatus('microphone-active');
      setError('');
      
      console.log('Microphone access granted:', stream.getAudioTracks()[0].getSettings());
      
    } catch (err: any) {
      setError(`Microphone error: ${err.message}`);
      setStatus('error');
      console.error('Microphone error:', err);
    }
  };

  const startSpeechRecognition = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        setError(`Speech recognition start error: ${err.message}`);
        setStatus('error');
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const startFullTest = async () => {
    try {
      setStatus('starting');
      setError('');
      setTranscript('');
      
      // First get microphone access
      await testMicrophone();
      
      // Then start speech recognition
      if (recognitionRef.current) {
        setTimeout(() => {
          startSpeechRecognition();
        }, 500);
      }
      
    } catch (err: any) {
      setError(`Test failed: ${err.message}`);
      setStatus('error');
    }
  };

  const stopTest = () => {
    stopSpeechRecognition();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setStatus('stopped');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'idle': return 'text-gray-500';
      case 'requesting': return 'text-yellow-500';
      case 'microphone-active': return 'text-blue-500';
      case 'listening': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'stopped': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Microphone & Speech Recognition Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Browser Support Check */}
          <div className="space-y-2">
            <h3 className="font-semibold">Browser Support:</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className={`flex items-center gap-2 ${browserSupport.getUserMedia ? 'text-green-600' : 'text-red-600'}`}>
                {browserSupport.getUserMedia ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                getUserMedia
              </div>
              <div className={`flex items-center gap-2 ${browserSupport.webkitSpeechRecognition ? 'text-green-600' : 'text-red-600'}`}>
                {browserSupport.webkitSpeechRecognition ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                webkitSpeechRecognition
              </div>
              <div className={`flex items-center gap-2 ${browserSupport.SpeechRecognition ? 'text-green-600' : 'text-red-600'}`}>
                {browserSupport.SpeechRecognition ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                SpeechRecognition
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span>
            <span className={`${getStatusColor()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testMicrophone}
              variant="outline"
              disabled={status === 'requesting'}
            >
              <Mic className="w-4 h-4 mr-2" />
              Test Microphone
            </Button>
            
            <Button 
              onClick={startSpeechRecognition}
              variant="outline"
              disabled={!recognitionRef.current || isListening}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Speech Recognition
            </Button>
            
            <Button 
              onClick={stopSpeechRecognition}
              variant="outline"
              disabled={!isListening}
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Speech Recognition
            </Button>
            
            <Button 
              onClick={startFullTest}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={status === 'starting' || status === 'requesting'}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Full Test
            </Button>
            
            <Button 
              onClick={stopTest}
              variant="destructive"
              disabled={status === 'idle' || status === 'stopped'}
            >
              <Square className="w-4 h-4 mr-2" />
              Stop All
            </Button>
          </div>

          {/* Live Status Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${streamRef.current ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Microphone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Speech Recognition</span>
            </div>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="space-y-2">
              <h3 className="font-semibold">Transcript:</h3>
              <div className="bg-gray-50 border rounded-lg p-3 max-h-32 overflow-y-auto">
                <p className="text-sm">{transcript}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Click "Start Full Test" to test both microphone and speech recognition</li>
              <li>Allow microphone permissions when prompted</li>
              <li>Speak clearly into your microphone</li>
              <li>Watch for the transcript to appear below</li>
              <li>Check the status indicators for real-time feedback</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
