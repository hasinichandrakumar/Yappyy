import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  wordCount: number;
  sessionTime: number;
  confidence: number;
}

export function useSpeechRecognition() {
  const [result, setResult] = useState<SpeechRecognitionResult>({
    transcript: "",
    isListening: false,
    wordCount: 0,
    sessionTime: 0,
    confidence: 0
  });

  const recognition = useRef<SpeechRecognition | null>(null);
  const sessionStartTime = useRef<number>(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const initializeSpeechRecognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      
      recognition.current.onstart = () => {
        setResult(prev => ({ ...prev, isListening: true }));
        sessionStartTime.current = Date.now();
        
        // Start session timer
        timerInterval.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - sessionStartTime.current) / 1000);
          setResult(prev => ({ ...prev, sessionTime: elapsed }));
        }, 1000);
      };
      
      recognition.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setResult(prev => {
          const newTranscript = prev.transcript + finalTranscript + interimTranscript;
          const wordCount = newTranscript.trim().split(/\s+/).filter(word => word.length > 0).length;
          
          return {
            ...prev,
            transcript: newTranscript,
            wordCount,
            confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0
          };
        });
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access to use speech recognition.');
        }
      };
      
      recognition.current.onend = () => {
        setResult(prev => ({ ...prev, isListening: false }));
        if (timerInterval.current) {
          clearInterval(timerInterval.current);
        }
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition.current) {
      try {
        recognition.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognition.current) {
      recognition.current.stop();
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setResult(prev => ({
      ...prev,
      transcript: "",
      wordCount: 0,
      sessionTime: 0
    }));
  }, []);

  useEffect(() => {
    initializeSpeechRecognition();
    
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [initializeSpeechRecognition]);

  return {
    ...result,
    startListening,
    stopListening,
    resetTranscript
  };
}
