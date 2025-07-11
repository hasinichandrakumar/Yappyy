import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Bell, Volume2, Eye, Mic, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const settingsSchema = z.object({
  notifications: z.boolean(),
  soundEffects: z.boolean(),
  voiceFeedback: z.boolean(),
  autoSave: z.boolean(),
  sessionReminders: z.boolean(),
  analysisDetail: z.string(),
  feedbackFrequency: z.string(),
  uiTheme: z.string(),
  microphoneSensitivity: z.string(),
  videoQuality: z.string(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AppSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      notifications: true,
      soundEffects: true,
      voiceFeedback: true,
      autoSave: true,
      sessionReminders: false,
      analysisDetail: "balanced",
      feedbackFrequency: "real-time",
      uiTheme: "light",
      microphoneSensitivity: "medium",
      videoQuality: "high",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      // Save settings to backend using apiRequest
      await apiRequest('/api/user-settings', 'POST', data);

      toast({
        title: "Settings Updated",
        description: "Your app preferences have been saved successfully!",
      });
    } catch (error) {
      console.error('Settings save error:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">App Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your Yappyy experience with personalized app preferences and system settings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications & Alerts
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Control when and how Yappyy notifies you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Push Notifications</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about practice reminders and achievements</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionReminders"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Session Reminders</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Daily reminders to practice speaking</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Audio & Video Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio & Video
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure audio and video quality settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="soundEffects"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Sound Effects</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds for interactions and feedback</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceFeedback"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Voice Feedback</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable spoken feedback from Peppy AI coach</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="microphoneSensitivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Microphone Sensitivity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select sensitivity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="low">Low - Less sensitive</SelectItem>
                        <SelectItem value="medium">Medium - Balanced</SelectItem>
                        <SelectItem value="high">High - Very sensitive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoQuality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Video Quality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select video quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="low">Low - 480p (faster)</SelectItem>
                        <SelectItem value="medium">Medium - 720p (balanced)</SelectItem>
                        <SelectItem value="high">High - 1080p (best quality)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Analysis & Feedback Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Analysis & Feedback
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Customize how detailed and frequent your feedback is
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="autoSave"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Auto-Save Sessions</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save your practice sessions</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="analysisDetail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Analysis Detail Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select detail level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="basic">Basic - Key insights only</SelectItem>
                        <SelectItem value="balanced">Balanced - Important details</SelectItem>
                        <SelectItem value="detailed">Detailed - Comprehensive analysis</SelectItem>
                        <SelectItem value="expert">Expert - Technical deep-dive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedbackFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Feedback Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select feedback timing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="real-time">Real-time - During practice</SelectItem>
                        <SelectItem value="periodic">Periodic - Every few minutes</SelectItem>
                        <SelectItem value="end-session">End of session - Summary only</SelectItem>
                        <SelectItem value="on-demand">On-demand - When requested</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Interface Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Interface Preferences</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Customize the app appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="uiTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Theme Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="light">Light - Bright interface</SelectItem>
                        <SelectItem value="dark">Dark - Dark interface</SelectItem>
                        <SelectItem value="auto">Auto - Follow system</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            {isSaving ? (
              <>
                <Settings className="w-5 h-5 mr-2 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}