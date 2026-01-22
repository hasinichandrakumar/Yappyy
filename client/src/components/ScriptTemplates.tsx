import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AITemplatePersonalization } from "./AITemplatePersonalization";
import jsPDF from "jspdf";
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
  Sparkles,
  TrendingUp,
  Bot,
  Zap,
  Rocket,
  UserCheck,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  FileDown
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  tags?: string[];
  popularity?: number;
  contentAdvice?: string;
  voiceAdvice?: string;
  bodyLanguageAdvice?: string;
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
    id: "product-launch",
    title: "Product Launch",
    description: "Unveiling new products with excitement",
    category: "Business",
    duration: "8-12 min",
    difficulty: "intermediate",
    icon: <Target className="w-5 h-5" />,
    color: "bg-cyan-500",
    template: `Welcome everyone to [EVENT_NAME]!

I'm [YOUR_NAME], [YOUR_TITLE] at [COMPANY_NAME], and today is a special day.

[OPENING_HOOK]

For [TIME_PERIOD], we've been working on something revolutionary. Something that will [IMPACT_STATEMENT].

Today, I'm thrilled to introduce [PRODUCT_NAME].

[PROBLEM_SECTION]: [CURRENT_PAIN_POINT]

We asked ourselves: What if [VISION_QUESTION]?

[PRODUCT_NAME] is our answer. Here's what makes it special:

🚀 [FEATURE_1]: [BENEFIT_1]
🎯 [FEATURE_2]: [BENEFIT_2]  
⚡ [FEATURE_3]: [BENEFIT_3]

But let me show you: [DEMO_DESCRIPTION]

[CUSTOMER_STORY]: [BETA_RESULTS]

Starting [AVAILABILITY_DATE], [PRODUCT_NAME] will be available for [PRICE].

This is just the beginning. Together, we're [FUTURE_VISION].

Thank you for joining us on this journey!`,
    prompts: [
      { label: "Event Name", placeholder: "Apple Keynote 2024", key: "EVENT_NAME" },
      { label: "Your Name", placeholder: "Tim Cook", key: "YOUR_NAME" },
      { label: "Your Title", placeholder: "CEO", key: "YOUR_TITLE" },
      { label: "Company Name", placeholder: "Apple", key: "COMPANY_NAME" },
      { label: "Opening Hook", placeholder: "Today, we're going to make the impossible possible", key: "OPENING_HOOK" },
      { label: "Time Period", placeholder: "two years", key: "TIME_PERIOD" },
      { label: "Impact Statement", placeholder: "change how you work forever", key: "IMPACT_STATEMENT" },
      { label: "Product Name", placeholder: "iPhone 16 Pro", key: "PRODUCT_NAME" },
      { label: "Problem Section", placeholder: "Current smartphones are limited by", key: "PROBLEM_SECTION" },
      { label: "Current Pain Point", placeholder: "battery life and processing power", key: "CURRENT_PAIN_POINT" },
      { label: "Vision Question", placeholder: "we could have all-day battery with AI processing", key: "VISION_QUESTION" },
      { label: "Feature 1", placeholder: "48-hour battery life", key: "FEATURE_1" },
      { label: "Benefit 1", placeholder: "Never worry about charging again", key: "BENEFIT_1" },
      { label: "Feature 2", placeholder: "AI-powered camera", key: "FEATURE_2" },
      { label: "Benefit 2", placeholder: "Professional photos automatically", key: "BENEFIT_2" },
      { label: "Feature 3", placeholder: "Titanium build", key: "FEATURE_3" },
      { label: "Benefit 3", placeholder: "Strongest phone ever made", key: "BENEFIT_3" },
      { label: "Demo Description", placeholder: "Live demonstration of the camera capabilities", key: "DEMO_DESCRIPTION" },
      { label: "Customer Story", placeholder: "Beta testers reported 95% satisfaction", key: "CUSTOMER_STORY" },
      { label: "Beta Results", placeholder: "increased productivity by 40%", key: "BETA_RESULTS" },
      { label: "Availability Date", placeholder: "September 22nd", key: "AVAILABILITY_DATE" },
      { label: "Price", placeholder: "$999", key: "PRICE" },
      { label: "Future Vision", placeholder: "redefining what's possible with mobile technology", key: "FUTURE_VISION" }
    ]
  },
  {
    id: "team-motivation",
    title: "Team Motivation",
    description: "Inspiring and energizing your team",
    category: "Business",
    duration: "5-10 min",
    difficulty: "beginner",
    icon: <Users className="w-5 h-5" />,
    color: "bg-emerald-500",
    template: `Good [TIME_OF_DAY], team!

I wanted to gather everyone today because [REASON_FOR_MEETING].

First, let me say this: [APPRECIATION_MESSAGE].

Looking at where we started [TIME_PERIOD_BACK] and where we are today, I see [PROGRESS_MADE].

Yes, we've faced [CHALLENGE_1] and [CHALLENGE_2]. But look what we've accomplished:
- [ACHIEVEMENT_1]
- [ACHIEVEMENT_2]
- [ACHIEVEMENT_3]

[PERSONAL_STORY_OR_EXAMPLE]

Moving forward, our goal is [FUTURE_GOAL]. I know we can achieve this because [CONFIDENCE_REASON].

Here's what I need from each of you: [SPECIFIC_ASK].

Remember: [MOTIVATIONAL_MESSAGE].

Together, we're not just [CURRENT_ROLE] - we're [INSPIRING_IDENTITY].

Let's make [TIME_PERIOD_AHEAD] our best period yet!`,
    prompts: [
      { label: "Time of Day", placeholder: "morning", key: "TIME_OF_DAY" },
      { label: "Reason for Meeting", placeholder: "we just hit a major milestone", key: "REASON_FOR_MEETING" },
      { label: "Appreciation Message", placeholder: "Your dedication has been incredible", key: "APPRECIATION_MESSAGE" },
      { label: "Time Period Back", placeholder: "six months ago", key: "TIME_PERIOD_BACK" },
      { label: "Progress Made", placeholder: "a team that's grown stronger and more unified", key: "PROGRESS_MADE" },
      { label: "Challenge 1", placeholder: "tight deadlines", key: "CHALLENGE_1" },
      { label: "Challenge 2", placeholder: "resource constraints", key: "CHALLENGE_2" },
      { label: "Achievement 1", placeholder: "Delivered 3 major projects on time", key: "ACHIEVEMENT_1" },
      { label: "Achievement 2", placeholder: "Improved customer satisfaction by 25%", key: "ACHIEVEMENT_2" },
      { label: "Achievement 3", placeholder: "Built the strongest team culture I've seen", key: "ACHIEVEMENT_3" },
      { label: "Personal Story", placeholder: "Last week, when Sarah stayed late to help...", key: "PERSONAL_STORY_OR_EXAMPLE" },
      { label: "Future Goal", placeholder: "become the top-performing division", key: "FUTURE_GOAL" },
      { label: "Confidence Reason", placeholder: "I've seen what this team can do", key: "CONFIDENCE_REASON" },
      { label: "Specific Ask", placeholder: "keep pushing boundaries and supporting each other", key: "SPECIFIC_ASK" },
      { label: "Motivational Message", placeholder: "Every challenge is an opportunity to grow", key: "MOTIVATIONAL_MESSAGE" },
      { label: "Current Role", placeholder: "a development team", key: "CURRENT_ROLE" },
      { label: "Inspiring Identity", placeholder: "innovators changing the world", key: "INSPIRING_IDENTITY" },
      { label: "Time Period Ahead", placeholder: "the next quarter", key: "TIME_PERIOD_AHEAD" }
    ]
  },
  {
    id: "investor-pitch",
    title: "Investor Pitch",
    description: "Securing funding for your startup",
    category: "Business",
    duration: "10-15 min",
    difficulty: "advanced",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-indigo-500",
    template: `Thank you for your time today.

I'm [YOUR_NAME], founder of [COMPANY_NAME]. We're solving [PROBLEM_STATEMENT].

THE PROBLEM: [MARKET_PROBLEM_DETAIL]

This affects [MARKET_SIZE] people/businesses, costing them [COST_OF_PROBLEM] annually.

OUR SOLUTION: [SOLUTION_DESCRIPTION]

We've developed [PRODUCT_DESCRIPTION] that [UNIQUE_VALUE_PROPOSITION].

TRACTION: In [TIME_PERIOD], we've achieved:
- [METRIC_1]: [VALUE_1]
- [METRIC_2]: [VALUE_2]
- [METRIC_3]: [VALUE_3]

BUSINESS MODEL: We make money through [REVENUE_MODEL], targeting [REVENUE_PER_CUSTOMER] per customer.

MARKET: The [MARKET_CATEGORY] market is worth [TOTAL_MARKET_SIZE] and growing at [GROWTH_RATE] annually.

COMPETITION: Unlike [COMPETITOR_1] and [COMPETITOR_2], we [COMPETITIVE_ADVANTAGE].

TEAM: [TEAM_DESCRIPTION]

FINANCIALS: We project [REVENUE_PROJECTION] by [TARGET_YEAR], with [PROFITABILITY_TIMELINE].

THE ASK: We're raising [FUNDING_AMOUNT] to [USE_OF_FUNDS].

With your investment, we'll [PROJECTED_OUTCOME].

Questions?`,
    prompts: [
      { label: "Your Name", placeholder: "Sarah Chen", key: "YOUR_NAME" },
      { label: "Company Name", placeholder: "EcoTech Solutions", key: "COMPANY_NAME" },
      { label: "Problem Statement", placeholder: "plastic waste in oceans", key: "PROBLEM_STATEMENT" },
      { label: "Market Problem Detail", placeholder: "8 million tons of plastic enter our oceans annually", key: "MARKET_PROBLEM_DETAIL" },
      { label: "Market Size", placeholder: "2 billion", key: "MARKET_SIZE" },
      { label: "Cost of Problem", placeholder: "$200 billion", key: "COST_OF_PROBLEM" },
      { label: "Solution Description", placeholder: "AI-powered plastic collection robots", key: "SOLUTION_DESCRIPTION" },
      { label: "Product Description", placeholder: "autonomous ocean-cleaning drones", key: "PRODUCT_DESCRIPTION" },
      { label: "Unique Value Proposition", placeholder: "removes 10x more plastic than existing methods", key: "UNIQUE_VALUE_PROPOSITION" },
      { label: "Time Period", placeholder: "the last 12 months", key: "TIME_PERIOD" },
      { label: "Metric 1", placeholder: "Plastic removed", key: "METRIC_1" },
      { label: "Value 1", placeholder: "500 tons", key: "VALUE_1" },
      { label: "Metric 2", placeholder: "Pilot partnerships", key: "METRIC_2" },
      { label: "Value 2", placeholder: "15 coastal cities", key: "VALUE_2" },
      { label: "Metric 3", placeholder: "Cost reduction", key: "METRIC_3" },
      { label: "Value 3", placeholder: "60% vs traditional methods", key: "VALUE_3" },
      { label: "Revenue Model", placeholder: "subscription-based ocean cleaning services", key: "REVENUE_MODEL" },
      { label: "Revenue Per Customer", placeholder: "$50,000", key: "REVENUE_PER_CUSTOMER" },
      { label: "Market Category", placeholder: "environmental technology", key: "MARKET_CATEGORY" },
      { label: "Total Market Size", placeholder: "$45 billion", key: "TOTAL_MARKET_SIZE" },
      { label: "Growth Rate", placeholder: "12%", key: "GROWTH_RATE" },
      { label: "Competitor 1", placeholder: "OceanCleanup", key: "COMPETITOR_1" },
      { label: "Competitor 2", placeholder: "SeaVax", key: "COMPETITOR_2" },
      { label: "Competitive Advantage", placeholder: "offer 24/7 autonomous operation with AI optimization", key: "COMPETITIVE_ADVANTAGE" },
      { label: "Team Description", placeholder: "Former SpaceX engineers with 30+ years combined experience", key: "TEAM_DESCRIPTION" },
      { label: "Revenue Projection", placeholder: "$10 million in revenue", key: "REVENUE_PROJECTION" },
      { label: "Target Year", placeholder: "2027", key: "TARGET_YEAR" },
      { label: "Profitability Timeline", placeholder: "breakeven by month 18", key: "PROFITABILITY_TIMELINE" },
      { label: "Funding Amount", placeholder: "$2 million", key: "FUNDING_AMOUNT" },
      { label: "Use of Funds", placeholder: "scale manufacturing and expand to 50 cities", key: "USE_OF_FUNDS" },
      { label: "Projected Outcome", placeholder: "clean 1 million tons of ocean plastic annually", key: "PROJECTED_OUTCOME" }
    ]
  },
  {
    id: "award-acceptance",
    title: "Award Acceptance",
    description: "Gracious and memorable acceptance speech",
    category: "Personal",
    duration: "3-5 min",
    difficulty: "intermediate",
    icon: <Award className="w-5 h-5" />,
    color: "bg-gold-500",
    template: `Thank you so much for this incredible honor.

[EMOTIONAL_OPENING]

When I started [JOURNEY_BEGINNING], I never imagined [UNEXPECTED_OUTCOME].

This award doesn't just belong to me. It belongs to [ACKNOWLEDGMENT_1], [ACKNOWLEDGMENT_2], and [ACKNOWLEDGMENT_3].

[PERSONAL_STORY]

[MENTOR_RECOGNITION]: [MENTOR_IMPACT].

To my [FAMILY_TEAM]: [FAMILY_GRATITUDE].

This recognition reminds us that [BROADER_MESSAGE].

I accept this award not as an endpoint, but as [FUTURE_COMMITMENT].

Together, we can [CALL_TO_ACTION].

Thank you again for this tremendous honor.`,
    prompts: [
      { label: "Emotional Opening", placeholder: "I'm honestly overwhelmed by this recognition", key: "EMOTIONAL_OPENING" },
      { label: "Journey Beginning", placeholder: "my career 20 years ago", key: "JOURNEY_BEGINNING" },
      { label: "Unexpected Outcome", placeholder: "I'd be standing here today", key: "UNEXPECTED_OUTCOME" },
      { label: "Acknowledgment 1", placeholder: "my incredible team", key: "ACKNOWLEDGMENT_1" },
      { label: "Acknowledgment 2", placeholder: "the patients who trusted us", key: "ACKNOWLEDGMENT_2" },
      { label: "Acknowledgment 3", placeholder: "the research community", key: "ACKNOWLEDGMENT_3" },
      { label: "Personal Story", placeholder: "Three years ago, we had a breakthrough moment...", key: "PERSONAL_STORY" },
      { label: "Mentor Recognition", placeholder: "Dr. Sarah Williams taught me", key: "MENTOR_RECOGNITION" },
      { label: "Mentor Impact", placeholder: "that great science serves humanity", key: "MENTOR_IMPACT" },
      { label: "Family Team", placeholder: "family", key: "FAMILY_TEAM" },
      { label: "Family Gratitude", placeholder: "thank you for believing in this dream", key: "FAMILY_GRATITUDE" },
      { label: "Broader Message", placeholder: "innovation thrives when we support each other", key: "BROADER_MESSAGE" },
      { label: "Future Commitment", placeholder: "a responsibility to do even more", key: "FUTURE_COMMITMENT" },
      { label: "Call to Action", placeholder: "continue pushing the boundaries of what's possible", key: "CALL_TO_ACTION" }
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
  },
  
  // NEW COMPREHENSIVE TEMPLATES - Significantly expanding the template library
  {
    id: "product-launch",
    title: "Product Launch Presentation",
    description: "Compelling product launch for new features or products",
    category: "Business",
    duration: "10-15 min",
    difficulty: "intermediate",
    icon: <Rocket className="w-5 h-5" />,
    color: "bg-purple-500",
    tags: ["launch", "product", "announcement", "marketing"],
    popularity: 88,
    contentAdvice: "Focus on customer benefits rather than features. Include a clear problem-solution narrative and social proof.",
    voiceAdvice: "Use energetic and confident delivery with strategic pauses for emphasis on key benefits.",
    bodyLanguageAdvice: "Use gestures to demonstrate product usage and maintain eye contact to build trust.",
    template: `Good [TIME_OF_DAY], [AUDIENCE_TYPE]!

Today marks a milestone for [COMPANY_NAME] and, more importantly, for you.

[PROBLEM_INTRODUCTION] has been a challenge for [TARGET_AUDIENCE] for too long.

I'm excited to introduce [PRODUCT_NAME] - [PRODUCT_TAGLINE].

Here's how it works:
• [KEY_FEATURE_1]
• [KEY_FEATURE_2] 
• [KEY_FEATURE_3]

But features don't matter if they don't solve real problems. Let me show you what this means for you:

[BENEFIT_1] means [SPECIFIC_OUTCOME_1].
[BENEFIT_2] results in [SPECIFIC_OUTCOME_2].
[BENEFIT_3] delivers [SPECIFIC_OUTCOME_3].

We've already seen incredible results: [SUCCESS_METRIC_1], [SUCCESS_METRIC_2], and [SUCCESS_METRIC_3].

[CUSTOMER_TESTIMONIAL]

Starting [AVAILABILITY_DATE], [PRODUCT_NAME] will be available [WHERE_TO_GET].

For the first [LIMITED_TIME], we're offering [SPECIAL_OFFER].

This isn't just a product launch - it's the beginning of [VISION_STATEMENT].

Thank you. I'm excited to answer your questions and show you [PRODUCT_NAME] in action.`,
    prompts: [
      { label: "Time of Day", placeholder: "morning/afternoon/evening", key: "TIME_OF_DAY" },
      { label: "Audience Type", placeholder: "team/customers/investors", key: "AUDIENCE_TYPE" },
      { label: "Company Name", placeholder: "TechCorp", key: "COMPANY_NAME" },
      { label: "Problem Introduction", placeholder: "Managing complex data workflows", key: "PROBLEM_INTRODUCTION" },
      { label: "Target Audience", placeholder: "data scientists and analysts", key: "TARGET_AUDIENCE" },
      { label: "Product Name", placeholder: "DataFlow Pro", key: "PRODUCT_NAME" },
      { label: "Product Tagline", placeholder: "the first AI-powered data orchestration platform", key: "PRODUCT_TAGLINE" },
      { label: "Key Feature 1", placeholder: "One-click data pipeline creation", key: "KEY_FEATURE_1" },
      { label: "Key Feature 2", placeholder: "Real-time error detection and auto-healing", key: "KEY_FEATURE_2" },
      { label: "Key Feature 3", placeholder: "Collaborative workspace with version control", key: "KEY_FEATURE_3" },
      { label: "Benefit 1", placeholder: "Reducing setup time by 90%", key: "BENEFIT_1" },
      { label: "Specific Outcome 1", placeholder: "you can focus on insights instead of infrastructure", key: "SPECIFIC_OUTCOME_1" },
      { label: "Benefit 2", placeholder: "Eliminating data pipeline failures", key: "BENEFIT_2" },
      { label: "Specific Outcome 2", placeholder: "99.9% uptime for your critical workflows", key: "SPECIFIC_OUTCOME_2" },
      { label: "Benefit 3", placeholder: "Team collaboration at scale", key: "BENEFIT_3" },
      { label: "Specific Outcome 3", placeholder: "seamless handoffs between data teams", key: "SPECIFIC_OUTCOME_3" },
      { label: "Success Metric 1", placeholder: "500+ beta users", key: "SUCCESS_METRIC_1" },
      { label: "Success Metric 2", placeholder: "85% reduction in pipeline errors", key: "SUCCESS_METRIC_2" },
      { label: "Success Metric 3", placeholder: "4.9/5 user satisfaction", key: "SUCCESS_METRIC_3" },
      { label: "Customer Testimonial", placeholder: "Sarah from DataTech says: 'This transformed our entire workflow'", key: "CUSTOMER_TESTIMONIAL" },
      { label: "Availability Date", placeholder: "next Monday", key: "AVAILABILITY_DATE" },
      { label: "Where to Get", placeholder: "at dataflowpro.com", key: "WHERE_TO_GET" },
      { label: "Limited Time", placeholder: "30 days", key: "LIMITED_TIME" },
      { label: "Special Offer", placeholder: "50% off the first year", key: "SPECIAL_OFFER" },
      { label: "Vision Statement", placeholder: "making data science accessible to everyone", key: "VISION_STATEMENT" }
    ]
  },
  
  {
    id: "job-interview",
    title: "Job Interview Presentation",
    description: "Professional interview presentation for your dream role",
    category: "Professional",
    duration: "5-10 min",
    difficulty: "intermediate",
    icon: <UserCheck className="w-5 h-5" />,
    color: "bg-green-500",
    tags: ["interview", "career", "professional", "hiring"],
    popularity: 95,
    contentAdvice: "Tell a compelling story about your career journey with specific achievements and quantifiable results.",
    voiceAdvice: "Project confidence without arrogance. Use clear, measured delivery with enthusiasm for the role.",
    bodyLanguageAdvice: "Maintain professional posture and genuine eye contact. Use gestures sparingly but purposefully.",
    template: `Good [TIME_OF_DAY], [INTERVIEWER_NAMES]. Thank you for this opportunity.

I'm [YOUR_NAME], and I'm excited to discuss how my experience aligns with [COMPANY_NAME]'s vision for [POSITION_TITLE].

My journey began [CAREER_START_STORY]. This taught me [EARLY_LESSON], which became the foundation of my approach to [RELEVANT_SKILL].

In my role as [CURRENT_PREVIOUS_POSITION] at [CURRENT_PREVIOUS_COMPANY], I [MAJOR_ACHIEVEMENT_1]. This resulted in [QUANTIFIABLE_RESULT_1].

One challenge that defined my growth was [SPECIFIC_CHALLENGE]. Here's how I approached it:
• [APPROACH_STEP_1]
• [APPROACH_STEP_2]
• [APPROACH_STEP_3]

The outcome was [CHALLENGE_OUTCOME], which taught me [LESSON_LEARNED].

I've also led initiatives in [LEADERSHIP_EXAMPLE]. By [SPECIFIC_ACTION], we achieved [TEAM_RESULT].

What excites me about [COMPANY_NAME] is [COMPANY_SPECIFIC_INTEREST]. I see an opportunity to contribute by [YOUR_CONTRIBUTION_VISION].

My experience with [RELEVANT_EXPERTISE] and my passion for [PASSION_AREA] position me to [VALUE_PROPOSITION].

In the next 90 days, I would focus on [90_DAY_PLAN]. Within a year, I envision [1_YEAR_VISION].

I'd love to hear more about [QUESTION_FOR_THEM] and discuss how we can [MUTUAL_SUCCESS].

Thank you.`,
    prompts: [
      { label: "Time of Day", placeholder: "morning/afternoon", key: "TIME_OF_DAY" },
      { label: "Interviewer Names", placeholder: "Sarah and Michael", key: "INTERVIEWER_NAMES" },
      { label: "Your Name", placeholder: "Alex Johnson", key: "YOUR_NAME" },
      { label: "Company Name", placeholder: "TechCorp", key: "COMPANY_NAME" },
      { label: "Position Title", placeholder: "Senior Product Manager", key: "POSITION_TITLE" },
      { label: "Career Start Story", placeholder: "when I built my first app in college", key: "CAREER_START_STORY" },
      { label: "Early Lesson", placeholder: "user feedback is worth more than perfect code", key: "EARLY_LESSON" },
      { label: "Relevant Skill", placeholder: "product development", key: "RELEVANT_SKILL" },
      { label: "Current/Previous Position", placeholder: "Product Manager", key: "CURRENT_PREVIOUS_POSITION" },
      { label: "Current/Previous Company", placeholder: "StartupTech", key: "CURRENT_PREVIOUS_COMPANY" },
      { label: "Major Achievement 1", placeholder: "led the redesign of our core platform", key: "MAJOR_ACHIEVEMENT_1" },
      { label: "Quantifiable Result 1", placeholder: "30% increase in user engagement and $2M additional revenue", key: "QUANTIFIABLE_RESULT_1" },
      { label: "Specific Challenge", placeholder: "launching a product in a completely new market", key: "SPECIFIC_CHALLENGE" },
      { label: "Approach Step 1", placeholder: "Conducted 50+ customer interviews", key: "APPROACH_STEP_1" },
      { label: "Approach Step 2", placeholder: "Built MVPs with rapid iteration cycles", key: "APPROACH_STEP_2" },
      { label: "Approach Step 3", placeholder: "Collaborated closely with design and engineering", key: "APPROACH_STEP_3" },
      { label: "Challenge Outcome", placeholder: "successful product launch with 15K users in 3 months", key: "CHALLENGE_OUTCOME" },
      { label: "Lesson Learned", placeholder: "the importance of market validation before feature development", key: "LESSON_LEARNED" },
      { label: "Leadership Example", placeholder: "cross-functional team coordination", key: "LEADERSHIP_EXAMPLE" },
      { label: "Specific Action", placeholder: "implementing weekly sync meetings and shared KPIs", key: "SPECIFIC_ACTION" },
      { label: "Team Result", placeholder: "reduced project delivery time by 40%", key: "TEAM_RESULT" },
      { label: "Company Specific Interest", placeholder: "your commitment to sustainable technology solutions", key: "COMPANY_SPECIFIC_INTEREST" },
      { label: "Your Contribution Vision", placeholder: "bringing user-centered design to enterprise products", key: "YOUR_CONTRIBUTION_VISION" },
      { label: "Relevant Expertise", placeholder: "B2B SaaS product management", key: "RELEVANT_EXPERTISE" },
      { label: "Passion Area", placeholder: "creating intuitive user experiences", key: "PASSION_AREA" },
      { label: "Value Proposition", placeholder: "drive product adoption and customer satisfaction", key: "VALUE_PROPOSITION" },
      { label: "90 Day Plan", placeholder: "understanding customer needs and product roadmap priorities", key: "90_DAY_PLAN" },
      { label: "1 Year Vision", placeholder: "launching 2 major features that increase customer retention by 25%", key: "1_YEAR_VISION" },
      { label: "Question for Them", placeholder: "the team's biggest product challenges", key: "QUESTION_FOR_THEM" },
      { label: "Mutual Success", placeholder: "accelerate TechCorp's growth in the enterprise market", key: "MUTUAL_SUCCESS" }
    ]
  },

  {
    id: "crisis-communication",
    title: "Crisis Communication",
    description: "Professional crisis response and damage control",
    category: "Professional",
    duration: "3-7 min",
    difficulty: "advanced",
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "bg-red-500",
    tags: ["crisis", "communication", "pr", "emergency"],
    popularity: 72,
    contentAdvice: "Lead with accountability and transparency. Focus on solutions and next steps rather than dwelling on problems.",
    voiceAdvice: "Use calm, measured tone that conveys seriousness and control. Avoid defensive language.",
    bodyLanguageAdvice: "Maintain composed posture and direct eye contact. Keep gestures minimal and purposeful.",
    template: `[AUDIENCE_TYPE], thank you for your time.

I want to address [CRISIS_SITUATION] directly and transparently.

First, let me be clear: [ACCOUNTABILITY_STATEMENT].

Here's what happened: [FACTUAL_SUMMARY].

We take full responsibility for [RESPONSIBILITY_SCOPE] and sincerely apologize to [AFFECTED_PARTIES].

Our immediate response has been:
• [IMMEDIATE_ACTION_1]
• [IMMEDIATE_ACTION_2] 
• [IMMEDIATE_ACTION_3]

To prevent this from happening again, we are implementing:
• [PREVENTION_MEASURE_1]
• [PREVENTION_MEASURE_2]
• [PREVENTION_MEASURE_3]

For those affected: [SPECIFIC_REMEDY_OFFER].

Moving forward, we commit to [FUTURE_COMMITMENT].

We will provide updates [UPDATE_FREQUENCY] at [COMMUNICATION_CHANNEL].

I understand this situation has [IMPACT_ACKNOWLEDGMENT]. We are committed to [REBUILDING_TRUST_STATEMENT].

I'm here to answer your questions and will continue to be available as we work through this together.

Thank you.`,
    prompts: [
      { label: "Audience Type", placeholder: "customers/stakeholders/media", key: "AUDIENCE_TYPE" },
      { label: "Crisis Situation", placeholder: "the data security incident from Tuesday", key: "CRISIS_SITUATION" },
      { label: "Accountability Statement", placeholder: "this should not have happened and we take full responsibility", key: "ACCOUNTABILITY_STATEMENT" },
      { label: "Factual Summary", placeholder: "unauthorized access was detected in our customer database at 2 PM", key: "FACTUAL_SUMMARY" },
      { label: "Responsibility Scope", placeholder: "the security vulnerability and delayed response", key: "RESPONSIBILITY_SCOPE" },
      { label: "Affected Parties", placeholder: "our customers and their trust in us", key: "AFFECTED_PARTIES" },
      { label: "Immediate Action 1", placeholder: "Secured the breach within 4 hours", key: "IMMEDIATE_ACTION_1" },
      { label: "Immediate Action 2", placeholder: "Notified all affected customers", key: "IMMEDIATE_ACTION_2" },
      { label: "Immediate Action 3", placeholder: "Engaged external security experts", key: "IMMEDIATE_ACTION_3" },
      { label: "Prevention Measure 1", placeholder: "Enhanced encryption protocols", key: "PREVENTION_MEASURE_1" },
      { label: "Prevention Measure 2", placeholder: "24/7 security monitoring", key: "PREVENTION_MEASURE_2" },
      { label: "Prevention Measure 3", placeholder: "Monthly security audits", key: "PREVENTION_MEASURE_3" },
      { label: "Specific Remedy Offer", placeholder: "free credit monitoring and identity protection for one year", key: "SPECIFIC_REMEDY_OFFER" },
      { label: "Future Commitment", placeholder: "transparency and security as our top priorities", key: "FUTURE_COMMITMENT" },
      { label: "Update Frequency", placeholder: "weekly", key: "UPDATE_FREQUENCY" },
      { label: "Communication Channel", placeholder: "our website and email", key: "COMMUNICATION_CHANNEL" },
      { label: "Impact Acknowledgment", placeholder: "caused stress and concern about your personal information", key: "IMPACT_ACKNOWLEDGMENT" },
      { label: "Rebuilding Trust Statement", placeholder: "earning back your trust through our actions, not just words", key: "REBUILDING_TRUST_STATEMENT" }
    ]
  },

  {
    id: "training-workshop",
    title: "Training Workshop Introduction",
    description: "Engaging workshop opening for skill development sessions",
    category: "Professional",
    duration: "5-8 min",
    difficulty: "intermediate",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-blue-600",
    tags: ["training", "workshop", "education", "development"],
    popularity: 81,
    contentAdvice: "Set clear learning objectives and create psychological safety for participation. Use interactive elements.",
    voiceAdvice: "Use engaging, enthusiastic tone with varied pace to maintain energy and attention.",
    bodyLanguageAdvice: "Move around the space naturally and use gestures to encourage participation.",
    template: `Welcome everyone to [WORKSHOP_TITLE]!

I'm [YOUR_NAME], [YOUR_CREDENTIALS], and I'm excited to spend the next [DURATION] with you.

Let's start with a quick question: [OPENING_QUESTION]

Great responses! This tells me you're exactly where you need to be.

Here's what we're going to accomplish today:
• [LEARNING_OBJECTIVE_1]
• [LEARNING_OBJECTIVE_2] 
• [LEARNING_OBJECTIVE_3]

By the end of our time together, you'll be able to [MAIN_OUTCOME].

I believe in learning by doing. So we'll use:
- [ACTIVITY_TYPE_1] to [PURPOSE_1]
- [ACTIVITY_TYPE_2] to [PURPOSE_2]
- [ACTIVITY_TYPE_3] to [PURPOSE_3]

A few ground rules for our time together:
• [GROUND_RULE_1]
• [GROUND_RULE_2]
• [GROUND_RULE_3]

[PERSONAL_STORY_INTRO]: [RELEVANT_EXPERIENCE]. This taught me [KEY_LESSON], which is exactly what we'll explore today.

The research shows [SUPPORTING_STATISTIC]. But here's what's really exciting: [PRACTICAL_INSIGHT].

Let's dive in with our first activity: [FIRST_ACTIVITY].

Remember, the goal isn't perfection—it's progress and practice.

Ready? Let's begin!`,
    prompts: [
      { label: "Workshop Title", placeholder: "Effective Communication Skills", key: "WORKSHOP_TITLE" },
      { label: "Your Name", placeholder: "Sarah Thompson", key: "YOUR_NAME" },
      { label: "Your Credentials", placeholder: "certified communication coach with 10 years experience", key: "YOUR_CREDENTIALS" },
      { label: "Duration", placeholder: "3 hours", key: "DURATION" },
      { label: "Opening Question", placeholder: "How many of you have ever felt misunderstood in an important conversation?", key: "OPENING_QUESTION" },
      { label: "Learning Objective 1", placeholder: "Master active listening techniques", key: "LEARNING_OBJECTIVE_1" },
      { label: "Learning Objective 2", placeholder: "Practice clear and assertive communication", key: "LEARNING_OBJECTIVE_2" },
      { label: "Learning Objective 3", placeholder: "Handle difficult conversations with confidence", key: "LEARNING_OBJECTIVE_3" },
      { label: "Main Outcome", placeholder: "communicate with clarity and confidence in any situation", key: "MAIN_OUTCOME" },
      { label: "Activity Type 1", placeholder: "Role-playing exercises", key: "ACTIVITY_TYPE_1" },
      { label: "Purpose 1", placeholder: "practice real-world scenarios", key: "PURPOSE_1" },
      { label: "Activity Type 2", placeholder: "Partner discussions", key: "ACTIVITY_TYPE_2" },
      { label: "Purpose 2", placeholder: "build active listening skills", key: "PURPOSE_2" },
      { label: "Activity Type 3", placeholder: "Reflection journaling", key: "ACTIVITY_TYPE_3" },
      { label: "Purpose 3", placeholder: "internalize key concepts", key: "PURPOSE_3" },
      { label: "Ground Rule 1", placeholder: "What's shared here, stays here", key: "GROUND_RULE_1" },
      { label: "Ground Rule 2", placeholder: "All questions and perspectives are welcome", key: "GROUND_RULE_2" },
      { label: "Ground Rule 3", placeholder: "Practice with kindness toward yourself and others", key: "GROUND_RULE_3" },
      { label: "Personal Story Intro", placeholder: "Five years ago, I lost a major client due to a communication breakdown", key: "PERSONAL_STORY_INTRO" },
      { label: "Relevant Experience", placeholder: "I realized I was talking at them, not with them", key: "RELEVANT_EXPERIENCE" },
      { label: "Key Lesson", placeholder: "true communication is about connection, not just information", key: "KEY_LESSON" },
      { label: "Supporting Statistic", placeholder: "93% of communication effectiveness comes from tone and body language", key: "SUPPORTING_STATISTIC" },
      { label: "Practical Insight", placeholder: "small changes in how we listen can transform relationships", key: "PRACTICAL_INSIGHT" },
      { label: "First Activity", placeholder: "a listening exercise with a partner", key: "FIRST_ACTIVITY" }
    ]
  },

  {
    id: "sales-presentation",
    title: "Sales Presentation",
    description: "Persuasive sales pitch for products or services",
    category: "Business",
    duration: "10-20 min",
    difficulty: "intermediate",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-orange-500",
    tags: ["sales", "persuasion", "revenue", "client"],
    popularity: 90,
    contentAdvice: "Focus on customer pain points and demonstrate clear ROI. Use social proof and create urgency.",
    voiceAdvice: "Build rapport with conversational tone, then increase energy when presenting solutions.",
    bodyLanguageAdvice: "Use open gestures and lean in during key points. Mirror client's communication style.",
    template: `[GREETING], [CLIENT_NAME].

Thank you for taking the time to meet with me today. I know time is your most valuable asset.

[RAPPORT_BUILDING_STATEMENT].

I've been thinking about our previous conversation where you mentioned [CLIENT_PAIN_POINT]. I believe I can help you solve that.

Let me ask you: What would it mean to your business if you could [DESIRED_OUTCOME]?

That's exactly what [PRODUCT_SERVICE_NAME] does for companies like yours.

Here's the situation many [CLIENT_INDUSTRY] companies face:
• [INDUSTRY_CHALLENGE_1]
• [INDUSTRY_CHALLENGE_2]
• [INDUSTRY_CHALLENGE_3]

Sound familiar?

[PRODUCT_SERVICE_NAME] is specifically designed to address these challenges. Here's how:

[FEATURE_1] means [BENEFIT_1]. For example, [SPECIFIC_EXAMPLE_1].

[FEATURE_2] results in [BENEFIT_2]. One client saw [SUCCESS_STORY_1].

[FEATURE_3] delivers [BENEFIT_3]. This typically leads to [QUANTIFIABLE_OUTCOME].

Let me show you exactly how this would work for [CLIENT_COMPANY]:

Based on your current [CURRENT_SITUATION], implementing our solution would:
• [SPECIFIC_BENEFIT_1]: [PROJECTED_RESULT_1]
• [SPECIFIC_BENEFIT_2]: [PROJECTED_RESULT_2]
• [SPECIFIC_BENEFIT_3]: [PROJECTED_RESULT_3]

The total ROI for [CLIENT_COMPANY] would be approximately [ROI_PROJECTION] within [TIMEFRAME].

Other companies in [CLIENT_INDUSTRY] are already seeing these results:
- [SOCIAL_PROOF_1]
- [SOCIAL_PROOF_2]
- [SOCIAL_PROOF_3]

I recommend we move forward with [RECOMMENDED_PACKAGE] for [INVESTMENT_AMOUNT].

However, [URGENCY_ELEMENT].

What questions do you have about moving forward?`,
    prompts: [
      { label: "Greeting", placeholder: "Good morning/afternoon", key: "GREETING" },
      { label: "Client Name", placeholder: "Michael", key: "CLIENT_NAME" },
      { label: "Rapport Building Statement", placeholder: "I noticed your recent expansion into the European market - congratulations", key: "RAPPORT_BUILDING_STATEMENT" },
      { label: "Client Pain Point", placeholder: "difficulty tracking customer satisfaction across all touchpoints", key: "CLIENT_PAIN_POINT" },
      { label: "Desired Outcome", placeholder: "predict customer churn before it happens", key: "DESIRED_OUTCOME" },
      { label: "Product/Service Name", placeholder: "CustomerInsight Pro", key: "PRODUCT_SERVICE_NAME" },
      { label: "Client Industry", placeholder: "SaaS", key: "CLIENT_INDUSTRY" },
      { label: "Industry Challenge 1", placeholder: "Customer data scattered across multiple platforms", key: "INDUSTRY_CHALLENGE_1" },
      { label: "Industry Challenge 2", placeholder: "Reactive rather than proactive customer success", key: "INDUSTRY_CHALLENGE_2" },
      { label: "Industry Challenge 3", placeholder: "High churn rates in competitive markets", key: "INDUSTRY_CHALLENGE_3" },
      { label: "Feature 1", placeholder: "Unified customer dashboard", key: "FEATURE_1" },
      { label: "Benefit 1", placeholder: "complete customer visibility in one place", key: "BENEFIT_1" },
      { label: "Specific Example 1", placeholder: "see every interaction from first contact to renewal", key: "SPECIFIC_EXAMPLE_1" },
      { label: "Feature 2", placeholder: "Predictive churn analytics", key: "FEATURE_2" },
      { label: "Benefit 2", placeholder: "identify at-risk customers 90 days before they churn", key: "BENEFIT_2" },
      { label: "Success Story 1", placeholder: "TechStart reduced churn by 35% in 6 months", key: "SUCCESS_STORY_1" },
      { label: "Feature 3", placeholder: "Automated intervention workflows", key: "FEATURE_3" },
      { label: "Benefit 3", placeholder: "proactive customer success without manual effort", key: "BENEFIT_3" },
      { label: "Quantifiable Outcome", placeholder: "15-25% reduction in churn rates", key: "QUANTIFIABLE_OUTCOME" },
      { label: "Client Company", placeholder: "TechCorp", key: "CLIENT_COMPANY" },
      { label: "Current Situation", placeholder: "2,500 customers and 18% annual churn", key: "CURRENT_SITUATION" },
      { label: "Specific Benefit 1", placeholder: "Reduced churn from 18% to 12%", key: "SPECIFIC_BENEFIT_1" },
      { label: "Projected Result 1", placeholder: "$450K additional annual revenue", key: "PROJECTED_RESULT_1" },
      { label: "Specific Benefit 2", placeholder: "25% improvement in customer satisfaction", key: "SPECIFIC_BENEFIT_2" },
      { label: "Projected Result 2", placeholder: "increased referrals and expansion revenue", key: "PROJECTED_RESULT_2" },
      { label: "Specific Benefit 3", placeholder: "50% reduction in manual customer success work", key: "SPECIFIC_BENEFIT_3" },
      { label: "Projected Result 3", placeholder: "reallocate 2 FTEs to growth initiatives", key: "PROJECTED_RESULT_3" },
      { label: "ROI Projection", placeholder: "280%", key: "ROI_PROJECTION" },
      { label: "Timeframe", placeholder: "12 months", key: "TIMEFRAME" },
      { label: "Social Proof 1", placeholder: "CloudTech: 40% churn reduction in 8 months", key: "SOCIAL_PROOF_1" },
      { label: "Social Proof 2", placeholder: "DataFlow: $2M additional revenue in year one", key: "SOCIAL_PROOF_2" },
      { label: "Social Proof 3", placeholder: "StartupLabs: Customer satisfaction increased from 7.2 to 9.1", key: "SOCIAL_PROOF_3" },
      { label: "Recommended Package", placeholder: "the Professional plan", key: "RECOMMENDED_PACKAGE" },
      { label: "Investment Amount", placeholder: "$2,500 per month", key: "INVESTMENT_AMOUNT" },
      { label: "Urgency Element", placeholder: "I can offer a 20% discount if we finalize this by Friday", key: "URGENCY_ELEMENT" }
    ]
  },

  // Additional Professional Templates
  {
    id: "team-meeting",
    title: "Team Meeting Leadership",
    description: "Lead productive team meetings with clear outcomes",
    category: "Professional",
    duration: "15-30 min",
    difficulty: "intermediate",
    icon: <Users className="w-5 h-5" />,
    color: "bg-indigo-500",
    tags: ["meeting", "leadership", "team", "productivity"],
    popularity: 87,
    contentAdvice: "Set clear agenda and outcomes. Encourage participation and maintain focus on actionable items.",
    voiceAdvice: "Use confident, inclusive tone that encourages input from all team members.",
    bodyLanguageAdvice: "Make eye contact with all participants and use gestures to facilitate discussion.",
    template: `Good [TIME_OF_DAY], everyone. Thank you for joining today's [MEETING_TYPE].

Before we dive in, let's review our agenda:
• [AGENDA_ITEM_1] - [TIME_1]
• [AGENDA_ITEM_2] - [TIME_2] 
• [AGENDA_ITEM_3] - [TIME_3]
• Next steps and action items - [TIME_4]

Our goal today is to [MEETING_OBJECTIVE] so we can [DESIRED_OUTCOME].

Let's start with [FIRST_TOPIC]. [CONTEXT_FOR_TOPIC].

[FACILITATING_QUESTION]: What are your thoughts on [SPECIFIC_QUESTION]?

[Pause for discussion]

Great points. Let me summarize what I'm hearing: [SUMMARY_TECHNIQUE].

Moving to [SECOND_TOPIC]: [TOPIC_CONTEXT].

[DECISION_POINT]: We need to decide on [DECISION_NEEDED]. Let's hear options from the group.

Based on our discussion, here are our action items:
• [ACTION_ITEM_1] - Owner: [OWNER_1] - Due: [DUE_DATE_1]
• [ACTION_ITEM_2] - Owner: [OWNER_2] - Due: [DUE_DATE_2]
• [ACTION_ITEM_3] - Owner: [OWNER_3] - Due: [DUE_DATE_3]

Next meeting: [NEXT_MEETING_DATE] to review progress on [FOLLOW_UP_TOPIC].

Questions before we wrap up?

Thank you everyone. Let's make it happen!`,
    prompts: [
      { label: "Time of Day", placeholder: "morning/afternoon", key: "TIME_OF_DAY" },
      { label: "Meeting Type", placeholder: "weekly team sync", key: "MEETING_TYPE" },
      { label: "Agenda Item 1", placeholder: "Project Alpha update", key: "AGENDA_ITEM_1" },
      { label: "Time 1", placeholder: "10 min", key: "TIME_1" },
      { label: "Agenda Item 2", placeholder: "Resource allocation discussion", key: "AGENDA_ITEM_2" },
      { label: "Time 2", placeholder: "15 min", key: "TIME_2" },
      { label: "Agenda Item 3", placeholder: "Q3 planning priorities", key: "AGENDA_ITEM_3" },
      { label: "Time 3", placeholder: "20 min", key: "TIME_3" },
      { label: "Time 4", placeholder: "5 min", key: "TIME_4" },
      { label: "Meeting Objective", placeholder: "align on Q3 priorities and resolve resource conflicts", key: "MEETING_OBJECTIVE" },
      { label: "Desired Outcome", placeholder: "move forward with clear ownership and timelines", key: "DESIRED_OUTCOME" },
      { label: "First Topic", placeholder: "Project Alpha timeline", key: "FIRST_TOPIC" },
      { label: "Context for Topic", placeholder: "We're currently 2 weeks behind the original schedule", key: "CONTEXT_FOR_TOPIC" },
      { label: "Facilitating Question", placeholder: "Before we problem-solve", key: "FACILITATING_QUESTION" },
      { label: "Specific Question", placeholder: "the biggest blocker to getting back on track", key: "SPECIFIC_QUESTION" },
      { label: "Summary Technique", placeholder: "the main challenges are timeline pressure and resource constraints", key: "SUMMARY_TECHNIQUE" },
      { label: "Second Topic", placeholder: "resource reallocation", key: "SECOND_TOPIC" },
      { label: "Topic Context", placeholder: "Based on Project Alpha's needs", key: "TOPIC_CONTEXT" },
      { label: "Decision Point", placeholder: "Now for the decision we need to make", key: "DECISION_POINT" },
      { label: "Decision Needed", placeholder: "whether to bring in temporary contractors", key: "DECISION_NEEDED" },
      { label: "Action Item 1", placeholder: "Research contractor options and costs", key: "ACTION_ITEM_1" },
      { label: "Owner 1", placeholder: "Sarah", key: "OWNER_1" },
      { label: "Due Date 1", placeholder: "Friday", key: "DUE_DATE_1" },
      { label: "Action Item 2", placeholder: "Revise Project Alpha timeline", key: "ACTION_ITEM_2" },
      { label: "Owner 2", placeholder: "Mike", key: "OWNER_2" },
      { label: "Due Date 2", placeholder: "Tuesday", key: "DUE_DATE_2" },
      { label: "Action Item 3", placeholder: "Communication plan to stakeholders", key: "ACTION_ITEM_3" },
      { label: "Owner 3", placeholder: "Jenny", key: "OWNER_3" },
      { label: "Due Date 3", placeholder: "Thursday", key: "DUE_DATE_3" },
      { label: "Next Meeting Date", placeholder: "next Friday", key: "NEXT_MEETING_DATE" },
      { label: "Follow Up Topic", placeholder: "Project Alpha progress", key: "FOLLOW_UP_TOPIC" }
    ]
  },

  {
    id: "investor-update",
    title: "Investor Update",
    description: "Professional quarterly update for investors",
    category: "Business",
    duration: "20-30 min",
    difficulty: "advanced",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-emerald-500",
    tags: ["investor", "finance", "quarterly", "business"],
    popularity: 79,
    contentAdvice: "Lead with key metrics and achievements. Be transparent about challenges and show clear action plans.",
    voiceAdvice: "Use confident, data-driven delivery with appropriate pauses for emphasis on key metrics.",
    bodyLanguageAdvice: "Maintain professional posture and use gestures to emphasize growth trends and achievements.",
    template: `Good [TIME_OF_DAY], everyone. Thank you for joining our [QUARTER] investor update.

I'm excited to share our progress and discuss what's ahead for [COMPANY_NAME].

## Key Highlights This Quarter

We achieved [MAJOR_MILESTONE] and hit [KEY_METRIC_1] - a [PERCENTAGE_GROWTH]% increase from last quarter.

Our revenue was [REVENUE_FIGURE], which puts us [REVENUE_COMPARISON] our projections.

## Financial Performance

• Revenue: [REVENUE_DETAIL]
• Growth Rate: [GROWTH_RATE_DETAIL] 
• Cash Position: [CASH_POSITION]
• Burn Rate: [BURN_RATE] - giving us [RUNWAY] of runway

## Product & Market Progress

This quarter, we [PRODUCT_ACHIEVEMENT]. Our customers are responding well: [CUSTOMER_FEEDBACK].

Market traction highlights:
• [TRACTION_METRIC_1]
• [TRACTION_METRIC_2]
• [TRACTION_METRIC_3]

## Challenges & Learnings

I want to be transparent about [CHALLENGE_FACED]. We addressed this by [SOLUTION_IMPLEMENTED], which resulted in [OUTCOME].

## Looking Ahead

Next quarter, we're focused on [Q_NEXT_PRIORITY_1], [Q_NEXT_PRIORITY_2], and [Q_NEXT_PRIORITY_3].

Our key goals are:
• [GOAL_1]: [TARGET_1]
• [GOAL_2]: [TARGET_2]
• [GOAL_3]: [TARGET_3]

## Funding & Use of Capital

We've deployed [CAPITAL_DEPLOYED] primarily toward [USE_CASE_1] and [USE_CASE_2].

Looking ahead, we anticipate [FUTURE_FUNDING_NEEDS] for [FUNDING_PURPOSE].

## Questions & Discussion

I'm here to answer any questions about our performance, strategy, or outlook.

Thank you for your continued support and partnership.`,
    prompts: [
      { label: "Time of Day", placeholder: "morning/afternoon", key: "TIME_OF_DAY" },
      { label: "Quarter", placeholder: "Q3 2025", key: "QUARTER" },
      { label: "Company Name", placeholder: "TechCorp", key: "COMPANY_NAME" },
      { label: "Major Milestone", placeholder: "our 10,000th customer milestone", key: "MAJOR_MILESTONE" },
      { label: "Key Metric 1", placeholder: "$2.5M in monthly recurring revenue", key: "KEY_METRIC_1" },
      { label: "Percentage Growth", placeholder: "45", key: "PERCENTAGE_GROWTH" },
      { label: "Revenue Figure", placeholder: "$7.2M", key: "REVENUE_FIGURE" },
      { label: "Revenue Comparison", placeholder: "15% above", key: "REVENUE_COMPARISON" },
      { label: "Revenue Detail", placeholder: "$7.2M (up 45% QoQ)", key: "REVENUE_DETAIL" },
      { label: "Growth Rate Detail", placeholder: "45% QoQ, 180% YoY", key: "GROWTH_RATE_DETAIL" },
      { label: "Cash Position", placeholder: "$12M in the bank", key: "CASH_POSITION" },
      { label: "Burn Rate", placeholder: "$800K monthly", key: "BURN_RATE" },
      { label: "Runway", placeholder: "15 months", key: "RUNWAY" },
      { label: "Product Achievement", placeholder: "launched our AI analytics dashboard", key: "PRODUCT_ACHIEVEMENT" },
      { label: "Customer Feedback", placeholder: "85% report increased productivity within 30 days", key: "CUSTOMER_FEEDBACK" },
      { label: "Traction Metric 1", placeholder: "Net Revenue Retention: 125%", key: "TRACTION_METRIC_1" },
      { label: "Traction Metric 2", placeholder: "Customer Acquisition Cost: down 25%", key: "TRACTION_METRIC_2" },
      { label: "Traction Metric 3", placeholder: "Average Contract Value: up 35%", key: "TRACTION_METRIC_3" },
      { label: "Challenge Faced", placeholder: "increased churn in our SMB segment", key: "CHALLENGE_FACED" },
      { label: "Solution Implemented", placeholder: "launching a dedicated success program", key: "SOLUTION_IMPLEMENTED" },
      { label: "Outcome", placeholder: "reducing SMB churn by 40% in 8 weeks", key: "OUTCOME" },
      { label: "Q Next Priority 1", placeholder: "expanding into enterprise market", key: "Q_NEXT_PRIORITY_1" },
      { label: "Q Next Priority 2", placeholder: "launching mobile app", key: "Q_NEXT_PRIORITY_2" },
      { label: "Q Next Priority 3", placeholder: "international expansion", key: "Q_NEXT_PRIORITY_3" },
      { label: "Goal 1", placeholder: "Enterprise pipeline", key: "GOAL_1" },
      { label: "Target 1", placeholder: "$5M in qualified opportunities", key: "TARGET_1" },
      { label: "Goal 2", placeholder: "Mobile app adoption", key: "GOAL_2" },
      { label: "Target 2", placeholder: "50% of users on mobile within 60 days", key: "TARGET_2" },
      { label: "Goal 3", placeholder: "EU market entry", key: "GOAL_3" },
      { label: "Target 3", placeholder: "First 100 European customers", key: "TARGET_3" },
      { label: "Capital Deployed", placeholder: "$1.8M this quarter", key: "CAPITAL_DEPLOYED" },
      { label: "Use Case 1", placeholder: "engineering team expansion", key: "USE_CASE_1" },
      { label: "Use Case 2", placeholder: "enterprise sales hiring", key: "USE_CASE_2" },
      { label: "Future Funding Needs", placeholder: "Series B funding in Q1 2026", key: "FUTURE_FUNDING_NEEDS" },
      { label: "Funding Purpose", placeholder: "accelerating international expansion", key: "FUNDING_PURPOSE" }
    ]
  },

  {
    id: "graduation-speech",
    title: "Graduation Speech",
    description: "Inspirational commencement address for graduates",
    category: "Personal",
    duration: "10-15 min",
    difficulty: "intermediate",
    icon: <Award className="w-5 h-5" />,
    color: "bg-yellow-500",
    tags: ["graduation", "inspiration", "achievement", "future"],
    popularity: 83,
    contentAdvice: "Balance celebration of achievement with inspiration for the future. Include personal stories and universal truths.",
    voiceAdvice: "Use inspiring, uplifting tone with strategic pauses for emphasis and applause moments.",
    bodyLanguageAdvice: "Stand tall with confident posture. Use gestures to connect with the entire audience.",
    template: `Dean [DEAN_NAME], faculty, proud families, and most importantly, graduating class of [YEAR]!

Today, we celebrate not just your academic achievement, but your journey of growth, discovery, and transformation.

[YEARS_AGO] years ago, you walked through these doors as [DESCRIPTION_OF_ARRIVAL]. Today, you leave as [DESCRIPTION_OF_DEPARTURE].

I want to share a story about [PERSONAL_STORY_INTRO]. [STORY_DETAILS]. This taught me [LESSON_FROM_STORY], and I believe it applies to your journey ahead.

Your education here has given you more than knowledge—it's given you [EDUCATIONAL_VALUE_1], [EDUCATIONAL_VALUE_2], and [EDUCATIONAL_VALUE_3].

But education doesn't end here. In fact, [CONTINUING_EDUCATION_POINT].

As you enter [NEXT_PHASE], you'll face [CHALLENGE_THEY_WILL_FACE]. Remember: [ADVICE_FOR_CHALLENGE].

The world needs what you have to offer. Your generation faces [GLOBAL_CHALLENGE], and you have the tools to [HOW_THEY_CAN_HELP].

I leave you with three pieces of advice:

First: [ADVICE_1]. [ELABORATION_1].

Second: [ADVICE_2]. [ELABORATION_2].

Third: [ADVICE_3]. [ELABORATION_3].

Class of [YEAR], you are ready. You are prepared. You are needed.

Go forth and [CALL_TO_ACTION].

Congratulations, graduates!`,
    prompts: [
      { label: "Dean Name", placeholder: "Dr. Johnson", key: "DEAN_NAME" },
      { label: "Year", placeholder: "2025", key: "YEAR" },
      { label: "Years Ago", placeholder: "Four", key: "YEARS_AGO" },
      { label: "Description of Arrival", placeholder: "eager but uncertain freshmen", key: "DESCRIPTION_OF_ARRIVAL" },
      { label: "Description of Departure", placeholder: "confident leaders ready to change the world", key: "DESCRIPTION_OF_DEPARTURE" },
      { label: "Personal Story Intro", placeholder: "my first major failure", key: "PERSONAL_STORY_INTRO" },
      { label: "Story Details", placeholder: "I pitched a business idea that got completely rejected. I was devastated", key: "STORY_DETAILS" },
      { label: "Lesson from Story", placeholder: "failure isn't the opposite of success—it's the stepping stone to it", key: "LESSON_FROM_STORY" },
      { label: "Educational Value 1", placeholder: "critical thinking skills", key: "EDUCATIONAL_VALUE_1" },
      { label: "Educational Value 2", placeholder: "resilience in face of challenges", key: "EDUCATIONAL_VALUE_2" },
      { label: "Educational Value 3", placeholder: "the ability to collaborate and lead", key: "EDUCATIONAL_VALUE_3" },
      { label: "Continuing Education Point", placeholder: "the most successful people never stop learning", key: "CONTINUING_EDUCATION_POINT" },
      { label: "Next Phase", placeholder: "your careers and graduate studies", key: "NEXT_PHASE" },
      { label: "Challenge They Will Face", placeholder: "setbacks and moments of doubt", key: "CHALLENGE_THEY_WILL_FACE" },
      { label: "Advice for Challenge", placeholder: "your education has taught you to persist, adapt, and grow", key: "ADVICE_FOR_CHALLENGE" },
      { label: "Global Challenge", placeholder: "climate change, inequality, and technological disruption", key: "GLOBAL_CHALLENGE" },
      { label: "How They Can Help", placeholder: "create solutions that previous generations couldn't imagine", key: "HOW_THEY_CAN_HELP" },
      { label: "Advice 1", placeholder: "Never stop being curious", key: "ADVICE_1" },
      { label: "Elaboration 1", placeholder: "The moment you think you know everything is the moment you stop growing", key: "ELABORATION_1" },
      { label: "Advice 2", placeholder: "Build bridges, not walls", key: "ADVICE_2" },
      { label: "Elaboration 2", placeholder: "Our greatest challenges require collaboration across differences", key: "ELABORATION_2" },
      { label: "Advice 3", placeholder: "Define success for yourself", key: "ADVICE_3" },
      { label: "Elaboration 3", placeholder: "Don't let others' expectations overshadow your own values and dreams", key: "ELABORATION_3" },
      { label: "Call to Action", placeholder: "make your mark on the world", key: "CALL_TO_ACTION" }
    ]
  }
];

