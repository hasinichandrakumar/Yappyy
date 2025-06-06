import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Gavel, 
  TrendingUp, 
  GraduationCap,
  Briefcase,
  Heart,
  Award,
  Mic,
  MessageCircle,
  Play,
  Square,
  Bot,
  Sparkles,
  Clock,
  Star
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface AudienceRole {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  personality: string;
  responseStyle: string;
  questions: string[];
}

interface AIResponse {
  message: string;
  tone: string;
  feedback: string;
  timestamp: Date;
}

export default function AIPracticeRoleplay() {
  const { transcript, isListening, wordCount, sessionTime } = useSpeechRecognition();
  
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customAudience, setCustomAudience] = useState<string>("");
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState<boolean>(false);
  const [speechTopic, setSpeechTopic] = useState<string>("");

  const audienceRoles: AudienceRole[] = [
    {
      id: "investors",
      name: "Panel of Investors",
      description: "Venture capitalists evaluating your business pitch",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600",
      personality: "Analytical, skeptical, profit-focused, experienced",
      responseStyle: "Ask tough questions about market size, competition, financials, and scalability",
      questions: [
        "What's your customer acquisition cost?",
        "How do you plan to scale this?",
        "Who are your main competitors?",
        "What's your revenue model?",
        "What's your exit strategy?"
      ]
    },
    {
      id: "crowd",
      name: "Enthusiastic Crowd",
      description: "Engaged audience at a public speaking event",
      icon: <Users className="w-5 h-5" />,
      color: "from-blue-500 to-purple-600",
      personality: "Supportive, curious, diverse backgrounds, seeking inspiration",
      responseStyle: "Provide encouraging feedback, ask clarifying questions, show enthusiasm",
      questions: [
        "Can you give us a real example?",
        "How did you overcome that challenge?",
        "What advice would you give to beginners?",
        "That's inspiring! What's next?",
        "How can we apply this in our lives?"
      ]
    },
    {
      id: "judges",
      name: "Competition Judges",
      description: "Panel of experts scoring your presentation",
      icon: <Gavel className="w-5 h-5" />,
      color: "from-purple-500 to-indigo-600",
      personality: "Critical, detail-oriented, professional, high standards",
      responseStyle: "Evaluate content, delivery, structure, and impact with constructive criticism",
      questions: [
        "Your opening could be stronger - how would you improve it?",
        "The structure needs more clarity in the middle section",
        "Great content, but work on your pacing",
        "Your conclusion was powerful - well done",
        "Consider adding more evidence to support your points"
      ]
    },
    {
      id: "students",
      name: "University Students",
      description: "College students in a lecture or seminar",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "from-orange-500 to-red-600",
      personality: "Curious, questioning, casual, tech-savvy",
      responseStyle: "Ask practical questions, challenge assumptions, seek relevance to their lives",
      questions: [
        "How does this relate to our generation?",
        "Is there research to back this up?",
        "Can you break that down more simply?",
        "What are the practical applications?",
        "How do we get started with this?"
      ]
    },
    {
      id: "clients",
      name: "Potential Clients",
      description: "Business clients considering your services",
      icon: <Briefcase className="w-5 h-5" />,
      color: "from-teal-500 to-cyan-600",
      personality: "Results-focused, time-conscious, budget-aware, practical",
      responseStyle: "Focus on value, ROI, implementation, and business impact",
      questions: [
        "What's the ROI on this?",
        "How long does implementation take?",
        "What are the costs involved?",
        "Do you have case studies?",
        "What support do you provide?"
      ]
    },
    {
      id: "wedding-guests",
      name: "Wedding Guests",
      description: "Friends and family at a wedding celebration",
      icon: <Heart className="w-5 h-5" />,
      color: "from-pink-500 to-rose-600",
      personality: "Emotional, celebratory, personal connections, warm",
      responseStyle: "React with emotion, share memories, celebrate the couple",
      questions: [
        "That story about them is so sweet!",
        "We remember when they first met!",
        "Tell us more about their journey together",
        "That's exactly how we see them too",
        "What a beautiful way to put it"
      ]
    }
  ];

  const generateAIResponse = async (userSpeech: string) => {
    if (!selectedRole && !useCustom) return;

    setIsGeneratingResponse(true);
    try {
      const roleData = audienceRoles.find(role => role.id === selectedRole);
      const audienceType = useCustom ? customAudience : roleData?.name;
      const personality = useCustom ? "Respond based on the audience description provided" : roleData?.personality;
      const responseStyle = useCustom ? "Adapt your response style to match the audience" : roleData?.responseStyle;

      const prompt = `You are roleplaying as: ${audienceType}

Personality: ${personality}
Response Style: ${responseStyle}

The speaker just said: "${userSpeech}"

Speech Topic Context: "${speechTopic}"

Respond as this audience would - ask relevant questions, provide feedback, or make comments that this audience type would naturally have. Keep responses conversational and authentic to the role. Limit response to 2-3 sentences.

Also provide a brief coaching note about how well the speaker is connecting with this specific audience type.

Format your response as JSON:
{
  "message": "Your response as the audience",
  "tone": "The emotional tone of your response",
  "feedback": "Brief coaching note about audience connection"
}`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are an expert at roleplaying different audience types for public speaking practice. Provide authentic, helpful responses that help speakers improve their audience connection."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`AI response failed: ${response.status}`);
      }

      const data = await response.json();
      let aiResult;
      
      try {
        aiResult = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        aiResult = {
          message: data.choices[0].message.content,
          tone: "engaged",
          feedback: "Continue practicing to improve audience connection"
        };
      }

      const newResponse: AIResponse = {
        message: aiResult.message,
        tone: aiResult.tone,
        feedback: aiResult.feedback,
        timestamp: new Date()
      };

      setAiResponses(prev => [...prev, newResponse]);
      
    } catch (error) {
      console.error('AI roleplay response failed:', error);
      // Fallback response based on role
      const roleData = audienceRoles.find(role => role.id === selectedRole);
      const fallbackQuestions = roleData?.questions || ["That's interesting, tell us more", "Can you elaborate on that point?"];
      const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      
      const fallbackResponse: AIResponse = {
        message: randomQuestion,
        tone: "curious",
        feedback: "Good start! Try to be more specific and engaging with your examples.",
        timestamp: new Date()
      };
      
      setAiResponses(prev => [...prev, fallbackResponse]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const startPracticeSession = () => {
    setIsSessionActive(true);
    setAiResponses([]);
    
    // Initial welcome message
    const roleData = audienceRoles.find(role => role.id === selectedRole);
    const audienceType = useCustom ? customAudience : roleData?.name;
    
    const welcomeMessage: AIResponse = {
      message: `Welcome! We're ready to hear your presentation. As ${audienceType}, we're excited to see what you have to share with us.`,
      tone: "welcoming",
      feedback: "Start strong with a compelling opening to grab the audience's attention.",
      timestamp: new Date()
    };
    
    setAiResponses([welcomeMessage]);
  };

  const endPracticeSession = () => {
    setIsSessionActive(false);
    
    // Provide session summary
    const summaryMessage: AIResponse = {
      message: `Great session! You spoke for ${Math.floor(sessionTime / 60)} minutes and ${sessionTime % 60} seconds with ${wordCount} words. Thank you for the presentation!`,
      tone: "appreciative",
      feedback: `Session complete. You maintained good engagement throughout. Consider the feedback provided to enhance your next presentation.`,
      timestamp: new Date()
    };
    
    setAiResponses(prev => [...prev, summaryMessage]);
  };

  // Auto-generate responses when user pauses in speech
  useEffect(() => {
    if (isSessionActive && transcript && transcript.length > 50) {
      const words = transcript.split(' ');
      const lastWords = words.slice(-20).join(' '); // Last 20 words
      
      if (lastWords.length > 30 && !isGeneratingResponse) {
        // Simulate audience response after speaker talks for a bit
        const timeoutId = setTimeout(() => {
          generateAIResponse(lastWords);
        }, 3000); // Wait 3 seconds after speaker finishes a segment

        return () => clearTimeout(timeoutId);
      }
    }
  }, [transcript, isSessionActive]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display gradient-text mb-2">AI Practice Roleplay</h2>
        <p className="text-gray-600">Practice speaking with AI playing different audience roles</p>
      </div>

      {!isSessionActive ? (
        <>
          {/* Setup Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audience Selection */}
            <Card className="gradient-card purple-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Choose Your Audience</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Custom Audience Toggle */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div>
                    <Label className="text-sm font-medium">Custom Audience</Label>
                    <p className="text-xs text-gray-600">Describe your own audience type</p>
                  </div>
                  <Switch
                    checked={useCustom}
                    onCheckedChange={setUseCustom}
                  />
                </div>

                {useCustom ? (
                  <div>
                    <Label htmlFor="custom-audience">Describe Your Audience</Label>
                    <Textarea
                      id="custom-audience"
                      placeholder="E.g., Board of directors at a Fortune 500 company, focused on quarterly results and strategic planning..."
                      value={customAudience}
                      onChange={(e) => setCustomAudience(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Select Audience Type</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {audienceRoles.map((role) => (
                        <div
                          key={role.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedRole === role.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => setSelectedRole(role.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${role.color} text-white`}>
                              {role.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{role.name}</h4>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Setup */}
            <Card className="gradient-card purple-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <span>Session Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="speech-topic">Speech Topic (Optional)</Label>
                  <Input
                    id="speech-topic"
                    placeholder="E.g., Quarterly business results, Product launch, Wedding toast..."
                    value={speechTopic}
                    onChange={(e) => setSpeechTopic(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-600 mt-1">Helps AI provide more relevant responses</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">What to Expect:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      <span>AI will respond as your chosen audience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-purple-500" />
                      <span>Get real-time questions and feedback</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Practice handling audience interaction</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startPracticeSession}
                  disabled={!selectedRole && (!useCustom || !customAudience.trim())}
                  className="w-full gradient-bg text-white hover:opacity-90 purple-glow"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Active Session */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session Info */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Session Active</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Audience:</span>
                    <span className="text-sm font-medium">
                      {useCustom ? "Custom" : audienceRoles.find(role => role.id === selectedRole)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Words:</span>
                    <span className="text-sm font-medium">{wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={isListening ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {isListening ? "Listening" : "Waiting"}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={endPracticeSession}
                  variant="outline"
                  className="w-full mt-4 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </CardContent>
            </Card>

            {/* AI Responses */}
            <div className="lg:col-span-2">
              <Card className="gradient-card purple-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span>Audience Responses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {aiResponses.map((response, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {useCustom ? "Audience" : audienceRoles.find(role => role.id === selectedRole)?.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {response.tone}
                          </Badge>
                        </div>
                        <p className="text-gray-800 mb-2">{response.message}</p>
                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                          <strong>Coach Note:</strong> {response.feedback}
                        </div>
                      </div>
                    ))}
                    
                    {isGeneratingResponse && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                          <span className="text-sm text-gray-600">Audience is responding...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}