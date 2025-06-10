import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Crown,
  Flame, 
  Zap, 
  Users,
  TrendingUp,
  Clock,
  Star,
  Award,
  Target,
  ChevronUp,
  ChevronDown,
  Plus,
  Heart,
  MessageCircle,
  UserPlus,
  Sparkles
} from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  score: number;
  change: number; // rank change from previous period
  streak: number;
  totalSessions: number;
  totalTime: number; // in minutes
  isFollowing?: boolean;
  isCurrentUser?: boolean;
  badges: string[];
  level: number;
  yapX: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  targetValue: number;
  unit: string;
  duration: number;
  reward: number;
  participants: number;
  timeLeft: string;
  isParticipating: boolean;
  progress?: number;
}

interface SocialActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'achievement' | 'challenge-completed' | 'streak-milestone' | 'level-up';
  title: string;
  description: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export default function SocialLeaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');
  const [selectedCategory, setSelectedCategory] = useState<'overall' | 'practice-time' | 'yapx-earned' | 'streaks'>('overall');
  const queryClient = useQueryClient();

  // Mock data for development - replace with real API calls
  const mockLeaderboardData: LeaderboardUser[] = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/api/placeholder/32/32",
      rank: 1,
      score: 2450,
      change: 2,
      streak: 15,
      totalSessions: 42,
      totalTime: 580,
      badges: ["streak-master", "practice-champion"],
      level: 8,
      yapX: 2450,
    },
    {
      id: "2",
      name: "Sarah Chen",
      avatar: "/api/placeholder/32/32",
      rank: 2,
      score: 2280,
      change: -1,
      streak: 12,
      totalSessions: 38,
      totalTime: 520,
      badges: ["voice-expert", "confidence-builder"],
      level: 7,
      yapX: 2280,
    },
    {
      id: "current",
      name: "You",
      rank: 8,
      score: 1650,
      change: 3,
      streak: 7,
      totalSessions: 25,
      totalTime: 340,
      isCurrentUser: true,
      badges: ["first-week", "early-bird"],
      level: 5,
      yapX: 1650,
    },
  ];

  const mockChallenges: Challenge[] = [
    {
      id: "1",
      title: "7-Day Speaking Streak",
      description: "Practice speaking for 7 consecutive days",
      type: "practice-streak",
      targetValue: 7,
      unit: "days",
      duration: 7,
      reward: 500,
      participants: 156,
      timeLeft: "4 days left",
      isParticipating: true,
      progress: 3,
    },
    {
      id: "2",
      title: "Voice Master Challenge",
      description: "Complete 10 voice-focused practice sessions",
      type: "skill-focus",
      targetValue: 10,
      unit: "sessions",
      duration: 14,
      reward: 750,
      participants: 89,
      timeLeft: "9 days left",
      isParticipating: false,
    },
  ];

  const mockActivities: SocialActivity[] = [
    {
      id: "1",
      userId: "1",
      userName: "Alex Johnson",
      userAvatar: "/api/placeholder/32/32",
      type: "streak-milestone",
      title: "15-Day Streak Achieved!",
      description: "Just completed my 15th consecutive day of practice. Consistency is key!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 23,
      comments: 8,
      isLiked: true,
    },
    {
      id: "2",
      userId: "2",
      userName: "Sarah Chen",
      userAvatar: "/api/placeholder/32/32",
      type: "level-up",
      title: "Level 7 Unlocked!",
      description: "Advanced to level 7 with focus on presentation skills",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 31,
      comments: 12,
      isLiked: false,
    },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600";
    if (rank <= 10) return "bg-gradient-to-r from-blue-400 to-purple-500";
    return "bg-gradient-to-r from-gray-400 to-gray-600";
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ChevronDown className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 text-gray-400">-</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Social Learning Hub
        </h2>
        <p className="text-gray-600">Compete, connect, and grow with the YapUp community</p>
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid grid-cols-3 w-full h-12">
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="all-time">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overall">Overall</TabsTrigger>
                  <TabsTrigger value="practice-time">Time</TabsTrigger>
                  <TabsTrigger value="yapx-earned">YapX</TabsTrigger>
                  <TabsTrigger value="streaks">Streaks</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Current User Stats */}
          {mockLeaderboardData.find(u => u.isCurrentUser) && (
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${getRankBadgeColor(8)} text-white font-bold`}>
                      #{8}
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Your Current Rank</h3>
                      <p className="text-sm text-blue-700">Keep practicing to climb higher!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">1,650</div>
                    <div className="text-sm text-blue-600 flex items-center">
                      <ChevronUp className="w-4 h-4" />
                      Up 3 places
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockLeaderboardData.map((user, index) => (
                <div 
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 ${
                    user.isCurrentUser ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getRankBadgeColor(user.rank)} text-white`}>
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${user.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                          {user.name}
                        </span>
                        {user.level && (
                          <Badge variant="outline" className="text-xs">
                            Level {user.level}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Flame className="w-3 h-3" />
                          <span>{user.streak} days</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(user.totalTime)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold text-lg">{user.score.toLocaleString()}</div>
                      <div className="flex items-center text-sm">
                        {getChangeIcon(user.change)}
                        <span className={user.change > 0 ? 'text-green-600' : user.change < 0 ? 'text-red-600' : 'text-gray-500'}>
                          {user.change !== 0 && Math.abs(user.change)}
                        </span>
                      </div>
                    </div>
                    {!user.isCurrentUser && (
                      <Button variant="outline" size="sm">
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Challenges</h3>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mockChallenges.map((challenge) => (
              <Card key={challenge.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <Badge className="bg-purple-100 text-purple-800">
                      {challenge.reward} YapX
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{challenge.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{challenge.participants} participants</span>
                    </span>
                    <span className="flex items-center space-x-1 text-orange-600">
                      <Clock className="w-4 h-4" />
                      <span>{challenge.timeLeft}</span>
                    </span>
                  </div>

                  {challenge.isParticipating && challenge.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Progress</span>
                        <span>{challenge.progress}/{challenge.targetValue} {challenge.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(challenge.progress / challenge.targetValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button 
                    className={`w-full ${
                      challenge.isParticipating 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                    }`}
                    disabled={challenge.isParticipating}
                  >
                    {challenge.isParticipating ? 'Participating' : 'Join Challenge'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Social Activity Tab */}
        <TabsContent value="social" className="space-y-6">
          <h3 className="text-lg font-semibold">Community Activity</h3>
          
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="py-4">
                  <div className="flex space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={activity.userAvatar} />
                      <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{activity.userName}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type.replace('-', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-gray-600 text-sm">{activity.description}</p>
                      <div className="flex items-center space-x-4 pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={`flex items-center space-x-1 ${activity.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          <Heart className={`w-4 h-4 ${activity.isLiked ? 'fill-current' : ''}`} />
                          <span>{activity.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>{activity.comments}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}