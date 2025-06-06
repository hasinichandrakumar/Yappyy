import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  wordCount: number;
  wpm: number;
  fillerWords: string[];
  currentSentence: string;
}

// Common filler words to detect
const FILLER_WORDS = [
  'um', 'uh', 'ah', 'er', 'like', 'you know', 'so', 'actually', 'basically', 
  'literally', 'right', 'ok', 'okay', 'well', 'i mean', 'kind of', 'sort of'
];

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  const calculateWPM = useCallback((words: number, timeInMinutes: number) => {
    return timeInMinutes > 0 ? Math.round(words / timeInMinutes) : 0;
  }, []);

  const detectFillerWords = useCallback((text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/);
    const detected: string[] = [];
    
    // Check for single word fillers
    words.forEach(word => {
      const cleanWord = word.replace(/[.,!?;]/g, '');
      if (FILLER_WORDS.includes(cleanWord)) {
        detected.push(cleanWord);
      }
    });

    // Check for phrase fillers
    const textLower = text.toLowerCase();
    FILLER_WORDS.forEach(filler => {
      if (filler.includes(' ') && textLower.includes(filler)) {
        detected.push(filler);
      }
    });

    return detected;
  }, []);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    console.log('Starting speech recognition...');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      startTimeRef.current = Date.now();
      lastUpdateTimeRef.current = Date.now();
      setIsListening(true);
      setTranscript('');
      setWordCount(0);
      setWpm(0);
      setFillerWords([]);
      setCurrentSentence('');

      let fullTranscriptRef = '';

      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result received');
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        console.log('Final transcript:', finalTranscript);
        console.log('Interim transcript:', interimTranscript);

        // Update the full transcript reference
        if (finalTranscript) {
          fullTranscriptRef += finalTranscript;
        }
        
        const currentText = finalTranscript || interimTranscript;
        const displayTranscript = fullTranscriptRef + (interimTranscript ? ' ' + interimTranscript : '');
        
        setTranscript(displayTranscript);
        setCurrentSentence(currentText);

        // Calculate word count and WPM using the accumulated transcript
        const words = fullTranscriptRef.trim().split(/\s+/).filter(word => word.length > 0);
        const currentWordCount = words.length;
        setWordCount(currentWordCount);

        const currentTime = Date.now();
        const timeInMinutes = (currentTime - startTimeRef.current) / 60000;
        
        // Only calculate WPM if we have meaningful time elapsed and words
        if (timeInMinutes > 0.1 && currentWordCount > 0) {
          const currentWPM = calculateWPM(currentWordCount, timeInMinutes);
          setWpm(currentWPM);
        }

        // Detect filler words in the final transcript only
        if (finalTranscript) {
          const newFillers = detectFillerWords(finalTranscript);
          setFillerWords(prev => [...prev, ...newFillers]);
        }

        lastUpdateTimeRef.current = currentTime;
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    }
  }, [calculateWPM, detectFillerWords]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setWordCount(0);
    setWpm(0);
    setFillerWords([]);
    setCurrentSentence('');
    startTimeRef.current = 0;
    lastUpdateTimeRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    wordCount,
    wpm,
    fillerWords,
    currentSentence
  };
}

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}