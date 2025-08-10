import OpenAI from 'openai';

// OpenAI configuration for AI coaching features
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Check if OpenAI is properly configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Default model configurations
export const AI_MODELS = {
  COACHING: 'gpt-4o',
  ANALYSIS: 'gpt-4o',
  CONTENT: 'gpt-4o'
} as const;

// AI coaching system prompts
export const COACHING_PROMPTS = {
  COMPREHENSIVE_ANALYSIS: `You are an expert communication coach and speech analyst. Provide comprehensive, actionable insights based on authentic performance data. Focus on specific, measurable improvements and genuine strengths.`,
  
  SPEAKING_STYLE: `You are an expert speech analyst and communication coach. Analyze the user's speaking style and provide detailed insights about their communication patterns, speaking personality, and unique characteristics.`,
  
  PERSONALIZED_FEEDBACK: `You are a personalized AI speaking coach. Provide encouraging, specific feedback that helps users improve their communication skills based on their actual performance data.`
} as const;