import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Edit3, 
  Brain, 
  Mic,
  FileText,
  Sparkles,
  Zap,
  RefreshCw
} from "lucide-react";

interface SpeechInputOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface SpeechInputSelectorProps {
  onInputSelect: (type: string, content?: string) => void;
}

export default function SpeechInputSelector({ onInputSelect }: SpeechInputSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const inputOptions: SpeechInputOption[] = [
    {
      id: "upload",
      title: "Upload Script",
      icon: <Upload className="w-6 h-6" />,
      description: "Upload your speech from PDF, .txt, or .docx file",
      color: "bg-blue-500"
    },
    {
      id: "paste",
      title: "Paste Text",
      icon: <Edit3 className="w-6 h-6" />,
      description: "Copy and paste your prepared speech or notes",
      color: "bg-green-500"
    },
    {
      id: "ai-prompt",
      title: "AI Prompt Generator",
      icon: <Brain className="w-6 h-6" />,
      description: "Let AI create engaging speaking prompts for you",
      color: "bg-purple-500"
    },
    {
      id: "freestyle",
      title: "Freestyle Mode",
      icon: <Mic className="w-6 h-6" />,
      description: "No script needed - just hit record and speak freely",
      color: "bg-orange-500"
    }
  ];

  const aiPromptExamples = [
    "Sell your favorite snack to aliens visiting Earth for the first time",
    "Defend pineapple on pizza in a courtroom setting",
    "Pitch an AI that can write and visualize your dreams",
    "Convince a time traveler why they should stay in 2024",
    "Explain social media to someone from the 1800s",
    "Argue why procrastination is actually a superpower",
    "Sell the concept of sleep to someone who's never needed it",
    "Pitch a dating app for pets to their owners"
  ];

  const generateAIPrompt = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate API call - replace with actual AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const randomPrompt = aiPromptExamples[Math.floor(Math.random() * aiPromptExamples.length)];
    setGeneratedPrompt(randomPrompt);
    setIsGenerating(false);
  }, []);

  const handleOptionSelect = (option: SpeechInputOption) => {
    setSelectedOption(option.id);
    
    if (option.id === "ai-prompt" && !generatedPrompt) {
      generateAIPrompt();
    }
    
    if (option.id === "freestyle") {
      onInputSelect("freestyle");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you'd read the file content
      onInputSelect("upload", `Uploaded file: ${file.name}`);
    }
  };

  const handlePastedTextSubmit = () => {
    if (pastedText.trim()) {
      onInputSelect("paste", pastedText);
    }
  };

  const handlePromptUse = () => {
    if (generatedPrompt) {
      onInputSelect("ai-prompt", generatedPrompt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Speech Input</h2>
        <p className="text-lg text-gray-600">Upload, generate, or speak freely</p>
      </div>

      {/* Input Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inputOptions.map((option) => (
          <Card 
            key={option.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedOption === option.id 
                ? 'ring-2 ring-cyan-500 bg-cyan-50 border-cyan-200' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <CardHeader className="text-center pb-3">
              <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center text-white mx-auto mb-3`}>
                {option.icon}
              </div>
              <CardTitle className="text-lg font-semibold">
                {option.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-gray-600">
                {option.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dynamic Content Based on Selection */}
      {selectedOption === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Upload Your Script</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, .txt, and .docx files up to 10MB
              </p>
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedOption === "paste" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5" />
              <span>Paste Your Speech</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your speech text here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex justify-between items-center">
              <Badge variant="secondary">
                {pastedText.length} characters
              </Badge>
              <Button 
                onClick={handlePastedTextSubmit}
                disabled={!pastedText.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                Use This Text
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedOption === "ai-prompt" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Prompt Generator</span>
              <Badge className="bg-purple-100 text-purple-700">Creative</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGenerating ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 text-purple-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Generating creative prompt...</p>
              </div>
            ) : generatedPrompt ? (
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-purple-800 font-medium">Your AI-Generated Prompt:</p>
                      <p className="text-purple-700 mt-1">{generatedPrompt}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={handlePromptUse}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Use This Prompt
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={generateAIPrompt}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Button 
                  onClick={generateAIPrompt}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Creative Prompt
                </Button>
              </div>
            )}

            {/* Example Prompts */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Example Prompts:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiPromptExamples.slice(0, 4).map((example, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    "{example}"
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedOption === "freestyle" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>Freestyle Mode</span>
              <Badge className="bg-orange-100 text-orange-700">No Script</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <Mic className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Ready to Speak Freely?
              </h3>
              <p className="text-orange-700">
                No preparation needed. Just hit record and let your thoughts flow. 
                Our AI will provide real-time feedback as you speak.
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 px-8"
            >
              Start Freestyle Session
              <Mic className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}