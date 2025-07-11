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
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      // Here you would save the profile data to your backend
      console.log("Profile data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h1>
        <p className="text-gray-600">
          Help us personalize your Yappyy experience by sharing some information about your speaking goals and preferences.
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

          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            {isSaving ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Profile Information
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}