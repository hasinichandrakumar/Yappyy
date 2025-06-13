import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Award, 
  Star, 
  Crown, 
  Zap,
  Target,
  Mic,
  Clock,
  Brain,
  Users,
  Flame,
  Shield,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Lock,
  Calendar,
  BarChart3,
  Gift,
  Heart,
  Eye,
  MessageCircle,
  Rocket,
  Medal,
  Gem,
  Diamond,
  PartyPopper,
  Timer,
  Volume2,
  Play,
  BookOpen,
  Lightbulb,
  Coffee,
  Briefcase
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "practice" | "skill" | "milestone" | "special" | "streak";
  icon: React.ReactNode;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  criteria: {
    type: string;
    target: number;
    current: number;
    description: string;
  };
  rewards: string[];
  isUnlocked: boolean;
  unlockedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
}

const achievementData: Achievement[] = [
  // Practice Achievements
  {
    id: "first-speech",
    name: "First Steps",
    description: "Complete your very first practice session",
    category: "practice",
    icon: <Play className="h-6 w-6" />,
    color: "text-green-600",
    gradientFrom: "from-green-400",
    gradientTo: "to-emerald-500",
    criteria: {
      type: "sessions_completed",
      target: 1,
      current: 0,
      description: "Complete 1 practice session"
    },
    rewards: ["Welcome badge", "Confidence boost", "Practice motivation"],
    isUnlocked: false,
    rarity: "common",
    points: 50
  },
  {
    id: "dedicated-speaker",
    name: "Dedicated Speaker",
    description: "Practice for 5 sessions - you're building a habit!",
    category: "practice",
    icon: <Target className="h-6 w-6" />,
    color: "text-blue-600",
    gradientFrom: "from-blue-400",
    gradientTo: "to-indigo-500",
    criteria: {
      type: "sessions_completed",
      target: 5,
      current: 0,
      description: "Complete 5 practice sessions"
    },
    rewards: ["Advanced analytics", "Personal coach insights", "Progress tracking"],
    isUnlocked: false,
    rarity: "common",
    points: 150
  },
  {
    id: "consistency-champion",
    name: "Consistency Champion",
    description: "Practice 3 days in a row - consistency is key!",
    category: "streak",
    icon: <Flame className="h-6 w-6" />,
    color: "text-orange-600",
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    criteria: {
      type: "daily_streak",
      target: 3,
      current: 0,
      description: "Practice for 3 consecutive days"
    },
    rewards: ["Streak multiplier", "Daily challenges", "Momentum badge"],
    isUnlocked: false,
    rarity: "rare",
    points: 250
  },
  {
    id: "speech-master",
    name: "Speech Master",
    description: "Complete 25 practice sessions - you're a true speaker!",
    category: "milestone",
    icon: <Crown className="h-6 w-6" />,
    color: "text-purple-600",
    gradientFrom: "from-purple-400",
    gradientTo: "to-pink-500",
    criteria: {
      type: "sessions_completed",
      target: 25,
      current: 0,
      description: "Complete 25 practice sessions"
    },
    rewards: ["Master status", "Premium templates", "Expert insights"],
    isUnlocked: false,
    rarity: "epic",
    points: 500
  },

  // Skill Achievements
  {
    id: "confident-speaker",
    name: "Confident Speaker",
    description: "Achieve 80%+ confidence score in a session",
    category: "skill",
    icon: <Shield className="h-6 w-6" />,
    color: "text-teal-600",
    gradientFrom: "from-teal-400",
    gradientTo: "to-cyan-500",
    criteria: {
      type: "confidence_score",
      target: 80,
      current: 0,
      description: "Reach 80% confidence in any session"
    },
    rewards: ["Confidence badge", "Advanced tips", "Personal celebration"],
    isUnlocked: false,
    rarity: "rare",
    points: 200
  },
  {
    id: "clear-communicator",
    name: "Clear Communicator",
    description: "Achieve 85%+ clarity score - crystal clear delivery!",
    category: "skill",
    icon: <MessageCircle className="h-6 w-6" />,
    color: "text-emerald-600",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-green-500",
    criteria: {
      type: "clarity_score",
      target: 85,
      current: 0,
      description: "Achieve 85% or higher clarity score"
    },
    rewards: ["Clarity master badge", "Communication tips", "Voice coaching"],
    isUnlocked: false,
    rarity: "rare",
    points: 300
  },
  {
    id: "perfect-pace",
    name: "Perfect Pace",
    description: "Maintain ideal speaking pace (140-160 WPM)",
    category: "skill",
    icon: <Timer className="h-6 w-6" />,
    color: "text-amber-600",
    gradientFrom: "from-amber-400",
    gradientTo: "to-orange-500",
    criteria: {
      type: "optimal_pace",
      target: 1,
      current: 0,
      description: "Speak at optimal pace (140-160 WPM) for full session"
    },
    rewards: ["Pace master badge", "Rhythm insights", "Timing tips"],
    isUnlocked: false,
    rarity: "rare",
    points: 250
  },

  // Special Achievements
  {
    id: "ted-talk-ready",
    name: "TED Talk Ready",
    description: "Master a TED talk template with 90%+ score",
    category: "special",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "text-red-600",
    gradientFrom: "from-red-400",
    gradientTo: "to-rose-500",
    criteria: {
      type: "template_mastery",
      target: 90,
      current: 0,
      description: "Score 90%+ on a TED talk template"
    },
    rewards: ["TED speaker badge", "Inspiration templates", "Stage presence tips"],
    isUnlocked: false,
    rarity: "epic",
    points: 400
  },
  {
    id: "business-presenter",
    name: "Business Presenter",
    description: "Excel at business presentations with professional flair",
    category: "special",
    icon: <Briefcase className="h-6 w-6" />,
    color: "text-slate-600",
    gradientFrom: "from-slate-400",
    gradientTo: "to-gray-500",
    criteria: {
      type: "business_expertise",
      target: 85,
      current: 0,
      description: "Average 85%+ on business presentation templates"
    },
    rewards: ["Professional badge", "Business templates", "Executive presence"],
    isUnlocked: false,
    rarity: "epic",
    points: 350
  },
  {
    id: "streak-legend",
    name: "Streak Legend",
    description: "Practice for 30 days straight - incredible dedication!",
    category: "streak",
    icon: <Rocket className="h-6 w-6" />,
    color: "text-violet-600",
    gradientFrom: "from-violet-400",
    gradientTo: "to-purple-500",
    criteria: {
      type: "daily_streak",
      target: 30,
      current: 0,
      description: "Maintain a 30-day practice streak"
    },
    rewards: ["Legend status", "Exclusive content", "Streak multipliers"],
    isUnlocked: false,
    rarity: "legendary",
    points: 1000
  },
  {
    id: "perfectionist",
    name: "The Perfectionist",
    description: "Achieve a perfect 100% score in any session",
    category: "special",
    icon: <Diamond className="h-6 w-6" />,
    color: "text-cyan-600",
    gradientFrom: "from-cyan-400",
    gradientTo: "to-blue-500",
    criteria: {
      type: "perfect_score",
      target: 100,
      current: 0,
      description: "Score 100% in any practice session"
    },
    rewards: ["Diamond badge", "Perfect speaker status", "Elite recognition"],
    isUnlocked: false,
    rarity: "legendary",
    points: 750
  }
];

