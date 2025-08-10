import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, CalendarDays, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const STORAGE_KEYS = {
  lastDate: 'practiceStreak.lastDate',
  current: 'practiceStreak.current',
  best: 'practiceStreak.best',
  dailyGoal1: 'dailyGoals.goal1',
  dailyGoal2: 'dailyGoals.goal2',
  dailyGoal1Progress: 'dailyGoals.goal1Progress',
  dailyGoal2Progress: 'dailyGoals.goal2Progress',
};

function getTodayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getYesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
}

export default function PerformanceSimple() {
  const [currentStreak, setCurrentStreak] = useState<number>(Number(localStorage.getItem(STORAGE_KEYS.current)) || 0);
  const [bestStreak, setBestStreak] = useState<number>(Number(localStorage.getItem(STORAGE_KEYS.best)) || 0);
  const [lastDate, setLastDate] = useState<string>(localStorage.getItem(STORAGE_KEYS.lastDate) || '');
  const [todayMarked, setTodayMarked] = useState<boolean>(false);

  // Daily Goals State
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
    {
      id: 'practice-sessions',
      title: 'Practice Sessions',
      description: 'Complete practice sessions today',
      target: 3,
      current: Number(localStorage.getItem(STORAGE_KEYS.dailyGoal1Progress)) || 0,
      unit: 'sessions',
      icon: <Target className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'practice-minutes',
      title: 'Practice Time',
      description: 'Total minutes of practice today',
      target: 15,
      current: Number(localStorage.getItem(STORAGE_KEYS.dailyGoal2Progress)) || 0,
      unit: 'minutes',
      icon: <Clock className="w-5 h-5 text-green-500" />
    }
  ]);

  // Ensure today status derived from stored date
  useEffect(() => {
    const today = getTodayISO();
    setTodayMarked(lastDate === today);
    
    // Check if it's a new day and reset daily goals
    const lastGoalDate = localStorage.getItem('dailyGoals.lastDate');
    if (lastGoalDate !== today) {
      // Reset daily goals for new day
      setDailyGoals(prev => prev.map(goal => ({ ...goal, current: 0 })));
      localStorage.setItem('dailyGoals.lastDate', today);
      localStorage.setItem(STORAGE_KEYS.dailyGoal1Progress, '0');
      localStorage.setItem(STORAGE_KEYS.dailyGoal2Progress, '0');
    }
  }, [lastDate]);

  function markTodayPracticed(): void {
    const today = getTodayISO();
    const yesterday = getYesterdayISO();

    let nextStreak = 1;
    if (lastDate === today) {
      // already counted
      nextStreak = currentStreak || 1;
    } else if (lastDate === yesterday) {
      nextStreak = (currentStreak || 0) + 1;
    } else {
      nextStreak = 1;
    }

    const nextBest = Math.max(bestStreak || 0, nextStreak);
    setCurrentStreak(nextStreak);
    setBestStreak(nextBest);
    setLastDate(today);
    setTodayMarked(true);

    localStorage.setItem(STORAGE_KEYS.current, String(nextStreak));
    localStorage.setItem(STORAGE_KEYS.best, String(nextBest));
    localStorage.setItem(STORAGE_KEYS.lastDate, today);

    // Update practice sessions goal
    updateGoalProgress('practice-sessions', 1);
  }

  function resetStreaks(): void {
    setCurrentStreak(0);
    setBestStreak(0);
    setLastDate('');
    setTodayMarked(false);
    localStorage.removeItem(STORAGE_KEYS.current);
    localStorage.removeItem(STORAGE_KEYS.best);
    localStorage.removeItem(STORAGE_KEYS.lastDate);
  }

  function updateGoalProgress(goalId: string, increment: number): void {
    setDailyGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.target, goal.current + increment);
        // Save to localStorage
        const storageKey = goalId === 'practice-sessions' ? STORAGE_KEYS.dailyGoal1Progress : STORAGE_KEYS.dailyGoal2Progress;
        localStorage.setItem(storageKey, String(newCurrent));
        return { ...goal, current: newCurrent };
      }
      return goal;
    }));
  }

  function getGoalProgress(goal: DailyGoal): number {
    return Math.min(100, (goal.current / goal.target) * 100);
  }

  function isGoalCompleted(goal: DailyGoal): boolean {
    return goal.current >= goal.target;
  }

  return (
    <div className="space-y-6">
      {/* Streak & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border border-blue-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-orange-500" />
              Practice Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">{currentStreak} days</div>
                <div className="text-sm text-gray-500">Best streak: <span className="font-semibold text-gray-700">{bestStreak} days</span></div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1"><CalendarDays className="w-3 h-3" /> Last check-in: {lastDate || '—'}</div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={markTodayPracticed} disabled={todayMarked} className="bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 text-white shadow-md">
                  {todayMarked ? 'Logged for Today' : 'Log Practice Today'}
                </Button>
                <Button variant="outline" onClick={resetStreaks} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-yellow-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-yellow-500" />
              Quick Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>+5 pts: Complete a 5‑minute practice</li>
              <li>+10 pts: Hit 0 fillers in one session</li>
              <li>+15 pts: Maintain 3‑day streak</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goals - Replacing Leaderboard */}
      <Card className="border border-green-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-green-600" />
            Daily Goals
            <span className="ml-auto text-sm text-gray-500">
              {dailyGoals.filter(isGoalCompleted).length} of {dailyGoals.length} completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyGoals.map((goal) => (
              <div
                key={goal.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isGoalCompleted(goal) 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {goal.icon}
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isGoalCompleted(goal) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={getGoalProgress(goal)} 
                    className={`h-2 ${isGoalCompleted(goal) ? 'bg-green-100' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round(getGoalProgress(goal))}% complete</span>
                    <span>
                      {goal.target - goal.current > 0 
                        ? `${goal.target - goal.current} ${goal.unit} remaining`
                        : 'Goal achieved! 🎉'
                      }
                    </span>
                  </div>
                </div>

                {!isGoalCompleted(goal) && (
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateGoalProgress(goal.id, 1)}
                      className="text-xs"
                    >
                      +1 {goal.unit}
                    </Button>
                    {goal.id === 'practice-minutes' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, 5)}
                        className="text-xs"
                      >
                        +5 minutes
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}