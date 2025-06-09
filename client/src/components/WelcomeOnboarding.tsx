import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ChevronRight, 
  ChevronLeft, 
  Mic, 
  Video, 
  BarChart3, 
  User, 
  Target, 
  Sparkles,
  PlayCircle,
  Trophy,
  Brain,
  Camera,
  Check
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface WelcomeOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  userName: string;
}

export default function WelcomeOnboarding({ isOpen, onComplete, userName }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: `Welcome to YapUp, ${userName}!`,
      description: "Your AI-powered public speaking coach is ready to help you master communication skills",
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-gray-600">
            YapUp uses advanced AI to analyze your speaking patterns, body language, and content structure. 
            Get personalized feedback to improve your communication skills faster than ever.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Mic className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Voice Analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Body Language</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium">AI Coaching</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Start Your First Practice Session",
      description: "Jump into the Practice Hub to record your first speech and get instant feedback",
      icon: <PlayCircle className="w-8 h-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Practice Hub Features:</h4>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Real-time voice and video recording
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Live feedback on speaking pace and clarity
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Body language analysis with MediaPipe
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                AI-powered content suggestions
              </li>
            </ul>
          </div>
          <p className="text-gray-600">
            The Practice Hub is where the magic happens. Click the "Practice" tab in your dashboard 
            to access professional-grade speaking analysis tools.
          </p>
        </div>
      ),
      action: {
        text: "Go to Practice Hub",
        onClick: () => {
          // This will be handled by the parent component
          window.location.hash = "#practice";
        }
      }
    },
    {
      id: 3,
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed analytics and performance insights",
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-blue-700">Voice Clarity</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-green-700">Body Language</div>
            </div>
          </div>
          <p className="text-gray-600">
            Your Analytics tab provides comprehensive insights into your speaking performance, 
            including trends over time, strengths to maintain, and areas for improvement.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">What You'll See:</h4>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Speech pattern analysis and recommendations</li>
              <li>• Progress tracking across multiple sessions</li>
              <li>• Personalized improvement roadmaps</li>
              <li>• Comparative performance metrics</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Customize Your Experience",
      description: "Set up your profile and preferences for personalized coaching",
      icon: <User className="w-8 h-8 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Click the user icon in the top navigation to access your profile settings. 
            Customize your experience by setting:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium">Speaking Goals</div>
                <div className="text-sm text-gray-600">Choose what you want to improve</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Badge className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium">Experience Level</div>
                <div className="text-sm text-gray-600">Get appropriate coaching intensity</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium">Practice Reminders</div>
                <div className="text-sm text-gray-600">Stay consistent with your improvement</div>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        text: "Set Up Profile",
        onClick: () => {
          window.location.href = "/profile";
        }
      }
    },
    {
      id: 5,
      title: "Earn Achievements",
      description: "Unlock badges and track milestones as you improve your speaking skills",
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-xs font-medium">First Speech</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Mic className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-xs font-medium">Clear Speaker</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-xs font-medium">Goal Crusher</div>
            </div>
          </div>
          <p className="text-gray-600">
            Complete practice sessions, hit improvement milestones, and maintain practice streaks 
            to unlock achievements that celebrate your progress.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="font-semibold text-yellow-800 mb-2">Coming up next:</div>
            <div className="text-sm text-yellow-700">
              Complete your first practice session to earn the "First Steps" badge and unlock 
              personalized coaching recommendations.
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </DialogTitle>
            <Badge variant="outline">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="mt-2" />
        </DialogHeader>

        <div className="py-6">
          <p className="text-lg text-gray-700 mb-6">
            {steps[currentStep].description}
          </p>
          
          {steps[currentStep].content}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps[currentStep].action && (
              <Button
                variant="outline"
                onClick={steps[currentStep].action!.onClick}
              >
                {steps[currentStep].action!.text}
              </Button>
            )}
            
            <Button onClick={nextStep}>
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onComplete}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip tutorial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}