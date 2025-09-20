import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, User, Bot, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TemplatePersonalizationChatProps {
  template: any;
  editedContent: string;
  onContentUpdate: (content: string) => void;
  hasBeenSaved?: boolean;
}

export default function TemplatePersonalizationChat({ 
  template, 
  editedContent, 
  onContentUpdate,
  hasBeenSaved 
}: TemplatePersonalizationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm here to help personalize your "${template?.title}" template. Tell me about your specific needs - who's your audience, what's the occasion, any personal stories you'd like to include, or any other details that would make this speech uniquely yours!`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Chat mutation for AI responses
  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; template: any; currentContent: string; conversationHistory: Message[] }) => {
      const response = await fetch('/api/personalize-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: data.message,
          template: data.template,
          currentContent: data.currentContent,
          conversationHistory: data.conversationHistory.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get AI response');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Add AI response to messages
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response || "I've updated your template based on your requirements.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Update the template content if provided
      if (data.updatedContent) {
        onContentUpdate(data.updatedContent);
        toast({
          title: "Template Updated ✨",
          description: "Your template has been personalized based on our conversation.",
        });
      }
      
      setIsTyping(false);
    },
    onError: (error: any) => {
      setIsTyping(false);
      toast({
        title: "Chat Error",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Send to AI
    chatMutation.mutate({
      message: inputMessage,
      template: template,
      currentContent: editedContent,
      conversationHistory: messages
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Success Banner */}
      {hasBeenSaved && (
        <div className="mb-3 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">
            Template saved successfully! You can find it in "My Templates"
          </span>
        </div>
      )}
      
      {/* Chat Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 border rounded-lg bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'order-2'
                    : 'order-1'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <Card
                    className={`p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </Card>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <Card className="p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="mt-4 flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell me about your speech needs..."
          className="flex-1"
          disabled={isTyping}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isTyping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputMessage("I need to make this more professional for a corporate audience")}
          disabled={isTyping}
        >
          Make Professional
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputMessage("Add humor and make it more engaging")}
          disabled={isTyping}
        >
          Add Humor
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputMessage("Include a personal story about overcoming challenges")}
          disabled={isTyping}
        >
          Add Story
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputMessage("Make it shorter and more impactful")}
          disabled={isTyping}
        >
          Shorten
        </Button>
      </div>
    </div>
  );
}