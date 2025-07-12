// PDF Export Controls Component
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateSessionPDF, generatePeriodPDF, SessionData, ReportOptions } from '@/lib/pdf-export';
import { 
  Download, 
  FileText, 
  Calendar, 
  Clock, 
  TrendingUp,
  Loader2
} from 'lucide-react';

interface PDFExportControlsProps {
  sessions: SessionData[];
  selectedSession?: SessionData | null;
}

export default function PDFExportControls({ sessions, selectedSession }: PDFExportControlsProps) {
  const [reportType, setReportType] = useState<'session' | 'weekly' | 'monthly' | 'yearly'>('session');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSessionExport = async (session: SessionData) => {
    console.log('🎯 Session export button clicked for session:', session?.id);
    if (!session) {
      console.error('❌ No session provided');
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log('🚀 Calling generateSessionPDF...');
      await generateSessionPDF(session);
      console.log('✅ PDF generation completed successfully');
      toast({
        title: "PDF Generated",
        description: `Session analysis report has been downloaded.`,
      });
    } catch (error) {
      console.error('❌ PDF generation failed in component:', error);
      toast({
        title: "Export Failed",
        description: `Failed to generate PDF report: ${error.message || error}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePeriodExport = async (type: 'weekly' | 'monthly' | 'yearly') => {
    console.log('🎯 Period export button clicked for:', type);
    if (sessions.length === 0) {
      console.error('❌ No sessions available');
      toast({
        title: "No Data Available",
        description: "Complete some practice sessions first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const now = new Date();
      let startDate: Date;
      
      switch (type) {
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const filteredSessions = sessions.filter(session => {
        const sessionDate = new Date(session.createdAt);
        return sessionDate >= startDate && sessionDate <= now;
      });

      console.log('📊 Filtered sessions for', type, ':', filteredSessions.length, 'out of', sessions.length);

      const options: ReportOptions = {
        type,
        sessions: filteredSessions,
        dateRange: {
          start: startDate,
          end: now
        }
      };

      console.log('🚀 Calling generatePeriodPDF...');
      await generatePeriodPDF(options);
      console.log('✅ PDF generation completed successfully');
      
      toast({
        title: "PDF Generated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} analysis report has been downloaded.`,
      });
    } catch (error) {
      console.error('❌ PDF generation failed in component:', error);
      toast({
        title: "Export Failed",
        description: `Failed to generate PDF report: ${error.message || error}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSessionCount = (type: 'weekly' | 'monthly' | 'yearly'): number => {
    const now = new Date();
    let startDate: Date;
    
    switch (type) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return sessions.filter(session => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate >= startDate && sessionDate <= now;
    }).length;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Individual Session Export */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Individual Session Report</h4>
          {selectedSession ? (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{selectedSession.sessionName}</p>
                <p className="text-sm text-slate-600">
                  {new Date(selectedSession.createdAt).toLocaleDateString()} • 
                  {Math.round(selectedSession.duration / 60)} min
                </p>
              </div>
              <Button
                onClick={() => handleSessionExport(selectedSession)}
                disabled={isGenerating}
                size="sm"
                className="ml-3"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export PDF
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg text-center text-slate-600">
              Select a session from the analysis tab to export its detailed report
            </div>
          )}
        </div>

        <Separator />

        {/* Period Reports */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Period Analysis Reports</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Weekly Report */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Weekly Report</span>
              </div>
              <div className="text-sm text-slate-600">
                Last 7 days
                <Badge variant="secondary" className="ml-2">
                  {getSessionCount('weekly')} sessions
                </Badge>
              </div>
              <Button
                onClick={() => handlePeriodExport('weekly')}
                disabled={isGenerating || getSessionCount('weekly') === 0}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Weekly
              </Button>
            </div>

            {/* Monthly Report */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">Monthly Report</span>
              </div>
              <div className="text-sm text-slate-600">
                Current month
                <Badge variant="secondary" className="ml-2">
                  {getSessionCount('monthly')} sessions
                </Badge>
              </div>
              <Button
                onClick={() => handlePeriodExport('monthly')}
                disabled={isGenerating || getSessionCount('monthly') === 0}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Monthly
              </Button>
            </div>

            {/* Yearly Report */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Yearly Report</span>
              </div>
              <div className="text-sm text-slate-600">
                Current year
                <Badge variant="secondary" className="ml-2">
                  {getSessionCount('yearly')} sessions
                </Badge>
              </div>
              <Button
                onClick={() => handlePeriodExport('yearly')}
                disabled={isGenerating || getSessionCount('yearly') === 0}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Yearly
              </Button>
            </div>
          </div>
        </div>

        {/* Report Information */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">What's included in PDF reports:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Performance metrics and scores</li>
            <li>• Detailed analysis and feedback</li>
            <li>• Progress trends and improvements</li>
            <li>• Personalized recommendations</li>
            <li>• Session transcripts (when available)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}