import { Card, CardContent } from "@/components/ui/card";
import { Eye, Volume2, Timer, Target } from "lucide-react";

export default function RealTimeMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Eye Contact */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Eye Contact</h3>
          <p className="text-sm text-gray-600">Real-time tracking</p>
        </CardContent>
      </Card>

      {/* Voice Clarity */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Clarity</h3>
          <p className="text-sm text-gray-600">AI-powered analysis</p>
        </CardContent>
      </Card>

      {/* Speaking Pace */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Timer className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaking Pace</h3>
          <p className="text-sm text-gray-600">Optimal WPM guidance</p>
        </CardContent>
      </Card>

      {/* Confidence Score */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confidence Score</h3>
          <p className="text-sm text-gray-600">Live assessment</p>
        </CardContent>
      </Card>
    </div>
  );
}