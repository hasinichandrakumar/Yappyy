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
  Sparkles,
  TrendingUp,
  Bot,
  Zap
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
  }
];

export default function ScriptTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplate | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAIGenerator, setShowAIGenerator] = useState<boolean>(false);
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
              content: `You are an expert speechwriter and communication coach. Create professional, engaging speech templates with clear structure and placeholder variables for customization.${useRoleplay && selectedRoleData ? ` When roleplay is requested, fully embody the speaking style and persona of the specified character while maintaining professional template format.` : ''}`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Template generation failed: ${response.status}`);
      }

      const data = await response.json();
      const aiGeneratedScript = data.choices[0].message.content;
      
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
                          onClick={downloadScript}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
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