export default function EnhancedBadgeSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(achievementData);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCelebration, setShowCelebration] = useState<Achievement | null>(null);
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    currentStreak: 0,
    averageScore: 0,
    totalPoints: 0
  });

  const queryClient = useQueryClient();

  // Fetch user achievements and progress
  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-achievements'],
    enabled: true
  });

  const { data: practiceSessions } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  // Update achievement progress
  const updateAchievementMutation = useMutation({
    mutationFn: async (achievementData: any) => {
      const response = await fetch('/api/achievements/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementData)
      });
      if (!response.ok) throw new Error('Failed to update achievement');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-achievements'] });
      if (data.newlyUnlocked) {
        setShowCelebration(data.achievement);
      }
    }
  });

  // Calculate achievement progress based on user data
  useEffect(() => {
    if (practiceSessions && Array.isArray(practiceSessions)) {
      const updatedAchievements = achievements.map(achievement => {
        let current = 0;
        
        switch (achievement.criteria.type) {
          case "sessions_completed":
            current = practiceSessions.length;
            break;
          case "confidence_score":
            const maxConfidence = Math.max(...practiceSessions.map(s => s.confidenceScore || 0));
            current = maxConfidence;
            break;
          case "clarity_score":
            const maxClarity = Math.max(...practiceSessions.map(s => s.voiceClarity || 0));
            current = maxClarity;
            break;
          case "perfect_score":
            const maxScore = Math.max(...practiceSessions.map(s => s.overallScore || 0));
            current = maxScore;
            break;
          case "daily_streak":
            // Calculate current streak
            const today = new Date();
            let streak = 0;
            const sortedSessions = practiceSessions
              .map(s => new Date(s.createdAt))
              .sort((a, b) => b.getTime() - a.getTime());
            
            for (let i = 0; i < sortedSessions.length; i++) {
              const sessionDate = sortedSessions[i];
              const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
              if (daysDiff === i) {
                streak++;
              } else {
                break;
              }
            }
            current = streak;
            break;
        }

        const isUnlocked = current >= achievement.criteria.target;
        return {
          ...achievement,
          criteria: { ...achievement.criteria, current },
          isUnlocked
        };
      });

      setAchievements(updatedAchievements);

      // Update user stats
      setUserStats({
        totalSessions: practiceSessions.length,
        currentStreak: updatedAchievements.find(a => a.id === "consistency-champion")?.criteria.current || 0,
        averageScore: practiceSessions.length > 0 
          ? Math.round(practiceSessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / practiceSessions.length)
          : 0,
        totalPoints: updatedAchievements
          .filter(a => a.isUnlocked)
          .reduce((sum, a) => sum + a.points, 0)
      });
    }
  }, [practiceSessions]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-300 bg-gray-50";
      case "rare": return "border-blue-300 bg-blue-50";
      case "epic": return "border-purple-300 bg-purple-50";
      case "legendary": return "border-yellow-300 bg-yellow-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: "bg-gray-100 text-gray-800",
      rare: "bg-blue-100 text-blue-800", 
      epic: "bg-purple-100 text-purple-800",
      legendary: "bg-yellow-100 text-yellow-800"
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === "all" || achievement.category === selectedCategory
  );

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Achievement Center
        </h1>
        <p className="text-gray-600">Track your speaking journey and earn rewards!</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalSessions}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.averageScore}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <Badge variant="outline" className="text-sm">
            {unlockedCount} / {totalCount} Badges Earned
          </Badge>
        </div>
        <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
        <p className="text-sm text-gray-600 mt-2">
          {unlockedCount === 0 
            ? "Start practicing to earn your first badge!"
            : `Great job! You've unlocked ${unlockedCount} badges. Keep going!`
          }
        </p>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: "all", label: "All Badges", icon: <Trophy className="h-4 w-4" /> },
          { id: "practice", label: "Practice", icon: <Play className="h-4 w-4" /> },
          { id: "skill", label: "Skills", icon: <Brain className="h-4 w-4" /> },
          { id: "streak", label: "Streaks", icon: <Flame className="h-4 w-4" /> },
          { id: "milestone", label: "Milestones", icon: <Crown className="h-4 w-4" /> },
          { id: "special", label: "Special", icon: <Star className="h-4 w-4" /> }
        ].map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.label}
          </Button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              achievement.isUnlocked ? getRarityColor(achievement.rarity) : "opacity-75 bg-gray-50"
            }`}>
              {achievement.isUnlocked && (
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${achievement.gradientFrom} ${achievement.gradientTo} rounded-bl-full flex items-start justify-end p-2`}>
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${achievement.isUnlocked ? `bg-gradient-to-br ${achievement.gradientFrom} ${achievement.gradientTo} text-white` : 'bg-gray-200 text-gray-400'}`}>
                    {achievement.isUnlocked ? achievement.icon : <Lock className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    <Badge className={getRarityBadge(achievement.rarity)}>
                      {achievement.rarity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{achievement.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className={achievement.isUnlocked ? "text-green-600 font-semibold" : ""}>
                      {achievement.criteria.current} / {achievement.criteria.target}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((achievement.criteria.current / achievement.criteria.target) * 100, 100)} 
                    className={`h-2 ${achievement.isUnlocked ? 'bg-green-100' : ''}`}
                  />
                  <p className="text-xs text-gray-500">{achievement.criteria.description}</p>
                </div>

                {achievement.isUnlocked && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-green-700">Rewards Unlocked:</h4>
                    <ul className="text-xs text-green-600 space-y-1">
                      {achievement.rewards.map((reward, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <Gift className="h-3 w-3" />
                          {reward}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1 text-purple-600">
                      <Star className="h-3 w-3" />
                      <span className="text-xs font-semibold">{achievement.points} points earned</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCelebration(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-lg p-8 text-center max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <PartyPopper className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-600 mb-2">
                  Achievement Unlocked!
                </h2>
                <h3 className="text-xl font-semibold mb-2">{showCelebration.name}</h3>
                <p className="text-gray-600 mb-4">{showCelebration.description}</p>
                <Badge className={getRarityBadge(showCelebration.rarity)}>
                  {showCelebration.rarity.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-6">
                <h4 className="font-semibold">Rewards:</h4>
                <ul className="text-sm text-gray-600">
                  {showCelebration.rewards.map((reward, index) => (
                    <li key={index}>• {reward}</li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => setShowCelebration(null)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}