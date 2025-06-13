import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Clock } from "lucide-react";

interface SimpleSessionSelectorProps {
  sessions: any[];
  selectedSession: any;
  onSessionSelect: (session: any) => void;
}

export default function SimpleSessionSelector({ 
  sessions, 
  selectedSession, 
  onSessionSelect 
}: SimpleSessionSelectorProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No practice sessions yet</p>
        <p className="text-sm text-gray-500 mt-1">Complete a practice session to see your recordings</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Your Practice Sessions</h3>
      
      <div className="grid gap-3">
        {sessions.map((session, index) => (
          <Card 
            key={session.id || index}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSession?.id === session.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onSessionSelect(session)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Play className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">
                      {session.title || `Practice Session ${index + 1}`}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(session.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(session.duration || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {session.overallScore && (
                    <Badge variant="outline" className="text-xs">
                      {session.overallScore}% Score
                    </Badge>
                  )}
                  <Button
                    variant={selectedSession?.id === session.id ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSessionSelect(session);
                    }}
                  >
                    {selectedSession?.id === session.id ? "Selected" : "View"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}