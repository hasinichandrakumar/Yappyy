import { useEffect, useRef, useState } from 'react';
// Import MediaPipe types conditionally to avoid runtime errors
type Holistic = any;
type Results = any;
type Camera = any;
type drawConnectors = any;
type drawLandmarks = any;
type POSE_CONNECTIONS = any;
type HAND_CONNECTIONS = any;
type FACEMESH_TESSELATION = any;

interface MediaPipeAnalysis {
  handGestures: {
    leftHand: { confidence: number; gesture: string; landmarks: any[] };
    rightHand: { confidence: number; gesture: string; landmarks: any[] };
  };
  bodyPose: {
    posture: string;
    confidence: number;
    keyPoints: any[];
    postureScore: number;
  };
  facialExpression: {
    emotion: string;
    confidence: number;
    eyeContact: number;
    engagement: number;
  };
  overallPresence: number;
}

interface EnhancedMediaPipeProcessorProps {
  videoElement: HTMLVideoElement | null;
  onAnalysis: (analysis: MediaPipeAnalysis) => void;
  isActive: boolean;
}

export function EnhancedMediaPipeProcessor({
  videoElement,
  onAnalysis,
  isActive
}: EnhancedMediaPipeProcessorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holisticRef = useRef<Holistic | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!videoElement || !isActive) return;

    initializeMediaPipe();

    return () => {
      cleanup();
    };
  }, [videoElement, isActive]);

  const initializeMediaPipe = async () => {
    try {
      console.log('🎯 Initializing Enhanced MediaPipe Holistic...');

      const holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      holistic.onResults(onResults);
      holisticRef.current = holistic;

      if (videoElement) {
        const camera = new Camera(videoElement, {
          onFrame: async () => {
            if (holisticRef.current && videoElement) {
              await holisticRef.current.send({ image: videoElement });
            }
          },
          width: 1280,
          height: 720
        });

        cameraRef.current = camera;
        await camera.start();
        setIsInitialized(true);
        console.log('✅ Enhanced MediaPipe Holistic initialized');
      }
    } catch (error) {
      console.error('❌ MediaPipe initialization error:', error);
    }
  };

  const onResults = (results: Results) => {
    if (!canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw the results (optional - for debugging)
    drawResults(canvasCtx, results);

    // Analyze results and send to parent
    const analysis = analyzeHolisticResults(results);
    onAnalysis(analysis);

    canvasCtx.restore();
  };

  const drawResults = (ctx: CanvasRenderingContext2D, results: Results) => {
    // Draw face landmarks
    if (results.faceLandmarks) {
      drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: '#C0C0C070',
        lineWidth: 1
      });
    }

    // Draw pose landmarks
    if (results.poseLandmarks) {
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1
      });
    }

    // Draw hand landmarks
    if (results.leftHandLandmarks) {
      drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: '#CC0000',
        lineWidth: 2
      });
      drawLandmarks(ctx, results.leftHandLandmarks, {
        color: '#00FF00',
        lineWidth: 1
      });
    }

    if (results.rightHandLandmarks) {
      drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: '#0000CC',
        lineWidth: 2
      });
      drawLandmarks(ctx, results.rightHandLandmarks, {
        color: '#FF0000',
        lineWidth: 1
      });
    }
  };

  const analyzeHolisticResults = (results: Results): MediaPipeAnalysis => {
    // Analyze hand gestures
    const leftHandAnalysis = analyzeHandGesture(results.leftHandLandmarks, 'left');
    const rightHandAnalysis = analyzeHandGesture(results.rightHandLandmarks, 'right');

    // Analyze body pose
    const poseAnalysis = analyzePose(results.poseLandmarks);

    // Analyze facial expression and eye contact
    const facialAnalysis = analyzeFacialExpression(results.faceLandmarks);

    // Calculate overall presence
    const overallPresence = calculateOverallPresence(poseAnalysis, facialAnalysis);

    return {
      handGestures: {
        leftHand: leftHandAnalysis,
        rightHand: rightHandAnalysis
      },
      bodyPose: poseAnalysis,
      facialExpression: facialAnalysis,
      overallPresence
    };
  };

  const analyzeHandGesture = (landmarks: any[], hand: 'left' | 'right') => {
    if (!landmarks || landmarks.length === 0) {
      return { confidence: 0, gesture: 'none', landmarks: [] };
    }

    // Simple gesture recognition based on landmark positions
    const wrist = landmarks[0];
    const thumb = landmarks[4];
    const index = landmarks[8];
    const middle = landmarks[12];
    const ring = landmarks[16];
    const pinky = landmarks[20];

    let gesture = 'unknown';
    let confidence = 0.7;

    // Basic gesture detection logic
    const fingersUp = [
      thumb.y < landmarks[3].y, // Thumb
      index.y < landmarks[6].y, // Index
      middle.y < landmarks[10].y, // Middle
      ring.y < landmarks[14].y, // Ring
      pinky.y < landmarks[18].y  // Pinky
    ];

    const fingersUpCount = fingersUp.filter(Boolean).length;

    if (fingersUpCount === 0) {
      gesture = 'fist';
    } else if (fingersUpCount === 1 && fingersUp[1]) {
      gesture = 'pointing';
    } else if (fingersUpCount === 2 && fingersUp[1] && fingersUp[2]) {
      gesture = 'peace';
    } else if (fingersUpCount === 5) {
      gesture = 'open_palm';
    } else if (fingersUpCount === 1 && fingersUp[0]) {
      gesture = 'thumbs_up';
    } else {
      gesture = 'neutral';
    }

    return {
      confidence,
      gesture,
      landmarks: landmarks.map(l => ({ x: l.x, y: l.y, z: l.z }))
    };
  };

  const analyzePose = (landmarks: any[]) => {
    if (!landmarks || landmarks.length === 0) {
      return {
        posture: 'unknown',
        confidence: 0,
        keyPoints: [],
        postureScore: 50
      };
    }

    // Key pose landmarks
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const nose = landmarks[0];

    // Calculate posture metrics
    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
    const hipAlignment = Math.abs(leftHip.y - rightHip.y);
    const spineAlignment = Math.abs((leftShoulder.x + rightShoulder.x) / 2 - (leftHip.x + rightHip.x) / 2);

    let posture = 'neutral';
    let postureScore = 75;

    // Analyze posture quality
    if (shoulderAlignment < 0.02 && hipAlignment < 0.02 && spineAlignment < 0.05) {
      posture = 'excellent';
      postureScore = 95;
    } else if (shoulderAlignment < 0.05 && hipAlignment < 0.05 && spineAlignment < 0.1) {
      posture = 'good';
      postureScore = 80;
    } else if (shoulderAlignment > 0.1 || spineAlignment > 0.15) {
      posture = 'slouched';
      postureScore = 45;
    }

    return {
      posture,
      confidence: 0.8,
      keyPoints: landmarks.map(l => ({ x: l.x, y: l.y, z: l.z, visibility: l.visibility })),
      postureScore
    };
  };

  const analyzeFacialExpression = (landmarks: any[]) => {
    if (!landmarks || landmarks.length === 0) {
      return {
        emotion: 'unknown',
        confidence: 0,
        eyeContact: 0,
        engagement: 50
      };
    }

    // Key facial landmarks
    const nose = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const mouthLeft = landmarks[61];
    const mouthRight = landmarks[291];

    // Calculate eye contact (based on eye position relative to nose)
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2
    };

    // Simple eye contact estimation (looking straight ahead)
    const eyeContactScore = Math.max(0, 100 - Math.abs(eyeCenter.x - nose.x) * 200);

    // Basic emotion detection based on mouth position
    const mouthCenter = {
      x: (mouthLeft.x + mouthRight.x) / 2,
      y: (mouthLeft.y + mouthRight.y) / 2
    };

    let emotion = 'neutral';
    if (mouthCenter.y < nose.y - 0.02) {
      emotion = 'happy';
    } else if (mouthCenter.y > nose.y + 0.02) {
      emotion = 'sad';
    }

    // Engagement based on face visibility and stability
    const engagement = Math.min(100, landmarks.length * 2);

    return {
      emotion,
      confidence: 0.7,
      eyeContact: Math.round(eyeContactScore),
      engagement: Math.round(engagement)
    };
  };

  const calculateOverallPresence = (poseAnalysis: any, facialAnalysis: any): number => {
    const postureWeight = 0.4;
    const eyeContactWeight = 0.3;
    const engagementWeight = 0.3;

    const overallScore = 
      (poseAnalysis.postureScore * postureWeight) +
      (facialAnalysis.eyeContact * eyeContactWeight) +
      (facialAnalysis.engagement * engagementWeight);

    return Math.round(Math.max(0, Math.min(100, overallScore)));
  };

  const cleanup = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (holisticRef.current) {
      holisticRef.current.close();
    }
    setIsInitialized(false);
  };

  return (
    <div className="hidden">
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ display: 'none' }}
      />
    </div>
  );
}