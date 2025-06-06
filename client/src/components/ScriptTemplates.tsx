import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Briefcase, 
  Users, 
  Award, 
  Heart,
  Lightbulb,
  Target,
  Clock,
  Copy,
  Download,
  Wand2,
  Sparkles
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ScriptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: React.ReactNode;
  color: string;
  template: string;
  prompts: {
    label: string;
    placeholder: string;
    key: string;
  }[];
}

const scriptTemplates: ScriptTemplate[] = [
  {
    id: "business-pitch",
    title: "Business Pitch",
    description: "Compelling pitch to investors or clients",
    category: "Business",
    duration: "5-10 min",
    difficulty: "intermediate",
    icon: <Briefcase className="w-5 h-5" />,
    color: "bg-blue-500",
    template: `Good [TIME_OF_DAY], [AUDIENCE_TYPE].

My name is [YOUR_NAME], and I'm here to share an opportunity that could [MAIN_BENEFIT].

[PROBLEM_STATEMENT]

What if I told you there's a solution that [SOLUTION_PREVIEW]?

[COMPANY_NAME] [MAIN_SOLUTION]. Here's how it works:
- [KEY_FEATURE_1]
- [KEY_FEATURE_2] 
- [KEY_FEATURE_3]

Our results speak for themselves: [KEY_METRIC_1], [KEY_METRIC_2], and [KEY_METRIC_3].

The market opportunity is [MARKET_SIZE] and growing at [GROWTH_RATE] annually.

We're seeking [FUNDING_AMOUNT] to [USE_OF_FUNDS]. With your investment, we project [PROJECTED_OUTCOME].

Thank you for your time. I'd love to answer any questions and discuss how we can [CALL_TO_ACTION].`,
    prompts: [
      { label: "Your Name", placeholder: "John Smith", key: "YOUR_NAME" },
      { label: "Time of Day", placeholder: "morning/afternoon/evening", key: "TIME_OF_DAY" },
      { label: "Audience Type", placeholder: "investors/partners/clients", key: "AUDIENCE_TYPE" },
      { label: "Main Benefit", placeholder: "transform your business", key: "MAIN_BENEFIT" },
      { label: "Problem Statement", placeholder: "Companies struggle with...", key: "PROBLEM_STATEMENT" },
      { label: "Solution Preview", placeholder: "increases efficiency by 50%", key: "SOLUTION_PREVIEW" },
      { label: "Company Name", placeholder: "TechCorp", key: "COMPANY_NAME" },
      { label: "Main Solution", placeholder: "provides AI-powered analytics", key: "MAIN_SOLUTION" },
      { label: "Key Feature 1", placeholder: "Real-time data processing", key: "KEY_FEATURE_1" },
      { label: "Key Feature 2", placeholder: "Automated reporting", key: "KEY_FEATURE_2" },
      { label: "Key Feature 3", placeholder: "Custom dashboards", key: "KEY_FEATURE_3" },
      { label: "Key Metric 1", placeholder: "500+ happy customers", key: "KEY_METRIC_1" },
      { label: "Key Metric 2", placeholder: "$2M in revenue", key: "KEY_METRIC_2" },
      { label: "Key Metric 3", placeholder: "99% uptime", key: "KEY_METRIC_3" },
      { label: "Market Size", placeholder: "$50 billion", key: "MARKET_SIZE" },
      { label: "Growth Rate", placeholder: "15%", key: "GROWTH_RATE" },
      { label: "Funding Amount", placeholder: "$1 million", key: "FUNDING_AMOUNT" },
      { label: "Use of Funds", placeholder: "expand our team and technology", key: "USE_OF_FUNDS" },
      { label: "Projected Outcome", placeholder: "10x growth in 2 years", key: "PROJECTED_OUTCOME" },
      { label: "Call to Action", placeholder: "partner with us", key: "CALL_TO_ACTION" }
    ]
  },
  {
    id: "wedding-speech",
    title: "Wedding Speech",
    description: "Heartfelt speech for special occasions",
    category: "Personal",
    duration: "3-5 min",
    difficulty: "beginner",
    icon: <Heart className="w-5 h-5" />,
    color: "bg-pink-500",
    template: `Good evening, everyone!

For those who don't know me, I'm [YOUR_NAME], [RELATIONSHIP_TO_COUPLE].

[COUPLE_NAMES], when I think about your love story, I'm reminded of [MEMORABLE_MOMENT].

[GROOM_NAME], I remember when you first told me about [BRIDE_NAME]. [STORY_ABOUT_GROOM].

[BRIDE_NAME], [STORY_ABOUT_BRIDE].

What makes your relationship special is [UNIQUE_QUALITY]. You both [SHARED_TRAIT].

As you begin this new chapter together, I wish you [WISH_1], [WISH_2], and [WISH_3].

Let's raise our glasses to [COUPLE_NAMES] - may your love story continue to inspire us all!

Cheers!`,
    prompts: [
      { label: "Your Name", placeholder: "Sarah", key: "YOUR_NAME" },
      { label: "Relationship to Couple", placeholder: "the bride's sister", key: "RELATIONSHIP_TO_COUPLE" },
      { label: "Couple Names", placeholder: "Emily and Jake", key: "COUPLE_NAMES" },
      { label: "Memorable Moment", placeholder: "how they met at the coffee shop", key: "MEMORABLE_MOMENT" },
      { label: "Groom's Name", placeholder: "Jake", key: "GROOM_NAME" },
      { label: "Bride's Name", placeholder: "Emily", key: "BRIDE_NAME" },
      { label: "Story About Groom", placeholder: "Your eyes lit up like I'd never seen before", key: "STORY_ABOUT_GROOM" },
      { label: "Story About Bride", placeholder: "you couldn't stop smiling for weeks", key: "STORY_ABOUT_BRIDE" },
      { label: "Unique Quality", placeholder: "how you both love adventure", key: "UNIQUE_QUALITY" },
      { label: "Shared Trait", placeholder: "make each other laugh every single day", key: "SHARED_TRAIT" },
      { label: "Wish 1", placeholder: "endless laughter", key: "WISH_1" },
      { label: "Wish 2", placeholder: "unwavering support", key: "WISH_2" },
      { label: "Wish 3", placeholder: "adventures that last a lifetime", key: "WISH_3" }
    ]
  },
  {
    id: "conference-keynote",
    title: "Conference Keynote",
    description: "Inspiring presentation for large audiences",
    category: "Professional",
    duration: "15-20 min",
    difficulty: "advanced",
    icon: <Users className="w-5 h-5" />,
    color: "bg-purple-500",
    template: `Good [TIME_OF_DAY], [EVENT_NAME] attendees!

[OPENING_HOOK]

My name is [YOUR_NAME], and I've spent [YEARS_EXPERIENCE] years [YOUR_EXPERTISE].

Today, I want to challenge you to think differently about [MAIN_TOPIC].

[CURRENT_STATE_PROBLEM]

But what if I told you that [VISION_STATEMENT]?

Let me share three key insights that will [TRANSFORMATION_PROMISE]:

First: [INSIGHT_1]
[SUPPORTING_STORY_1]

Second: [INSIGHT_2]
[SUPPORTING_STORY_2]

Third: [INSIGHT_3]
[SUPPORTING_STORY_3]

The future belongs to those who [FUTURE_VISION].

I challenge each of you to [CALL_TO_ACTION_1] and [CALL_TO_ACTION_2].

Together, we can [COLLECTIVE_IMPACT].

Thank you for your attention. Now let's [CLOSING_ACTION].`,
    prompts: [
      { label: "Time of Day", placeholder: "morning", key: "TIME_OF_DAY" },
      { label: "Event Name", placeholder: "TechSummit 2024", key: "EVENT_NAME" },
      { label: "Opening Hook", placeholder: "Imagine a world where AI and humans collaborate seamlessly", key: "OPENING_HOOK" },
      { label: "Your Name", placeholder: "Dr. Alex Chen", key: "YOUR_NAME" },
      { label: "Years Experience", placeholder: "15", key: "YEARS_EXPERIENCE" },
      { label: "Your Expertise", placeholder: "researching artificial intelligence", key: "YOUR_EXPERTISE" },
      { label: "Main Topic", placeholder: "the future of work", key: "MAIN_TOPIC" },
      { label: "Current State Problem", placeholder: "Many fear AI will replace human creativity", key: "CURRENT_STATE_PROBLEM" },
      { label: "Vision Statement", placeholder: "AI will actually amplify human potential", key: "VISION_STATEMENT" },
      { label: "Transformation Promise", placeholder: "reshape how you approach innovation", key: "TRANSFORMATION_PROMISE" },
      { label: "Insight 1", placeholder: "Collaboration beats competition", key: "INSIGHT_1" },
      { label: "Supporting Story 1", placeholder: "Last year, our team...", key: "SUPPORTING_STORY_1" },
      { label: "Insight 2", placeholder: "Creativity emerges from constraints", key: "INSIGHT_2" },
      { label: "Supporting Story 2", placeholder: "When Netflix faced bandwidth limits...", key: "SUPPORTING_STORY_2" },
      { label: "Insight 3", placeholder: "Purpose drives performance", key: "INSIGHT_3" },
      { label: "Supporting Story 3", placeholder: "Studies show teams with clear purpose...", key: "SUPPORTING_STORY_3" },
      { label: "Future Vision", placeholder: "embrace change as opportunity", key: "FUTURE_VISION" },
      { label: "Call to Action 1", placeholder: "start one AI collaboration project", key: "CALL_TO_ACTION_1" },
      { label: "Call to Action 2", placeholder: "mentor someone in your field", key: "CALL_TO_ACTION_2" },
      { label: "Collective Impact", placeholder: "build a more innovative future", key: "COLLECTIVE_IMPACT" },
      { label: "Closing Action", placeholder: "make it happen", key: "CLOSING_ACTION" }
    ]
  },
  {
    id: "sales-presentation",
    title: "Sales Presentation",
    description: "Persuasive pitch to close deals",
    category: "Business",
    duration: "10-15 min",
    difficulty: "intermediate",
    icon: <Target className="w-5 h-5" />,
    color: "bg-green-500",
    template: `Hello [CLIENT_NAME] team,

Thank you for taking the time to meet with us today.

I understand you're facing [PAIN_POINT_1] and [PAIN_POINT_2]. These challenges are costing you [COST_OF_PROBLEM].

We've helped companies like [SIMILAR_CLIENT] solve exactly these issues.

Our solution, [PRODUCT_NAME], provides:
- [BENEFIT_1] - resulting in [SPECIFIC_OUTCOME_1]
- [BENEFIT_2] - leading to [SPECIFIC_OUTCOME_2]  
- [BENEFIT_3] - achieving [SPECIFIC_OUTCOME_3]

Let me show you exactly how this works: [DEMO_DESCRIPTION]

[CASE_STUDY]: [CASE_STUDY_RESULTS]

The investment for this solution is [PRICE], and based on [ROI_CALCULATION], you'll see a return of [ROI_PERCENTAGE] within [TIME_FRAME].

We can have you up and running in [IMPLEMENTATION_TIME].

What questions do you have about moving forward with [NEXT_STEP]?`,
    prompts: [
      { label: "Client Name", placeholder: "Acme Corp", key: "CLIENT_NAME" },
      { label: "Pain Point 1", placeholder: "inefficient processes", key: "PAIN_POINT_1" },
      { label: "Pain Point 2", placeholder: "high operational costs", key: "PAIN_POINT_2" },
      { label: "Cost of Problem", placeholder: "$100k annually", key: "COST_OF_PROBLEM" },
      { label: "Similar Client", placeholder: "TechStart Inc", key: "SIMILAR_CLIENT" },
      { label: "Product Name", placeholder: "EfficiencyPro", key: "PRODUCT_NAME" },
      { label: "Benefit 1", placeholder: "Automated workflow management", key: "BENEFIT_1" },
      { label: "Specific Outcome 1", placeholder: "50% time savings", key: "SPECIFIC_OUTCOME_1" },
      { label: "Benefit 2", placeholder: "Real-time analytics dashboard", key: "BENEFIT_2" },
      { label: "Specific Outcome 2", placeholder: "data-driven decisions", key: "SPECIFIC_OUTCOME_2" },
      { label: "Benefit 3", placeholder: "24/7 customer support", key: "BENEFIT_3" },
      { label: "Specific Outcome 3", placeholder: "99% uptime guarantee", key: "SPECIFIC_OUTCOME_3" },
      { label: "Demo Description", placeholder: "Live demonstration of the dashboard", key: "DEMO_DESCRIPTION" },
      { label: "Case Study", placeholder: "ManufacturingCorp", key: "CASE_STUDY" },
      { label: "Case Study Results", placeholder: "reduced costs by 30% in 6 months", key: "CASE_STUDY_RESULTS" },
      { label: "Price", placeholder: "$50k annually", key: "PRICE" },
      { label: "ROI Calculation", placeholder: "your current savings", key: "ROI_CALCULATION" },
      { label: "ROI Percentage", placeholder: "200%", key: "ROI_PERCENTAGE" },
      { label: "Time Frame", placeholder: "12 months", key: "TIME_FRAME" },
      { label: "Implementation Time", placeholder: "2 weeks", key: "IMPLEMENTATION_TIME" },
      { label: "Next Step", placeholder: "a pilot program", key: "NEXT_STEP" }
    ]
  },
  {
    id: "graduation-speech",
    title: "Graduation Speech",
    description: "Inspirational speech for graduates",
    category: "Personal",
    duration: "5-8 min",
    difficulty: "beginner",
    icon: <Award className="w-5 h-5" />,
    color: "bg-yellow-500",
    template: `Dear graduates, families, and faculty,

What an incredible day this is for the [SCHOOL_NAME] Class of [GRADUATION_YEAR]!

[OPENING_REFLECTION]

Graduates, you've worked incredibly hard to reach this moment. Through [CHALLENGE_1] and [CHALLENGE_2], you've shown [ADMIRABLE_QUALITY].

As you leave [SCHOOL_NAME] and enter [NEXT_PHASE], remember these three things:

First: [LIFE_LESSON_1]. [SUPPORTING_EXAMPLE_1].

Second: [LIFE_LESSON_2]. [SUPPORTING_EXAMPLE_2].

Third: [LIFE_LESSON_3]. [SUPPORTING_EXAMPLE_3].

The world needs what you have to offer: [UNIQUE_CONTRIBUTION].

Go forward with [ENCOURAGEMENT_1], [ENCOURAGEMENT_2], and [ENCOURAGEMENT_3].

Congratulations, Class of [GRADUATION_YEAR]! Your future starts now.`,
    prompts: [
      { label: "School Name", placeholder: "Lincoln High School", key: "SCHOOL_NAME" },
      { label: "Graduation Year", placeholder: "2024", key: "GRADUATION_YEAR" },
      { label: "Opening Reflection", placeholder: "Four years ago, you walked through these doors as freshmen", key: "OPENING_REFLECTION" },
      { label: "Challenge 1", placeholder: "remote learning", key: "CHALLENGE_1" },
      { label: "Challenge 2", placeholder: "unprecedented changes", key: "CHALLENGE_2" },
      { label: "Admirable Quality", placeholder: "resilience and determination", key: "ADMIRABLE_QUALITY" },
      { label: "Next Phase", placeholder: "college and careers", key: "NEXT_PHASE" },
      { label: "Life Lesson 1", placeholder: "Embrace failure as learning", key: "LIFE_LESSON_1" },
      { label: "Supporting Example 1", placeholder: "Every successful person has failed multiple times", key: "SUPPORTING_EXAMPLE_1" },
      { label: "Life Lesson 2", placeholder: "Stay curious and keep learning", key: "LIFE_LESSON_2" },
      { label: "Supporting Example 2", placeholder: "The jobs of tomorrow don't exist today", key: "SUPPORTING_EXAMPLE_2" },
      { label: "Life Lesson 3", placeholder: "Make a difference in others' lives", key: "LIFE_LESSON_3" },
      { label: "Supporting Example 3", placeholder: "True success is measured by impact", key: "SUPPORTING_EXAMPLE_3" },
      { label: "Unique Contribution", placeholder: "your energy, creativity, and fresh perspectives", key: "UNIQUE_CONTRIBUTION" },
      { label: "Encouragement 1", placeholder: "confidence", key: "ENCOURAGEMENT_1" },
      { label: "Encouragement 2", placeholder: "compassion", key: "ENCOURAGEMENT_2" },
      { label: "Encouragement 3", placeholder: "courage", key: "ENCOURAGEMENT_3" }
    ]
  },
  {
    id: "ted-talk",
    title: "TED Talk",
    description: "Ideas worth spreading format",
    category: "Professional",
    duration: "12-18 min",
    difficulty: "advanced",
    icon: <Lightbulb className="w-5 h-5" />,
    color: "bg-red-500",
    template: `[POWERFUL_OPENING]

[PERSONAL_CONNECTION]

Today, I want to share an idea that could [IMPACT_STATEMENT].

It started [ORIGIN_STORY].

But here's what I discovered: [KEY_INSIGHT].

Let me take you on a journey that began [STORY_BEGINNING].

[STORY_DEVELOPMENT]

This taught me that [LESSON_LEARNED].

Now, imagine if [SCALING_VISION].

The science behind this is fascinating: [SUPPORTING_RESEARCH].

Here's what this means for you: [PRACTICAL_APPLICATION].

I challenge you to [AUDIENCE_CHALLENGE].

If we all [COLLECTIVE_ACTION], we can [WORLD_CHANGE].

The question isn't whether we can do this. The question is: will we?

Thank you.`,
    prompts: [
      { label: "Powerful Opening", placeholder: "What if I told you that 5 minutes could change your life?", key: "POWERFUL_OPENING" },
      { label: "Personal Connection", placeholder: "Three years ago, I was struggling with anxiety", key: "PERSONAL_CONNECTION" },
      { label: "Impact Statement", placeholder: "transform how we think about mental health", key: "IMPACT_STATEMENT" },
      { label: "Origin Story", placeholder: "when I noticed a pattern in my daily habits", key: "ORIGIN_STORY" },
      { label: "Key Insight", placeholder: "Small actions create massive ripple effects", key: "KEY_INSIGHT" },
      { label: "Story Beginning", placeholder: "with a simple 5-minute morning routine", key: "STORY_BEGINNING" },
      { label: "Story Development", placeholder: "Within weeks, I noticed my anxiety decreasing", key: "STORY_DEVELOPMENT" },
      { label: "Lesson Learned", placeholder: "consistency beats intensity every time", key: "LESSON_LEARNED" },
      { label: "Scaling Vision", placeholder: "everyone adopted just one tiny habit", key: "SCALING_VISION" },
      { label: "Supporting Research", placeholder: "Studies show habit formation takes 66 days on average", key: "SUPPORTING_RESEARCH" },
      { label: "Practical Application", placeholder: "Start with 2 minutes, not 2 hours", key: "PRACTICAL_APPLICATION" },
      { label: "Audience Challenge", placeholder: "choose one tiny habit for the next 30 days", key: "AUDIENCE_CHALLENGE" },
      { label: "Collective Action", placeholder: "commit to small, daily improvements", key: "COLLECTIVE_ACTION" },
      { label: "World Change", placeholder: "create a healthier, happier society", key: "WORLD_CHANGE" }
    ]
  }
];

