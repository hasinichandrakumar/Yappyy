import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Zap, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ReturningUserWelcomeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DailyGoal {
  id: number;
  userId: string;
  goalType: string;
  targetValue: number;
  currentProgress: number;
  description: string;
  isCompleted: boolean;
  date: string;
}

interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  averageConfidence: number;
}

export default function ReturningUserWelcome({ isOpen, onClose }: ReturningUserWelcomeProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: dailyGoals = [], isLoading } = useQuery<DailyGoal[]>({
    queryKey: ['/api/daily-goals'],
    enabled: isOpen
  });

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ['/api/user/stats'],
    enabled: isOpen
  });

  const markWelcomeShown = useMutation({
    mutationFn: () => apiRequest('/api/user/welcome-complete', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/info'] });
      onClose();
    }
  });

  const updateGoalProgress = useMutation({
    mutationFn: ({ goalId, progress }: { goalId: number; progress: number }) =>
      apiRequest(`/api/daily-goals/${goalId}/progress`, 'PATCH', { progress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-goals'] });
    }
  });

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-purple-500";
  };

  const formatGoalType = (goalType: string) => {
    switch (goalType) {
      case 'practice_sessions': return '🎤 Practice Sessions';
      case 'speaking_minutes': return '⏱️ Speaking Minutes';
      case 'confidence_improvement': return '💪 Confidence Boost';
      case 'filler_reduction': return '🎯 Reduce Filler Words';
      default: return goalType;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl font-bold">
            <Trophy className="h-7 w-7 text-purple-600" />
            <span className="font-extrabold text-gray-900">Welcome Back, {user?.name}!</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Stats Summary */}
          {userStats && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-extrabold text-purple-600">
                      {userStats.totalSessions || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Total Sessions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-blue-600">
                      {userStats.totalMinutes || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Minutes Practiced</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-green-600">
                      {userStats.currentStreak || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Today's Goals */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <Target className="h-6 w-6 text-purple-600 mr-2" />
              <span className="font-extrabold">Today's Goals</span>
            </h3>
            
            {isLoading ? (
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center text-gray-500">Loading your goals...</div>
                </CardContent>
              </Card>
            ) : dailyGoals && dailyGoals.length > 0 ? (
              <div className="space-y-3">
                {dailyGoals.slice(0, 2).map((goal) => {
                  const progress = (goal.currentProgress / goal.targetValue) * 100;
                  const isCompleted = goal.currentProgress >= goal.targetValue;
                  
                  return (
                    <Card key={goal.id} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {formatGoalType(goal.goalType)}
                              </span>
                              {isCompleted && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {goal.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {goal.currentProgress} / {goal.targetValue}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Progress 
                            value={Math.min(progress, 100)} 
                            className={`h-2 ${getProgressColor(goal.currentProgress, goal.targetValue)}`}
                          />
                          <div className="text-xs text-gray-500">
                            {Math.round(progress)}% complete
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Your daily goals are being generated...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Motivation Message */}
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">
                    Ready to continue your speaking journey?
                  </p>
                  <p className="text-sm text-purple-700">
                    Your AI coach has been learning from your previous sessions and is excited to help you improve even more today!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            onClick={() => markWelcomeShown.mutate()}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={markWelcomeShown.isPending}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Continue Your Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}