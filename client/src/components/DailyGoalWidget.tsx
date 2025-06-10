import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Flame, 
  Trophy, 
  Clock, 
  Zap, 
  CheckCircle, 
  Star, 
  TrendingUp,
  PlayCircle,
  Brain,
  Mic,
  Eye,
  ArrowRight
} from "lucide-react";

interface DailyGoal {
  id: string;
  type: 'practice' | 'improvement' | 'challenge' | 'streak';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  yapX: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'voice' | 'body' | 'content' | 'confidence';
  timeEstimate: string;
  motivationalMessage: string;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
}

interface StreakInfo {
  current: number;
  best: number;
  lastActivity: Date | null;
}

export default function DailyGoalWidget() {
  const [selectedGoal, setSelectedGoal] = useState<DailyGoal | null>(null);
  const queryClient = useQueryClient();

  // Fetch daily goals from API
  const { data: dailyGoals = [] } = useQuery({
    queryKey: ['/api/user/daily-goals'],
  });

  // Fetch user streaks
  const { data: streaks = [] } = useQuery({
    queryKey: ['/api/user/streaks'],
  });

  // Complete goal mutation
  const completeGoalMutation = useMutation({
    mutationFn: async (goalId: number) => {
      const response = await fetch(`/api/user/daily-goals/${goalId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetValue: 100 })
      });
      if (!response.ok) throw new Error('Failed to complete goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/daily-goals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/streaks'] });
    }
  });

  const getStreakInfo = () => {
    const practiceStreak = (streaks as any[]).find((s: any) => s.streakType === 'practice');
    return {
      current: practiceStreak?.currentStreak || 0,
      best: practiceStreak?.longestStreak || 0,
      lastActivity: practiceStreak?.lastActivityDate ? new Date(practiceStreak.lastActivityDate) : null
    };
  };

  const mapGoalData = (apiGoal: any): DailyGoal => ({
    id: apiGoal.id.toString(),
    type: apiGoal.goalType,
    title: apiGoal.title,
    description: apiGoal.description,
    target: apiGoal.targetValue,
    current: apiGoal.currentValue,
    unit: apiGoal.unit,
    points: apiGoal.points,
    difficulty: apiGoal.difficulty,
    category: apiGoal.category,
    timeEstimate: getTimeEstimate(apiGoal.difficulty),
    motivationalMessage: getMotivationalMessage(apiGoal.category),
    icon: getCategoryIcon(apiGoal.category),
    color: getCategoryColor(apiGoal.category),
    completed: apiGoal.isCompleted
  });

  const getTimeEstimate = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '5 min';
      case 'medium': return '10 min';
      case 'hard': return '15 min';
      default: return '5 min';
    }
  };

  const getMotivationalMessage = (category: string) => {
    const messages = {
      voice: 'Every word matters! Clear speech builds confidence.',
      body: 'Your presence speaks before you do!',
      content: 'Stories stick! Make yours unforgettable.',
      confidence: 'Small steps, big progress! Keep going!'
    };
    return messages[category as keyof typeof messages] || 'You\'ve got this!';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'voice': return <Mic className="w-6 h-6" />;
      case 'body': return <Eye className="w-6 h-6" />;
      case 'content': return <Brain className="w-6 h-6" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'voice': return 'bg-blue-500';
      case 'body': return 'bg-green-500';
      case 'content': return 'bg-orange-500';
      default: return 'bg-purple-500';
    }
  };

  const mappedGoals = (dailyGoals as any[]).map(mapGoalData);
  const streak = getStreakInfo();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletedGoals = () => mappedGoals.filter(goal => goal.completed).length;
  const getTotalPoints = () => mappedGoals.filter(goal => goal.completed).reduce((sum, goal) => sum + goal.points, 0);

  return (
    <div className="space-y-6">
      {/* Streak and Progress Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="text-xl font-bold text-orange-900">{streak.current} days</div>
                  <div className="text-sm text-orange-700">Current Streak</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className="text-xl font-bold text-yellow-900">{getTotalPoints()}</div>
                  <div className="text-sm text-yellow-700">Points Today</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {getCompletedGoals()}/{mappedGoals.length}
              </div>
              <div className="text-sm text-gray-600">Goals Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals */}
      <div className="grid gap-4 md:grid-cols-2">
        {mappedGoals.map((goal) => (
          <Card 
            key={goal.id} 
            className={`transition-all duration-300 hover:shadow-lg ${
              goal.completed ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${goal.color} text-white`}>
                    {goal.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getDifficultyColor(goal.difficulty)}>
                        {goal.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">{goal.timeEstimate}</span>
                    </div>
                  </div>
                </div>
                {goal.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600">{goal.description}</p>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.current}/{goal.target} {goal.unit}</span>
                </div>
                <Progress 
                  value={(goal.current / goal.target) * 100} 
                  className="h-2"
                />
              </div>

              {/* Motivational Message */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  💡 {goal.motivationalMessage}
                </p>
              </div>

              {/* Action Button */}
              {!goal.completed ? (
                <Button 
                  onClick={() => setSelectedGoal(goal)}
                  className="w-full"
                  variant={goal.difficulty === 'hard' ? 'default' : 'outline'}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start {goal.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex items-center justify-center py-2 text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Completed! +{goal.points} points</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Encouragement Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="py-6">
          <div className="text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              {getCompletedGoals() === mappedGoals.length 
                ? "Amazing! All goals completed!" 
                : getCompletedGoals() > 0 
                  ? "Great progress! Keep it up!" 
                  : "Ready to level up your speaking skills?"}
            </h3>
            <p className="text-purple-700 text-sm">
              {getCompletedGoals() === mappedGoals.length 
                ? "You're building unstoppable speaking confidence!" 
                : "Each practice session brings you closer to mastery."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Practice Launcher */}
      {selectedGoal && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">Ready to tackle: {selectedGoal.title}?</h4>
                <p className="text-sm text-blue-700">Estimated time: {selectedGoal.timeEstimate}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedGoal(null)}
                >
                  Later
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    const practiceTab = document.querySelector('[data-value="practice"]') as HTMLElement;
                    practiceTab?.click();
                    completeGoalMutation.mutate(parseInt(selectedGoal.id));
                    setSelectedGoal(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}