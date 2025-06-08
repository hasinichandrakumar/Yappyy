import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, BarChart3, Users, TrendingUp } from "lucide-react";

interface Session {
  id: number;
  userId: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface SessionSelectorProps {
  onSessionSelect: (session: Session | null) => void;
  selectedSessionId?: number | null;
  showCurrentSession?: boolean;
}

export default function SessionSelector({ 
  onSessionSelect, 
  selectedSessionId, 
  showCurrentSession = true 
}: SessionSelectorProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  useEffect(() => {
    if (selectedSessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === selectedSessionId);
      if (session) {
        setSelectedSession(session);
        onSessionSelect(session);
      }
    }
  }, [selectedSessionId, sessions, onSessionSelect]);

  const handleSessionChange = (sessionId: string) => {
    if (sessionId === "current") {
      setSelectedSession(null);
      onSessionSelect(null);
    } else {
      const session = sessions.find(s => s.id === parseInt(sessionId));
      if (session) {
        setSelectedSession(session);
        onSessionSelect(session);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Select Session to Analyze</h3>
          </div>
          {selectedSession && (
            <Badge variant="outline" className="text-blue-700">
              Session #{selectedSession.id}
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <Select 
            value={selectedSession ? selectedSession.id.toString() : showCurrentSession ? "current" : ""} 
            onValueChange={handleSessionChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a practice session to analyze" />
            </SelectTrigger>
            <SelectContent>
              {showCurrentSession && (
                <SelectItem value="current">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Current Live Session</span>
                  </div>
                </SelectItem>
              )}
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">Session #{session.id}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(session.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(session.duration)}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Session Details */}
          {selectedSession && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Date</div>
                    <div className="text-blue-700">{formatDate(selectedSession.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Duration</div>
                    <div className="text-blue-700">{formatDuration(selectedSession.duration)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedSession && showCurrentSession && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700">Analyzing current live session data</span>
              </div>
            </div>
          )}

          {sessions.length === 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">No practice sessions found</p>
              <p className="text-xs text-gray-500 mt-1">Start a practice session to begin analysis</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}