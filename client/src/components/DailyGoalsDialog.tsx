import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Clock, Award, CheckCircle2, ArrowRight } from "lucide-react";

interface DailyGoal {
  id: number;
  goalType: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  points: number;
  difficulty: string;
  category: string;
  isCompleted: boolean;
}

interface DailyGoalsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goals: DailyGoal[];
  userName?: string;
  sessionCount?: number;
}

export function DailyGoalsDialog({ isOpen, onClose, goals, userName, sessionCount }: DailyGoalsDialogProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'practice': return Target;
      case 'voice': return Clock;
      case 'performance': return Award;
      default: return Target;
    }
  };

  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const totalPoints = goals.reduce((sum, goal) => sum + (goal.isCompleted ? goal.points : 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Welcome Back, {userName || 'Speaker'}! 🎯
              </div>
              <div className="text-sm text-gray-600 font-normal">
                Session {sessionCount || 0} completed • Ready for today's challenges
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Today's Progress</h3>
                  <p className="text-sm text-gray-600">
                    {completedGoals} of {goals.length} goals completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
                  <div className="text-xs text-gray-600">Points Earned</div>
                </div>
              </div>
              {goals.length > 0 && (
                <Progress 
                  value={(completedGoals / goals.length) * 100} 
                  className="mt-3 h-2"
                />
              )}
            </CardContent>
          </Card>

          {/* Daily Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Your Daily Goals
            </h3>
            
            {goals.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-600 mb-2">No Goals Today</h4>
                  <p className="text-sm text-gray-500">
                    Start practicing to unlock personalized daily goals!
                  </p>
                </CardContent>
              </Card>
            ) : (
              goals.map((goal) => {
                const IconComponent = getCategoryIcon(goal.category);
                const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                
                return (
                  <Card key={goal.id} className={`transition-all ${goal.isCompleted ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:border-blue-300'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${goal.isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                            {goal.isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900">{goal.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getDifficultyColor(goal.difficulty)}>
                            {goal.difficulty}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">+{goal.points}</div>
                            <div className="text-xs text-gray-500">points</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        {goal.isCompleted && (
                          <div className="flex items-center text-sm text-green-600 font-medium">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Completed! Great work!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {goals.some(g => !g.isCompleted) ? (
                <>
                  Start Practicing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Continue Your Journey'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}