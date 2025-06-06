import { useState } from "react";
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
  Play,
  Square,
  Bot
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface AudienceRole {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function AIPracticeRoleplay() {
  const { wordCount, sessionTime } = useSpeechRecognition();
  
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [speechTopic, setSpeechTopic] = useState<string>("");
  const [latestResponse, setLatestResponse] = useState<string>("");
  const [useCustomAudience, setUseCustomAudience] = useState<boolean>(false);
  const [customAudiencePrompt, setCustomAudiencePrompt] = useState<string>("");
  const [useCustomPurpose, setUseCustomPurpose] = useState<boolean>(false);
  const [customPurposePrompt, setCustomPurposePrompt] = useState<string>("");

  const audienceRoles: AudienceRole[] = [
    {
      id: "investors",
      name: "Panel of Investors",
      description: "Venture capitalists evaluating your business pitch",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: "crowd",
      name: "Enthusiastic Crowd",
      description: "Engaged audience at a public speaking event",
      icon: <Users className="w-4 h-4" />
    },
    {
      id: "judges",
      name: "Competition Judges",
      description: "Panel of experts scoring your presentation",
      icon: <Gavel className="w-4 h-4" />
    },
    {
      id: "students",
      name: "University Students",
      description: "College students in a lecture or seminar",
      icon: <GraduationCap className="w-4 h-4" />
    },
    {
      id: "clients",
      name: "Potential Clients",
      description: "Business clients considering your services",
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: "wedding-guests",
      name: "Wedding Guests",
      description: "Friends and family at a wedding celebration",
      icon: <Heart className="w-4 h-4" />
    }
  ];

  const startPracticeSession = () => {
    setIsSessionActive(true);
    const audienceType = useCustomAudience ? "Custom Audience" : audienceRoles.find(role => role.id === selectedRole)?.name;
    setLatestResponse(`Welcome! We're ready to hear your presentation as ${audienceType}.`);
  };

  const endPracticeSession = () => {
    setIsSessionActive(false);
    setLatestResponse("");
  };

  return (
    <Card className="gradient-card purple-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Bot className="w-5 h-5 text-purple-600" />
          <span>AI Practice</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSessionActive ? (
          <div className="space-y-3">
            {/* Custom Audience Toggle */}
            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded border border-purple-200">
              <div>
                <Label className="text-xs font-medium">Custom Audience</Label>
                <p className="text-xs text-gray-600">Describe your own audience</p>
              </div>
              <Switch
                checked={useCustomAudience}
                onCheckedChange={setUseCustomAudience}
              />
            </div>

            {useCustomAudience ? (
              <div>
                <Label className="text-sm font-medium">Describe Your Audience</Label>
                <Textarea
                  placeholder="E.g., Board of directors at a tech company, focused on quarterly results and innovation. They're analytical, time-conscious, and looking for data-driven insights..."
                  value={customAudiencePrompt}
                  onChange={(e) => setCustomAudiencePrompt(e.target.value)}
                  className="mt-1 h-20 text-xs"
                />
              </div>
            ) : (
              <div>
                <Label className="text-sm font-medium">Audience Type</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center space-x-2">
                          {role.icon}
                          <span>{role.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="speech-topic" className="text-sm">Topic (Optional)</Label>
              <Input
                id="speech-topic"
                placeholder="Speech topic..."
                value={speechTopic}
                onChange={(e) => setSpeechTopic(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              onClick={startPracticeSession}
              disabled={useCustomAudience ? !customAudiencePrompt.trim() : !selectedRole}
              className="w-full gradient-bg text-white hover:opacity-90"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Practice
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 mb-2">
                Session Active
              </Badge>
              <div className="text-sm space-y-1">
                <div>Duration: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</div>
                <div>Words: {wordCount}</div>
              </div>
            </div>

            {latestResponse && (
              <div className="bg-blue-50 p-3 rounded text-sm">
                <div className="font-medium text-blue-800 mb-1">Audience:</div>
                <p className="text-blue-700">{latestResponse}</p>
              </div>
            )}

            <Button
              onClick={endPracticeSession}
              variant="outline"
              className="w-full border-red-300 text-red-600"
              size="sm"
            >
              <Square className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}