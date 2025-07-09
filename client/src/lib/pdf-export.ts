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
  private colors = {
    primary: [37, 99, 235], // Blue
    secondary: [34, 211, 238], // Cyan
    success: [16, 185, 129], // Green
    warning: [245, 158, 11], // Orange
    purple: [139, 92, 246], // Purple
    gray: [100, 116, 139], // Slate
    lightGray: [248, 250, 252], // Light background
    darkGray: [30, 41, 59], // Dark text
    white: [255, 255, 255]
  };

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
  }

  async generateSessionReport(session: SessionData): Promise<void> {
    this.resetDocument();
    
    // Cover Page
    this.addCoverPage(session);
    this.pdf.addPage();
    this.currentY = 20;

    // Executive Summary
    this.addExecutiveSummary(session);
    this.currentY += 15;

    // Performance Dashboard
    this.addSectionTitle('Performance Dashboard', true);
    this.addPerformanceGrid(session);
    this.currentY += 20;

    // Detailed Analysis
    if (session.analysis) {
      this.addSectionTitle('Detailed Analysis', true);
      this.addAnalysisDetails(session.analysis);
    }

    // Transcript (if available)
    if (session.transcript && session.transcript.trim()) {
      this.checkPageBreak(60);
      this.addSectionTitle('Session Transcript', true);
      this.addTranscript(session.transcript);
    }

    // Recommendations
    this.addSectionTitle('Personalized Recommendations', true);
    this.addSessionRecommendations(session);

    // Footer
    this.addFooter();
  }

  async generatePeriodReport(options: ReportOptions): Promise<void> {
    this.resetDocument();
    
    const { type, sessions, dateRange } = options;
    const periodTitle = this.getPeriodTitle(type, dateRange);
    
    // Cover Page
    this.addPeriodCoverPage(periodTitle, sessions, dateRange);
    this.pdf.addPage();
    this.currentY = 20;

    // Executive Summary
    this.addPeriodExecutiveSummary(sessions, periodTitle);
    this.currentY += 15;

    // Performance Dashboard
    this.addSectionTitle('Performance Dashboard', true);
    this.addPeriodPerformanceGrid(sessions);
    this.currentY += 20;

    // Trends Analysis with Charts
    this.addSectionTitle('Performance Trends', true);
    this.addEnhancedTrendsAnalysis(sessions);
    this.currentY += 20;

    // Session Gallery
    this.addSectionTitle('Session Gallery', true);
    this.addSessionGallery(sessions);

    // Recommendations
    this.checkPageBreak(40);
    this.addSectionTitle('Personalized Recommendations', true);
    this.addRecommendations(sessions);

    // Footer
    this.addFooter();
  }

  private resetDocument(): void {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.currentY = 20;
  }

  private addCoverPage(session: SessionData): void {
    // Gradient background simulation
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.rect(0, 0, this.pageWidth, 80, 'F');
    
    // White overlay for gradient effect
    this.pdf.setFillColor(255, 255, 255, 0.1);
    this.pdf.rect(0, 60, this.pageWidth, 20, 'F');
    
    // Logo area
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(32);
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text('Yappyy', this.pageWidth / 2, 40, { align: 'center' });
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('AI-Powered Speaking Coach', this.pageWidth / 2, 50, { align: 'center' });
    
    // Session title
    this.pdf.setTextColor(...this.colors.darkGray);
    this.pdf.setFontSize(28);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Session Analysis Report', this.pageWidth / 2, 120, { align: 'center' });
    
    // Session details card
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.roundedRect(30, 140, 150, 60, 3, 3, 'F');
    
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.primary);
    this.pdf.text(session.sessionName, 105, 160, { align: 'center' });
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.gray);
    this.pdf.text(`Date: ${new Date(session.createdAt).toLocaleDateString()}`, 105, 175, { align: 'center' });
    this.pdf.text(`Duration: ${Math.round(session.duration / 60)} minutes`, 105, 185, { align: 'center' });
    
    // Overall score circle
    const centerX = this.pageWidth / 2;
    const centerY = 240;
    const radius = 25;
    
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.circle(centerX, centerY, radius, 'F');
    
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text(`${Math.round(session.overallScore || 75)}%`, centerX, centerY + 3, { align: 'center' });
    
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(...this.colors.gray);
    this.pdf.text('Overall Score', centerX, centerY + 40, { align: 'center' });
  }

  private addExecutiveSummary(session: SessionData): void {
    this.addSectionTitle('Executive Summary', true);
    
    // Summary card
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 40, 3, 3, 'F');
    
    const summaryText = `This session analysis provides comprehensive insights into your speaking performance. 
    Based on advanced AI analysis, you achieved an overall score of ${Math.round(session.overallScore || 75)}% 
    with strengths in voice clarity and areas for improvement in eye contact and confidence.`;
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.darkGray);
    
    const lines = this.pdf.splitTextToSize(summaryText, this.pageWidth - (2 * this.margin) - 10);
    lines.forEach((line: string, index: number) => {
      this.pdf.text(line, this.margin + 5, this.currentY + 10 + (index * 6));
    });
    
    this.currentY += 50;
  }

  private addSectionTitle(title: string, withIcon: boolean = false): void {
    this.checkPageBreak(25);
    
    // Section header with background
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (2 * this.margin), 15, 'F');
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text(title, this.margin + 5, this.currentY + 5);
    
    this.currentY += 20;
  }

  private addText(text: string, fontSize: number = 12): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(text, this.margin, this.currentY);
    this.currentY += 7;
  }

  private addPerformanceGrid(session: SessionData): void {
    const metrics = [
      { label: 'Overall Score', value: session.overallScore || 75, color: this.colors.primary, icon: '★' },
      { label: 'Voice Clarity', value: session.voiceClarity || 80, color: this.colors.success, icon: '🎤' },
      { label: 'Eye Contact', value: session.eyeContactScore || 75, color: this.colors.purple, icon: '👁' },
      { label: 'Confidence', value: session.confidenceScore || 78, color: this.colors.warning, icon: '💪' }
    ];
    
    const cardWidth = (this.pageWidth - (2 * this.margin) - 15) / 2;
    const cardHeight = 35;
    
    metrics.forEach((metric, index) => {
      const x = this.margin + (index % 2) * (cardWidth + 7.5);
      const y = this.currentY + Math.floor(index / 2) * (cardHeight + 10);
      
      this.addEnhancedPerformanceCard(metric.label, metric.value, metric.color, x, y, cardWidth, cardHeight);
    });
    
    this.currentY += (cardHeight + 10) * 2;
  }

  private addEnhancedPerformanceCard(label: string, value: number, color: number[], x: number, y: number, width: number, height: number): void {
    // Card shadow
    this.pdf.setFillColor(0, 0, 0, 0.1);
    this.pdf.roundedRect(x + 1, y + 1, width, height, 3, 3, 'F');
    
    // Card background
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.roundedRect(x, y, width, height, 3, 3, 'F');
    
    // Card border
    this.pdf.setDrawColor(...color);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(x, y, width, height, 3, 3, 'S');
    
    // Color accent bar
    this.pdf.setFillColor(...color);
    this.pdf.rect(x, y, width, 3, 'F');
    
    // Label
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.darkGray);
    this.pdf.text(label, x + 10, y + 15);
    
    // Value with color
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...color);
    this.pdf.text(`${Math.round(value)}%`, x + width - 25, y + 15);
    
    // Progress bar
    const barWidth = width - 20;
    const barHeight = 4;
    const barY = y + height - 12;
    
    // Background bar
    this.pdf.setFillColor(229, 231, 235);
    this.pdf.roundedRect(x + 10, barY, barWidth, barHeight, 2, 2, 'F');
    
    // Progress bar with gradient effect
    const progressWidth = (value / 100) * barWidth;
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(x + 10, barY, progressWidth, barHeight, 2, 2, 'F');
    
    // Performance indicator
    const indicator = value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : 'Needs Work';
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.gray);
    this.pdf.text(indicator, x + 10, y + height - 5);
  }

  private addAnalysisDetails(analysis: any): void {
    if (analysis.overallFeedback) {
      this.addAnalysisSection('Overall Feedback', analysis.overallFeedback, this.colors.primary);
    }

    if (analysis.strengths && analysis.strengths.length > 0) {
      this.addAnalysisSection('Key Strengths', analysis.strengths, this.colors.success, true);
    }

    if (analysis.improvements && analysis.improvements.length > 0) {
      this.addAnalysisSection('Areas for Improvement', analysis.improvements, this.colors.warning, true);
    }
  }

  private addAnalysisSection(title: string, content: string | string[], color: number[], isList: boolean = false): void {
    this.checkPageBreak(40);
    
    // Section header
    this.pdf.setFillColor(...color);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 8, 'F');
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text(title, this.margin + 5, this.currentY + 6);
    
    this.currentY += 15;
    
    // Content box
    const contentHeight = isList ? (content as string[]).length * 8 + 10 : 25;
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), contentHeight, 2, 2, 'F');
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.darkGray);
    
    if (isList) {
      (content as string[]).forEach((item, index) => {
        this.pdf.text(`• ${item}`, this.margin + 10, this.currentY + 10 + (index * 8));
      });
    } else {
      const lines = this.pdf.splitTextToSize(content as string, this.pageWidth - (2 * this.margin) - 20);
      lines.forEach((line: string, index: number) => {
        this.pdf.text(line, this.margin + 10, this.currentY + 10 + (index * 6));
      });
    }
    
    this.currentY += contentHeight + 10;
  }

  private addTranscript(transcript: string): void {
    // Transcript container
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.setDrawColor(...this.colors.gray);
    this.pdf.setLineWidth(0.5);
    
    const maxWidth = this.pageWidth - (this.margin * 2) - 20;
    const lines = this.pdf.splitTextToSize(transcript, maxWidth);
    const containerHeight = lines.length * 5 + 20;
    
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), containerHeight, 3, 3, 'FD');
    
    // Transcript header
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 12, 'F');
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text('Session Transcript', this.margin + 10, this.currentY + 8);
    
    this.currentY += 20;
    
    // Transcript content
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.darkGray);
    
    lines.forEach((line: string) => {
      this.checkPageBreak(5);
      this.pdf.text(line, this.margin + 10, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 10;
  }

  private addPeriodCoverPage(periodTitle: string, sessions: SessionData[], dateRange?: { start: Date; end: Date }): void {
    // Gradient background
    this.pdf.setFillColor(...this.colors.secondary);
    this.pdf.rect(0, 0, this.pageWidth, 100, 'F');
    
    // Overlay pattern
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.rect(0, 80, this.pageWidth, 20, 'F');
    
    // Logo area
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(32);
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text('Yappyy', this.pageWidth / 2, 40, { align: 'center' });
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('AI-Powered Speaking Coach', this.pageWidth / 2, 55, { align: 'center' });
    
    // Report title
    this.pdf.setTextColor(...this.colors.darkGray);
    this.pdf.setFontSize(26);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(periodTitle, this.pageWidth / 2, 130, { align: 'center' });
    
    // Date range card
    if (dateRange) {
      this.pdf.setFillColor(...this.colors.lightGray);
      this.pdf.roundedRect(40, 150, 130, 30, 3, 3, 'F');
      
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(...this.colors.gray);
      this.pdf.text(`${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`, 105, 170, { align: 'center' });
    }
    
    // Stats circles
    const stats = [
      { label: 'Sessions', value: sessions.length.toString(), color: this.colors.primary },
      { label: 'Hours', value: Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600).toString(), color: this.colors.success },
      { label: 'Avg Score', value: `${Math.round(sessions.reduce((sum, s) => sum + (s.overallScore || 75), 0) / sessions.length)}%`, color: this.colors.warning }
    ];
    
    stats.forEach((stat, index) => {
      const x = 45 + (index * 60);
      const y = 220;
      
      this.pdf.setFillColor(...stat.color);
      this.pdf.circle(x, y, 20, 'F');
      
      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.white);
      this.pdf.text(stat.value, x, y + 2, { align: 'center' });
      
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(...this.colors.gray);
      this.pdf.text(stat.label, x, y + 35, { align: 'center' });
    });
  }

  private addPeriodExecutiveSummary(sessions: SessionData[], periodTitle: string): void {
    this.addSectionTitle('Executive Summary', true);
    
    const avgScore = sessions.reduce((sum, s) => sum + (s.overallScore || 75), 0) / sessions.length;
    const totalHours = Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600);
    
    // Summary card with stats
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 50, 3, 3, 'F');
    
    const summaryText = `During this ${periodTitle.toLowerCase()}, you completed ${sessions.length} practice sessions 
    totaling ${totalHours} hours of speaking practice. Your average performance score was ${Math.round(avgScore)}%, 
    demonstrating consistent improvement in your communication skills.`;
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.darkGray);
    
    const lines = this.pdf.splitTextToSize(summaryText, this.pageWidth - (2 * this.margin) - 20);
    lines.forEach((line: string, index: number) => {
      this.pdf.text(line, this.margin + 10, this.currentY + 15 + (index * 6));
    });
    
    this.currentY += 60;
  }

  private addPeriodPerformanceGrid(sessions: SessionData[]): void {
    if (sessions.length === 0) return;

    const avgOverall = sessions.reduce((sum, s) => sum + (s.overallScore || 75), 0) / sessions.length;
    const avgVoice = sessions.reduce((sum, s) => sum + (s.voiceClarity || 80), 0) / sessions.length;
    const avgEyeContact = sessions.reduce((sum, s) => sum + (s.eyeContactScore || 75), 0) / sessions.length;
    const avgConfidence = sessions.reduce((sum, s) => sum + (s.confidenceScore || 78), 0) / sessions.length;

    const metrics = [
      { label: 'Overall Score', value: avgOverall, color: this.colors.primary },
      { label: 'Voice Clarity', value: avgVoice, color: this.colors.success },
      { label: 'Eye Contact', value: avgEyeContact, color: this.colors.purple },
      { label: 'Confidence', value: avgConfidence, color: this.colors.warning }
    ];
    
    const cardWidth = (this.pageWidth - (2 * this.margin) - 15) / 2;
    const cardHeight = 35;
    
    metrics.forEach((metric, index) => {
      const x = this.margin + (index % 2) * (cardWidth + 7.5);
      const y = this.currentY + Math.floor(index / 2) * (cardHeight + 10);
      
      this.addEnhancedPerformanceCard(metric.label, metric.value, metric.color, x, y, cardWidth, cardHeight);
    });
    
    this.currentY += (cardHeight + 10) * 2;
  }

  private addEnhancedTrendsAnalysis(sessions: SessionData[]): void {
    if (sessions.length < 2) {
      this.addText('Not enough data for trend analysis (minimum 2 sessions required)');
      return;
    }

    const first = sessions[0];
    const last = sessions[sessions.length - 1];
    
    const trends = [
      { label: 'Overall Score', change: (last.overallScore || 75) - (first.overallScore || 75), color: this.colors.primary },
      { label: 'Voice Clarity', change: (last.voiceClarity || 80) - (first.voiceClarity || 80), color: this.colors.success },
      { label: 'Eye Contact', change: (last.eyeContactScore || 75) - (first.eyeContactScore || 75), color: this.colors.purple },
      { label: 'Confidence', change: (last.confidenceScore || 78) - (first.confidenceScore || 78), color: this.colors.warning }
    ];

    trends.forEach((trend, index) => {
      const y = this.currentY + (index * 20);
      
      // Trend card
      this.pdf.setFillColor(...this.colors.white);
      this.pdf.setDrawColor(...trend.color);
      this.pdf.setLineWidth(0.5);
      this.pdf.roundedRect(this.margin, y, this.pageWidth - (2 * this.margin), 15, 2, 2, 'FD');
      
      // Trend indicator
      const isPositive = trend.change > 0;
      this.pdf.setFillColor(...(isPositive ? this.colors.success : this.colors.warning));
      this.pdf.rect(this.margin, y, 5, 15, 'F');
      
      // Label
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.darkGray);
      this.pdf.text(trend.label, this.margin + 15, y + 10);
      
      // Change value
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...(isPositive ? this.colors.success : this.colors.warning));
      this.pdf.text(`${isPositive ? '+' : ''}${trend.change.toFixed(1)}%`, this.pageWidth - this.margin - 30, y + 10);
      
      // Arrow indicator
      this.pdf.setTextColor(...trend.color);
      this.pdf.text(isPositive ? '↗' : '↘', this.pageWidth - this.margin - 15, y + 10);
    });
    
    this.currentY += trends.length * 20;
  }

  private addSessionGallery(sessions: SessionData[]): void {
    sessions.forEach((session, index) => {
      this.checkPageBreak(25);
      
      // Session card
      this.pdf.setFillColor(...this.colors.white);
      this.pdf.setDrawColor(...this.colors.primary);
      this.pdf.setLineWidth(0.5);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 20, 3, 3, 'FD');
      
      // Session number badge
      this.pdf.setFillColor(...this.colors.primary);
      this.pdf.circle(this.margin + 15, this.currentY + 10, 6, 'F');
      
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.white);
      this.pdf.text(`${index + 1}`, this.margin + 13, this.currentY + 12);
      
      // Session details
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.darkGray);
      this.pdf.text(session.sessionName, this.margin + 30, this.currentY + 8);
      
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(...this.colors.gray);
      this.pdf.text(`${new Date(session.createdAt).toLocaleDateString()}`, this.margin + 30, this.currentY + 15);
      this.pdf.text(`${Math.round(session.duration / 60)}min`, this.margin + 80, this.currentY + 15);
      
      // Score badge
      const score = Math.round(session.overallScore || 75);
      const scoreColor = score >= 80 ? this.colors.success : score >= 60 ? this.colors.warning : this.colors.purple;
      
      this.pdf.setFillColor(...scoreColor);
      this.pdf.roundedRect(this.pageWidth - this.margin - 25, this.currentY + 5, 20, 10, 2, 2, 'F');
      
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.white);
      this.pdf.text(`${score}%`, this.pageWidth - this.margin - 15, this.currentY + 12, { align: 'center' });
      
      this.currentY += 25;
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

  private addSessionRecommendations(session: SessionData): void {
    const recommendations = [
      'Practice maintaining eye contact by looking directly at the camera lens',
      'Work on reducing filler words through mindful speaking exercises',
      'Focus on varying your vocal tone to maintain audience engagement',
      'Practice confident body language and posture during presentations'
    ];
    
    recommendations.forEach((rec, index) => {
      this.checkPageBreak(20);
      
      // Recommendation card
      this.pdf.setFillColor(...this.colors.white);
      this.pdf.setDrawColor(...this.colors.primary);
      this.pdf.setLineWidth(0.5);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 15, 2, 2, 'FD');
      
      // Number badge
      this.pdf.setFillColor(...this.colors.primary);
      this.pdf.circle(this.margin + 10, this.currentY + 7, 4, 'F');
      
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.white);
      this.pdf.text(`${index + 1}`, this.margin + 8, this.currentY + 9);
      
      // Recommendation text
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(...this.colors.darkGray);
      this.pdf.text(rec, this.margin + 20, this.currentY + 9);
      
      this.currentY += 20;
    });
  }

  private addFooter(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      
      // Footer background
      this.pdf.setFillColor(...this.colors.primary);
      this.pdf.rect(0, this.pageHeight - 15, this.pageWidth, 15, 'F');
      
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(...this.colors.white);
      
      // Footer text
      this.pdf.text(
        `Generated by Yappyy - AI-Powered Speaking Coach | ${new Date().toLocaleDateString()}`,
        this.margin,
        this.pageHeight - 8
      );
      
      // Page number
      this.pdf.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth - this.margin - 20,
        this.pageHeight - 8
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