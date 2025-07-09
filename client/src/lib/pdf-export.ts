// PDF Export System for Analysis Reports
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface SessionData {
  id: number;
  userId: string;
  sessionName: string;
  duration: number;
  createdAt: string;
  overallScore?: number;
  voiceClarity?: number;
  eyeContactScore?: number;
  confidenceScore?: number;
  transcript?: string;
  analysis?: any;
}

export interface ReportOptions {
  type: 'session' | 'weekly' | 'monthly' | 'yearly';
  sessions: SessionData[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export class PDFExportService {
  private pdf: jsPDF;
  private pageHeight: number = 297; // A4 height in mm
  private pageWidth: number = 210; // A4 width in mm
  private margin: number = 20;
  private currentY: number = 20;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
  }

  async generateSessionReport(session: SessionData): Promise<void> {
    this.resetDocument();
    
    // Header
    this.addHeader('Yappyy - Session Analysis Report');
    this.addSubheader(`Session: ${session.sessionName}`);
    this.addText(`Date: ${new Date(session.createdAt).toLocaleDateString()}`);
    this.addText(`Duration: ${Math.round(session.duration / 60)} minutes`);
    this.currentY += 10;

    // Overall Performance
    this.addSectionTitle('Overall Performance');
    this.addPerformanceCard('Overall Score', session.overallScore || 75, '#3B82F6');
    this.addPerformanceCard('Voice Clarity', session.voiceClarity || 80, '#10B981');
    this.addPerformanceCard('Eye Contact', session.eyeContactScore || 75, '#8B5CF6');
    this.addPerformanceCard('Confidence', session.confidenceScore || 78, '#F59E0B');
    this.currentY += 15;

    // Analysis Details
    if (session.analysis) {
      this.addSectionTitle('Detailed Analysis');
      this.addAnalysisDetails(session.analysis);
    }

    // Transcript (if available)
    if (session.transcript && session.transcript.trim()) {
      this.checkPageBreak(60);
      this.addSectionTitle('Session Transcript');
      this.addTranscript(session.transcript);
    }

    // Footer
    this.addFooter();
  }

  async generatePeriodReport(options: ReportOptions): Promise<void> {
    this.resetDocument();
    
    const { type, sessions, dateRange } = options;
    const periodTitle = this.getPeriodTitle(type, dateRange);
    
    // Header
    this.addHeader(`Yappyy - ${periodTitle} Report`);
    if (dateRange) {
      this.addSubheader(`${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`);
    }
    this.addText(`Total Sessions: ${sessions.length}`);
    this.currentY += 10;

    // Summary Statistics
    this.addSectionTitle('Performance Summary');
    this.addSummaryStats(sessions);
    this.currentY += 15;

    // Trends Analysis
    this.addSectionTitle('Performance Trends');
    this.addTrendsAnalysis(sessions);
    this.currentY += 15;

    // Session List
    this.addSectionTitle('Session Details');
    this.addSessionList(sessions);

    // Recommendations
    this.checkPageBreak(40);
    this.addSectionTitle('Recommendations');
    this.addRecommendations(sessions);

    // Footer
    this.addFooter();
  }

  private resetDocument(): void {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.currentY = 20;
  }

  private addHeader(title: string): void {
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 15;
  }

  private addSubheader(subtitle: string): void {
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(subtitle, this.margin, this.currentY);
    this.currentY += 10;
  }

  private addSectionTitle(title: string): void {
    this.checkPageBreak(20);
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 10;
  }

  private addText(text: string, fontSize: number = 12): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(text, this.margin, this.currentY);
    this.currentY += 7;
  }

