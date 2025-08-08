import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Star, Target, Mic, Volume2, Clock, Award, Zap, Crown, 
  Medal, Gift, Sparkles, TrendingUp, CheckCircle, Lock, Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'practice' | 'improvement' | 'consistency' | 'milestones' | 'special';
  criteria: {
    metric: string;
    target: number;
    current: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  earned: boolean;
  dateEarned?: string;
  unlockedBy?: string;
}

const BADGE_DEFINITIONS: Badge[] = [
  // Practice Badges
  {
    id: 'first-session',
    name: 'First Steps',
    description: 'Complete your first practice session',
    icon: Mic,
    category: 'practice',
    criteria: { metric: 'sessions_completed', target: 1, current: 0 },
    rarity: 'common',
    points: 10,
    earned: false
  },
  {
    id: 'session-warrior',
    name: 'Session Warrior',
    description: 'Complete 10 practice sessions',
    icon: Trophy,
    category: 'practice',
    criteria: { metric: 'sessions_completed', target: 10, current: 0 },
    rarity: 'rare',
    points: 50,
    earned: false
  },
  {
    id: 'marathon-speaker',
    name: 'Marathon Speaker',
    description: 'Practice for over 60 minutes total',
    icon: Clock,
    category: 'practice',
    criteria: { metric: 'total_practice_time', target: 3600, current: 0 },
    rarity: 'epic',
    points: 100,
    earned: false
  },

  // Improvement Badges
  {
    id: 'filler-fighter',
    name: 'Filler Fighter',
    description: 'Reduce filler words by 50% from your baseline',
    icon: Target,
    category: 'improvement',
    criteria: { metric: 'filler_reduction', target: 50, current: 0 },
    rarity: 'rare',
    points: 75,
    earned: false
  },
  {
    id: 'clarity-champion',
    name: 'Clarity Champion',
    description: 'Achieve 90% clarity score in a session',
    icon: Star,
    category: 'improvement',
    criteria: { metric: 'max_clarity_score', target: 90, current: 0 },
    rarity: 'epic',
    points: 100,
    earned: false
  },
  {
    id: 'volume-master',
    name: 'Volume Master',
    description: 'Maintain optimal volume throughout an entire session',
    icon: Volume2,
    category: 'improvement',
    criteria: { metric: 'volume_consistency', target: 95, current: 0 },
    rarity: 'rare',
    points: 60,
    earned: false
  },

  // Consistency Badges
  {
    id: 'daily-dedication',
    name: 'Daily Dedication',
    description: 'Practice for 7 consecutive days',
    icon: Flame,
    category: 'consistency',
    criteria: { metric: 'consecutive_days', target: 7, current: 0 },
    rarity: 'epic',
    points: 120,
    earned: false
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Complete your weekly practice goal 4 weeks in a row',
    icon: TrendingUp,
    category: 'consistency',
    criteria: { metric: 'weekly_goals_met', target: 4, current: 0 },
    rarity: 'legendary',
    points: 200,
    earned: false
  },

  // Milestone Badges
  {
    id: 'purpose-driven',
    name: 'Purpose Driven',
    description: 'Complete 5 sessions with clear purpose statements',
    icon: Zap,
    category: 'milestones',
    criteria: { metric: 'sessions_with_purpose', target: 5, current: 0 },
    rarity: 'rare',
    points: 80,
    earned: false
  },
  {
    id: 'feedback-champion',
    name: 'Feedback Champion',
    description: 'Receive 100 pieces of live AI feedback',
    icon: CheckCircle,
    category: 'milestones',
    criteria: { metric: 'feedback_received', target: 100, current: 0 },
    rarity: 'epic',
    points: 150,
    earned: false
  },

  // Special Achievement Badges
  {
    id: 'speech-dna-unlocked',
    name: 'DNA Decoded',
    description: 'Unlock your personalized Speech DNA',
    icon: Crown,
    category: 'special',
    criteria: { metric: 'speech_dna_generated', target: 1, current: 0 },
    rarity: 'legendary',
    points: 250,
    earned: false
  },
  {
    id: 'template-master',
    name: 'Template Master',
    description: 'Use 10 different speech templates',
    icon: Award,
    category: 'special',
    criteria: { metric: 'templates_used', target: 10, current: 0 },
    rarity: 'epic',
    points: 130,
    earned: false
  }
];

