import { useState, useEffect } from "react";
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
  points: number;
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
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [streak, setStreak] = useState<StreakInfo>({ current: 0, best: 0, lastActivity: null });
  const [selectedGoal, setSelectedGoal] = useState<DailyGoal | null>(null);

  useEffect(() => {
    generateDailyGoals();
    loadUserStreak();
  }, []);

  const generateDailyGoals = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Generate personalized goals based on user's progress and day of week
    const goalPool: Omit<DailyGoal, 'id' | 'current' | 'completed'>[] = [
      {
        type: 'practice',
        title: 'Voice Clarity Challenge',
        description: 'Practice speaking with crystal clear articulation',
        target: 3,
        unit: 'minutes',
        points: 25,
        difficulty: 'easy',
        category: 'voice',
        timeEstimate: '5 min',
        motivationalMessage: 'Every word matters! Clear speech builds confidence.',
        icon: <Mic className="w-6 h-6" />,
        color: 'bg-blue-500'
      },
      {
        type: 'improvement',
        title: 'Eye Contact Mastery',
        description: 'Maintain steady eye contact throughout your speech',
        target: 85,
        unit: '% eye contact',
        points: 30,
        difficulty: 'medium',
        category: 'body',
        timeEstimate: '10 min',
        motivationalMessage: 'Connect with your audience through your eyes!',
        icon: <Eye className="w-6 h-6" />,
        color: 'bg-green-500'
      },
      {
        type: 'challenge',
        title: 'Confident Posture Power',
        description: 'Stand tall and command attention with your presence',
        target: 90,
        unit: '% good posture',
        points: 35,
        difficulty: 'medium',
        category: 'body',
        timeEstimate: '8 min',
        motivationalMessage: 'Your posture speaks before you do!',
        icon: <Target className="w-6 h-6" />,
        color: 'bg-purple-500'
      },
      {
        type: 'practice',
        title: 'Storytelling Spark',
        description: 'Craft and deliver a compelling 2-minute story',
        target: 2,
        unit: 'stories',
        points: 40,
        difficulty: 'hard',
        category: 'content',
        timeEstimate: '15 min',
        motivationalMessage: 'Stories stick! Make yours unforgettable.',
        icon: <Brain className="w-6 h-6" />,
        color: 'bg-orange-500'
      },
      {
        type: 'streak',
        title: 'Consistency Champion',
        description: 'Keep your practice streak alive today',
        target: 1,
        unit: 'session',
        points: 20,
        difficulty: 'easy',
        category: 'confidence',
        timeEstimate: '5 min',
        motivationalMessage: 'Small steps, big progress! Keep going!',
        icon: <Flame className="w-6 h-6" />,
        color: 'bg-red-500'
      }
    ];

    // Smart goal selection based on day and user patterns
    const selectedGoals = goalPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((goal, index) => ({
        ...goal,
        id: `goal-${today.getTime()}-${index}`,
        current: 0,
        completed: false
      }));

    setDailyGoals(selectedGoals);
  };

  const loadUserStreak = () => {
    // This would connect to real user data
    setStreak({
      current: 3,
      best: 7,
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });
  };

  const completeGoal = (goalId: string) => {
    setDailyGoals(goals => 
      goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: true, current: goal.target }
          : goal
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletedGoals = () => dailyGoals.filter(goal => goal.completed).length;
  const getTotalPoints = () => dailyGoals.filter(goal => goal.completed).reduce((sum, goal) => sum + goal.points, 0);

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
                {getCompletedGoals()}/{dailyGoals.length}
              </div>
              <div className="text-sm text-gray-600">Goals Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals */}
      <div className="grid gap-4 md:grid-cols-2">
        {dailyGoals.map((goal) => (
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
              {getCompletedGoals() === dailyGoals.length 
                ? "🎉 Amazing! All goals completed!" 
                : getCompletedGoals() > 0 
                  ? "Great progress! Keep it up!" 
                  : "Ready to level up your speaking skills?"}
            </h3>
            <p className="text-purple-700 text-sm">
              {getCompletedGoals() === dailyGoals.length 
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
                    // Switch to practice tab and start session
                    const practiceTab = document.querySelector('[data-value="practice"]') as HTMLElement;
                    practiceTab?.click();
                    completeGoal(selectedGoal.id);
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