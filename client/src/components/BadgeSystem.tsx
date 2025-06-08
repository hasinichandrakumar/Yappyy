import { useState, useEffect } from "react";
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
  Volume2
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
  points?: number;
  celebrationGif?: string;
}

interface BadgeStats {
  totalBadges: number;
  unlockedBadges: number;
  totalPoints: number;
  currentStreak: number;
  nextMilestone: string;
}

export default function BadgeSystem() {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showCelebration, setShowCelebration] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string[]>([]);

  // Enhanced badge data with more engaging content and variety
  const badges: BadgeData[] = [
    // LEGENDARY BADGES
    {
      id: "grand-master",
      name: "Grand Master Speaker",
      description: "The ultimate achievement - mastery across all speaking dimensions",
      category: "growth",
      icon: <Crown className="w-8 h-8" />,
      color: "from-purple-600 via-pink-500 to-yellow-400",
      criteria: [
        "Unlock 50+ badges across all categories",
        "Maintain 95%+ average scores for 3 months",
        "Complete the Executive Speaker Challenge",
        "Mentor 5+ community members to success"
      ],
      benefits: [
        "Exclusive Grand Master certificate",
        "VIP access to all premium features",
        "Personal brand consultation session",
        "Speaking engagement opportunities"
      ],
      isUnlocked: false,
      progress: 23,
      rarity: "legendary",
      points: 5000,
      celebrationGif: "🎆"
    },
    {
      id: "voice-virtuoso",
      name: "Voice Virtuoso",
      description: "Perfect vocal control and modulation mastery",
      category: "delivery",
      icon: <Volume2 className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-400",
      criteria: [
        "Perfect pitch variation (8+ vocal ranges)",
        "Strategic pause mastery (95%+ effectiveness)",
        "Zero monotone sessions (15+ consecutive)",
        "Exceptional vocal clarity (98%+ consistency)"
      ],
      benefits: [
        "Expressive Delivery Masterclass access",
        "Voice-over challenge unlock",
        "Custom vocal analysis reports"
      ],
      isUnlocked: true,
      progress: 100,
      rarity: "legendary",
      points: 2500,
      dateEarned: new Date("2024-02-10")
    },
    
    // EPIC BADGES
    {
      id: "persuasion-master",
      name: "Persuasion Master",
      description: "Exceptional ability to influence and convince audiences",
      category: "content",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      criteria: [
        "95%+ audience engagement score",
        "Flawless argument structure (AI-verified)",
        "Complete 10 persuasive speeches with 90%+ success",
        "Master emotional appeal techniques"
      ],
      benefits: [
        "Advanced persuasion missions",
        "LinkedIn certification badge",
        "Negotiation coaching bonus session"
      ],
      isUnlocked: true,
      progress: 100,
      rarity: "epic",
      points: 1500,
      dateEarned: new Date("2024-01-28")
    },
    {
      id: "storyteller-supreme",
      name: "Storyteller Supreme", 
      description: "Captivate audiences with compelling narratives",
      category: "content",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      criteria: [
        "Create 20+ engaging story-driven speeches",
        "Achieve 90%+ emotional resonance scores",
        "Master narrative arc construction",
        "Excel in dramatic tension and resolution"
      ],
      benefits: [
        "Storytelling workshop access",
        "Creative writing collaboration opportunities",
        "Narrative coaching specialized sessions"
      ],
      isUnlocked: false,
      progress: 67,
      rarity: "epic",
      points: 1200
    },

    // RARE BADGES  
    {
      id: "confidence-champion",
      name: "Confidence Champion",
      description: "Demonstrate unwavering confidence and poise",
      category: "delivery",
      icon: <Shield className="w-6 h-6" />,
      color: "from-green-500 to-emerald-400",
      criteria: [
        "Maintain 85%+ confidence scores for 30 days",
        "Zero anxiety indicators in body language",
        "Complete high-pressure scenario challenges",
        "Demonstrate executive presence consistently"
      ],
      benefits: [
        "Executive presence training",
        "Leadership speaking opportunities",
        "Confidence coaching certification"
      ],
      isUnlocked: true,
      progress: 100,
      rarity: "rare",
      points: 800,
      dateEarned: new Date("2024-02-05")
    },
    {
      id: "body-language-expert",
      name: "Body Language Expert",
      description: "Master non-verbal communication and presence",
      category: "delivery",
      icon: <Eye className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-500",
      criteria: [
        "Perfect posture scores (20+ sessions)",
        "Optimal eye contact patterns",
        "Purposeful gesture mastery",
        "Professional presence consistency"
      ],
      benefits: [
        "Advanced body language analysis",
        "Presence coaching sessions",
        "Non-verbal communication masterclass"
      ],
      isUnlocked: false,
      progress: 45,
      rarity: "rare",
      points: 600
    },
    {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Perfect speaking pace and rhythm control",
      category: "delivery",
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-400",
      criteria: [
        "Optimal WPM range (150-180) for 10+ sessions",
        "Perfect pause timing and rhythm",
        "Dynamic pace variation mastery",
        "Zero rushed or dragging segments"
      ],
      benefits: [
        "Rhythm and pace masterclass",
        "Advanced timing techniques",
        "Speaking tempo optimization tools"
      ],
      isUnlocked: false,
      progress: 78,
      rarity: "rare",
      points: 500
    },

    // COMMON BADGES
    {
      id: "first-steps",
      name: "First Steps",
      description: "Begin your speaking journey with your first session",
      category: "growth",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-green-400 to-blue-400",
      criteria: ["Complete 1 practice session"],
      benefits: [
        "Unlock advanced practice modes",
        "Access to basic coaching tips",
        "Progress tracking enabled"
      ],
      isUnlocked: true,
      progress: 100,
      rarity: "common",
      points: 100,
      dateEarned: new Date("2024-01-15")
    },
    {
      id: "week-warrior",
      name: "Week Warrior",
      description: "Practice consistently for a full week",
      category: "growth",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-400 to-purple-400",
      criteria: ["Practice for 7 consecutive days"],
      benefits: [
        "Habit tracking rewards",
        "Consistency bonus points",
        "Weekly challenge access"
      ],
      isUnlocked: true,
      progress: 100,
      rarity: "common",
      points: 200,
      dateEarned: new Date("2024-01-22")
    },
    {
      id: "clarity-seeker",
      name: "Clarity Seeker",
      description: "Achieve excellent voice clarity scores",
      category: "delivery",
      icon: <Mic className="w-6 h-6" />,
      color: "from-cyan-400 to-blue-400",
      criteria: ["Maintain 80%+ voice clarity for 5 sessions"],
      benefits: [
        "Voice training exercises",
        "Articulation improvement tips",
        "Clarity coaching modules"
      ],
      isUnlocked: true,
      progress: 100,
      rarity: "common",
      points: 150,
      dateEarned: new Date("2024-01-18")
    },
    {
      id: "time-keeper",
      name: "Time Keeper",
      description: "Master timing and duration control",
      category: "delivery",
      icon: <Timer className="w-6 h-6" />,
      color: "from-emerald-400 to-green-400",
      criteria: ["Hit target duration within 30 seconds for 10 sessions"],
      benefits: [
        "Advanced timing tools",
        "Duration optimization tips",
        "Pacing control techniques"
      ],
      isUnlocked: false,
      progress: 30,
      rarity: "common",
      points: 120
    },

    // COMMUNITY BADGES
    {
      id: "helpful-mentor",
      name: "Helpful Mentor",
      description: "Support and guide fellow speakers",
      category: "community",
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-400 to-rose-400",
      criteria: [
        "Provide feedback to 10+ community members",
        "Receive 50+ helpful votes",
        "Mentor 2+ speakers to badge achievements"
      ],
      benefits: [
        "Mentor badge showcase",
        "Community leadership recognition",
        "Advanced feedback tools access"
      ],
      isUnlocked: false,
      progress: 15,
      rarity: "rare",
      points: 400
    },

    // THEMED BADGES
    {
      id: "holiday-speaker",
      name: "Holiday Speaker",
      description: "Spread joy with festive speaking sessions",
      category: "themed",
      icon: <Gift className="w-6 h-6" />,
      color: "from-red-500 to-green-500",
      criteria: ["Complete 5 sessions during holiday season"],
      benefits: [
        "Festive templates access",
        "Holiday-themed challenges",
        "Seasonal coaching content"
      ],
      isUnlocked: false,
      progress: 60,
      rarity: "common",
      points: 180
    }
  ];

  const stats: BadgeStats = {
    totalBadges: badges.length,
    unlockedBadges: badges.filter(b => b.isUnlocked).length,
    totalPoints: badges.filter(b => b.isUnlocked).reduce((sum, b) => sum + (b.points || 0), 0),
    currentStreak: 7,
    nextMilestone: "Unlock 5 more badges to reach Speaker Level 3"
  };

  const filteredBadges = activeCategory === "all" 
    ? badges 
    : badges.filter(badge => badge.category === activeCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-purple-600 bg-purple-100";
      case "epic": return "text-orange-600 bg-orange-100";
      case "rare": return "text-blue-600 bg-blue-100";
      default: return "text-green-600 bg-green-100";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-purple-400 shadow-purple-200";
      case "epic": return "border-orange-400 shadow-orange-200";
      case "rare": return "border-blue-400 shadow-blue-200";
      default: return "border-green-400 shadow-green-200";
    }
  };

  // Simulate recent badge unlock
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentlyUnlocked(["voice-virtuoso"]);
      setShowCelebration(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <PartyPopper className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-gray-600 mb-4">You've unlocked the Voice Virtuoso badge!</p>
              <Button onClick={() => setShowCelebration(false)}>
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-800">{stats.unlockedBadges}</div>
            <div className="text-sm text-blue-600">Badges Earned</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-800">{stats.totalPoints}</div>
            <div className="text-sm text-purple-600">Total Points</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.currentStreak}</div>
            <div className="text-sm text-green-600">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold text-orange-800">{Math.round((stats.unlockedBadges / stats.totalBadges) * 100)}%</div>
            <div className="text-sm text-orange-600">Completion</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Milestone */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Next Milestone</h3>
            <p className="text-indigo-100">{stats.nextMilestone}</p>
          </div>
          <Rocket className="w-8 h-8 text-indigo-200" />
        </div>
        <Progress value={70} className="mt-3 bg-indigo-400" />
      </motion.div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="delivery" className="text-xs">Delivery</TabsTrigger>
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="growth" className="text-xs">Growth</TabsTrigger>
          <TabsTrigger value="community" className="text-xs">Community</TabsTrigger>
          <TabsTrigger value="themed" className="text-xs">Themed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  hoveredBadge === badge.id ? 'scale-105' : ''
                }`}
                onClick={() => setSelectedBadge(badge)}
              >
                <Card className={`h-full ${
                  badge.isUnlocked 
                    ? `border-2 ${getRarityBorder(badge.rarity)} shadow-lg` 
                    : 'border-gray-200 opacity-75'
                } hover:shadow-xl transition-all duration-300`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${badge.color} ${
                        badge.isUnlocked ? '' : 'grayscale'
                      }`}>
                        {badge.isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-gray-400" />}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={`${getRarityColor(badge.rarity)} border-0`}>
                          {badge.rarity}
                        </Badge>
                        {badge.isUnlocked && badge.points && (
                          <Badge variant="secondary" className="text-xs">
                            {badge.points} pts
                          </Badge>
                        )}
                        {recentlyUnlocked.includes(badge.id) && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Badge className="bg-yellow-500 text-white">NEW!</Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardTitle className={`text-lg mb-2 ${
                      badge.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {badge.name}
                    </CardTitle>
                    <p className={`text-sm mb-4 ${
                      badge.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {badge.description}
                    </p>

                    {!badge.isUnlocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{badge.progress}%</span>
                        </div>
                        <Progress value={badge.progress} className="h-2" />
                      </div>
                    )}

                    {badge.isUnlocked && badge.dateEarned && (
                      <div className="flex items-center text-sm text-gray-500 mt-3">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Earned {badge.dateEarned.toLocaleDateString()}
                      </div>
                    )}

                    {hoveredBadge === badge.id && badge.isUnlocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/95 p-4 rounded-lg flex items-center justify-center"
                      >
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedBadge.color}`}>
                      {selectedBadge.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedBadge.name}</h2>
                      <p className="text-gray-600">{selectedBadge.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getRarityColor(selectedBadge.rarity)}>
                          {selectedBadge.rarity}
                        </Badge>
                        {selectedBadge.points && (
                          <Badge variant="secondary">{selectedBadge.points} points</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedBadge(null)}>
                    ×
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Criteria</h3>
                    <ul className="space-y-2">
                      {selectedBadge.criteria.map((criterion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            selectedBadge.isUnlocked ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-sm text-gray-700">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Benefits</h3>
                    <ul className="space-y-2">
                      {selectedBadge.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Gift className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {!selectedBadge.isUnlocked && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-sm text-gray-600">{selectedBadge.progress}% complete</span>
                    </div>
                    <Progress value={selectedBadge.progress} className="h-3" />
                  </div>
                )}

                {selectedBadge.isUnlocked && (
                  <div className="mt-6 flex justify-center">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      Share Achievement
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}