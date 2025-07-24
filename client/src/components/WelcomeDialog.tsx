import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MessageCircle, BarChart3, BookOpen, Target } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function WelcomeDialog({ isOpen, onClose, userName }: WelcomeDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const queryClient = useQueryClient();

  const markWelcomeComplete = useMutation({
    mutationFn: () => apiRequest('/api/user/welcome-complete', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onClose();
    }
  });

  const steps = [
    {
      title: "Welcome to Yappyy!",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900">
            Hi {userName || 'there'}! Welcome to your speaking journey
          </h3>
          <p className="text-gray-600 text-lg">
            You're about to transform your communication skills with AI-powered coaching
          </p>
        </div>
      )
    },
    {
      title: "What Makes Yappyy Special",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-2 border-blue-100">
            <CardContent className="p-4 text-center">
              <Mic className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Real-Time Analysis</h4>
              <p className="text-sm text-gray-600">Get instant feedback as you speak</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-100">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">AI Coach</h4>
              <p className="text-sm text-gray-600">Personal coaching that learns from you</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-100">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
              <p className="text-sm text-gray-600">See your improvement over time</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-100">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Templates</h4>
              <p className="text-sm text-gray-600">Practice with professional scenarios</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Your Fresh Start",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Session 1 Awaits!</h3>
            <p className="text-gray-600 mb-4">
              You're starting completely fresh with a clean slate. Every great speaker started with their first session.
            </p>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              New User • Session 1 Ready
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            🎯 Your personalized AI coach will learn your speaking style and provide tailored feedback as you practice
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markWelcomeComplete.mutate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {steps[currentStep].content}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={markWelcomeComplete.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Start My Journey'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}