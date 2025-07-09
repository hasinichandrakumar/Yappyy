import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Video, Square, Play, Pause, Edit3, Save, X } from 'lucide-react';

export default function SimplePracticePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState("Practice Session 1");
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const saveSessionName = () => {
    setIsEditingName(false);
  };

  const saveSessionPurpose = () => {
    setIsEditingPurpose(false);
  };

  return (
    <div className="space-y-6">
      {/* Session Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Practice Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Session Name</label>
            <div className="flex items-center space-x-2">
              {isEditingName ? (
                <>
                  <Input
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={saveSessionName}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditingName(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-lg font-medium">{sessionName}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditingName(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Session Purpose */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Purpose (Optional)</label>
            <div className="flex items-center space-x-2">
              {isEditingPurpose ? (
                <>
                  <Input
                    value={sessionPurpose}
                    onChange={(e) => setSessionPurpose(e.target.value)}
                    placeholder="What are you practicing today?"
                    className="flex-1"
                  />
                  <Button size="sm" onClick={saveSessionPurpose}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditingPurpose(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-gray-600">
                    {sessionPurpose || "Click to add purpose"}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditingPurpose(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Recording Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <Button 
                onClick={handleStartRecording}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Mic className="w-6 h-6 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={handleStopRecording}
                size="lg"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Square className="w-6 h-6 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>

          {isRecording && (
            <div className="mt-4 text-center">
              <Badge variant="destructive" className="animate-pulse">
                Recording Active
              </Badge>
              <div className="mt-2">
                <span className="text-sm text-gray-600">
                  Duration: {Math.floor(sessionDuration / 60)}:
                  {(sessionDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Live Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Voice Clarity</label>
              <Progress value={75} className="mt-1" />
              <span className="text-xs text-gray-500">75%</span>
            </div>
            <div>
              <label className="text-sm font-medium">Speaking Pace</label>
              <Progress value={60} className="mt-1" />
              <span className="text-xs text-gray-500">120 WPM</span>
            </div>
            <div>
              <label className="text-sm font-medium">Eye Contact</label>
              <Progress value={80} className="mt-1" />
              <span className="text-xs text-gray-500">80%</span>
            </div>
            <div>
              <label className="text-sm font-medium">Confidence</label>
              <Progress value={85} className="mt-1" />
              <span className="text-xs text-gray-500">85%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}