import { Results } from '@mediapipe/hands';

interface GestureMetrics {
  handMovements: number;
  naturalness: number;
  effectiveness: number;
  timing: number;
}

const GESTURE_HISTORY_SIZE = 10;
let gestureHistory: any[][] = [];

export function calculateGestureMetrics(handLandmarks: any[]): GestureMetrics {
  if (!handLandmarks || handLandmarks.length === 0) {
    return {
      handMovements: 0,
      naturalness: 0,
      effectiveness: 0,
      timing: 0
    };
  }

  try {
    // Store current hand positions in history
    gestureHistory.push(handLandmarks);
    if (gestureHistory.length > GESTURE_HISTORY_SIZE) {
      gestureHistory.shift();
    }

    // Calculate hand movement smoothness
    let movementSmoothnessScore = 100;
    if (gestureHistory.length > 1) {
      const currentHand = handLandmarks[0]; // Using first hand for primary gesture analysis
      const previousHand = gestureHistory[gestureHistory.length - 2][0];
      
      if (currentHand && previousHand) {
        // Calculate movement delta between frames
        const movementDelta = currentHand.map((landmark: any, index: number) => ({
          x: Math.abs(landmark.x - previousHand[index].x),
          y: Math.abs(landmark.y - previousHand[index].y),
          z: Math.abs(landmark.z - previousHand[index].z)
        }));

        // Penalize jerky movements
        const maxDelta = Math.max(
          ...movementDelta.map(delta => Math.max(delta.x, delta.y, delta.z))
        );
        movementSmoothnessScore = Math.max(0, 100 - (maxDelta * 1000));
      }
    }

    // Calculate hand openness and gesture naturalness
    const fingerTips = [4, 8, 12, 16, 20]; // Thumb, index, middle, ring, pinky tips
    const fingerBases = [2, 5, 9, 13, 17]; // Corresponding base points
    let openFingers = 0;
    let fingerAngles = 0;

    handLandmarks[0].forEach((_, index) => {
      if (fingerTips.includes(index)) {
        const tipIndex = fingerTips.indexOf(index);
        const baseIndex = fingerBases[tipIndex];
        const tip = handLandmarks[0][index];
        const base = handLandmarks[0][baseIndex];
        
        // Check if finger is extended
        if (tip.y < base.y) {
          openFingers++;
        }

        // Calculate finger angles for naturalness
        const angle = Math.atan2(tip.y - base.y, tip.x - base.x);
        fingerAngles += Math.abs(angle);
      }
    });

    // Natural hand positions tend to have some fingers extended and some curved
    const naturalnessScore = Math.min(100, ((openFingers / 5) * 70) + 30);

    // Effectiveness based on clear, distinct positions
    const effectivenessScore = Math.min(100, (movementSmoothnessScore * 0.6) + (naturalnessScore * 0.4));

    // Timing score based on movement consistency
    const timingScore = Math.min(100, movementSmoothnessScore * 0.9);

    return {
      handMovements: Math.round(movementSmoothnessScore),
      naturalness: Math.round(naturalnessScore),
      effectiveness: Math.round(effectivenessScore),
      timing: Math.round(timingScore)
    };
  } catch (error) {
    console.warn('⚠️ Error calculating gesture metrics:', error);
    return {
      handMovements: 0,
      naturalness: 0,
      effectiveness: 0,
      timing: 0
    };
  }
}