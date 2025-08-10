import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Trophy, Crown, Award, CalendarDays, RefreshCw } from 'lucide-react';

type Leader = {
  id: string;
  name: string;
  points: number;
  streak: number;
};

const STORAGE_KEYS = {
  lastDate: 'practiceStreak.lastDate',
  current: 'practiceStreak.current',
  best: 'practiceStreak.best',
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

export default function PerformanceSimple() {
  const [currentStreak, setCurrentStreak] = useState<number>(Number(localStorage.getItem(STORAGE_KEYS.current)) || 0);
  const [bestStreak, setBestStreak] = useState<number>(Number(localStorage.getItem(STORAGE_KEYS.best)) || 0);
  const [lastDate, setLastDate] = useState<string>(localStorage.getItem(STORAGE_KEYS.lastDate) || '');
  const [todayMarked, setTodayMarked] = useState<boolean>(false);

  // Ensure today status derived from stored date
  useEffect(() => {
    const today = getTodayISO();
    setTodayMarked(lastDate === today);
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

  // Lightweight local leaderboard (mock). In a real app, fetch from backend
  const leaderboard: Leader[] = useMemo(() => {
    const me: Leader = { id: 'me', name: 'You', points: (bestStreak || 0) * 10 + (currentStreak || 0), streak: currentStreak || 0 };
    const seeds: Leader[] = [
      { id: 'l1', name: 'Alex', points: 140, streak: 7 },
      { id: 'l2', name: 'Sam', points: 120, streak: 6 },
      { id: 'l3', name: 'Jordan', points: 110, streak: 5 },
      { id: 'l4', name: 'Taylor', points: 90, streak: 3 },
    ];
    const merged = [me, ...seeds];
    return merged.sort((a, b) => b.points - a.points).slice(0, 10);
  }, [bestStreak, currentStreak]);

  const myRank = leaderboard.findIndex(l => l.id === 'me') + 1;

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
              <Award className="w-5 h-5 text-yellow-500" />
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

      {/* Leaderboard */}
      <Card className="border border-purple-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-purple-600" />
            Leaderboard
            <span className="ml-auto text-sm text-gray-500">Your rank: {myRank > 0 ? `#${myRank}` : '—'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {leaderboard.map((u, idx) => (
              <div key={u.id} className={`flex items-center py-3 ${u.id === 'me' ? 'bg-blue-50/60 rounded-lg px-3 -mx-3' : ''}`}>
                <div className="w-10 text-center mr-3">
                  {idx < 3 ? (
                    <Crown className={`w-5 h-5 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-amber-700'}`} />
                  ) : (
                    <span className="text-sm text-gray-500">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 font-medium text-gray-800">{u.name}</div>
                <div className="w-28 text-right">
                  <span className="text-sm text-gray-600">Streak</span>
                  <div className="text-base font-semibold">{u.streak}d</div>
                </div>
                <div className="w-28 text-right">
                  <span className="text-sm text-gray-600">Points</span>
                  <div className="text-base font-semibold">{u.points}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



