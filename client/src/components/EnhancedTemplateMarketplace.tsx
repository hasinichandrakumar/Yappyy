import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Filter, 
  Star, 
  Download, 
  Edit3, 
  Wand2, 
  Target, 
  Heart, 
  Lightbulb,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Mic,
  Award
} from "lucide-react";

interface SpeechTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  genre: 'persuasive' | 'narrative' | 'motivational' | 'analytical' | 'celebratory';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  downloads: number;
  author: string;
  price: number;
  isUserGenerated: boolean;
  toneProfile: {
    humor: number;
    formality: number;
    emotion: number;
    urgency: number;
  };
  structure: {
    hook: string;
    body: string[];
    cta: string;
  };
  fillInBlanks: {
    [key: string]: string;
  };
  smartRewrites: {
    persuasive: string;
    emotional: string;
    humorous: string;
  };
}

interface ToneSettings {
  humor: number;
  formality: number;
  emotion: number;
  urgency: number;
}

export default function EnhancedTemplateMarketplace() {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [toneSettings, setToneSettings] = useState<ToneSettings>({
    humor: 50,
    formality: 50,
    emotion: 50,
    urgency: 50
  });
  const [selectedTemplate, setSelectedTemplate] = useState<SpeechTemplate | null>(null);
  const [customInputs, setCustomInputs] = useState<{[key: string]: string}>({});

  const templates: SpeechTemplate[] = [
    {
      id: '1',
      title: "TED Talk: Revolutionary Product Launch",
      description: "AI-crafted structure for announcing breakthrough innovations with maximum impact",
      category: "Product Launch",
      genre: 'persuasive',
      difficulty: 'advanced',
      duration: "12-15 minutes",
      rating: 4.9,
      downloads: 2847,
      author: "Dr. Sarah Chen",
      price: 29,
      isUserGenerated: true,
      toneProfile: {
        humor: 30,
        formality: 70,
        emotion: 80,
        urgency: 90
      },
      structure: {
        hook: "What if I told you that in the next [TIMEFRAME], [PROBLEM] will be completely solved?",
        body: [
          "The [STATISTIC] that changed everything",
          "How we discovered [BREAKTHROUGH]",
          "The three pillars of [SOLUTION]",
          "Real-world impact: [CASE_STUDY]"
        ],
        cta: "Join us in [ACTION] - because [FUTURE_VISION] starts today."
      },
      fillInBlanks: {
        TIMEFRAME: "18 months",
        PROBLEM: "climate change",
        STATISTIC: "97% reduction in carbon emissions",
        BREAKTHROUGH: "carbon-negative technology",
        SOLUTION: "our revolutionary approach",
        CASE_STUDY: "Google's 50% energy reduction",
        ACTION: "the sustainability revolution",
        FUTURE_VISION: "a carbon-neutral world"
      },
      smartRewrites: {
        persuasive: "Transform your opening with data-driven urgency and social proof",
        emotional: "Add personal story about environmental impact on your family",
        humorous: "Start with: 'My kids asked me why the planet is getting a fever...'"
      }
    },
    {
      id: '2',
      title: "Motivational Keynote: Overcoming Adversity",
      description: "Inspire audiences with your journey from challenge to triumph",
      category: "Keynote",
      genre: 'motivational',
      difficulty: 'intermediate',
      duration: "20-25 minutes",
      rating: 4.8,
      downloads: 3921,
      author: "Marcus Williams",
      price: 19,
      isUserGenerated: true,
      toneProfile: {
        humor: 60,
        formality: 40,
        emotion: 95,
        urgency: 70
      },
      structure: {
        hook: "They said [NEGATIVE_PREDICTION]. Today, I'm here to tell you they were wrong.",
        body: [
          "The moment everything changed: [PIVOTAL_MOMENT]",
          "The three lessons [FAILURE] taught me",
          "How [MINDSET_SHIFT] transformed my path",
          "Your turn: The [ACTION_FRAMEWORK] that works"
        ],
        cta: "Your [OBSTACLE] isn't your ending - it's your beginning. Start [FIRST_STEP] today."
      },
      fillInBlanks: {
        NEGATIVE_PREDICTION: "I'd never succeed in business",
        PIVOTAL_MOMENT: "losing my first company",
        FAILURE: "bankruptcy",
        MINDSET_SHIFT: "seeing failure as data",
        ACTION_FRAMEWORK: "RISE method",
        OBSTACLE: "setback",
        FIRST_STEP: "taking one small action"
      },
      smartRewrites: {
        persuasive: "Add statistics about resilience and success rates after failure",
        emotional: "Include vulnerable moment about your darkest day",
        humorous: "Open with: 'I've failed so many times, I should get a PhD in it...'"
      }
    },
    {
      id: '3',
      title: "Business Pitch: Series A Funding",
      description: "Structured approach to secure venture capital with compelling storytelling",
      category: "Funding Pitch",
      genre: 'analytical',
      difficulty: 'advanced',
      duration: "10 minutes",
      rating: 4.7,
      downloads: 1653,
      author: "AI Speech Coach",
      price: 39,
      isUserGenerated: false,
      toneProfile: {
        humor: 20,
        formality: 90,
        emotion: 60,
        urgency: 85
      },
      structure: {
        hook: "[MARKET_SIZE] people face [PROBLEM] daily. We've built the solution they're waiting for.",
        body: [
          "Market opportunity: [TAM] and growing [GROWTH_RATE]%",
          "Our solution: [UNIQUE_VALUE_PROP]",
          "Traction: [KEY_METRICS] in [TIMEFRAME]",
          "The ask: [FUNDING_AMOUNT] for [USE_OF_FUNDS]"
        ],
        cta: "Partner with us to capture [MARKET_SHARE]% of this [MARKET_VALUE] market."
      },
      fillInBlanks: {
        MARKET_SIZE: "500 million",
        PROBLEM: "inefficient workflow management",
        TAM: "$50B total addressable market",
        GROWTH_RATE: "25",
        UNIQUE_VALUE_PROP: "AI-powered automation that learns",
        KEY_METRICS: "200% revenue growth",
        TIMEFRAME: "12 months",
        FUNDING_AMOUNT: "$5M",
        USE_OF_FUNDS: "product development and market expansion",
        MARKET_SHARE: "3",
        MARKET_VALUE: "$50B"
      },
      smartRewrites: {
        persuasive: "Lead with customer pain point and urgency of solution",
        emotional: "Share founder story about discovering this problem",
        humorous: "Start with: 'We're solving a problem so obvious, we're surprised no one fixed it yet...'"
      }
    }
  ];

  const genres = [
    { value: 'all', label: 'All Genres', icon: Star },
    { value: 'persuasive', label: 'Persuasive', icon: Target },
    { value: 'narrative', label: 'Narrative', icon: Heart },
    { value: 'motivational', label: 'Motivational', icon: TrendingUp },
    { value: 'analytical', label: 'Analytical', icon: Briefcase },
    { value: 'celebratory', label: 'Celebratory', icon: Award }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'product-launch', label: 'Product Launch' },
    { value: 'keynote', label: 'Keynote' },
    { value: 'funding-pitch', label: 'Funding Pitch' },
    { value: 'ted-talk', label: 'TED Talk' },
    { value: 'sales-presentation', label: 'Sales Presentation' }
  ];

  const filteredTemplates = templates.filter(template => 
    selectedGenre === 'all' || template.genre === selectedGenre
  );

  const handleToneChange = (tone: keyof ToneSettings, value: number[]) => {
    setToneSettings(prev => ({
      ...prev,
      [tone]: value[0]
    }));
  };

  const generateSmartRewrite = (template: SpeechTemplate, style: 'persuasive' | 'emotional' | 'humorous') => {
    return template.smartRewrites[style];
  };

  const getToneDescription = (value: number) => {
    if (value < 25) return 'Minimal';
    if (value < 50) return 'Light';
    if (value < 75) return 'Moderate';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Tone Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-purple-600" />
            <CardTitle>Smart Template Filters & Tone Designer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genre and Category Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => {
                    const Icon = genre.icon;
                    return (
                      <SelectItem key={genre.value} value={genre.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{genre.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tone Sliders */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Tone Customization</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(toneSettings).map(([tone, value]) => (
                <div key={tone} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 capitalize">{tone}</label>
                    <Badge variant="outline" className="text-xs">
                      {getToneDescription(value)}
                    </Badge>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(val) => handleToneChange(tone as keyof ToneSettings, val)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Minimal</span>
                    <span>Strong</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.difficulty}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{template.genre}</Badge>
                <Badge variant="outline">{template.duration}</Badge>
                {template.isUserGenerated && (
                  <Badge className="bg-purple-100 text-purple-800">Community</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tone Profile Visualization */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Tone Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(template.toneProfile).map(([tone, value]) => (
                    <div key={tone} className="flex justify-between">
                      <span className="capitalize">{tone}:</span>
                      <span className="font-medium">{getToneDescription(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Preview */}
              <div className="p-3 bg-gray-50 rounded text-sm">
                <strong>Hook:</strong> {template.structure.hook.substring(0, 80)}...
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {template.downloads}
                  </span>
                  <span>by {template.author}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    ${template.price}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Customization Modal/Panel */}
      {selectedTemplate && (
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                <CardTitle>Fill-in-the-Blank Builder</CardTitle>
              </div>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Close
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              AI builds the structure, you customize the content
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Fill-in-the-Blank Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedTemplate.fillInBlanks).map(([key, defaultValue]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <Input
                    placeholder={defaultValue}
                    value={customInputs[key] || ''}
                    onChange={(e) => setCustomInputs(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                  />
                </div>
              ))}
            </div>

            {/* Smart Rewrites */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Smart Rewrites</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(selectedTemplate.smartRewrites).map(([style, suggestion]) => (
                  <Card key={style} className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium capitalize">{style}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{suggestion}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Apply Rewrite
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Hook:</strong> {selectedTemplate.structure.hook}
                </div>
                <div>
                  <strong>Body Structure:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {selectedTemplate.structure.body.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Call to Action:</strong> {selectedTemplate.structure.cta}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Save Draft</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Generate Speech
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}