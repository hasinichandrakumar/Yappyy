import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, MessageCircle, Send } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SpeechTranscript() {
  const { transcript, isListening, wordCount, sessionTime } = useSpeechRecognition();
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [speechPurpose, setSpeechPurpose] = useState<string>("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript || "No transcript available"], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const analyzeTranscript = async () => {
    if (!transcript || !speechPurpose) return;
    
    setIsAnalyzing(true);
    try {
      const response = await apiRequest('POST', '/api/analyze-speech-format', {
        transcript,
        purpose: speechPurpose
      });
      const result = await response.json();
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: result.feedback,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to analyze transcript:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    
    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setUserMessage("");
    setIsAnalyzing(true);
    
    try {
      const response = await apiRequest('POST', '/api/speech-coaching-chat', {
        message: userMessage,
        transcript,
        purpose: speechPurpose,
        chatHistory: chatMessages
      });
      const result = await response.json();
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const speechPurposes = [
    { value: "school_presentation", label: "School Presentation" },
    { value: "ted_talk", label: "TED Talk" },
    { value: "business_pitch", label: "Business Pitch" },
    { value: "conference_talk", label: "Conference Talk" },
    { value: "wedding_speech", label: "Wedding Speech" },
    { value: "toast", label: "Toast/Celebration" },
    { value: "job_interview", label: "Job Interview" },
    { value: "sales_presentation", label: "Sales Presentation" },
    { value: "training_session", label: "Training Session" },
    { value: "debate", label: "Debate" },
    { value: "other", label: "Other" }
  ];

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Transcript</h2>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setShowChatbot(!showChatbot)}
              variant="ghost"
              size="sm"
              className="text-primary hover:text-blue-700"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Coaching Chat
            </Button>
            <Button 
              onClick={downloadTranscript}
              variant="ghost"
              size="sm"
              className="text-primary hover:text-blue-700"
              disabled={!transcript}
            >
              Export <Download className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Speech Purpose Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Speech Purpose (helps provide better feedback)
          </label>
          <Select value={speechPurpose} onValueChange={setSpeechPurpose}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the purpose of your speech" />
            </SelectTrigger>
            <SelectContent>
              {speechPurposes.map((purpose) => (
                <SelectItem key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div 
          ref={transcriptRef}
          className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto"
        >
          {transcript ? (
            <p className="text-gray-700 leading-relaxed">
              {transcript}
              {isListening && <span className="text-primary animate-pulse ml-1">|</span>}
            </p>
          ) : (
            <p className="text-gray-500 italic">
              {isListening ? "Listening for speech..." : "Start speaking to see transcript"}
            </p>
          )}
        </div>

        {/* Auto-analyze button */}
        {transcript && speechPurpose && (
          <div className="mt-3">
            <Button 
              onClick={analyzeTranscript}
              disabled={isAnalyzing}
              size="sm"
              className="bg-primary text-white hover:bg-blue-700"
            >
              {isAnalyzing ? "Analyzing..." : "Get Format Feedback"}
            </Button>
          </div>
        )}

        {/* Chatbot Interface */}
        {showChatbot && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Speech Coaching Assistant</h3>
            
            {/* Chat Messages */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto mb-3">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  Ask me anything about improving your speech format, delivery, or content!
                </p>
              ) : (
                <div className="space-y-3">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask for feedback on your speech..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isAnalyzing}
              />
              <Button 
                onClick={sendMessage}
                disabled={!userMessage.trim() || isAnalyzing}
                size="sm"
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Words spoken: <span className="font-medium text-gray-700">{wordCount}</span></span>
          <span>Session time: <span className="font-medium text-gray-700">{formatTime(sessionTime)}</span></span>
        </div>
      </CardContent>
    </Card>
  );
}
