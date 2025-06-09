import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, 
  Flame, 
  Clock, 
  TrendingUp,
  Calendar,
  Target,
  Coffee,
  Sun,
  Moon,
  Sunrise
} from "lucide-react";

interface WelcomeMessage {
  greeting: string;
  motivation: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  personalizedTip: string;
}

export default function WelcomeBackWidget() {
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage | null>(null);

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const { data: lastSession } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: !!user
  });

  useEffect(() => {
    if (user) {
      generateWelcomeMessage();
    }
  }, [user, lastSession]);

  const generateWelcomeMessage = () => {
    const now = new Date();
    const hour = now.getHours();
    const firstName = (user as any)?.firstName || 'there';
    
    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    let greeting: string;
    let motivation: string;

    // Determine time of day and personalized greeting
    if (hour < 12) {
      timeOfDay = 'morning';
      greeting = `Good morning, ${firstName}!`;
      motivation = "Start your day with confidence-building practice.";
    } else if (hour < 17) {
      timeOfDay = 'afternoon';
      greeting = `Good afternoon, ${firstName}!`;
      motivation = "Perfect time to sharpen your speaking skills.";
    } else {
      timeOfDay = 'evening';
      greeting = `Good evening, ${firstName}!`;
      motivation = "Wind down with some focused practice time.";
    }

    // Generate personalized tip based on user activity
    const tips = [
      "Focus on eye contact today - it builds instant connection.",
      "Try varying your pace - it keeps your audience engaged.",
      "Practice storytelling - people remember stories 22x better than facts.",
      "Work on your posture - confidence starts with how you stand.",
      "Use strategic pauses - they add power to your words."
    ];

    const personalizedTip = tips[Math.floor(Math.random() * tips.length)];

    setWelcomeMessage({
      greeting,
      motivation,
      timeOfDay,
      personalizedTip
    });
  };

  const getTimeIcon = () => {
    if (!welcomeMessage) return <Sun className="w-6 h-6" />;
    
    switch (welcomeMessage.timeOfDay) {
      case 'morning': return <Sunrise className="w-6 h-6 text-orange-500" />;
      case 'afternoon': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'evening': return <Moon className="w-6 h-6 text-purple-500" />;
      default: return <Sun className="w-6 h-6" />;
    }
  };

  const getTimeColor = () => {
    if (!welcomeMessage) return 'from-blue-50 to-cyan-50';
    
    switch (welcomeMessage.timeOfDay) {
      case 'morning': return 'from-orange-50 to-yellow-50';
      case 'afternoon': return 'from-yellow-50 to-orange-50';
      case 'evening': return 'from-purple-50 to-blue-50';
      default: return 'from-blue-50 to-cyan-50';
    }
  };

  const getDaysSinceLastSession = () => {
    if (!lastSession || !Array.isArray(lastSession) || lastSession.length === 0) {
      return null;
    }
    
    const lastSessionDate = new Date(lastSession[0].createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastSessionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getReturnMessage = () => {
    const daysSince = getDaysSinceLastSession();
    
    if (daysSince === null) {
      return "Ready to start your speaking journey?";
    } else if (daysSince === 1) {
      return "Welcome back! Great to see you practicing daily.";
    } else if (daysSince <= 3) {
      return `Welcome back! It's been ${daysSince} days since your last session.`;
    } else if (daysSince <= 7) {
      return `Good to see you again! Let's get back into your practice routine.`;
    } else {
      return `Welcome back! Ready to jump back into improving your speaking skills?`;
    }
  };

  if (!welcomeMessage || !user) return null;

  return (
    <Card className={`bg-gradient-to-r ${getTimeColor()} border-opacity-50`}>
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getTimeIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {welcomeMessage.greeting}
              </h2>
              <p className="text-gray-700 mt-1">
                {getReturnMessage()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Today's Focus</span>
          </div>
          <p className="text-sm text-gray-700">
            {welcomeMessage.personalizedTip}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {welcomeMessage.motivation}
          </div>
          
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              const practiceTab = document.querySelector('[data-value="practice"]') as HTMLElement;
              practiceTab?.click();
            }}
          >
            <Target className="w-4 h-4 mr-2" />
            Start Practicing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}