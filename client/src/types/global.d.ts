declare global {
  interface Window {
    faceLandmarksDetection: {
      detectFaces: (input: any) => Promise<Array<{
        landmarks: Array<{
          x: number;
          y: number;
          z: number;
          type: string;
        }>;
      }>>;
    };
    poseDetection: {
      detectPoses: (input: any) => Promise<Array<{
        keypoints: Array<{
          x: number;
          y: number;
          z: number;
          score: number;
          name: string;
        }>;
      }>>;
    };
  }
}