  private addPerformanceCard(label: string, value: number, color: string): void {
    const cardHeight = 15;
    const cardWidth = 80;
    
    this.checkPageBreak(cardHeight + 5);
    
    // Card background
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.rect(this.margin, this.currentY - 3, cardWidth, cardHeight, 'F');
    
    // Label
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(label, this.margin + 5, this.currentY + 4);
    
    // Value
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${Math.round(value)}%`, this.margin + 50, this.currentY + 4);
    
    // Progress bar
    const barWidth = 60;
    const barHeight = 3;
    const barY = this.currentY + 6;
    
    // Background bar
    this.pdf.setFillColor(229, 231, 235);
    this.pdf.rect(this.margin + 5, barY, barWidth, barHeight, 'F');
    
    // Progress bar
    const progressWidth = (value / 100) * barWidth;
    this.pdf.setFillColor(59, 130, 246); // Blue color
    this.pdf.rect(this.margin + 5, barY, progressWidth, barHeight, 'F');
    
    this.currentY += cardHeight + 5;
  }

  private addAnalysisDetails(analysis: any): void {
    if (analysis.overallFeedback) {
      this.addText('Overall Feedback:', 12);
      this.addWrappedText(analysis.overallFeedback, 11);
      this.currentY += 5;
    }

    if (analysis.strengths && analysis.strengths.length > 0) {
      this.addText('Strengths:', 12);
      analysis.strengths.forEach((strength: string) => {
        this.addText(`• ${strength}`, 10);
      });
      this.currentY += 5;
    }

    if (analysis.improvements && analysis.improvements.length > 0) {
      this.addText('Areas for Improvement:', 12);
      analysis.improvements.forEach((improvement: string) => {
        this.addText(`• ${improvement}`, 10);
      });
      this.currentY += 5;
    }
  }

  private addTranscript(transcript: string): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    
    const maxWidth = this.pageWidth - (this.margin * 2);
    const lines = this.pdf.splitTextToSize(transcript, maxWidth);
    
    lines.forEach((line: string) => {
      this.checkPageBreak(5);
      this.pdf.text(line, this.margin, this.currentY);
      this.currentY += 5;
    });
  }

  private addSummaryStats(sessions: SessionData[]): void {
    if (sessions.length === 0) return;

    const avgOverall = sessions.reduce((sum, s) => sum + (s.overallScore || 75), 0) / sessions.length;
    const avgVoice = sessions.reduce((sum, s) => sum + (s.voiceClarity || 80), 0) / sessions.length;
    const avgEyeContact = sessions.reduce((sum, s) => sum + (s.eyeContactScore || 75), 0) / sessions.length;
    const avgConfidence = sessions.reduce((sum, s) => sum + (s.confidenceScore || 78), 0) / sessions.length;
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    this.addPerformanceCard('Average Overall Score', avgOverall, '#3B82F6');
    this.addPerformanceCard('Average Voice Clarity', avgVoice, '#10B981');
    this.addPerformanceCard('Average Eye Contact', avgEyeContact, '#8B5CF6');
    this.addPerformanceCard('Average Confidence', avgConfidence, '#F59E0B');
    
    this.addText(`Total Practice Time: ${Math.round(totalTime / 60)} minutes`);
    this.addText(`Average Session Length: ${Math.round((totalTime / sessions.length) / 60)} minutes`);
  }

  private addTrendsAnalysis(sessions: SessionData[]): void {
    if (sessions.length < 2) {
      this.addText('Not enough data for trend analysis (minimum 2 sessions required)');
      return;
    }

    const first = sessions[0];
    const last = sessions[sessions.length - 1];
    
    const overallChange = (last.overallScore || 75) - (first.overallScore || 75);
    const voiceChange = (last.voiceClarity || 80) - (first.voiceClarity || 80);
    const eyeContactChange = (last.eyeContactScore || 75) - (first.eyeContactScore || 75);
    const confidenceChange = (last.confidenceScore || 78) - (first.confidenceScore || 78);

    this.addText(`Overall Score: ${overallChange > 0 ? '+' : ''}${overallChange.toFixed(1)}% change`);
    this.addText(`Voice Clarity: ${voiceChange > 0 ? '+' : ''}${voiceChange.toFixed(1)}% change`);
    this.addText(`Eye Contact: ${eyeContactChange > 0 ? '+' : ''}${eyeContactChange.toFixed(1)}% change`);
    this.addText(`Confidence: ${confidenceChange > 0 ? '+' : ''}${confidenceChange.toFixed(1)}% change`);
  }

  private addSessionList(sessions: SessionData[]): void {
    sessions.forEach((session, index) => {
      this.checkPageBreak(15);
      
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${index + 1}. ${session.sessionName}`, this.margin, this.currentY);
      this.currentY += 6;
      
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Date: ${new Date(session.createdAt).toLocaleDateString()}`, this.margin + 5, this.currentY);
      this.pdf.text(`Duration: ${Math.round(session.duration / 60)}min`, this.margin + 70, this.currentY);
      this.pdf.text(`Score: ${Math.round(session.overallScore || 75)}%`, this.margin + 130, this.currentY);
      this.currentY += 8;
    });
  }

  private addRecommendations(sessions: SessionData[]): void {
    const recommendations = this.generateRecommendations(sessions);
    
    recommendations.forEach((rec, index) => {
      this.checkPageBreak(8);
      this.addText(`${index + 1}. ${rec}`, 11);
    });
  }

  private generateRecommendations(sessions: SessionData[]): string[] {
    if (sessions.length === 0) return ['Complete more practice sessions for personalized recommendations'];

    const recommendations: string[] = [];
    const avgOverall = sessions.reduce((sum, s) => sum + (s.overallScore || 75), 0) / sessions.length;
    const avgVoice = sessions.reduce((sum, s) => sum + (s.voiceClarity || 80), 0) / sessions.length;
    const avgEyeContact = sessions.reduce((sum, s) => sum + (s.eyeContactScore || 75), 0) / sessions.length;
    const avgConfidence = sessions.reduce((sum, s) => sum + (s.confidenceScore || 78), 0) / sessions.length;

    if (avgVoice < 70) {
      recommendations.push('Focus on voice clarity exercises and articulation practice');
    }
    if (avgEyeContact < 60) {
      recommendations.push('Practice maintaining eye contact by looking directly at the camera lens');
    }
    if (avgConfidence < 70) {
      recommendations.push('Build confidence through regular practice and positive self-talk techniques');
    }
    if (sessions.length < 5) {
      recommendations.push('Increase practice frequency to at least 3 sessions per week for optimal improvement');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue your excellent practice routine and focus on advanced presentation techniques');
    }

    return recommendations;
  }

  private addWrappedText(text: string, fontSize: number = 12): void {
    this.pdf.setFontSize(fontSize);
    const maxWidth = this.pageWidth - (this.margin * 2);
    const lines = this.pdf.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      this.checkPageBreak(5);
      this.pdf.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
  }

  private checkPageBreak(requiredHeight: number): void {
    if (this.currentY + requiredHeight > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addFooter(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      
      // Footer text
      this.pdf.text(
        `Generated by Yappyy - AI-Powered Speaking Coach | ${new Date().toLocaleDateString()}`,
        this.margin,
        this.pageHeight - 10
      );
      
      // Page number
      this.pdf.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth - this.margin - 20,
        this.pageHeight - 10
      );
    }
  }

  private getPeriodTitle(type: string, dateRange?: { start: Date; end: Date }): string {
    switch (type) {
      case 'weekly':
        return 'Weekly Analysis';
      case 'monthly':
        return 'Monthly Analysis';
      case 'yearly':
        return 'Yearly Analysis';
      default:
        return 'Period Analysis';
    }
  }

  public async downloadPDF(filename: string): Promise<void> {
    this.pdf.save(filename);
  }

  public getPDFBlob(): Blob {
    return this.pdf.output('blob');
  }
}

// Helper functions for generating reports
export const generateSessionPDF = async (session: SessionData): Promise<void> => {
  const pdfService = new PDFExportService();
  await pdfService.generateSessionReport(session);
  const filename = `yappyy-session-${session.id}-${new Date().toISOString().split('T')[0]}.pdf`;
  await pdfService.downloadPDF(filename);
};

export const generatePeriodPDF = async (options: ReportOptions): Promise<void> => {
  const pdfService = new PDFExportService();
  await pdfService.generatePeriodReport(options);
  
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `yappyy-${options.type}-report-${dateStr}.pdf`;
  await pdfService.downloadPDF(filename);
};