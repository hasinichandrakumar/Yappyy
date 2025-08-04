// Real-Time Computer Vision Dashboard - DISABLED BY USER REQUEST
// This component has been completely disabled and returns nothing

interface ComputerVisionDashboardProps {
  mediaPipePosture?: number | null;
  mediaPipeEyeContact?: number | null;
  isMediaPipeInitialized?: boolean;
  bodyLanguageMetrics?: any;
  isBodyLanguageActive?: boolean;
  facialAnalysis?: any;
  isFacialAnalysisActive?: boolean;
  roboflowAnalysis?: any;
  isRoboflowAnalyzing?: boolean;
}

export default function RealTimeComputerVisionDashboard(props: ComputerVisionDashboardProps) {
  // User explicitly requested removal of all analytics boxes during practice
  // This component is completely disabled and will never render anything
  return null;
}