export default function ImprovedBadgeSystem() {
  const [badges, setBadges] = useState<Badge[]>(BADGE_DEFINITIONS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    badgesEarned: 0,
    currentStreak: 0,
    level: 1
  });
  const { toast } = useToast();

  // Simulate checking badge progress based on user activity
  useEffect(() => {
    checkBadgeProgress();
  }, []);

  const checkBadgeProgress = async () => {
    // In a real implementation, this would fetch user data from the API
    // For demo purposes, we'll simulate some progress
    const simulatedProgress = {
      sessions_completed: 3,
      total_practice_time: 1800, // 30 minutes
      filler_reduction: 25,
      max_clarity_score: 85,
      volume_consistency: 90,
      consecutive_days: 2,
      weekly_goals_met: 1,
      sessions_with_purpose: 2,
      feedback_received: 45,
      speech_dna_generated: 0,
      templates_used: 3
    };

    const updatedBadges = badges.map(badge => {
      const currentValue = simulatedProgress[badge.criteria.metric as keyof typeof simulatedProgress] || 0;
      const wasEarned = badge.earned;
      const isNowEarned = currentValue >= badge.criteria.target;

      // Check if badge was just earned
      if (!wasEarned && isNowEarned) {
        showBadgeEarned(badge);
      }

      return {
        ...badge,
        criteria: { ...badge.criteria, current: currentValue },
        earned: isNowEarned,
        dateEarned: isNowEarned && !wasEarned ? new Date().toLocaleDateString() : badge.dateEarned
      };
    });

    setBadges(updatedBadges);
    
    // Update user stats
    const earnedBadges = updatedBadges.filter(b => b.earned);
    const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);
    
    setUserStats({
      totalPoints,
      badgesEarned: earnedBadges.length,
      currentStreak: simulatedProgress.consecutive_days,
      level: Math.floor(totalPoints / 100) + 1
    });
  };

  const showBadgeEarned = (badge: Badge) => {
    toast({
      title: "🏆 Badge Earned!",
      description: `You've earned the "${badge.name}" badge! +${badge.points} points`,
      duration: 5000,
    });

    // Add visual celebration effect
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    celebration.innerHTML = `
      <div class="bg-yellow-400 text-yellow-900 px-6 py-4 rounded-lg shadow-lg animate-bounce">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">🏆</span>
          <div>
            <div class="font-bold">${badge.name}</div>
            <div class="text-sm">+${badge.points} points</div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(celebration);
    setTimeout(() => {
      document.body.removeChild(celebration);
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const filteredBadges = activeCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Badges', icon: Trophy },
    { id: 'practice', name: 'Practice', icon: Mic },
    { id: 'improvement', name: 'Improvement', icon: TrendingUp },
    { id: 'consistency', name: 'Consistency', icon: Flame },
    { id: 'milestones', name: 'Milestones', icon: Star },
    { id: 'special', name: 'Special', icon: Crown }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{userStats.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{userStats.badgesEarned}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">Level {userStats.level}</div>
            <div className="text-sm text-muted-foreground">Speaker Level</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Towards Next Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Current Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {badges
              .filter(badge => !badge.earned && badge.criteria.current > 0)
              .slice(0, 3)
              .map(badge => {
                const IconComponent = badge.icon;
                const progress = (badge.criteria.current / badge.criteria.target) * 100;
                
                return (
                  <div key={badge.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{badge.name}</span>
                        <Badge variant="outline" className={getRarityTextColor(badge.rarity)}>
                          {badge.rarity}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {badge.criteria.current}/{badge.criteria.target}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Badge Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center space-y-1 px-2 py-2 text-xs"
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredBadges.map(badge => {
            const IconComponent = badge.icon;
            const progress = badge.criteria.target > 0 
              ? (badge.criteria.current / badge.criteria.target) * 100 
              : 0;

            return (
              <Card 
                key={badge.id} 
                className={`relative transition-all duration-200 ${getRarityColor(badge.rarity)} ${
                  badge.earned ? 'ring-2 ring-yellow-400 shadow-lg' : 'opacity-75'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${badge.earned ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                        <IconComponent 
                          className={`h-5 w-5 ${badge.earned ? 'text-yellow-600' : 'text-gray-400'}`} 
                        />
                      </div>
                      {badge.earned && <Trophy className="h-4 w-4 text-yellow-500" />}
                      {!badge.earned && progress === 0 && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                    <Badge variant="outline" className={getRarityTextColor(badge.rarity)}>
                      {badge.points}pts
                    </Badge>
                  </div>
                  <CardTitle className={`text-lg ${badge.earned ? '' : 'text-gray-500'}`}>
                    {badge.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-3 ${badge.earned ? 'text-gray-700' : 'text-gray-500'}`}>
                    {badge.description}
                  </p>
                  
                  {!badge.earned && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{badge.criteria.current}/{badge.criteria.target}</span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>
                  )}

                  {badge.earned && badge.dateEarned && (
                    <div className="text-xs text-green-600 font-medium">
                      Earned on {badge.dateEarned}
                    </div>
                  )}

                  <Badge 
                    variant="outline" 
                    className={`mt-2 text-xs ${getRarityTextColor(badge.rarity)}`}
                  >
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Tabs>
      </div>
    </div>
  );
}