export default function ScriptTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplate | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAIGenerator, setShowAIGenerator] = useState<boolean>(false);
  const [showAIPersonalization, setShowAIPersonalization] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [useRoleplay, setUseRoleplay] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const categories = ["all", "Business", "Personal", "Professional"];

  const roleplayOptions = [
    { id: "steve-jobs", name: "Steve Jobs", description: "Visionary, passionate, product-focused with dramatic pauses" },
    { id: "oprah", name: "Oprah Winfrey", description: "Warm, empathetic, audience-connecting storyteller" },
    { id: "obama", name: "Barack Obama", description: "Eloquent, measured, inspiring with presidential gravitas" },
    { id: "tony-robbins", name: "Tony Robbins", description: "High-energy, motivational, audience-activating coach" },
    { id: "ted-speaker", name: "TED Speaker", description: "Thought-provoking, insight-driven, idea-focused presenter" },
    { id: "entrepreneur", name: "Silicon Valley Entrepreneur", description: "Innovation-focused, disruptive, future-thinking leader" },
    { id: "coach", name: "Sports Coach", description: "Motivational, team-building, performance-driven communicator" },
    { id: "professor", name: "University Professor", description: "Educational, research-backed, intellectually stimulating" },
    { id: "comedian", name: "Stand-up Comedian", description: "Humorous, relatable, timing-focused entertainer" },
    { id: "ceo", name: "Fortune 500 CEO", description: "Strategic, results-oriented, leadership-focused executive" }
  ];

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

  const exportToPDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add Yappyy header
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated by Yappyy', pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    const title = selectedTemplate?.title || 'Custom Speech Template';
    pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
    // Add a line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 35, pdf.internal.pageSize.getWidth() - 20, 35);
    
    // Add the script content
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    
    // Split text into lines that fit the page width
    const lines = pdf.splitTextToSize(generatedScript, pdf.internal.pageSize.getWidth() - 40);
    
    let yPosition = 45;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const lineHeight = 6;
    const bottomMargin = 20;
    
    for (let i = 0; i < lines.length; i++) {
      // Check if we need to add a new page
      if (yPosition + lineHeight > pageHeight - bottomMargin) {
        pdf.addPage();
        
        // Add Yappyy header on new pages
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Generated by Yappyy', pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        yPosition = 25;
      }
      
      pdf.text(lines[i], 20, yPosition);
      yPosition += lineHeight;
    }
    
    // Add footer on the last page
    pdf.setFontSize(9);
    pdf.setTextColor(128, 128, 128);
    const currentDate = new Date().toLocaleDateString();
    pdf.text(`Created on ${currentDate}`, 20, pageHeight - 10);
    pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pdf.internal.pageSize.getWidth() - 30, pageHeight - 10);
    
    // Save the PDF
    const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-yappyy.pdf`;
    pdf.save(fileName);
  };

  const generateAITemplate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGeneratingAI(true);
    try {
      const selectedRoleData = roleplayOptions.find(role => role.id === selectedRole);
      
      let prompt = `Create a professional speech script template based on this request: "${aiPrompt}"

