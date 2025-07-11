import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { User, Save, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  speakingGoals: z.string().min(10, "Please describe your speaking goals (at least 10 characters)"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  industryFocus: z.string().optional(),
  practiceFrequency: z.string().min(1, "Please select how often you want to practice"),
  specificChallenges: z.string().optional(),
  preferredFeedbackStyle: z.string().min(1, "Please select your preferred feedback style"),
  communicationStyle: z.string().min(1, "Please select your communication style"),
  learningPreference: z.string().min(1, "Please select your learning preference"),
  motivationStyle: z.string().min(1, "Please select what motivates you"),
  confidenceLevel: z.string().min(1, "Please rate your current confidence"),
  presentationContext: z.string().optional(),
  voiceChallenges: z.string().optional(),
  bodyLanguageFocus: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SimpleProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      speakingGoals: "",
      experienceLevel: "",
      industryFocus: "",
      practiceFrequency: "",
      specificChallenges: "",
      preferredFeedbackStyle: "",
      communicationStyle: "",
      learningPreference: "",
      motivationStyle: "",
      confidenceLevel: "",
      presentationContext: "",
      voiceChallenges: "",
      bodyLanguageFocus: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      // Submit profile data to train the deep learning coach using apiRequest
      const response = await apiRequest('/api/deep-learning-profile', 'POST', data);
      const result = await response.json();

      toast({
        title: "Deep Learning Coach Trained!",
        description: "Your AI coach has been personalized with your profile data and is ready to provide targeted feedback!",
      });

      console.log('Deep learning coach trained:', result);
    } catch (error) {
      console.error('Profile submission error:', error);
      toast({
        title: "Error",
        description: "Failed to train your AI coach. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Deep Learning Coach Profile</h1>
        <p className="text-gray-600">
          Help our AI Deep Learning Coach understand your speaking style and goals. This information trains our neural networks to provide hyperpersonalized feedback and coaching recommendations tailored specifically to you.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Basic Information</CardTitle>
              <CardDescription className="text-gray-600">
                Your name and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your first name" 
                          className="bg-white border-gray-300 text-gray-900" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your last name" 
                          className="bg-white border-gray-300 text-gray-900" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-white border-gray-300 text-gray-900" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Speaking Goals & Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Speaking Goals & Experience</CardTitle>
              <CardDescription className="text-gray-600">
                Tell us about your speaking objectives and current level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="speakingGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">What are your speaking goals?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Improve presentation skills for work, prepare for DECA competitions, build confidence for public speaking..."
                        className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="beginner">Beginner - New to public speaking</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                        <SelectItem value="advanced">Advanced - Experienced speaker</SelectItem>
                        <SelectItem value="professional">Professional - Regular presentations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industryFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Industry/Field (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Business, Education, Healthcare, Student (DECA/FBLA)"
                        className="bg-white border-gray-300 text-gray-900" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Practice Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Practice Preferences</CardTitle>
              <CardDescription className="text-gray-600">
                Help us customize your coaching experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="practiceFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">How often do you want to practice?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select practice frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="daily">Daily (5-10 minutes)</SelectItem>
                        <SelectItem value="few-times-week">Few times a week (15-20 minutes)</SelectItem>
                        <SelectItem value="weekly">Weekly (30+ minutes)</SelectItem>
                        <SelectItem value="as-needed">As needed for events</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredFeedbackStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Preferred Feedback Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Choose feedback style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="encouraging">Encouraging & Supportive</SelectItem>
                        <SelectItem value="direct">Direct & Constructive</SelectItem>
                        <SelectItem value="detailed">Detailed & Technical</SelectItem>
                        <SelectItem value="motivational">Motivational & Inspiring</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specificChallenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Specific Challenges (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Nervous gestures, filler words, eye contact, voice projection..."
                        className="bg-white border-gray-300 text-gray-900"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Deep Learning Coach Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">AI Coach Personalization</CardTitle>
              <CardDescription className="text-gray-600">
                Configure how our deep learning neural networks will analyze and coach your speaking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="communicationStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Your Communication Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="How do you naturally communicate?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="analytical">Analytical - Data-driven, logical</SelectItem>
                        <SelectItem value="expressive">Expressive - Emotional, storytelling</SelectItem>
                        <SelectItem value="diplomatic">Diplomatic - Careful, considerate</SelectItem>
                        <SelectItem value="assertive">Assertive - Direct, confident</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="learningPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Learning Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="How do you learn best?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="visual">Visual - Charts, demonstrations</SelectItem>
                        <SelectItem value="auditory">Auditory - Verbal explanations</SelectItem>
                        <SelectItem value="kinesthetic">Kinesthetic - Practice, hands-on</SelectItem>
                        <SelectItem value="reading">Reading - Written instructions</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivationStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">What Motivates You?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="What drives your improvement?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="achievement">Achievement - Goals and milestones</SelectItem>
                        <SelectItem value="recognition">Recognition - Praise and acknowledgment</SelectItem>
                        <SelectItem value="mastery">Mastery - Skill development</SelectItem>
                        <SelectItem value="competition">Competition - Comparing progress</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidenceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Current Confidence Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="How confident do you feel speaking?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="very-low">Very Low - Very nervous</SelectItem>
                        <SelectItem value="low">Low - Often anxious</SelectItem>
                        <SelectItem value="moderate">Moderate - Sometimes confident</SelectItem>
                        <SelectItem value="high">High - Usually confident</SelectItem>
                        <SelectItem value="very-high">Very High - Always confident</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Specific Focus Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Focus Areas for AI Analysis</CardTitle>
              <CardDescription className="text-gray-600">
                Tell our neural networks what specific aspects to focus on during analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="presentationContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Presentation Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Board meetings, student competitions, team presentations, sales pitches..."
                        className="bg-white border-gray-300 text-gray-900"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceChallenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Voice & Speech Challenges (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Speaking too fast, filler words (um, uh), low volume, monotone delivery..."
                        className="bg-white border-gray-300 text-gray-900"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bodyLanguageFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Body Language Focus (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Eye contact, hand gestures, posture, nervous habits, facial expressions..."
                        className="bg-white border-gray-300 text-gray-900"
                        {...field} 
                      />
                    </FormControl>
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
                <CheckCircle className="w-5 h-5 mr-2 animate-spin" />
                Training AI Coach...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Train Deep Learning Coach
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}