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
          
          // Enhanced filler word detection
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

  // Comprehensive filler word detection
  const detectFillerWords = (text: string): string[] => {
    const singleWordFillers = [
      'um', 'uh', 'er', 'erm', 'ah', 'eh', 'oh', 'hmm', 'mhm',
      'like', 'so', 'well', 'actually', 'basically', 'literally', 'obviously', 
      'right', 'okay', 'alright', 'yeah', 'yep', 'yup', 'nah', 'nope',
      'kinda', 'sorta', 'anyway', 'meanwhile', 'whatever', 'stuff', 'things',
      'totally', 'really', 'super', 'pretty', 'quite', 'very'
    ];
    
    const phraseFillers = [
      'you know', 'i mean', 'you see', 'kind of', 'sort of', 
      'and uh', 'and um', 'but uh', 'but um', 'so uh', 'so um',
      'uh huh', 'mm hmm', 'oh well', 'i guess', 'i think',
      'to be honest', 'if you will', 'as it were', 'per se'
    ];
    
    const cleanText = text.toLowerCase().replace(/[.,!?;:]/g, '');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const detectedFillers: string[] = [];
    
    // Check for phrase fillers first
    for (let i = 0; i < words.length - 1; i++) {
      const twoWords = `${words[i]} ${words[i + 1]}`;
      const threeWords = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}` : '';
      
      if (phraseFillers.includes(twoWords)) {
        detectedFillers.push(twoWords);
        i++; // Skip next word since it's part of the phrase
      } else if (threeWords && phraseFillers.includes(threeWords)) {
        detectedFillers.push(threeWords);
        i += 2; // Skip next two words
      } else if (singleWordFillers.includes(words[i])) {
        detectedFillers.push(words[i]);
      }
    }
    
    // Check last word if not already processed
    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      if (singleWordFillers.includes(lastWord)) {
        detectedFillers.push(lastWord);
      }
    }
    
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