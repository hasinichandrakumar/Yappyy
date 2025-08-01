import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Wand2, Sparkles, User, Target, Clock, Users, Building, 
  Heart, Briefcase, GraduationCap, Loader2, Copy, Check 
} from "lucide-react";

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  difficulty: string;
  duration: string;
}

interface PersonalizationRequest {
  industry?: string;
  audience?: string;
  tone?: string;
  personalStory?: string;
  specificGoals?: string;
  context?: string;
  customRequest?: string;
}

interface EnhancedAIPersonalizerProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
  onPersonalized: (personalizedContent: string, improvements: string[], tips: string[]) => void;
}

const PERSONALIZATION_PRESETS = [
  {
    id: 'professional',
    name: 'Professional Presentation',
    icon: Briefcase,
    description: 'Corporate, polished, results-focused',
    preset: {
      tone: 'professional',
      audience: 'business professionals',
      context: 'corporate environment'
    }
  },
  {
    id: 'casual',
    name: 'Casual & Conversational',
    icon: Users,
    description: 'Friendly, approachable, relatable',
    preset: {
      tone: 'conversational',
      audience: 'general audience',
      context: 'informal setting'
    }
  },
  {
    id: 'academic',
    name: 'Academic Presentation',
    icon: GraduationCap,
    description: 'Scholarly, evidence-based, thorough',
    preset: {
      tone: 'academic',
      audience: 'students and academics',
      context: 'educational environment'
    }
  },
  {
    id: 'inspirational',
    name: 'Inspirational Speech',
    icon: Heart,
    description: 'Motivating, emotional, uplifting',
    preset: {
      tone: 'inspirational',
      audience: 'diverse audience',
      context: 'motivational event'
    }
  }
];

export function EnhancedAIPersonalizer({ template, isOpen, onClose, onPersonalized }: EnhancedAIPersonalizerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationRequest>({});
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [activeTab, setActiveTab] = useState('quick');
  const { toast } = useToast();

  const handlePresetSelect = (presetId: string) => {
    const preset = PERSONALIZATION_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setPersonalizationData({
        ...personalizationData,
        ...preset.preset
      });
    }
  };

  const handlePersonalize = async () => {
    if (!personalizationData.customRequest && !selectedPreset && Object.keys(personalizationData).length === 0) {
      toast({
        title: "Input Required",
        description: "Please select a preset or provide personalization details",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Build personalization request
      let userRequest = '';
      
      if (selectedPreset) {
        const preset = PERSONALIZATION_PRESETS.find(p => p.id === selectedPreset);
        userRequest += `Make this ${preset?.description.toLowerCase()}. `;
      }

      if (personalizationData.industry) {
        userRequest += `Tailor it for the ${personalizationData.industry} industry. `;
      }

      if (personalizationData.audience) {
        userRequest += `The audience is ${personalizationData.audience}. `;
      }

      if (personalizationData.tone) {
        userRequest += `Use a ${personalizationData.tone} tone. `;
      }

      if (personalizationData.personalStory) {
        userRequest += `Incorporate this personal element: ${personalizationData.personalStory}. `;
      }

      if (personalizationData.specificGoals) {
        userRequest += `Focus on achieving: ${personalizationData.specificGoals}. `;
      }

      if (personalizationData.context) {
        userRequest += `This will be delivered in: ${personalizationData.context}. `;
      }

      if (personalizationData.customRequest) {
        userRequest += personalizationData.customRequest;
      }

      console.log('🤖 Sending personalization request:', userRequest);

      const response = await fetch('/api/ai-personalize-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          userRequest: userRequest.trim(),
          personalizationData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      onPersonalized(
        result.personalizedContent || template.content,
        result.improvements || [],
        result.deliveryTips || []
      );

      toast({
        title: "🎯 Template Personalized!",
        description: `AI has customized your ${template.title} with ${result.improvements?.length || 0} improvements`,
      });

      onClose();
      
    } catch (error: any) {
      console.error('AI Personalization error:', error);
      toast({
        title: "Personalization Failed",
        description: error.message || "Unable to personalize template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-600" />
            AI Personalize: {template.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom Details</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERSONALIZATION_PRESETS.map((preset) => {
                const Icon = preset.icon;
                return (
                  <Card 
                    key={preset.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPreset === preset.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handlePresetSelect(preset.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Icon className="w-4 h-4" />
                        {preset.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-600">{preset.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedPreset && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Quick Personalization</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your template will be automatically customized using the "{PERSONALIZATION_PRESETS.find(p => p.id === selectedPreset)?.name}" style.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Field</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Education"
                  value={personalizationData.industry || ''}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, industry: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g., CEOs, Students, General Public"
                  value={personalizationData.audience || ''}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, audience: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Desired Tone</Label>
                <Input
                  id="tone"
                  placeholder="e.g., Professional, Casual, Inspiring"
                  value={personalizationData.tone || ''}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, tone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Speaking Context</Label>
                <Input
                  id="context"
                  placeholder="e.g., Conference, Team Meeting, Wedding"
                  value={personalizationData.context || ''}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, context: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalStory">Personal Story/Experience (Optional)</Label>
              <Textarea
                id="personalStory"
                placeholder="Share a personal story or experience to incorporate into the speech"
                rows={3}
                value={personalizationData.personalStory || ''}
                onChange={(e) => setPersonalizationData(prev => ({ ...prev, personalStory: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificGoals">Specific Goals</Label>
              <Textarea
                id="specificGoals"
                placeholder="What do you want to achieve with this speech? (e.g., persuade, inform, inspire)"
                rows={2}
                value={personalizationData.specificGoals || ''}
                onChange={(e) => setPersonalizationData(prev => ({ ...prev, specificGoals: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customRequest">Additional Customization Requests</Label>
              <Textarea
                id="customRequest"
                placeholder="Any other specific changes or improvements you'd like the AI to make"
                rows={3}
                value={personalizationData.customRequest || ''}
                onChange={(e) => setPersonalizationData(prev => ({ ...prev, customRequest: e.target.value }))}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-1" />
            Personalization takes 10-15 seconds
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handlePersonalize} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Personalizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Personalize with AI
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}