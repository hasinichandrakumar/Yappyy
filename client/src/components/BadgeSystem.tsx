import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart3
} from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  category: "delivery" | "content" | "growth" | "community" | "themed";
  icon: React.ReactNode;
  color: string;
  criteria: string[];
  benefits: string[];
  isUnlocked: boolean;
  progress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  dateEarned?: Date;
}

export default function BadgeSystem() {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);

  useEffect(() => {
    // Initialize badge data with progress simulation
    const badgeData: BadgeData[] = [
      // DELIVERY & STYLE BADGES
      {
        id: "most-persuasive",
        name: "Most Persuasive",
        description: "Master the art of persuasion with compelling arguments",
        category: "delivery",
        icon: <Trophy className="w-6 h-6" />,
        color: "from-yellow-400 to-yellow-600",
        criteria: [
          "Exceptional audience engagement score (95%+)",
          "Flawless argument structure (AI-analyzed logic)",
          "Masterful emotional appeal through voice and words",
          "Complete 10 persuasive speeches with 90%+ success rate"
        ],
        benefits: [
          "Unlocks advanced persuasion missions",
          "Shareable badge for LinkedIn/resume",
          "Bonus coaching session on negotiation"
        ],
        isUnlocked: Math.random() > 0.95,
        progress: Math.floor(Math.random() * 15),
        rarity: "legendary",
        dateEarned: Math.random() > 0.95 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined
      },
      {
        id: "best-voice-modulation",
        name: "Voice Virtuoso",
        description: "Perfect voice control and modulation mastery",
        category: "delivery",
        icon: <Mic className="w-6 h-6" />,
        color: "from-blue-400 to-blue-600",
        criteria: [
          "Perfect pitch and tone variation across 8+ vocal ranges",
          "Masterful strategic pauses with 95%+ effectiveness",
          "Zero monotone delivery across 15+ sessions",
          "Exceptional real-time waveform stability (98%+ consistency)"
        ],
        benefits: [
          "Unlocks Expressive Delivery Masterclass",
          "Voice-over challenge access",
          "Custom voice evolution visualization"
        ],
        isUnlocked: Math.random() > 0.90,
        progress: Math.floor(Math.random() * 20),
        rarity: "epic"
      },
      {
        id: "zero-filler-words",
        name: "Zero Filler Master",
        description: "Eliminate filler words while maintaining natural flow",
        category: "delivery",
        icon: <Target className="w-6 h-6" />,
        color: "from-green-400 to-green-600",
        criteria: [
          "100% elimination of filler words for 10+ consecutive sessions",
          "Maintain natural speaking flow (95%+ fluency score)",
          "Consistent performance over 20+ sessions",
          "Zero instances of 'um,' 'like,' 'you know,' 'so,' 'actually'"
        ],
        benefits: [
          "Featured on app leaderboard",
          "Advanced Clarity feedback layer",
          "Professional certificate for portfolio"
        ],
        isUnlocked: Math.random() > 0.8,
        progress: Math.floor(Math.random() * 100),
        rarity: "rare"
      },
      {
        id: "power-pitcher",
        name: "Power Pitcher",
        description: "Deliver compelling 60-second pitches with perfect pacing",
        category: "delivery",
        icon: <Zap className="w-6 h-6" />,
        color: "from-purple-400 to-purple-600",
        criteria: [
          "Complete 25 pitches within exactly 58-60 seconds",
          "Perfect pacing and clarity (98%+ score)",
          "Compelling message delivery with 90%+ impact rating",
          "Exceptional engagement metrics across all attempts"
        ],
        benefits: [
          "Elevator pitch mastery badge",
          "Quick-pitch challenge access",
          "Networking event preparation tools"
        ],
        isUnlocked: Math.random() > 0.5,
        progress: Math.floor(Math.random() * 100),
        rarity: "common"
      },
      {
        id: "silence-master",
        name: "Silence Master",
        description: "Use strategic pauses effectively without awkward silence",
        category: "delivery",
        icon: <Clock className="w-6 h-6" />,
        color: "from-indigo-400 to-indigo-600",
        criteria: [
          "Use 5+ strategic pauses per speech",
          "No awkward or uncomfortable silence",
          "Perfect timing for dramatic effect",
          "Audience engagement during pauses"
        ],
        benefits: [
          "Advanced timing techniques unlock",
          "Dramatic speaking module access",
          "Pause effectiveness analytics"
        ],
        isUnlocked: Math.random() > 0.7,
        progress: Math.floor(Math.random() * 100),
        rarity: "rare"
      },

      // CONTENT & STRUCTURE BADGES
      {
        id: "rock-solid-structure",
        name: "Rock Solid Structure",
        description: "Master the art of clear speech organization",
        category: "content",
        icon: <Shield className="w-6 h-6" />,
        color: "from-stone-400 to-stone-600",
        criteria: [
          "Clear intro-body-conclusion structure",
          "Logical flow between sections",
          "Strong transitions throughout",
          "Coherent argument progression"
        ],
        benefits: [
          "Advanced structure templates",
          "Speech outline generator",
          "Professional presentation tools"
        ],
        isUnlocked: Math.random() > 0.4,
        progress: Math.floor(Math.random() * 100),
        rarity: "common"
      },
      {
        id: "hook-hunter",
        name: "Hook Hunter",
        description: "Craft irresistible opening statements",
        category: "content",
        icon: <Sparkles className="w-6 h-6" />,
        color: "from-pink-400 to-pink-600",
        criteria: [
          "Attention-grabbing opening in every speech",
          "Use facts, questions, or stories effectively",
          "Immediate audience engagement",
          "Strong first impression metrics"
        ],
        benefits: [
          "Opening statement library",
          "Hook effectiveness analyzer",
          "Attention-grabbing techniques guide"
        ],
        isUnlocked: Math.random() > 0.6,
        progress: Math.floor(Math.random() * 100),
        rarity: "rare"
      },

      // GROWTH & HABIT BADGES
      {
        id: "level-up-speaker",
        name: "Level Up Speaker",
        description: "Show consistent improvement across multiple metrics",
        category: "growth",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "from-emerald-400 to-emerald-600",
        criteria: [
          "Improve 3+ metrics over 5 sessions",
          "Consistent upward trend",
          "Demonstrable skill development",
          "Performance analytics improvement"
        ],
        benefits: [
          "Progress tracking dashboard",
          "Personalized improvement plans",
          "Advanced analytics access"
        ],
        isUnlocked: Math.random() > 0.3,
        progress: Math.floor(Math.random() * 100),
        rarity: "common"
      },
      {
        id: "daily-grinder",
        name: "Daily Grinder",
        description: "Maintain a consistent practice streak",
        category: "growth",
        icon: <Flame className="w-6 h-6" />,
        color: "from-orange-400 to-red-500",
        criteria: [
          "Practice public speaking 7 days in a row",
          "Complete daily challenges",
          "Maintain engagement streak",
          "Regular skill development"
        ],
        benefits: [
          "Streak bonus multipliers",
          "Exclusive daily challenges",
          "Habit-building tools"
        ],
        isUnlocked: Math.random() > 0.8,
        progress: Math.floor(Math.random() * 100),
        rarity: "epic"
      },

      // COMMUNITY & COMPETITION BADGES
      {
        id: "crowd-favorite",
        name: "Crowd Favorite",
        description: "Win the hearts of your audience",
        category: "community",
        icon: <Users className="w-6 h-6" />,
        color: "from-teal-400 to-teal-600",
        criteria: [
          "Highest peer rating in mock contest",
          "Exceptional audience engagement",
          "Outstanding presentation delivery",
          "Community recognition"
        ],
        benefits: [
          "Featured speaker spotlight",
          "Community challenges access",
          "Peer mentorship opportunities"
        ],
        isUnlocked: Math.random() > 0.9,
        progress: Math.floor(Math.random() * 100),
        rarity: "legendary"
      },

      // FUN & THEMED BADGES
      {
        id: "fearless-roar",
        name: "Fearless Roar",
        description: "Conquer your fear with your first speech",
        category: "themed",
        icon: <Crown className="w-6 h-6" />,
        color: "from-amber-400 to-yellow-500",
        criteria: [
          "Complete your very first speech",
          "Overcome initial speaking anxiety",
          "Take the first step in your journey",
          "Show courage to begin"
        ],
        benefits: [
          "Welcome to speaking community",
          "Beginner's guide unlock",
          "Confidence building exercises"
        ],
        isUnlocked: true,
        progress: 100,
        rarity: "common",
        dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: "speech-wizard",
        name: "Speech Wizard",
        description: "Achieve mastery across all speaking dimensions",
        category: "themed",
        icon: <Star className="w-6 h-6" />,
        color: "from-violet-400 to-purple-600",
        criteria: [
          "Score above 90% across all metrics",
          "Single session perfection",
          "Exceptional performance in all areas",
          "Demonstrate complete mastery"
        ],
        benefits: [
          "Master speaker certification",
          "Advanced technique access",
          "Speaking wizard title"
        ],
        isUnlocked: Math.random() > 0.95,
        progress: Math.floor(Math.random() * 100),
        rarity: "legendary"
      }
    ];

    setBadges(badgeData);
  }, []);

  const filteredBadges = selectedCategory === "all" 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const unlockedBadges = badges.filter(badge => badge.isUnlocked);
  const totalProgress = badges.reduce((sum, badge) => sum + badge.progress, 0) / badges.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-300 bg-gray-50";
      case "rare": return "border-blue-300 bg-blue-50";
      case "epic": return "border-purple-300 bg-purple-50";
      case "legendary": return "border-yellow-300 bg-yellow-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display gradient-text mb-2">Badge System</h1>
        <p className="text-gray-600">Earn achievements and unlock new features as you master public speaking</p>
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-display gradient-text mb-1">{unlockedBadges.length}</div>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </CardContent>
          </Card>
          <Card className="gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-display gradient-text mb-1">{Math.round(totalProgress)}%</div>
              <p className="text-sm text-gray-600">Overall Progress</p>
            </CardContent>
          </Card>
          <Card className="gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-display gradient-text mb-1">{badges.length - unlockedBadges.length}</div>
              <p className="text-sm text-gray-600">To Unlock</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6 gradient-card purple-border">
          <TabsTrigger value="all" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
            <Trophy className="w-4 h-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
            <Mic className="w-4 h-4" />
            <span>Delivery</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
            <Brain className="w-4 h-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4" />
            <span>Growth</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            <span>Community</span>
          </TabsTrigger>
          <TabsTrigger value="themed" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
            <Star className="w-4 h-4" />
            <span>Special</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Badge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBadges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  badge.isUnlocked 
                    ? getRarityColor(badge.rarity) 
                    : 'opacity-75 border-gray-200 bg-gray-50'
                } ${selectedBadge?.id === badge.id ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setSelectedBadge(badge)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${badge.color} text-white`}>
                      {badge.isUnlocked ? badge.icon : <Lock className="w-6 h-6" />}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getRarityBadgeColor(badge.rarity)}>
                        {badge.rarity}
                      </Badge>
                      {badge.isUnlocked && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {!badge.isUnlocked && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress} className="h-2" />
                    </div>
                  )}
                  {badge.isUnlocked && badge.dateEarned && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Earned {badge.dateEarned.toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <Card className="gradient-card purple-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedBadge.color} text-white`}>
                  {selectedBadge.isUnlocked ? selectedBadge.icon : <Lock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-heading">{selectedBadge.name}</h3>
                  <Badge className={getRarityBadgeColor(selectedBadge.rarity)}>
                    {selectedBadge.rarity}
                  </Badge>
                </div>
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedBadge(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">{selectedBadge.description}</p>

            {/* Criteria */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Target className="w-4 h-4 text-purple-600 mr-2" />
                Requirements
              </h4>
              <div className="space-y-2">
                {selectedBadge.criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className={`w-4 h-4 ${selectedBadge.isUnlocked ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-700">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Award className="w-4 h-4 text-yellow-600 mr-2" />
                Rewards & Benefits
              </h4>
              <div className="space-y-2">
                {selectedBadge.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            {!selectedBadge.isUnlocked && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                  Your Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{selectedBadge.progress}%</span>
                  </div>
                  <Progress value={selectedBadge.progress} className="h-3" />
                </div>
                <p className="text-xs text-gray-600">
                  Keep practicing to unlock this badge and earn its exclusive rewards!
                </p>
              </div>
            )}

            {selectedBadge.isUnlocked && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Badge Unlocked!</span>
                </div>
                {selectedBadge.dateEarned && (
                  <p className="text-sm text-green-700 mt-1">
                    Earned on {selectedBadge.dateEarned.toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}