import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Gift, 
  TrendingUp, 
  Calendar,
  Target,
  Flame,
  Coins,
  Award,
  ChevronUp
} from "lucide-react";

interface YapXLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  perks: string[];
  icon: React.ReactNode;
  color: string;
}

interface YapXStreak {
  current: number;
  longest: number;
  multiplier: number;
  nextMilestone: number;
}

interface YapXReward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'feature' | 'cosmetic' | 'boost' | 'unlock';
  icon: React.ReactNode;
  available: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  yapxReward: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function YapXGamification() {
  const [totalYapX, setTotalYapX] = useState(2847);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(847);
  const [dailyStreak, setDailyStreak] = useState(12);
  const [weeklyStreak, setWeeklyStreak] = useState(3);
  
  const levels: YapXLevel[] = [
    { level: 1, title: "Novice Speaker", minXP: 0, maxXP: 1000, perks: ["Basic feedback"], icon: <Star className="w-4 h-4" />, color: "text-gray-600" },
    { level: 2, title: "Rising Voice", minXP: 1000, maxXP: 2500, perks: ["Advanced metrics", "Custom themes"], icon: <TrendingUp className="w-4 h-4" />, color: "text-blue-600" },
    { level: 3, title: "Confident Orator", minXP: 2500, maxXP: 5000, perks: ["AI coach sessions", "Premium templates"], icon: <Trophy className="w-4 h-4" />, color: "text-purple-600" },
    { level: 4, title: "Master Presenter", minXP: 5000, maxXP: 10000, perks: ["Unlimited practice", "Competition access"], icon: <Crown className="w-4 h-4" />, color: "text-yellow-600" },
    { level: 5, title: "Speaking Legend", minXP: 10000, maxXP: 999999, perks: ["All features", "Exclusive content"], icon: <Award className="w-4 h-4" />, color: "text-gradient" }
  ];

  const currentLevelData = levels.find(l => currentXP >= l.minXP && currentXP < l.maxXP) || levels[0];
  const nextLevelData = levels.find(l => l.level === currentLevelData.level + 1);
  const progressToNext = nextLevelData ? ((currentXP - currentLevelData.minXP) / (nextLevelData.minXP - currentLevelData.minXP)) * 100 : 100;

  const streakData: YapXStreak = {
    current: dailyStreak,
    longest: 18,
    multiplier: Math.min(Math.floor(dailyStreak / 5) + 1, 5),
    nextMilestone: Math.ceil(dailyStreak / 5) * 5
  };

  const rewards: YapXReward[] = [
    { id: '1', name: 'Premium Voice Analysis', description: 'Unlock advanced vocal pattern detection', cost: 500, type: 'feature', icon: <Zap className="w-4 h-4" />, available: totalYapX >= 500 },
    { id: '2', name: 'Golden Theme', description: 'Exclusive golden dashboard theme', cost: 750, type: 'cosmetic', icon: <Crown className="w-4 h-4" />, available: totalYapX >= 750 },
    { id: '3', name: '2x YapX Boost', description: '24-hour double YapX earning', cost: 1000, type: 'boost', icon: <Gift className="w-4 h-4" />, available: totalYapX >= 1000 },
    { id: '4', name: 'AI Mentor Pro', description: 'Personal AI speaking coach', cost: 2000, type: 'unlock', icon: <Trophy className="w-4 h-4" />, available: totalYapX >= 2000 }
  ];

  const achievements: Achievement[] = [
    { id: '1', name: 'First Steps', description: 'Complete your first practice session', yapxReward: 100, unlocked: true, progress: 1, maxProgress: 1, icon: <Target className="w-4 h-4" />, rarity: 'common' },
    { id: '2', name: 'Streak Master', description: 'Maintain a 7-day practice streak', yapxReward: 500, unlocked: true, progress: 7, maxProgress: 7, icon: <Flame className="w-4 h-4" />, rarity: 'rare' },
    { id: '3', name: 'Voice Virtuoso', description: 'Achieve 95%+ voice clarity in 5 sessions', yapxReward: 750, unlocked: false, progress: 3, maxProgress: 5, icon: <Star className="w-4 h-4" />, rarity: 'epic' },
    { id: '4', name: 'Presentation Legend', description: 'Complete 100 practice sessions', yapxReward: 2000, unlocked: false, progress: 47, maxProgress: 100, icon: <Crown className="w-4 h-4" />, rarity: 'legendary' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const earnYapX = (amount: number, reason: string) => {
    const multipliedAmount = amount * streakData.multiplier;
    setTotalYapX(prev => prev + multipliedAmount);
    setCurrentXP(prev => prev + multipliedAmount);
    
    // Show earning animation/notification here
    console.log(`Earned ${multipliedAmount} YapX (${amount} x ${streakData.multiplier}) for: ${reason}`);
  };

  return (
    <div className="space-y-6">
      {/* YapX Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="w-6 h-6 text-yellow-600" />
              <span>YapX Dashboard</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{totalYapX.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total YapX</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={currentLevelData.color}>
                  {currentLevelData.icon}
                  <span className="ml-1">Level {currentLevelData.level}</span>
                </Badge>
                <span className="text-sm text-gray-600">{currentLevelData.title}</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <div className="text-xs text-gray-500">
                {nextLevelData ? `${nextLevelData.minXP - currentXP} XP to Level ${nextLevelData.level}` : 'Max Level Reached!'}
              </div>
            </div>

            {/* Streak Multiplier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">{dailyStreak} Day Streak</span>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {streakData.multiplier}x Multiplier
                </Badge>
              </div>
              <Progress value={(dailyStreak % 5) * 20} className="h-2" />
              <div className="text-xs text-gray-500">
                {streakData.nextMilestone - dailyStreak} days to next multiplier
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => earnYapX(50, "Daily bonus claimed")}
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim Daily Bonus (50 YapX)
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => earnYapX(25, "Practice session started")}
              >
                <Target className="w-4 h-4 mr-2" />
                Start Practice (+25 YapX)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YapX Store */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span>YapX Store</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {reward.icon}
                  </div>
                  <div>
                    <div className="font-medium">{reward.name}</div>
                    <div className="text-sm text-gray-600">{reward.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{reward.cost} YapX</div>
                  <Button 
                    size="sm" 
                    disabled={!reward.available}
                    className="mt-1"
                  >
                    {reward.available ? 'Purchase' : 'Locked'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`flex items-center justify-between p-3 border rounded-lg ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{achievement.name}</span>
                      <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                    {!achievement.unlocked && (
                      <div className="mt-1">
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                        <div className="text-xs text-gray-500 mt-1">
                          {achievement.progress} / {achievement.maxProgress}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">+{achievement.yapxReward} YapX</div>
                  {achievement.unlocked && (
                    <Badge variant="default" className="mt-1 bg-green-600">
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Level Perks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChevronUp className="w-5 h-5 text-blue-600" />
            <span>Level Perks & Progression</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {levels.map((level) => (
              <div key={level.level} className={`p-4 border rounded-lg text-center ${currentLevel >= level.level ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`text-2xl mb-2 ${level.color}`}>
                  {level.icon}
                </div>
                <div className="font-medium text-sm">{level.title}</div>
                <div className="text-xs text-gray-600 mb-2">Level {level.level}</div>
                <div className="space-y-1">
                  {level.perks.map((perk, idx) => (
                    <div key={idx} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                      {perk}
                    </div>
                  ))}
                </div>
                {currentLevel >= level.level && (
                  <Badge variant="default" className="mt-2 bg-green-600">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}