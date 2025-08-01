import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  MessageSquare, 
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIPersonalizationChatProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onPersonalized: (personalizedContent: string, improvements: string[], tips: string[]) => void;
}

export default function AIPersonalizationChat({ 
  template, 
  isOpen, 
  onClose, 
  onPersonalized 
}: AIPersonalizationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your AI speech coach. I'll help you personalize the "${template?.title}" template to perfectly match your speech purpose and audience.\n\nTo get started, please tell me:\n\n• What's the main purpose of your speech?\n• Who is your audience?\n• What specific outcome do you want to achieve?\n• Any personal stories or examples you'd like to include?`,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [personalizationStep, setPersonalizationStep] = useState<'gathering' | 'personalizing' | 'complete'>('gathering');
  const [collectedInfo, setCollectedInfo] = useState<{
    purpose?: string;
    audience?: string;
    goals?: string;
    context?: string;
    personalStory?: string;
    tone?: string;
    industry?: string;
  }>({});
  
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Analyze user input to extract key information
    await processUserResponse(userMessage.content);
  };

  const processUserResponse = async (userInput: string) => {
    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '🤔 Analyzing your requirements...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Send to AI for analysis and response
      const response = await fetch('/api/ai-personalization-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          conversationHistory: messages.slice(-6), // Last 6 messages for context
          template: template,
          collectedInfo,
          step: personalizationStep
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process message');
      }

      const result = await response.json();

      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update collected information
      if (result.extractedInfo) {
        setCollectedInfo(prev => ({ ...prev, ...result.extractedInfo }));
      }

      // Check if we have enough information to personalize
      if (result.readyToPersonalize) {
        setPersonalizationStep('personalizing');
        await personalizeTemplate(result.finalInfo || collectedInfo);
      }
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Could you please try rephrasing your response?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const personalizeTemplate = async (finalInfo: any) => {
    setIsPersonalizing(true);

    try {
      // Build comprehensive personalization request
      const personalizationRequest = `
        Purpose: ${finalInfo.purpose || 'General presentation'}
        Audience: ${finalInfo.audience || 'General audience'}
        Goals: ${finalInfo.goals || 'Inform and engage'}
        Context: ${finalInfo.context || 'Professional setting'}
        Tone: ${finalInfo.tone || 'Professional and engaging'}
        Industry: ${finalInfo.industry || 'General'}
        Personal Story: ${finalInfo.personalStory || 'None specified'}
      `.trim();

      const response = await fetch('/api/ai-personalize-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          userRequest: personalizationRequest,
          personalizationData: finalInfo
        })
      });

      if (!response.ok) {
        throw new Error('Failed to personalize template');
      }

      const result = await response.json();

      // Add completion message
      const completionMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `🎉 Perfect! I've personalized your "${template.title}" template based on our conversation.\n\n**Key Improvements Made:**\n${result.improvements?.map((imp: string) => `• ${imp}`).join('\n') || 'Enhanced content structure and flow'}\n\n**Delivery Tips:**\n${result.deliveryTips?.map((tip: string) => `• ${tip}`).join('\n') || 'Practice with confidence and maintain eye contact'}\n\nYour personalized template is ready to use!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, completionMessage]);

      setPersonalizationStep('complete');

      // Return the personalized content
      onPersonalized(
        result.personalizedContent || template.content,
        result.improvements || [],
        result.deliveryTips || []
      );

      toast({
        title: "Template Personalized!",
        description: `Your ${template.title} has been customized based on your requirements.`,
      });

    } catch (error) {
      console.error('Personalization error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'I encountered an issue while personalizing your template. Let me try a simpler approach. Could you briefly describe your main goal for this speech?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Personalization Error",
        description: "Please try describing your requirements again.",
        variant: "destructive"
      });
    } finally {
      setIsPersonalizing(false);
    }
  };

  const getQuickSuggestions = () => {
    if (personalizationStep === 'gathering') {
      return [
        "I'm giving a sales presentation to potential clients",
        "This is for a team meeting about quarterly results",
        "I need to motivate my team during challenging times",
        "I'm presenting at a conference for industry professionals"
      ];
    }
    return [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Personalization Chat
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline">{template?.title}</Badge>
            <ArrowRight className="w-3 h-3" />
            <Badge className={`${
              personalizationStep === 'gathering' ? 'bg-blue-100 text-blue-800' :
              personalizationStep === 'personalizing' ? 'bg-blue-200 text-blue-900' :
              'bg-green-100 text-green-800'
            }`}>
              {personalizationStep === 'gathering' ? 'Gathering Info' :
               personalizationStep === 'personalizing' ? 'Personalizing' :
               'Complete'}
            </Badge>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <div className="flex-1 pr-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border border-blue-200">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>
                  <div className="flex items-center gap-1 mt-2 opacity-60">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border border-blue-200">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Suggestions */}
        {getQuickSuggestions().length > 0 && personalizationStep !== 'complete' && (
          <div className="border-t pt-3">
            <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {getQuickSuggestions().map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => setCurrentMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        {personalizationStep !== 'complete' && (
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe your speech purpose, audience, and goals..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 min-h-[60px] max-h-32 resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isPersonalizing}
              />
              <Button 
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isPersonalizing}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isPersonalizing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Completion Actions */}
        {personalizationStep === 'complete' && (
          <div className="border-t pt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Use Personalized Template
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}