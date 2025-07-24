import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, BarChart3, Trophy, Mic2, Camera, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface WelcomeMessageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeMessage({ isOpen, onClose }: WelcomeMessageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const markWelcomeShown = useMutation({
    mutationFn: () => apiRequest('/api/user/welcome-complete', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onClose();
    },
    onError: () => {
      // For guests, just close the welcome without marking as shown
      onClose();
    }
  });

  const welcomeSteps = [
    {
      title: "Welcome to Yappyy!",
      icon: <Sparkles className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name || user?.username}!
          </h2>
          <p className="text-gray-600 text-lg">
            You're about to embark on an amazing journey to become a world-class speaker with your personal AI coach.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800 font-medium">
              Fresh Start: You're starting from Session 1 with your own personalized AI deep learning system!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Your Personal AI Coach",
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <div className="text-center text-4xl">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            Meet Your AI Deep Learning Coach
          </h3>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">Neural network that learns YOUR speaking patterns</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Personalized feedback based on your progress</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800">Real-time analysis and coaching suggestions</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Advanced Features",
      icon: <Camera className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <div className="text-center text-4xl">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            Cutting-Edge Technology
          </h3>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Camera className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800">Video recording with full-body analysis</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
              <Mic2 className="h-5 w-5 text-indigo-600" />
              <span className="text-indigo-800">Advanced vocal filler detection</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
              <Trophy className="h-5 w-5 text-pink-600" />
              <span className="text-pink-800">Gamified achievement system</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Let's Get Started!",
      icon: <Trophy className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to Begin?
          </h2>
          <p className="text-gray-600 text-lg">
            Your AI coach is excited to start learning about your unique speaking style and help you achieve your goals.
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
            <p className="text-purple-800 font-medium">
              💡 Tip: The more you practice, the smarter your AI coach becomes at helping you improve!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = welcomeSteps[currentStep];
  const isLastStep = currentStep === welcomeSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      markWelcomeShown.mutate();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {currentStepData.icon}
            <span>{currentStepData.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2">
            {welcomeSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              {currentStepData.content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLastStep ? "Start My Journey!" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}