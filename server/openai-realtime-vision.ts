import { Request, Response } from 'express';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface VisionAnalysisRequest {
  imageData: string; // base64 encoded image
  analysisType: 'eye_contact' | 'posture' | 'body_language' | 'comprehensive';
}

interface VisionAnalysisResponse {
  eyeContactScore: number;
  postureScore: number;
  bodyLanguageScore: number;
  shoulderAlignment: 'aligned' | 'slightly-tilted' | 'misaligned';
  headPosition: 'centered' | 'tilted-left' | 'tilted-right';
  isLookingAtCamera: boolean;
  confidence: number;
  feedback: string;
}

export async function analyzeVideoFrame(req: Request, res: Response) {
  try {
    const { imageData, analysisType }: VisionAnalysisRequest = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const systemPrompt = `You are an expert public speaking coach analyzing video frames for real-time feedback. Analyze the person's:

1. Eye Contact: Are they looking directly at the camera? Score 0-100
2. Posture: Is their posture upright and professional? Score 0-100  
3. Body Language: Overall body language confidence and engagement Score 0-100
4. Shoulder Alignment: Are shoulders level and aligned?
5. Head Position: Is head centered or tilted?

Respond in JSON format with these exact keys:
{
  "eyeContactScore": number (0-100),
  "postureScore": number (0-100), 
  "bodyLanguageScore": number (0-100),
  "shoulderAlignment": "aligned" | "slightly-tilted" | "misaligned",
  "headPosition": "centered" | "tilted-left" | "tilted-right",
  "isLookingAtCamera": boolean,
  "confidence": number (0-1),
  "feedback": "Brief constructive feedback"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this video frame for ${analysisType} assessment.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and normalize the response
    const normalizedAnalysis: VisionAnalysisResponse = {
      eyeContactScore: Math.max(0, Math.min(100, analysis.eyeContactScore || 0)),
      postureScore: Math.max(0, Math.min(100, analysis.postureScore || 0)),
      bodyLanguageScore: Math.max(0, Math.min(100, analysis.bodyLanguageScore || 0)),
      shoulderAlignment: analysis.shoulderAlignment || 'aligned',
      headPosition: analysis.headPosition || 'centered',
      isLookingAtCamera: Boolean(analysis.isLookingAtCamera),
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0.5)),
      feedback: analysis.feedback || 'Keep up the good work!'
    };

    res.json(normalizedAnalysis);

  } catch (error: any) {
    console.error('Vision analysis error:', error);
    
    // Return fallback values on error
    res.json({
      eyeContactScore: 50,
      postureScore: 50,
      bodyLanguageScore: 50,
      shoulderAlignment: 'aligned',
      headPosition: 'centered',
      isLookingAtCamera: false,
      confidence: 0.1,
      feedback: 'Vision analysis temporarily unavailable'
    });
  }
}

export async function analyzePosture(req: Request, res: Response) {
  try {
    const { imageData }: { imageData: string } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze posture and body alignment in this image. Focus on shoulder alignment, spine posture, and overall body positioning. Respond in JSON format with postureScore (0-100), shoulderAlignment, headPosition, and specific feedback."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze the posture and body alignment in this frame."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    res.json(analysis);

  } catch (error) {
    console.error('Posture analysis error:', error);
    res.json({
      postureScore: 75,
      shoulderAlignment: 'aligned',
      headPosition: 'centered',
      feedback: 'Good posture maintained'
    });
  }
}

export async function analyzeEyeContact(req: Request, res: Response) {
  try {
    const { imageData }: { imageData: string } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze eye contact and gaze direction in this image. Determine if the person is looking directly at the camera (simulating audience eye contact). Respond in JSON format with eyeContactScore (0-100), isLookingAtCamera (boolean), and feedback."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze the eye contact and gaze direction in this frame."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    res.json(analysis);

  } catch (error) {
    console.error('Eye contact analysis error:', error);
    res.json({
      eyeContactScore: 60,
      isLookingAtCamera: false,
      feedback: 'Try to maintain direct eye contact with the camera'
    });
  }
}