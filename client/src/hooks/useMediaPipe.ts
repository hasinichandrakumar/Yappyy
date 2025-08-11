import { useState, useRef, useCallback, useEffect } from "react";

// Helper function to calculate eye aspect ratio (EAR)
function calculateEyeAspectRatio(outer: any, inner: any, top: any, bottom: any) {
  if (!outer || !inner || !top || !bottom) return 0;
  
  const verticalDist = Math.abs(top.y - bottom.y);
  const horizontalDist = Math.abs(outer.x - inner.x);
  
  if (horizontalDist === 0) return 0;
  return verticalDist / horizontalDist;
}

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

  // Disable MediaPipe loading to prevent WASM errors
  useEffect(() => {
    // Skip MediaPipe loading entirely to prevent WASM plugin errors
    console.log('⚠️ MediaPipe disabled to prevent WASM errors - using server-side computer vision');
    setMediapipeLoaded(false);
  }, []);

  const initializeMediaPipe = useCallback(async () => {
    if (!mediapiipeLoaded) {
      console.log('⚠️ MediaPipe libraries not loaded, using fallback computer vision');
      return;
    }

    try {
      // Check if Holistic is available
      if (!(window as any).Holistic) {
        console.warn('⚠️ Holistic not available, using fallback');
        return;
      }

      // Initialize MediaPipe Holistic with error handling
      const holisticModel = new (window as any).Holistic({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
      });

      // Set options with try-catch
      try {
        holisticModel.setOptions({
          modelComplexity: 1, // Reduced complexity to prevent WASM issues
          smoothLandmarks: true,
          enableSegmentation: false, // Disabled to prevent WASM overload
          smoothSegmentation: false,
          refineFaceLandmarks: false, // Disabled to prevent WASM issues
          minDetectionConfidence: 0.5, // Lower threshold for stability
          minTrackingConfidence: 0.5,
          selfieMode: true
        });
      } catch (optError) {
        console.warn('⚠️ MediaPipe options setting failed, using defaults:', optError);
      }

      holisticModel.onResults((results: any) => {
        try {
          processHolisticResults(results);
        } catch (resultError) {
          console.warn('⚠️ MediaPipe result processing failed:', resultError);
        }
      });

      holistic.current = holisticModel;
      setIsInitialized(true);
      console.log('✅ MediaPipe Holistic initialized successfully');
      
    } catch (error) {
      console.warn('⚠️ MediaPipe initialization failed, continuing with fallback:', error);
      setIsInitialized(false);
    }
  }, [mediapiipeLoaded]);

  const processHolisticResults = useCallback((results: any) => {
    let postureScore = 0;
    let gestureScore = 0;
    let eyeContactScore = 0;
    let confidenceThreshold = 0.7; // Minimum confidence for valid detection

    try {
      // Process pose landmarks for posture analysis
      if (results.poseLandmarks && results.poseLandmarks.length > 0) {
        const pose = results.poseLandmarks;
        
        // Calculate shoulder alignment (landmarks 11 and 12)
        const leftShoulder = pose[11];
        const rightShoulder = pose[12];
        const leftHip = pose[23];
        const rightHip = pose[24];
        const nose = pose[0];
        
        if (leftShoulder && rightShoulder && leftHip && rightHip && nose &&
            leftShoulder.visibility > confidenceThreshold &&
            rightShoulder.visibility > confidenceThreshold) {
          
          // Shoulder alignment (vertical and depth)
          const shoulderVerticalDiff = Math.abs(leftShoulder.y - rightShoulder.y);
          const shoulderDepthDiff = Math.abs(leftShoulder.z - rightShoulder.z);
          const shoulderAlignment = Math.max(0, 100 - (shoulderVerticalDiff * 800) - (shoulderDepthDiff * 500));
          
          // Spine alignment
          const hipCenter = {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2,
            z: (leftHip.z + rightHip.z) / 2
          };
          const shoulderCenter = {
            x: (leftShoulder.x + rightShoulder.x) / 2,
            y: (leftShoulder.y + rightShoulder.y) / 2,
            z: (leftShoulder.z + rightShoulder.z) / 2
          };
          
          // Calculate spine tilt
          const spineAngle = Math.atan2(
            shoulderCenter.x - hipCenter.x,
            shoulderCenter.y - hipCenter.y
          ) * (180 / Math.PI);
          const spineTilt = Math.max(0, 100 - Math.abs(spineAngle) * 2);
          
          // Head position relative to shoulders
          const headOffset = {
            x: nose.x - shoulderCenter.x,
            z: nose.z - shoulderCenter.z
          };
          const headPosition = Math.max(0, 100 - 
            (Math.abs(headOffset.x) * 300) - 
            (Math.abs(headOffset.z) * 200)
          );
          
          // Weighted average of all posture components
          postureScore = (
            shoulderAlignment * 0.4 +
            spineTilt * 0.4 +
            headPosition * 0.2
          );
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
        
        // Enhanced eye landmarks for more accurate gaze tracking
        const leftEyePoints = {
          outer: face[33],
          inner: face[133],
          top: face[159],
          bottom: face[145],
          center: face[468]
        };
        
        const rightEyePoints = {
          outer: face[362],
          inner: face[263],
          top: face[386],
          bottom: face[374],
          center: face[473]
        };
        
        if (Object.values(leftEyePoints).every(point => point?.visibility > confidenceThreshold) &&
            Object.values(rightEyePoints).every(point => point?.visibility > confidenceThreshold)) {
          
          // Calculate eye aspect ratio (EAR) to detect blinks/squints
          const leftEAR = calculateEyeAspectRatio(
            leftEyePoints.outer,
            leftEyePoints.inner,
            leftEyePoints.top,
            leftEyePoints.bottom
          );
          
          const rightEAR = calculateEyeAspectRatio(
            rightEyePoints.outer,
            rightEyePoints.inner,
            rightEyePoints.top,
            rightEyePoints.bottom
          );
          
          const avgEAR = (leftEAR + rightEAR) / 2;
          const eyeOpenness = Math.min(100, Math.max(0, (avgEAR - 0.15) * 500));
          
          // Calculate gaze direction using iris centers
          const leftGaze = {
            x: leftEyePoints.center.x,
            y: leftEyePoints.center.y,
            z: leftEyePoints.center.z
          };
          
          const rightGaze = {
            x: rightEyePoints.center.x,
            y: rightEyePoints.center.y,
            z: rightEyePoints.center.z
          };
          
          // Calculate horizontal gaze angle
          const horizontalGaze = (leftGaze.x + rightGaze.x) / 2;
          const horizontalScore = Math.max(0, 100 - Math.abs(horizontalGaze - 0.5) * 250);
          
          // Calculate vertical gaze angle
          const verticalGaze = (leftGaze.y + rightGaze.y) / 2;
          const verticalScore = Math.max(0, 100 - Math.abs(verticalGaze - 0.45) * 250);
          
          // Calculate depth (z-axis) for eye contact
          const depthGaze = (leftGaze.z + rightGaze.z) / 2;
          const depthScore = Math.max(0, 100 - Math.abs(depthGaze) * 200);
          
          // Weighted combination of all factors
          eyeContactScore = Math.min(100, (
            horizontalScore * 0.4 +
            verticalScore * 0.3 +
            depthScore * 0.2 +
            eyeOpenness * 0.1
          ));
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
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MediaPipe processing timeout')), 5000)
      );
      
      const processPromise = holistic.current.send({ image: videoElement });
      
      await Promise.race([processPromise, timeoutPromise]);
    } catch (error) {
      console.warn('⚠️ MediaPipe frame processing failed:', error);
      // Don't throw, just continue with fallback
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
