import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PersonalizationInfo {
  purpose?: string;
  audience?: string;
  goals?: string;
  context?: string;
  personalStory?: string;
  tone?: string;
  industry?: string;
}

export async function processPersonalizationChat(
  userInput: string,
  conversationHistory: ChatMessage[],
  template: any,
  collectedInfo: PersonalizationInfo,
  step: 'gathering' | 'personalizing' | 'complete'
) {
  try {
    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Create system prompt for chat analysis
    const systemPrompt = `You are an expert speech writing coach conducting a personalization interview. Your goal is to gather specific information about the user's speech requirements and then determine when you have enough information to personalize their template.

TEMPLATE BEING PERSONALIZED:
Title: ${template?.title}
Category: ${template?.category}
Description: ${template?.description}

CURRENT COLLECTED INFO:
${Object.entries(collectedInfo)
  .filter(([_, value]) => value)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n') || 'None yet'}

CONVERSATION STEP: ${step}

Your response should be friendly, professional, and focused on gathering the missing information. Ask follow-up questions to clarify details.

KEY INFORMATION TO GATHER:
1. Speech Purpose (what's the main objective?)
2. Target Audience (who will be listening?)
3. Specific Goals (what outcome do they want?)
4. Context/Setting (where will this be delivered?)
5. Tone/Style (formal, casual, motivational, etc.)
6. Industry/Field (if relevant)
7. Personal Stories/Examples (to make it more engaging)

ANALYSIS REQUIREMENTS:
- Extract any new information from the user's input
- Determine if you have enough information to create a high-quality personalization
- If ready to personalize, indicate this clearly
- If not ready, ask specific follow-up questions

Respond with JSON in this format:
{
  "response": "Your conversational response to the user",
  "extractedInfo": {
    "purpose": "extracted purpose if mentioned",
    "audience": "extracted audience if mentioned",
    "goals": "extracted goals if mentioned",
    "context": "extracted context if mentioned",
    "tone": "extracted tone if mentioned",
    "industry": "extracted industry if mentioned",
    "personalStory": "extracted personal story if mentioned"
  },
  "readyToPersonalize": false,
  "missingInfo": ["list of still needed information"],
  "finalInfo": null
}

When you have sufficient information (at least purpose, audience, and goals), set readyToPersonalize to true and include all collected info in finalInfo.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `CONVERSATION HISTORY:\n${conversationContext}\n\nUSER'S LATEST INPUT:\n${userInput}\n\nPlease analyze this input and respond appropriately.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and enhance the response
    if (!result.response) {
      result.response = "I'd love to help you personalize this template! Could you tell me more about your speech?";
    }

    if (!result.extractedInfo) {
      result.extractedInfo = {};
    }

    // Clean up extracted info (remove empty values)
    Object.keys(result.extractedInfo).forEach(key => {
      if (!result.extractedInfo[key] || result.extractedInfo[key].trim() === '') {
        delete result.extractedInfo[key];
      }
    });

    // If ready to personalize, merge all collected info
    if (result.readyToPersonalize) {
      result.finalInfo = {
        ...collectedInfo,
        ...result.extractedInfo
      };
    }

    return result;

  } catch (error) {
    console.error('AI personalization chat error:', error);
    return {
      response: "I apologize, but I'm having trouble processing your request right now. Could you please try again?",
      extractedInfo: {},
      readyToPersonalize: false,
      missingInfo: ["All information"],
      finalInfo: null
    };
  }
}

export async function generatePersonalizationSummary(
  collectedInfo: PersonalizationInfo,
  template: any
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a brief, professional summary of how a speech template will be personalized based on the collected user information."
        },
        {
          role: "user",
          content: `Template: ${template?.title}
Collected Information:
${Object.entries(collectedInfo)
  .filter(([_, value]) => value)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Create a 2-3 sentence summary of how this template will be personalized.`
        }
      ],
      temperature: 0.6,
      max_tokens: 200
    });

    return response.choices[0].message.content || 'Template will be personalized based on your requirements.';
  } catch (error) {
    console.error('Summary generation error:', error);
    return 'Your template will be customized to match your specific needs and audience.';
  }
}