Please provide:
1. A complete speech template with placeholder variables in [BRACKET] format
2. The template should be structured, engaging, and professional
3. Include clear sections with smooth transitions
4. Make it adaptable for different audiences and occasions
5. Length should be appropriate for the speech type (5-15 minutes typically)

Format the response as a ready-to-use speech template with [PLACEHOLDER_VARIABLES] that users can customize.`;

      if (useRoleplay && selectedRoleData) {
        prompt += `

ROLEPLAY INSTRUCTION: Write this template in the speaking style and persona of ${selectedRoleData.name}. 
Style characteristics: ${selectedRoleData.description}
Adopt their tone, phrasing patterns, signature techniques, and communication approach while maintaining the professional template format.`;
      }

      prompt += `

Template Request: ${aiPrompt}`;

      const response = await fetch('/api/openai/personalize-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          template: prompt,
          customizations: {
            useRoleplay,
            selectedRole: selectedRoleData?.name || null,
            systemPrompt: `You are an expert speechwriter and communication coach. Create professional, engaging speech templates with clear structure and placeholder variables for customization.${useRoleplay && selectedRoleData ? ` When roleplay is requested, fully embody the speaking style and persona of the specified character while maintaining professional template format.` : ''}`
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Template generation failed: ${response.status}`);
      }

      const data = await response.json();
      const aiGeneratedScript = data.personalizedContent || data.response || data.message || '';
      
      setGeneratedScript(aiGeneratedScript);
      setSelectedTemplate(null); // Clear any selected template
      
    } catch (error) {
      console.error('AI template generation failed:', error);
      // Fallback to a generic template structure
      const fallbackTemplate = `Good [TIME_OF_DAY], [AUDIENCE]!

Thank you for [REASON_FOR_GATHERING].

[OPENING_HOOK]

Today, I want to share [MAIN_MESSAGE] because [IMPORTANCE].

Let me start with [STORY_OR_EXAMPLE].

Here are the key points I'd like you to remember:

First: [POINT_1]
[SUPPORTING_DETAIL_1]

Second: [POINT_2]
[SUPPORTING_DETAIL_2]

Third: [POINT_3]
[SUPPORTING_DETAIL_3]

[CALL_TO_ACTION]

In closing, [MEMORABLE_ENDING].

Thank you for your time and attention.`;

      setGeneratedScript(fallbackTemplate);
    } finally {
      setIsGeneratingAI(false);
    }
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
      {!selectedTemplate && !showAIGenerator ? (
        <>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display gradient-text mb-2">Script Templates</h1>
            <p className="text-gray-600">Choose from professional templates or generate custom scripts with AI</p>
            
            {/* AI Generator Button */}
            <div className="mt-4">
              <Button 
                onClick={() => setShowAIGenerator(true)}
                className="gradient-bg text-white hover:opacity-90 purple-glow"
              >
                <Bot className="w-4 h-4 mr-2" />
                Generate Custom Template with AI
              </Button>
            </div>
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
      ) : showAIGenerator ? (
        <>
          {/* AI Template Generator */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display gradient-text">AI Template Generator</h1>
                <p className="text-gray-600">Describe your speech needs and get a custom template</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAIGenerator(false);
                  setAiPrompt("");
                  setGeneratedScript("");
                }}
              >
                Back to Templates
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Prompt Form */}
              <Card className="gradient-card purple-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <span>Describe Your Speech</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ai-prompt">What kind of speech do you need?</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="E.g., A motivational speech for my sales team about overcoming challenges and achieving quarterly goals. Should be energetic and include personal stories..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="mt-1 min-h-32"
                    />
                  </div>

                  {/* Roleplay Toggle */}
                  <div className="space-y-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="roleplay-toggle" className="text-sm font-medium">AI Roleplay Mode</Label>
                        <p className="text-xs text-gray-600">Have AI adopt a famous speaker's style</p>
                      </div>
                      <Switch
                        id="roleplay-toggle"
                        checked={useRoleplay}
                        onCheckedChange={setUseRoleplay}
                      />
                    </div>
                    
                    {useRoleplay && (
                      <div>
                        <Label htmlFor="role-select">Choose Speaking Persona</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a famous speaker to emulate" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleplayOptions.map(role => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{role.name}</span>
                                  <span className="text-xs text-gray-500">{role.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <h6 className="font-medium mb-2">Include details about:</h6>
                      <ul className="space-y-1 text-xs">
                        <li>• Speech purpose/occasion</li>
                        <li>• Target audience</li>
                        <li>• Desired tone & style</li>
                        <li>• Key messages</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium mb-2">Examples:</h6>
                      <ul className="space-y-1 text-xs">
                        <li>• Retirement farewell</li>
                        <li>• Company anniversary</li>
                        <li>• Educational presentation</li>
                        <li>• Campaign rally</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateAITemplate}
                    disabled={isGeneratingAI || !aiPrompt.trim()}
                    className="w-full gradient-bg text-white hover:opacity-90 purple-glow"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Generating Template...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Custom Template
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Template */}
              <Card className="gradient-card purple-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Generated Template</span>
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
                          onClick={exportToPDF}
                          variant="outline"
                          className="flex-1"
                        >
                          <FileDown className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                      
                      <Button
                        onClick={() => {
                          setAiPrompt("");
                          setGeneratedScript("");
                        }}
                        variant="outline"
                        className="w-full purple-border hover:bg-purple-50"
                      >
                        Generate Another Template
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Describe your speech needs and click "Generate" to create a custom template</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
                        onClick={exportToPDF}
                        variant="outline"
                        className="flex-1"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>

                    {/* AI Personalization Button */}
                    <Button
                      onClick={() => setShowAIPersonalization(true)}
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Personalize with AI Assistant
                    </Button>
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

      {/* AI Personalization Dialog */}
      {showAIPersonalization && generatedScript && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <AITemplatePersonalization
              template={generatedScript}
              onTemplateUpdate={(newTemplate) => {
                setGeneratedScript(newTemplate);
                setShowAIPersonalization(false);
              }}
              onClose={() => setShowAIPersonalization(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}