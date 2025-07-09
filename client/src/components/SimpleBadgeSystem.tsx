import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Target } from 'lucide-react';

export default function SimpleBadgeSystem() {
  const achievements = [
    { id: 1, name: "First Session", description: "Complete your first practice session", earned: true, icon: Trophy },
    { id: 2, name: "Confidence Builder", description: "Achieve 80% confidence score", earned: true, icon: Star },
    { id: 3, name: "Smooth Speaker", description: "Complete a session with less than 5 filler words", earned: false, icon: Award },
    { id: 4, name: "Eye Contact Master", description: "Maintain 85% eye contact score", earned: false, icon: Target },
  ];

  const stats = {
    totalSessions: 12,
    averageScore: 78,
    bestScore: 92,
    streakDays: 5
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent 
                      className={`w-8 h-8 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} 
                    />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        achievement.earned ? 'text-green-900' : 'text-gray-600'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Badge variant="default" className="bg-green-600">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.bestScore}%</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.streakDays}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}