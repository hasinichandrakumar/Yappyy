import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Trophy, 
  Flame, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Crown,
  Shield,
  Timer,
  Zap,
  Gift,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface BadgeGoal {
  id: string;
  badgeName: string;
  badgeIcon: React.ReactNode;
  description: string;
  category: "daily" | "skill" | "milestone";
  currentProgress: number;
  targetProgress: number;
  progressLabel: string;
  timeEstimate: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  actionable: string;
  nextStep: string;
}

export default function PracticeGoalsWithBadges() {
  const [goals, setGoals] = useState<BadgeGoal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);
  
  const queryClient = useQueryClient();

  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-achievements'],
    enabled: true
  });

  const { data: practiceSessions } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  // Calculate personalized goals based on user progress
  useEffect(() => {
    if (practiceSessions && Array.isArray(practiceSessions)) {
      const sessionCount = practiceSessions.length;
      const recentScores = practiceSessions.slice(-5).map(s => s.overallScore || 0);
      const avgScore = recentScores.length > 0 ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length) : 0;
      
      // Calculate current streak
      const today = new Date();
      let currentStreak = 0;
      const sortedSessions = practiceSessions
        .map(s => new Date(s.createdAt))
        .sort((a, b) => b.getTime() - a.getTime());
      
      for (let i = 0; i < sortedSessions.length; i++) {
        const sessionDate = sortedSessions[i];
        const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === i) {
          currentStreak++;
        } else {
          break;
        }
      }

      const newGoals: BadgeGoal[] = [];

      // Goal 1: First Steps Badge (if not earned)
      if (sessionCount === 0) {
        newGoals.push({
          id: "first-speech",
          badgeName: "First Steps",
          badgeIcon: <Play className="h-5 w-5" />,
          description: "Complete your very first practice session to earn your first badge!",
          category: "daily",
          currentProgress: 0,
          targetProgress: 1,
          progressLabel: "sessions completed",
          timeEstimate: "5-10 minutes",
          difficulty: "Easy",
          points: 50,
          color: "text-green-600",
          gradientFrom: "from-green-400",
          gradientTo: "to-emerald-500",
          actionable: "Start a practice session now",
          nextStep: "Click 'Start Practice' and speak for 1-2 minutes on any topic"
        });
      }

      // Goal 2: Dedicated Speaker Badge
      if (sessionCount < 5) {
        newGoals.push({
          id: "dedicated-speaker",
          badgeName: "Dedicated Speaker",
          badgeIcon: <Target className="h-5 w-5" />,
          description: "Complete 5 practice sessions to show your dedication",
          category: "milestone",
          currentProgress: sessionCount,
          targetProgress: 5,
          progressLabel: "sessions completed",
          timeEstimate: "2-3 days",
          difficulty: "Easy",
          points: 150,
          color: "text-blue-600",
          gradientFrom: "from-blue-400",
          gradientTo: "to-indigo-500",
          actionable: `Complete ${5 - sessionCount} more sessions`,
          nextStep: "Practice once daily for consistent progress"
        });
      }

      // Goal 3: Consistency Champion Badge
      if (currentStreak < 3) {
        newGoals.push({
          id: "consistency-champion",
          badgeName: "Consistency Champion",
          badgeIcon: <Flame className="h-5 w-5" />,
          description: "Practice for 3 days in a row to build a strong habit",
          category: "daily",
          currentProgress: currentStreak,
          targetProgress: 3,
          progressLabel: "consecutive days",
          timeEstimate: "3 days",
          difficulty: "Medium",
          points: 250,
          color: "text-orange-600",
          gradientFrom: "from-orange-400",
          gradientTo: "to-red-500",
          actionable: currentStreak === 0 ? "Start your streak today" : "Continue your streak",
          nextStep: currentStreak === 0 ? "Practice today to begin your streak" : `Practice today to reach day ${currentStreak + 1}`
        });
      }

      // Goal 4: Confident Speaker Badge
      const maxConfidence = Math.max(...practiceSessions.map(s => s.confidenceScore || 0));
      if (maxConfidence < 80) {
        newGoals.push({
          id: "confident-speaker",
          badgeName: "Confident Speaker",
          badgeIcon: <Shield className="h-5 w-5" />,
          description: "Achieve 80% confidence score in any session",
          category: "skill",
          currentProgress: Math.round(maxConfidence),
          targetProgress: 80,
          progressLabel: "confidence score",
          timeEstimate: "1-2 weeks",
          difficulty: "Medium",
          points: 200,
          color: "text-teal-600",
          gradientFrom: "from-teal-400",
          gradientTo: "to-cyan-500",
          actionable: "Focus on confident delivery",
          nextStep: "Practice standing tall, speaking clearly, and maintaining eye contact"
        });
      }

      // Goal 5: Speech Master Badge
      if (sessionCount < 25) {
        newGoals.push({
          id: "speech-master",
          badgeName: "Speech Master",
          badgeIcon: <Crown className="h-5 w-5" />,
          description: "Complete 25 practice sessions to become a true speech master",
          category: "milestone",
          currentProgress: sessionCount,
          targetProgress: 25,
          progressLabel: "sessions completed",
          timeEstimate: "3-4 weeks",
          difficulty: "Hard",
          points: 500,
          color: "text-purple-600",
          gradientFrom: "from-purple-400",
          gradientTo: "to-pink-500",
          actionable: `Complete ${25 - sessionCount} more sessions`,
          nextStep: "Keep practicing regularly to reach master level"
        });
      }

      // Only show top 2-3 most relevant goals
      setGoals(newGoals.slice(0, 3));
    }
  }, [practiceSessions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleStartPractice = () => {
    // Trigger practice session start
    // This would integrate with the main practice interface
    window.dispatchEvent(new CustomEvent('startPracticeSession'));
  };

  if (goals.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Great job!</h3>
        <p className="text-gray-600">You've completed your current goals. Keep practicing to unlock new badges!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Your Badge Goals
        </h2>
        <p className="text-gray-600">Complete these goals to earn amazing badges and rewards!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
              {/* Priority indicator for first goal */}
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                  PRIORITY
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${goal.gradientFrom} ${goal.gradientTo} text-white`}>
                    {goal.badgeIcon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{goal.badgeName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getDifficultyColor(goal.difficulty)}>
                        {goal.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-purple-600">
                        <Star className="h-3 w-3" />
                        <span className="text-xs font-semibold">{goal.points} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{goal.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">
                      {goal.currentProgress} / {goal.targetProgress} {goal.progressLabel}
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(goal.currentProgress, goal.targetProgress)} 
                    className="h-3"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Next Step:</h4>
                  <p className="text-sm text-blue-700">{goal.nextStep}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Estimated time: {goal.timeEstimate}</span>
                  <div className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    <span>{goal.category}</span>
                  </div>
                </div>

                {/* Action button */}
                <Button 
                  onClick={handleStartPractice}
                  className={`w-full bg-gradient-to-r ${goal.gradientFrom} ${goal.gradientTo} hover:opacity-90 text-white font-medium`}
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {goal.actionable}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick tip */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <div>
              <h4 className="font-semibold text-purple-800">Pro Tip</h4>
              <p className="text-sm text-purple-700">
                Focus on your priority goal first - it's the quickest way to earn your next badge! 
                Consistent daily practice helps you progress faster than sporadic long sessions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}