export default function ScriptTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplate | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Business", "Personal", "Professional"];

  const filteredTemplates = selectedCategory === "all" 
    ? scriptTemplates 
    : scriptTemplates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template: ScriptTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedScript("");
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateScript = () => {
    if (!selectedTemplate) return;

    let script = selectedTemplate.template;
    
    selectedTemplate.prompts.forEach(prompt => {
      const value = formData[prompt.key] || `[${prompt.key}]`;
      script = script.replace(new RegExp(`\\[${prompt.key}\\]`, 'g'), value);
    });

    setGeneratedScript(script);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
  };

  const downloadScript = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate?.title.replace(/\s+/g, '-').toLowerCase()}-script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display gradient-text mb-2">Script Templates</h1>
            <p className="text-gray-600">Choose from professional templates to create compelling speeches</p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="gradient-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${template.color} text-white group-hover:scale-110 transition-transform`}>
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{template.duration}</span>
                    </span>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display gradient-text">{selectedTemplate.title}</h1>
              <p className="text-gray-600">{selectedTemplate.description}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedTemplate(null)}
            >
              Back to Templates
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="gradient-card purple-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  <span>Customize Your Script</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate.prompts.map((prompt) => (
                  <div key={prompt.key}>
                    <Label htmlFor={prompt.key}>{prompt.label}</Label>
                    {prompt.key.includes('STORY') || prompt.key.includes('DESCRIPTION') ? (
                      <Textarea
                        id={prompt.key}
                        placeholder={prompt.placeholder}
                        value={formData[prompt.key] || ""}
                        onChange={(e) => handleInputChange(prompt.key, e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        id={prompt.key}
                        placeholder={prompt.placeholder}
                        value={formData[prompt.key] || ""}
                        onChange={(e) => handleInputChange(prompt.key, e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>
                ))}
                
                <Button 
                  onClick={generateScript}
                  className="w-full gradient-bg text-white hover:opacity-90 purple-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Script
                </Button>
              </CardContent>
            </Card>

            {/* Generated Script */}
            <Card className="gradient-card purple-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Your Generated Script</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedScript ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                        {generatedScript}
                      </pre>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadScript}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Fill out the form and click "Generate Script" to create your personalized speech</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}