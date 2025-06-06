import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { PracticeSession } from "@shared/schema";

export default function SessionHistory() {
  const { data: sessions, isLoading } = useQuery<PracticeSession[]>({
    queryKey: ['/api/sessions']
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (diffDays === 2) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getConfidenceBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-cyan-100 text-cyan-800";
    return "bg-red-100 text-red-800";
  };

  const getImprovementAreas = (session: PracticeSession) => {
    const areas: string[] = [];
    if (session.averageWPM < 120 || session.averageWPM > 160) areas.push("Pace");
    if (session.voiceClarity < 80) areas.push("Clarity");
    if (session.eyeContactScore !== "good") areas.push("Eye Contact");
    if (session.fillerWords > 5) areas.push("Filler Words");
    return areas.length > 0 ? areas.join(", ") : "None";
  };

  if (isLoading) {
    return (
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading session history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {!sessions || sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No sessions recorded yet. Start your first practice session!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Duration</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Confidence</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Areas Improved</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.slice(0, 5).map((session) => (
                  <tr key={session.id}>
                    <td className="py-4 text-sm text-gray-900">
                      {formatDate(session.createdAt)}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {formatDuration(session.duration)}
                    </td>
                    <td className="py-4">
                      <Badge 
                        className={`${getConfidenceBadgeColor(session.confidenceScore)} border-0`}
                      >
                        {Math.round(session.confidenceScore)}%
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {getImprovementAreas(session)}
                    </td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                        <Play className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
