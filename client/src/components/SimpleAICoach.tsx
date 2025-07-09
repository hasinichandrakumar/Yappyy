import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, Target } from 'lucide-react';

export default function SimpleAICoach() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Coach</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Today's Focus</h3>
              <p className="text-blue-800">Work on maintaining steady eye contact and reducing filler words.</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Recent Improvement</h3>
              <p className="text-green-800">Your confidence score has increased by 15% over the last week!</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-orange-800 space-y-1">
                <li>Practice with a mirror to improve facial expressions</li>
                <li>Record yourself speaking for 5 minutes daily</li>
                <li>Focus on varying your tone and pace</li>
              </ul>
            </div>

            <Button className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Get Personalized Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}