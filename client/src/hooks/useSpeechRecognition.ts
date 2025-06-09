import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  wordCount: number;
  fillerWords: string[];
  startListening: () => void;
  stopListening: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef<boolean>(false);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript) {
        setTranscript(prev => {
          const newTranscript = prev + finalTranscript;
          
          // Count words
          const words = newTranscript.trim().split(/\s+/).filter(word => word.length > 0);
          setWordCount(words.length);
          
          // Detect filler words
          const detectedFillers = detectFillerWords(finalTranscript);
          if (detectedFillers.length > 0) {
            setFillerWords(prev => [...prev, ...detectedFillers]);
          }
          
          return newTranscript;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart recognition if no speech detected
        if (isActiveRef.current) {
          setTimeout(() => {
            if (isActiveRef.current) {
              recognition.start();
            }
          }, 1000);
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart recognition if it should still be active
      if (isActiveRef.current) {
        setTimeout(() => {
          if (isActiveRef.current) {
            try {
              recognition.start();
            } catch (error) {
              console.warn('Could not restart speech recognition:', error);
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Detect filler words in speech
  const detectFillerWords = (text: string): string[] => {
    const fillerPatterns = [
      'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well',
      'actually', 'basically', 'literally', 'obviously', 'right',
      'kinda', 'sorta', 'anyway', 'meanwhile'
    ];
    
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const detectedFillers: string[] = [];
    
    words.forEach(word => {
      if (fillerPatterns.includes(word.trim())) {
        detectedFillers.push(word);
      }
    });
    
    return detectedFillers;
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isActiveRef.current) {
      try {
        isActiveRef.current = true;
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isActiveRef.current) {
      isActiveRef.current = false;
      recognitionRef.current.stop();
    }
  }, []);

  // Auto-start listening when component mounts
  useEffect(() => {
    startListening();
    
    return () => {
      stopListening();
    };
  }, [startListening, stopListening]);

  return {
    transcript,
    isListening,
    wordCount,
    fillerWords,
    startListening,
    stopListening
  };
}