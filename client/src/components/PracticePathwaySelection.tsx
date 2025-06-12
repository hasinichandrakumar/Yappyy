import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  GraduationCap, 
  Volume2, 
  Clock, 
  Mic,
  HeadphonesIcon,
  Flame,
  FileText,
  Timer
} from "lucide-react";

interface PracticeGoal {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  duration: string;
}

interface AdvancedOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

interface PracticePathwaySelectionProps {
  onGoalSelect: (goal: PracticeGoal) => void;
  onOptionsChange: (options: Record<string, boolean>) => void;
}

export default function PracticePathwaySelection({ onGoalSelect, onOptionsChange }: PracticePathwaySelectionProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOption[]>([
    {
      id: "realtime-feedback",
      label: "Real-time feedback",
      icon: <Mic className="w-4 h-4" />,
      description: "Get instant coaching while you speak",
      enabled: true
    },
    {
      id: "noise-filter",
      label: "Background noise filter",
      icon: <HeadphonesIcon className="w-4 h-4" />,
      description: "Filter out background noise for clearer analysis",
      enabled: false
    },
    {
      id: "confidence-scoring",
      label: "Confidence scoring",
      icon: <Flame className="w-4 h-4" />,
      description: "Track your confidence levels in real-time",
      enabled: true
    },
    {
      id: "transcript-generation",
      label: "Transcript generation",
      icon: <FileText className="w-4 h-4" />,
      description: "Generate live transcripts of your speech",
      enabled: true
    },
    {
      id: "timer-countdown",
      label: "Timer / countdown",
      icon: <Timer className="w-4 h-4" />,
      description: "Set time limits for focused practice",
      enabled: false
    }
  ]);

  const practiceGoals: PracticeGoal[] = [
    {
      id: "impromptu",
      name: "Impromptu Speaking",
      icon: <Target className="w-5 h-5" />,
      description: "Practice thinking on your feet with random prompts",
      duration: "5-15 min"
    },
    {
      id: "filler-elimination",
      name: "Filler Word Elimination",
      icon: <Brain className="w-5 h-5" />,
      description: "Reduce 'um', 'uh', 'like' and other filler words",
      duration: "10-20 min"
    },
    {
      id: "memorized-speech",
      name: "Memorized Speech",
      icon: <Brain className="w-5 h-5" />,
      description: "Perfect your prepared presentation or speech",
      duration: "15-30 min"
    },
    {
      id: "conversation-practice",
      name: "Conversation / Interview Practice",
      icon: <MessageCircle className="w-5 h-5" />,
      description: "Simulate interviews and professional conversations",
      duration: "10-25 min"
    },
    {
      id: "ted-simulation",
      name: "TED Talk Simulation",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Practice delivering compelling presentations",
      duration: "18-20 min"
    },
    {
      id: "classroom-presentation",
      name: "Classroom Presentation",
      icon: <GraduationCap className="w-5 h-5" />,
      description: "Prepare for academic presentations and reports",
      duration: "5-15 min"
    },
    {
      id: "voice-projection",
      name: "Voice Projection",
      icon: <Volume2 className="w-5 h-5" />,
      description: "Improve volume, clarity, and vocal presence",
      duration: "10-15 min"
    },
    {
      id: "time-crunch",
      name: "Time Crunch Drill",
      icon: <Clock className="w-5 h-5" />,
      description: "Quick practice sessions for busy schedules",
      duration: "1-3 min"
    }
  ];

  const handleGoalSelect = (goal: PracticeGoal) => {
    setSelectedGoal(goal.id);
    onGoalSelect(goal);
  };

  const handleOptionToggle = (optionId: string) => {
    setAdvancedOptions(prev => {
      const updated = prev.map(option => 
        option.id === optionId 
          ? { ...option, enabled: !option.enabled }
          : option
      );
      
      const optionsObject = updated.reduce((acc, option) => ({
        ...acc,
        [option.id]: option.enabled
      }), {});
      
      onOptionsChange(optionsObject);
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What's your goal today?</h2>
        <p className="text-lg text-gray-600">Choose a practice goal to get started with personalized coaching</p>
      </div>

      {/* Practice Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {practiceGoals.map((goal) => (
          <Card 
            key={goal.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedGoal === goal.id 
                ? 'ring-2 ring-cyan-500 bg-cyan-50 border-cyan-200' 
                : 'hover:border-cyan-300'
            }`}
            onClick={() => handleGoalSelect(goal)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    selectedGoal === goal.id 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {goal.icon}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {goal.duration}
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold leading-tight">
                {goal.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 leading-relaxed">
                {goal.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Advanced Options</span>
            <Badge variant="outline">Customize Experience</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <div className="flex items-center space-x-2 mt-1">
                  <Switch
                    id={option.id}
                    checked={option.enabled}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                  />
                  <div className="p-1 bg-gray-100 rounded">
                    {option.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <Label 
                    htmlFor={option.id} 
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      {selectedGoal && (
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Start Practice Session
            <Target className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}