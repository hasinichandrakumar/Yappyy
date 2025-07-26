import { useState, useRef, useCallback, useEffect } from "react";

interface MediaPipeResult {
  posture: number | null;
  gesture: number | null;
  eyeContact: number | null;
}

export function useMediaPipe() {
  const [result, setResult] = useState<MediaPipeResult>({
    posture: null,
    gesture: null,
    eyeContact: null
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [mediapiipeLoaded, setMediapipeLoaded] = useState(false);
  const holistic = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load MediaPipe libraries
  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        // Load MediaPipe Holistic
        const script1 = document.createElement('script');
        script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        script1.crossOrigin = 'anonymous';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
        script2.crossOrigin = 'anonymous';
        document.head.appendChild(script2);

        const script3 = document.createElement('script');
        script3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js';
        script3.crossOrigin = 'anonymous';
        document.head.appendChild(script3);

        // Wait for scripts to load
        await new Promise((resolve) => {
          script3.onload = resolve;
        });

        setMediapipeLoaded(true);
        console.log('MediaPipe libraries loaded successfully');
      } catch (error) {
        console.error('Failed to load MediaPipe libraries:', error);
      }
    };

    loadMediaPipe();
  }, []);

  const initializeMediaPipe = useCallback(async () => {
    if (!mediapiipeLoaded) {
      console.log('MediaPipe libraries not loaded yet');
      return;
    }

    try {
      // Initialize MediaPipe Holistic
      const holisticModel = new (window as any).Holistic({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
      });

      holisticModel.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      holisticModel.onResults((results: any) => {
        processHolisticResults(results);
      });

      holistic.current = holisticModel;
      setIsInitialized(true);
      console.log('MediaPipe Holistic initialized successfully');
      
    } catch (error) {
      console.error("Failed to initialize MediaPipe:", error);
      setIsInitialized(false);
    }
  }, [mediapiipeLoaded]);

  const processHolisticResults = useCallback((results: any) => {
    let postureScore = 0;
    let gestureScore = 0;
    let eyeContactScore = 0;

    try {
      // Process pose landmarks for posture analysis
      if (results.poseLandmarks && results.poseLandmarks.length > 0) {
        const pose = results.poseLandmarks;
        
        // Calculate shoulder alignment (landmarks 11 and 12)
        const leftShoulder = pose[11];
        const rightShoulder = pose[12];
        
        if (leftShoulder && rightShoulder) {
          const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
          const shoulderAlignment = Math.max(0, 100 - (shoulderDiff * 1000));
          
          // Calculate head position (landmark 0)
          const nose = pose[0];
          const headPosition = nose ? Math.max(0, 100 - Math.abs(nose.x - 0.5) * 200) : 0;
          
          postureScore = (shoulderAlignment + headPosition) / 2;
        }
      }

      // Process hand landmarks for gesture analysis
      if (results.leftHandLandmarks || results.rightHandLandmarks) {
        const hasLeftHand = results.leftHandLandmarks && results.leftHandLandmarks.length > 0;
        const hasRightHand = results.rightHandLandmarks && results.rightHandLandmarks.length > 0;
        
        if (hasLeftHand || hasRightHand) {
          // Calculate gesture naturalness based on hand visibility and position
          gestureScore = (hasLeftHand && hasRightHand) ? 85 : 60;
          
          // Analyze hand openness (open palm vs closed fist)
          if (hasRightHand) {
            const rightHand = results.rightHandLandmarks;
            const fingerTips = [4, 8, 12, 16, 20]; // Thumb, index, middle, ring, pinky tips
            const fingerBases = [3, 5, 9, 13, 17]; // Corresponding base points
            
            let openFingers = 0;
            for (let i = 0; i < fingerTips.length; i++) {
              const tip = rightHand[fingerTips[i]];
              const base = rightHand[fingerBases[i]];
              if (tip && base && tip.y < base.y) {
                openFingers++;
              }
            }
            
            const openness = (openFingers / 5) * 100;
            gestureScore = Math.max(gestureScore, openness * 0.9);
          }
        }
      }

      // Process face landmarks for eye contact
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const face = results.faceLandmarks;
        
        // Eye landmarks: left eye (33, 133), right eye (362, 263)
        const leftEye = { outer: face[33], inner: face[133] };
        const rightEye = { outer: face[362], inner: face[263] };
        
        if (leftEye.outer && leftEye.inner && rightEye.outer && rightEye.inner) {
          // Calculate gaze direction based on eye landmark positions
          const leftGaze = (leftEye.outer.x + leftEye.inner.x) / 2;
          const rightGaze = (rightEye.outer.x + rightEye.inner.x) / 2;
          const avgGaze = (leftGaze + rightGaze) / 2;
          
          // Score based on how close gaze is to center (0.5)
          const gazeScore = Math.max(0, 100 - Math.abs(avgGaze - 0.5) * 300);
          eyeContactScore = Math.min(100, gazeScore);
        }
      }

      // Update results with calculated scores
      setResult({
        posture: Math.round(postureScore),
        gesture: Math.round(gestureScore),
        eyeContact: Math.round(eyeContactScore)
      });

    } catch (error) {
      console.error('Error processing MediaPipe results:', error);
    }
  }, []);

  const processFrame = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!isInitialized || !holistic.current || !videoElement) return;
    
    try {
      await holistic.current.send({ image: videoElement });
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  }, [isInitialized]);

  return {
    ...result,
    initializeMediaPipe,
    processFrame,
    isInitialized,
    mediapiipeLoaded
  };
}
