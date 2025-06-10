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
  ArrowRight,
  Sparkles
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
    yapX: apiGoal.points,
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
  const getTotalYapX = () => mappedGoals.filter(goal => goal.completed).reduce((sum, goal) => sum + goal.yapX, 0);

  return (
    <div className="space-y-6">
      {/* Enhanced Streak and Progress Header */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10"></div>
        <CardContent className="relative py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Streak Section */}
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-200/50">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg">
                <Flame className={`w-6 h-6 text-white ${streak.current > 0 ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {streak.current} days
                </div>
                <div className="text-sm font-medium text-orange-700">Current Streak</div>
                {streak.best > 0 && (
                  <div className="text-xs text-orange-600">Best: {streak.best} days</div>
                )}
              </div>
            </div>

            {/* YapX Section */}
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-yellow-200/50">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {getTotalYapX()}
                </div>
                <div className="text-sm font-medium text-yellow-700">YapX Today</div>
                <div className="text-xs text-yellow-600">Keep earning!</div>
              </div>
            </div>

            {/* Goals Progress Section */}
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/50">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {getCompletedGoals()}/{mappedGoals.length}
                  </div>
                  <div className="text-sm font-medium text-purple-700">Goals Complete</div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${mappedGoals.length > 0 ? (getCompletedGoals() / mappedGoals.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Daily Goals */}
      <div className="grid gap-6 md:grid-cols-2">
        {mappedGoals.map((goal) => (
          <Card 
            key={goal.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 ${
              goal.completed 
                ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-lg' 
                : 'bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 shadow-md'
            }`}
          >
            {goal.completed && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500 to-emerald-500 transform rotate-45 translate-x-8 -translate-y-8">
                <CheckCircle className="absolute bottom-2 left-2 w-4 h-4 text-white transform -rotate-45" />
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`relative p-3 rounded-xl shadow-lg ${
                    goal.completed 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                      : goal.color.replace('bg-', 'bg-gradient-to-br from-').replace('-500', '-500 to-' + goal.color.replace('bg-', '').replace('-500', '-600'))
                  } text-white`}>
                    {goal.icon}
                    {goal.completed && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className={`text-lg font-semibold ${
                      goal.completed ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {goal.title}
                    </CardTitle>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`${getDifficultyColor(goal.difficulty)} border-0 font-medium`}
                      >
                        {goal.difficulty.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm font-medium">{goal.timeEstimate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <p className={`text-sm leading-relaxed ${
                goal.completed ? 'text-green-700' : 'text-gray-600'
              }`}>
                {goal.description}
              </p>
              
              {/* Enhanced Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-800">
                      {goal.current}/{goal.target}
                    </span>
                    <span className="text-xs text-gray-500">{goal.unit}</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        goal.completed 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    >
                      <div className="w-full h-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Motivational Message */}
              <div className={`p-4 rounded-xl border-l-4 ${
                goal.completed 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400'
              }`}>
                <div className="flex items-start space-x-2">
                  <Sparkles className={`w-4 h-4 mt-0.5 ${
                    goal.completed ? 'text-green-600' : 'text-blue-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    goal.completed ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {goal.motivationalMessage}
                  </p>
                </div>
              </div>

              {/* Enhanced Action Button */}
              {!goal.completed ? (
                <Button 
                  onClick={() => setSelectedGoal(goal)}
                  className={`w-full h-12 group relative overflow-hidden transition-all duration-300 ${
                    goal.difficulty === 'hard' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl' 
                      : goal.difficulty === 'medium'
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2 relative z-10">
                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Start {goal.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Button>
              ) : (
                <div className="flex items-center justify-center py-3 px-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Goal completed</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Encouragement Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-50 to-cyan-100 border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10"></div>
        <CardContent className="relative py-8">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shadow-lg mx-auto w-fit">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {getCompletedGoals() === mappedGoals.length 
                  ? "Amazing! All goals completed!" 
                  : getCompletedGoals() > 0 
                    ? "Great progress! Keep it up!" 
                    : "Ready to level up your speaking skills?"}
              </h3>
              <p className="text-blue-700 font-medium max-w-md mx-auto">
                {getCompletedGoals() === mappedGoals.length 
                  ? "You're building unstoppable speaking confidence! Your dedication is truly inspiring." 
                  : "Each practice session brings you closer to mastery. Consistency creates champions."}
              </p>
            </div>

            {getCompletedGoals() === mappedGoals.length && (
              <div className="flex items-center justify-center space-x-4 pt-2">
                <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 rounded-full">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">Perfect Day!</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-full">
                  <Flame className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Streak Active</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Practice Launcher */}
      {selectedGoal && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10"></div>
          <CardContent className="relative py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ready to tackle: {selectedGoal.title}?
                  </h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-blue-700">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{selectedGoal.timeEstimate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-purple-700">
                      <Trophy className="w-4 h-4" />
                      <span className="font-medium">+{selectedGoal.yapX} YapX</span>
                    </div>
                    <Badge className={`${getDifficultyColor(selectedGoal.difficulty)} border-0`}>
                      {selectedGoal.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 max-w-md">
                    {selectedGoal.motivationalMessage}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedGoal(null)}
                  className="group relative overflow-hidden border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  <span className="relative z-10">Maybe Later</span>
                  <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Button>
                <Button 
                  onClick={() => {
                    const practiceTab = document.querySelector('[data-value="overview"]') as HTMLElement;
                    practiceTab?.click();
                    setTimeout(() => {
                      const practiceSection = document.querySelector('[data-practice-section]');
                      practiceSection?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                    completeGoalMutation.mutate(parseInt(selectedGoal.id));
                    setSelectedGoal(null);
                  }}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center space-x-2 relative z-10">
                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Start Practice Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}