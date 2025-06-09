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
import ProfileLayout from "@/components/ProfileLayout";
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

export default function UserProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  });

  const handleEdit = () => {
    setFormData({
      firstName: (user as any)?.firstName || '',
      lastName: (user as any)?.lastName || '',
      bio: (user as any)?.bio || '',
      jobTitle: (user as any)?.jobTitle || '',
      company: (user as any)?.company || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({});
    setIsEditing(false);
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

  if (userLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and personalize your speaking journey</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
                    <AvatarImage src={(user as any)?.profileImageUrl} />
                    <AvatarFallback className="text-2xl">
                      {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
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
                    {(user as any)?.firstName} {(user as any)?.lastName}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {(user as any)?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={isEditing ? formData.firstName : (user as any)?.firstName || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={isEditing ? formData.lastName : (user as any)?.lastName || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Software Engineer"
                    value={isEditing ? formData.jobTitle : (user as any)?.jobTitle || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, jobTitle: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">
                    <Building className="w-4 h-4 inline mr-2" />
                    Company
                  </Label>
                  <Input
                    id="company"
                    placeholder="e.g. Acme Corp"
                    value={isEditing ? formData.company : (user as any)?.company || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, company: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and your speaking goals..."
                  value={isEditing ? formData.bio : (user as any)?.bio || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select 
                  value={(user as any)?.experienceLevel || ''}
                  onValueChange={(value) => {
                    if (isEditing) {
                      setFormData((prev: any) => ({ ...prev, experienceLevel: value }));
                    }
                  }}
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
                      variant={((user as any)?.speakingGoals || []).includes(goal) ? "default" : "outline"}
                      className="cursor-pointer"
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
                  <Label>
                    <Clock className="w-4 h-4 inline mr-2" />
                    Timezone
                  </Label>
                  <Select value={(user as any)?.timezone || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">America/New York</SelectItem>
                      <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    <Globe className="w-4 h-4 inline mr-2" />
                    Language
                  </Label>
                  <Select value={(user as any)?.preferredLanguage || 'en'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
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
                    checked={(user as any)?.practiceReminders || false}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Weekly Practice Goal</Label>
                  <Select value={((user as any)?.weeklyGoal || 3).toString()}>
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
                  <Select value={(user as any)?.themePreference || 'light'}>
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

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Practice Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Start practicing to build your streaks!</p>
                <Button className="mt-4" onClick={() => window.location.href = '/dashboard'}>
                  Start Practice Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}