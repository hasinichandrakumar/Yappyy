import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, RefreshCw, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AITemplatePersonalizationProps {
  template: string;
  onTemplateUpdate: (newTemplate: string) => void;
  onClose: () => void;
}

export function AITemplatePersonalization({ template, onTemplateUpdate, onClose }: AITemplatePersonalizationProps) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I\'m your AI template assistant. Tell me about your specific scenario, audience, and goals, and I\'ll help personalize this template for you.',
    timestamp: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [context, setContext] = useState({
    scenario: '',
    audience: '',
    goals: '',
    style: '',
    customization: []
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = async (userMessage: string) => {
    try {
      setIsProcessing(true);

      // Add user message to chat
      const newMessages = [...messages, {
        role: 'user',
        content: userMessage,
        timestamp: Date.now()
      }];
      setMessages(newMessages);

      // Prepare conversation context
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call AI API via backend
      const response = await fetch('/api/speech-coaching-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage,
          context: `You are an expert speech and presentation coach helping personalize speech templates.
              Current template:
              ${template}
              
              Your goal is to:
              1. Understand the user's specific needs, audience, and goals
              2. Suggest specific personalizations to the template
              3. Help refine the content for maximum impact
              4. Maintain a conversational, helpful tone
              
              If you suggest template changes, format them clearly with [PLACEHOLDERS].
              Focus on making the template more relevant and impactful for their specific case.`,
          conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.response || data.message || '';

      // Check if response contains a template update
      const templateMatch = aiResponse.match(/```(?:\w+)?\n([\s\S]*?)```/);
      if (templateMatch) {
        const newTemplate = templateMatch[1].trim();
        onTemplateUpdate(newTemplate);
      }

      // Add AI response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      }]);

      // Update context based on conversation
      updateContext(userMessage, aiResponse);

    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your request.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };

  const updateContext = (userMessage: string, aiResponse: string) => {
    // Extract context from conversation
    const newContext = { ...context };

    if (userMessage.toLowerCase().includes('audience')) {
      newContext.audience = userMessage;
    }
    if (userMessage.toLowerCase().includes('goal')) {
      newContext.goals = userMessage;
    }
    if (userMessage.toLowerCase().includes('scenario') || userMessage.toLowerCase().includes('situation')) {
      newContext.scenario = userMessage;
    }
    if (userMessage.toLowerCase().includes('style') || userMessage.toLowerCase().includes('tone')) {
      newContext.style = userMessage;
    }

    setContext(newContext);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      processMessage(input.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestQuestions = [
    "What's the specific occasion or scenario for this speech?",
    "Who is your target audience?",
    "What are your main goals for this presentation?",
    "What tone or style would you like to convey?",
    "Are there any specific cultural considerations?",
    "What key messages must be included?",
    "How long should the speech be?",
    "Are there any specific examples or stories you'd like to include?"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <span>AI Template Personalization</span>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Messages */}
            <Card className="border-2 border-purple-100">
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </Card>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your specific needs..."
                disabled={isProcessing}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isProcessing || !input.trim()}
                className="gradient-bg text-white"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>

          {/* Suggestions and Context */}
          <div className="space-y-4">
            {/* Suggested Questions */}
            <Card className="p-4 bg-purple-50">
              <h3 className="font-semibold mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                Suggested Questions
              </h3>
              <ul className="space-y-2">
                {suggestQuestions.map((question, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-sm hover:text-purple-700 hover:bg-purple-100"
                      onClick={() => {
                        setInput(question);
                        inputRef.current?.focus();
                      }}
                    >
                      {question}
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Context Summary */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Understanding So Far</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Scenario:</span>
                  <p className="text-gray-600">{context.scenario || 'Not specified yet'}</p>
                </div>
                <div>
                  <span className="font-medium">Audience:</span>
                  <p className="text-gray-600">{context.audience || 'Not specified yet'}</p>
                </div>
                <div>
                  <span className="font-medium">Goals:</span>
                  <p className="text-gray-600">{context.goals || 'Not specified yet'}</p>
                </div>
                <div>
                  <span className="font-medium">Style:</span>
                  <p className="text-gray-600">{context.style || 'Not specified yet'}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}