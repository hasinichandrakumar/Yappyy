import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Eye, Database, Download, Trash2, Lock, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const privacySchema = z.object({
  dataCollection: z.boolean(),
  voiceRecordings: z.boolean(),
  videoRecordings: z.boolean(),
  analyticsSharing: z.boolean(),
  profileVisibility: z.string(),
  sessionHistory: z.boolean(),
  improvementData: z.boolean(),
  thirdPartyIntegrations: z.boolean(),
  marketingEmails: z.boolean(),
  researchParticipation: z.boolean(),
});

type PrivacyFormData = z.infer<typeof privacySchema>;

export default function PrivacySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [showDataDeletion, setShowDataDeletion] = useState(false);

  const form = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      dataCollection: true,
      voiceRecordings: true,
      videoRecordings: true,
      analyticsSharing: false,
      profileVisibility: "private",
      sessionHistory: true,
      improvementData: true,
      thirdPartyIntegrations: false,
      marketingEmails: false,
      researchParticipation: false,
    },
  });

  const onSubmit = async (data: PrivacyFormData) => {
    setIsSaving(true);
    try {
      // Save privacy settings to backend using apiRequest
      await apiRequest('/api/privacy-settings', 'POST', data);

      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully!",
      });
    } catch (error) {
      console.error('Privacy settings save error:', error);
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await apiRequest('/api/export-data', 'POST', {});

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `yappyy-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Data Export Complete",
        description: "Your data has been exported and downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full">
          <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Privacy & Data</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Control how your data is collected, used, and shared. Your privacy is important to us.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Collection
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Control what data Yappyy collects to improve your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="dataCollection"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Basic Analytics</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow collection of usage data to improve the app</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceRecordings"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Voice Recordings</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Store voice recordings for AI analysis and improvement</p>
                      <Badge variant="secondary" className="mt-1">Required for AI coaching</Badge>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoRecordings"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Video Recordings</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Store video for body language and gesture analysis</p>
                      <Badge variant="secondary" className="mt-1">Required for body language analysis</Badge>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionHistory"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Session History</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Keep track of your practice sessions and progress</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="improvementData"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Improvement Analytics</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Track detailed metrics for personalized recommendations</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Sharing & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Sharing & Visibility
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Control how your information is shared and who can see your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="profileVisibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Profile Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select visibility level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="private">Private - Only you can see your data</SelectItem>
                        <SelectItem value="anonymous">Anonymous - Aggregated data only</SelectItem>
                        <SelectItem value="public">Public - Others can see your progress</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="analyticsSharing"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Anonymous Analytics</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Share anonymized data to help improve Yappyy for everyone</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="researchParticipation"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Research Participation</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow your anonymized data to be used for research purposes</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thirdPartyIntegrations"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Third-party Integrations</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow connections with external services and platforms</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Communication
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Control how we communicate with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="marketingEmails"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                    <div>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Marketing Emails</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new features and tips</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Data Management
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Export or delete your personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDataExport}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export My Data
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Download all your data in JSON format including sessions, progress, and preferences.
                </p>
                
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDataDeletion(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All Data
                </Button>
                <p className="text-sm text-red-500 dark:text-red-400">
                  Permanently delete all your data. This action cannot be undone.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
          >
            {isSaving ? (
              <>
                <Shield className="w-5 h-5 mr-2 animate-spin" />
                Saving Privacy Settings...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Privacy Settings
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}