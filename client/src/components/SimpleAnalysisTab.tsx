import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Award } from 'lucide-react';

export default function SimpleAnalysisTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Session Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">120</div>
              <div className="text-sm text-gray-600">Words per Minute</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Filler Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">90%</div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Voice Clarity</span>
              <span className="text-sm text-gray-600">88%</span>
            </div>
            <Progress value={88} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Eye Contact</span>
              <span className="text-sm text-gray-600">75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Gestures</span>
              <span className="text-sm text-gray-600">82%</span>
            </div>
            <Progress value={82} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}