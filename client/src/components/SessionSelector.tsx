import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Target, BarChart3, Play } from "lucide-react";

interface SessionSelectorProps {
  onSessionSelect: (session: any) => void;
  selectedSession?: any;
  placeholder?: string;
}

export default function SessionSelector({ onSessionSelect, selectedSession, placeholder }: SessionSelectorProps) {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500 py-8">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Sessions Yet</h3>
            <p className="text-sm">
              {placeholder || "Start your first practice session to see detailed analytics and AI coaching insights."}
            </p>
            <Button className="mt-4" onClick={() => window.location.href = '/dashboard'}>
              <Play className="w-4 h-4 mr-2" />
              Start Practicing
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select a Session</h3>
        <Badge variant="outline" className="text-xs">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Select
        value={selectedSession?.id?.toString() || ""}
        onValueChange={(value) => {
          const session = sessions.find((s: any) => s.id.toString() === value);
          if (session) onSessionSelect(session);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a session to analyze..." />
        </SelectTrigger>
        <SelectContent>
          {sessions.map((session: any) => (
            <SelectItem key={session.id} value={session.id.toString()}>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{session.name}</span>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(session.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(session.duration)}
                    </span>
                    {session.purpose && (
                      <span className="flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        {session.purpose}
                      </span>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={session.overallScore >= 80 ? "default" : session.overallScore >= 60 ? "secondary" : "outline"}
                  className="ml-2"
                >
                  {session.overallScore}%
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSession && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-900">{selectedSession.name}</h4>
              <Badge variant="default" className="bg-blue-600">
                {selectedSession.overallScore}%
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <div className="font-medium text-blue-800">{selectedSession.wordCount}</div>
                <div className="text-blue-600">Words</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-800">{selectedSession.wpm}</div>
                <div className="text-blue-600">WPM</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-800">{selectedSession.fillerWords?.length || 0}</div>
                <div className="text-blue-600">Fillers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}