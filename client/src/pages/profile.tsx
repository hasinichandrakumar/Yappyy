import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Mail, 
  Briefcase, 
  Building, 
  Target, 
  Globe, 
  Clock, 
  Bell, 
  Palette,
  Trophy,
  Flame,
  Calendar,
  Settings,
  Save,
  Camera
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  speakingGoals?: string[];
  experienceLevel?: string;
  timezone?: string;
  preferredLanguage?: string;
  notificationPreferences?: any;
  practiceReminders?: boolean;
  weeklyGoal?: number;
  themePreference?: string;
}

interface UserPreference {
  id: number;
  userId: string;
  category: string;
  setting: string;
  value: string;
}

interface UserAchievement {
  id: number;
  userId: string;
  achievementType: string;
  achievementName: string;
  description?: string;
  earnedAt: string;
  metadata?: any;
}

interface UserStreak {
  id: number;
  userId: string;
  streakType: string;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const { data: preferences = [] } = useQuery<UserPreference[]>({
    queryKey: ['/api/user/preferences'],
  });

  const { data: achievements = [] } = useQuery<UserAchievement[]>({
    queryKey: ['/api/user/achievements'],
  });

  const { data: streaks = [] } = useQuery<UserStreak[]>({
    queryKey: ['/api/user/streaks'],
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<UserProfile>) => 
      apiRequest('/api/user/profile', { method: 'PATCH', body: updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  });

  // Preference update mutation
  const updatePreferenceMutation = useMutation({
    mutationFn: ({ category, setting, value }: { category: string; setting: string; value: string }) =>
      apiRequest('/api/user/preferences', { method: 'PUT', body: { category, setting, value } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/preferences'] });
      toast({ title: "Preferences updated" });
    },
    onError: () => {
      toast({ title: "Failed to update preferences", variant: "destructive" });
    }
  });

  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({});
    setIsEditing(false);
  };

  const updatePreference = (category: string, setting: string, value: string) => {
    updatePreferenceMutation.mutate({ category, setting, value });
  };

  const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ];

  const speakingGoalOptions = [
    "Overcome stage fright",
    "Improve voice clarity", 
    "Better body language",
    "Engaging storytelling",
    "Professional presentations",
    "Wedding speeches",
    "Conference talks",
    "Sales pitches",
    "Job interviews",
    "Debate skills"
  ];

  const timezones = [
    "America/New_York",
    "America/Chicago", 
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  if (userLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and personalize your speaking journey</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="text-2xl">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={isEditing ? formData.firstName || '' : user?.firstName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={isEditing ? formData.lastName || '' : user?.lastName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Software Engineer"
                    value={isEditing ? formData.jobTitle || '' : user?.jobTitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    disabled={!isEditing}
                    icon={<Briefcase className="w-4 h-4" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Acme Corp"
                    value={isEditing ? formData.company || '' : user?.company || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    disabled={!isEditing}
                    icon={<Building className="w-4 h-4" />}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and your speaking goals..."
                  value={isEditing ? formData.bio || '' : user?.bio || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select 
                  value={isEditing ? formData.experienceLevel : user?.experienceLevel || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your speaking experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speaking Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {speakingGoalOptions.map((goal) => (
                    <Badge 
                      key={goal}
                      variant={user?.speakingGoals?.includes(goal) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (isEditing) {
                          const currentGoals = formData.speakingGoals || user?.speakingGoals || [];
                          const newGoals = currentGoals.includes(goal)
                            ? currentGoals.filter(g => g !== goal)
                            : [...currentGoals, goal];
                          setFormData(prev => ({ ...prev, speakingGoals: newGoals }));
                        }
                      }}
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select 
                    value={user?.timezone || ''}
                    onValueChange={(value) => updatePreference('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          <Clock className="w-4 h-4 mr-2 inline" />
                          {tz.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={user?.preferredLanguage || 'en'}
                    onValueChange={(value) => updatePreference('general', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <Globe className="w-4 h-4 mr-2 inline" />
                        English
                      </SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Practice Reminders</Label>
                    <p className="text-sm text-gray-600">Get daily reminders to practice speaking</p>
                  </div>
                  <Switch 
                    checked={user?.practiceReminders || false}
                    onCheckedChange={(checked) => 
                      updatePreference('notifications', 'practice_reminders', checked.toString())
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Weekly Practice Goal</Label>
                  <Select 
                    value={user?.weeklyGoal?.toString() || '3'}
                    onValueChange={(value) => updatePreference('goals', 'weekly_sessions', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 session per week</SelectItem>
                      <SelectItem value="3">3 sessions per week</SelectItem>
                      <SelectItem value="5">5 sessions per week</SelectItem>
                      <SelectItem value="7">Daily practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </h3>
                
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select 
                    value={user?.themePreference || 'light'}
                    onValueChange={(value) => updatePreference('appearance', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <h3 className="font-semibold">{achievement.achievementName}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <p className="text-xs text-gray-500">
                        Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No achievements yet. Start practicing to earn your first badge!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Practice Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {streaks.length > 0 ? (
                <div className="space-y-4">
                  {streaks.map((streak) => (
                    <div key={streak.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Flame className="w-6 h-6 text-orange-500" />
                        <div>
                          <h3 className="font-semibold capitalize">{streak.streakType.replace('_', ' ')}</h3>
                          <p className="text-sm text-gray-600">
                            Last practice: {streak.lastPracticeDate 
                              ? new Date(streak.lastPracticeDate).toLocaleDateString()
                              : 'Never'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{streak.currentStreak}</div>
                        <div className="text-sm text-gray-600">
                          Best: {streak.longestStreak}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Start practicing to build your streaks!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}