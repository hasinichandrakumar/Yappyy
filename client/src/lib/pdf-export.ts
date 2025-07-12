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
  fillerWords?: string[];
  fillerWordCount?: number;
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
    primary: [99, 102, 241], // Yappyy Indigo
    secondary: [139, 92, 246], // Yappyy Purple  
    accent: [59, 130, 246], // Yappyy Blue
    success: [34, 197, 94], // Emerald
    warning: [251, 146, 60], // Orange
    danger: [239, 68, 68], // Red
    gray: [100, 116, 139], // Slate
    lightGray: [248, 250, 252], // Light background
    darkGray: [15, 23, 42], // Slate 900
    mutedGray: [71, 85, 105], // Slate 600
    white: [255, 255, 255],
    brand: {
      gradient1: [99, 102, 241], // Indigo 500
      gradient2: [139, 92, 246], // Violet 500
      background: [248, 250, 252] // Slate 50
    }
  };

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
  }

  async generateSessionReport(session: SessionData): Promise<void> {
    this.resetDocument();
    
    // Single page professional analysis
    this.addModernHeader(session);
    this.currentY = 45;
    
    // Key metrics in grid layout
    this.addMetricsGrid(session);
    this.currentY += 50;
    
    // Performance insights
    this.addPerformanceInsights(session);
    this.currentY += 35;
    
    // Filler words analysis
    this.addFillerWordsSection(session);
    this.currentY += 30;

    // Detailed Analysis
    if (session.analysis) {
      this.addSectionTitle('Detailed Analysis', true);
      this.addAnalysisDetails(session.analysis);
    }

    // Filler Words Analysis (only add the method if it exists)
    this.checkPageBreak(50);
    this.addSectionTitle('Filler Words Analysis', true);
    this.addFillerWordsSection(session);

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

  private addModernHeader(session: SessionData): void {
    // Gradient background header
    this.pdf.setFillColor(99, 102, 241);
    this.pdf.rect(0, 0, this.pageWidth, 35, 'F');
    
    // Yappyy logo/brand
    this.pdf.setFontSize(28);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('Yappyy', 20, 22);
    
    // Session analysis subtitle
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('AI-Powered Speech Analysis Report', 20, 30);
    
    // Session name and date on the right
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    const sessionText = session.sessionName || 'Practice Session';
    const dateText = new Date().toLocaleDateString();
    this.pdf.text(sessionText, this.pageWidth - 20, 18, { align: 'right' });
    this.pdf.text(dateText, this.pageWidth - 20, 26, { align: 'right' });
  }

  private addMetricsGrid(session: SessionData): void {
    // Calculate proper percentage values (scores are 0-1, convert to 0-100)
    const overallScore = Math.round((session.overallScore || 0) * 100);
    const voiceClarity = Math.round((session.voiceClarity || 0) * 100);
    const eyeContactScore = Math.round(parseFloat(session.eyeContactScore?.toString() || '0'));
    const confidenceScore = Math.round((session.confidenceScore || 0) * 100);
    
    const metrics = [
      { label: 'Overall Performance', value: overallScore, icon: '🎯', color: this.colors.primary },
      { label: 'Voice Clarity', value: voiceClarity, icon: '🎤', color: this.colors.success },
      { label: 'Eye Contact', value: eyeContactScore, icon: '👁️', color: this.colors.secondary },
      { label: 'Confidence Level', value: confidenceScore, icon: '💪', color: this.colors.accent }
    ];
    
    const cardWidth = (this.pageWidth - 40) / 2;
    const cardHeight = 35;
    
    metrics.forEach((metric, index) => {
      const x = 20 + (index % 2) * (cardWidth + 10);
      const y = this.currentY + Math.floor(index / 2) * (cardHeight + 8);
      
      this.addMetricCard(metric.label, metric.value, metric.color, x, y, cardWidth, cardHeight);
    });
  }

  private addMetricCard(label: string, value: number, color: number[], x: number, y: number, width: number, height: number): void {
    // Card shadow
    this.pdf.setFillColor(0, 0, 0, 0.1);
    this.pdf.roundedRect(x + 1, y + 1, width, height, 4, 4, 'F');
    
    // Card background
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.setDrawColor(...color);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(x, y, width, height, 4, 4, 'FD');
    
    // Colored top bar
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(x, y, width, 4, 4, 4, 'F');
    this.pdf.rect(x, y + 4, width, height - 4, 'F');
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.rect(x, y + 4, width, height - 4, 'F');
    
    // Label
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(60, 60, 60);
    this.pdf.text(label, x + 8, y + 16);
    
    // Value
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...color);
    this.pdf.text(`${value}%`, x + width - 8, y + 25, { align: 'right' });
    
    // Performance badge
    const badge = value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : value >= 40 ? 'Fair' : 'Needs Work';
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(badge, x + 8, y + height - 6);
  }

  private addPerformanceInsights(session: SessionData): void {
    // Section title
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.text('Performance Insights', 20, this.currentY);
    
    this.currentY += 10;
    
    // Create insights grid
    const leftColumn = 20;
    const rightColumn = this.pageWidth / 2 + 5;
    const columnWidth = (this.pageWidth / 2) - 25;
    
    // Session details
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(80, 80, 80);
    this.pdf.text('SESSION DETAILS', leftColumn, this.currentY);
    this.currentY += 5;
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    const duration = Math.floor((session.duration || 0) / 60);
    const minutes = (session.duration || 0) % 60;
    this.pdf.text(`Duration: ${duration}:${minutes.toString().padStart(2, '0')}`, leftColumn, this.currentY);
    this.currentY += 4;
    this.pdf.text(`Words Per Minute: ${session.analysis?.averageWPM || 'N/A'}`, leftColumn, this.currentY);
    this.currentY += 4;
    this.pdf.text(`Filler Words: ${session.fillerWordCount || 0}`, leftColumn, this.currentY);
    
    // Key strengths (right column)
    this.currentY -= 13;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(80, 80, 80);
    this.pdf.text('KEY STRENGTHS', rightColumn, this.currentY);
    this.currentY += 5;
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    
    const strengths = this.getTopStrengths(session);
    strengths.forEach(strength => {
      this.pdf.text(`• ${strength}`, rightColumn, this.currentY);
      this.currentY += 4;
    });
  }

  private getTopStrengths(session: SessionData): string[] {
    const strengths = [];
    
    const overallScore = (session.overallScore || 0) * 100;
    const voiceClarity = (session.voiceClarity || 0) * 100;
    const confidenceScore = (session.confidenceScore || 0) * 100;
    const eyeContactScore = parseFloat(session.eyeContactScore?.toString() || '0');
    
    if (voiceClarity >= 70) strengths.push('Excellent voice clarity');
    if (confidenceScore >= 70) strengths.push('Strong confidence level');
    if (eyeContactScore >= 70) strengths.push('Good eye contact');
    if ((session.fillerWordCount || 0) <= 3) strengths.push('Minimal filler words');
    if (overallScore >= 70) strengths.push('Solid overall performance');
    
    return strengths.slice(0, 3);
  }

  private addCoverPage(session: SessionData): void {
    // Modern gradient background with brand colors
    this.pdf.setFillColor(...this.colors.brand.gradient1);
    this.pdf.rect(0, 0, this.pageWidth, 90, 'F');
    
    // Gradient overlay effect with secondary color
    this.pdf.setFillColor(...this.colors.brand.gradient2);
    for (let i = 0; i < 20; i++) {
      const alpha = 0.1 - (i * 0.005);
      this.pdf.setFillColor(139, 92, 246, alpha);
      this.pdf.rect(0, 70 + i, this.pageWidth, 1, 'F');
    }
    
    // Modern logo styling
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(42);
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text('Yappyy', this.pageWidth / 2, 35, { align: 'center' });
    
    // Elegant tagline with better typography
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(255, 255, 255, 0.9);
    this.pdf.text('AI-Powered Speaking Excellence', this.pageWidth / 2, 50, { align: 'center' });
    
    // Decorative line
    this.pdf.setDrawColor(255, 255, 255, 0.5);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.pageWidth / 2 - 40, 60, this.pageWidth / 2 + 40, 60);
    
    // Professional session title with modern typography
    this.pdf.setTextColor(...this.colors.darkGray);
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Session Analysis Report', this.pageWidth / 2, 110, { align: 'center' });
    
    // Elegant subtitle
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.mutedGray);
    this.pdf.text('Comprehensive Performance Analysis', this.pageWidth / 2, 125, { align: 'center' });
    
    // Modern session details card with shadow and border
    this.pdf.setFillColor(0, 0, 0, 0.05);
    this.pdf.roundedRect(32, 147, 146, 58, 8, 8, 'F');
    
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.setDrawColor(...this.colors.primary);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(30, 145, 150, 60, 8, 8, 'FD');
    
    // Session name with brand color
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.primary);
    this.pdf.text(session.sessionName, 105, 165, { align: 'center' });
    
    // Session metadata with improved spacing
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.mutedGray);
    this.pdf.text(`${new Date(session.createdAt).toLocaleDateString()}`, 105, 180, { align: 'center' });
    this.pdf.text(`${Math.round(session.duration / 60)} minutes`, 105, 192, { align: 'center' });
    
    // Professional overall score circle with gradient effect
    const centerX = this.pageWidth / 2;
    const centerY = 240;
    const radius = 30;
    
    // Calculate overall score from available metrics
    const voiceScore = (session.voiceClarity || 0.8) * 100;
    const confidenceScore = (session.confidenceScore || 0.75) * 100;
    const eyeContactScore = parseFloat(session.eyeContactScore || '75');
    const overallScore = Math.round((voiceScore + confidenceScore + eyeContactScore) / 3);
    
    // Shadow effect
    this.pdf.setFillColor(0, 0, 0, 0.1);
    this.pdf.circle(centerX + 2, centerY + 2, radius, 'F');
    
    // Main circle with brand gradient
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.circle(centerX, centerY, radius, 'F');
    
    // Inner circle for depth
    this.pdf.setFillColor(...this.colors.accent);
    this.pdf.circle(centerX, centerY, radius - 3, 'F');
    
    // Score display with better typography
    this.pdf.setFontSize(28);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text(`${overallScore}%`, centerX, centerY + 4, { align: 'center' });
    
    // Professional label
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.darkGray);
    this.pdf.text('Overall Performance', centerX, centerY + 45, { align: 'center' });
    
    // Performance category
    const category = overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : overallScore >= 55 ? 'Improving' : 'Needs Focus';
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.mutedGray);
    this.pdf.text(category, centerX, centerY + 58, { align: 'center' });
  }

  private addExecutiveSummary(session: SessionData): void {
    this.addSectionTitle('Executive Summary', true);
    
    // Professional summary card with modern styling
    this.pdf.setFillColor(0, 0, 0, 0.03);
    this.pdf.roundedRect(this.margin + 2, this.currentY + 2, this.pageWidth - (2 * this.margin), 45, 8, 8, 'F');
    
    this.pdf.setFillColor(...this.colors.brand.background);
    this.pdf.setDrawColor(...this.colors.primary);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 45, 8, 8, 'FD');
    
    // Executive summary content
    const voiceScore = (session.voiceClarity || 0.8) * 100;
    const confidenceScore = (session.confidenceScore || 0.75) * 100;
    const eyeContactScore = parseFloat(session.eyeContactScore || '75');
    const overallScore = Math.round((voiceScore + confidenceScore + eyeContactScore) / 3);
    
    const summaryText = `This comprehensive analysis leverages advanced AI technology to evaluate your speaking performance across multiple dimensions. Your overall score of ${overallScore}% reflects measurable strengths in communication delivery and identifies specific opportunities for enhancement in eye contact engagement and confidence projection.`;
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.darkGray);
    
    const lines = this.pdf.splitTextToSize(summaryText, this.pageWidth - (2 * this.margin) - 20);
    lines.forEach((line: string, index: number) => {
      this.pdf.text(line, this.margin + 15, this.currentY + 15 + (index * 6));
    });
    
    this.currentY += 50;
  }

  private addSectionTitle(title: string, withIcon: boolean = false): void {
    this.checkPageBreak(30);
    
    // Modern section header with gradient effect
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.roundedRect(this.margin, this.currentY - 5, this.pageWidth - (2 * this.margin), 18, 4, 4, 'F');
    
    // Subtle gradient overlay
    this.pdf.setFillColor(...this.colors.accent);
    this.pdf.roundedRect(this.margin, this.currentY - 5, this.pageWidth - (2 * this.margin), 6, 4, 4, 'F');
    
    // Professional typography
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text(title, this.margin + 10, this.currentY + 7);
    
    // Decorative accent line
    this.pdf.setDrawColor(...this.colors.white);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin + 10, this.currentY + 10, this.margin + 50, this.currentY + 10);
    
    this.currentY += 25;
  }

  private addText(text: string, fontSize: number = 12): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(text, this.margin, this.currentY);
    this.currentY += 7;
  }

  private addPerformanceGrid(session: SessionData): void {
    // Calculate accurate scores from database values
    const voiceScore = (session.voiceClarity || 0.8) * 100;
    const confidenceScore = (session.confidenceScore || 0.75) * 100;
    const eyeContactScore = parseFloat(session.eyeContactScore || '75');
    const overallScore = Math.round((voiceScore + confidenceScore + eyeContactScore) / 3);
    
    const metrics = [
      { label: 'Overall Score', value: overallScore, color: this.colors.primary, icon: '★' },
      { label: 'Voice Clarity', value: voiceScore, color: this.colors.success, icon: '🎤' },
      { label: 'Eye Contact', value: eyeContactScore, color: this.colors.secondary, icon: '👁' },
      { label: 'Confidence', value: confidenceScore, color: this.colors.accent, icon: '💪' }
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
    // Professional shadow effect
    this.pdf.setFillColor(0, 0, 0, 0.08);
    this.pdf.roundedRect(x + 2, y + 2, width, height, 6, 6, 'F');
    
    // Clean white background
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.roundedRect(x, y, width, height, 6, 6, 'F');
    
    // Modern border with brand color
    this.pdf.setDrawColor(...color);
    this.pdf.setLineWidth(1.5);
    this.pdf.roundedRect(x, y, width, height, 6, 6, 'S');
    
    // Top accent bar with gradient effect
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(x, y, width, 5, 6, 6, 'F');
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.rect(x, y + 5, width, height - 5, 'F');
    
    // Label with improved typography
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.darkGray);
    this.pdf.text(label, x + 12, y + 18);
    
    // Large, prominent value display
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...color);
    this.pdf.text(`${Math.round(value)}%`, x + width - 30, y + 20);
    
    // Elegant progress indicator
    const barWidth = width - 24;
    const barHeight = 6;
    const barY = y + height - 16;
    
    // Modern progress track
    this.pdf.setFillColor(241, 245, 249);
    this.pdf.roundedRect(x + 12, barY, barWidth, barHeight, 3, 3, 'F');
    
    // Vibrant progress fill with rounded edges
    const progressWidth = (value / 100) * barWidth;
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(x + 12, barY, progressWidth, barHeight, 3, 3, 'F');
    
    // Performance badge
    const indicator = value >= 85 ? 'Outstanding' : value >= 70 ? 'Excellent' : value >= 55 ? 'Good' : 'Improving';
    const badgeColor = value >= 85 ? this.colors.success : value >= 70 ? this.colors.primary : value >= 55 ? this.colors.warning : this.colors.mutedGray;
    
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...badgeColor);
    this.pdf.text(indicator, x + 12, y + height - 6);
  }

  private addFillerWordsSection(session: SessionData): void {
    // Section title
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.text('Speech Analysis Summary', 20, this.currentY);
    
    this.currentY += 12;
    
    // Filler words summary with improved design
    const fillerCount = session.fillerWordCount || 0;
    const fillerData = session.analysis?.fillerAnalysis;
    
    // Filler words box
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.setDrawColor(203, 213, 225);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(20, this.currentY, this.pageWidth - 40, 25, 4, 4, 'FD');
    
    // Filler count
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(220, 38, 127);
    this.pdf.text('Filler Words Detected:', 25, this.currentY + 10);
    
    this.pdf.setFontSize(20);
    this.pdf.text(`${fillerCount}`, this.pageWidth - 45, this.currentY + 12);
    
    // Severity assessment
    const severity = fillerData?.severity || (fillerCount > 10 ? 'high' : fillerCount > 5 ? 'moderate' : 'excellent');
    const severityText = severity === 'excellent' ? 'Excellent Control' : 
                        severity === 'moderate' ? 'Room for Improvement' : 'Needs Attention';
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(severityText, 25, this.currentY + 18);
    
    // Top filler words if available
    if (fillerData?.detectedFillers?.length > 0) {
      const topFillers = fillerData.detectedFillers.slice(0, 3).map(f => f.word).join(', ');
      this.pdf.text(`Most common: ${topFillers}`, this.pageWidth - 100, this.currentY + 18);
    }
    
    this.currentY += 30;
    
    // Bottom recommendations section
    this.addRecommendationsSection(session);
  }

  private addRecommendationsSection(session: SessionData): void {
    // Recommendations title
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.text('Key Recommendations', 20, this.currentY);
    
    this.currentY += 10;
    
    // Generate smart recommendations
    const recommendations = this.generateRecommendations(session);
    
    // Recommendations in a clean list format
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    
    recommendations.forEach((rec, index) => {
      // Bullet point
      this.pdf.setFillColor(99, 102, 241);
      this.pdf.circle(25, this.currentY - 2, 1, 'F');
      
      // Recommendation text
      this.pdf.text(rec, 30, this.currentY);
      this.currentY += 6;
    });
    
    // Add footer
    this.addModernFooter();
  }

  private generateRecommendations(session: SessionData): string[] {
    const recommendations = [];
    
    const overallScore = (session.overallScore || 0) * 100;
    const voiceClarity = (session.voiceClarity || 0) * 100;
    const confidenceScore = (session.confidenceScore || 0) * 100;
    const eyeContactScore = parseFloat(session.eyeContactScore?.toString() || '0');
    const fillerCount = session.fillerWordCount || 0;
    
    // Personalized recommendations based on performance
    if (fillerCount > 5) {
      recommendations.push('Practice pausing instead of using filler words - detected high frequency');
    }
    
    if (voiceClarity < 70) {
      recommendations.push('Focus on articulation and speaking clearly');
    }
    
    if (eyeContactScore < 70) {
      recommendations.push('Improve eye contact by looking directly at your audience');
    }
    
    if (confidenceScore < 70) {
      recommendations.push('Build confidence through regular practice and preparation');
    }
    
    if (overallScore >= 70) {
      recommendations.push('Continue your excellent progress with consistent practice');
    }
    
    // Ensure at least 3 recommendations
    if (recommendations.length < 3) {
      recommendations.push('Record yourself practicing to identify improvement areas');
      recommendations.push('Focus on varying your pace and tone for better engagement');
    }
    
    return recommendations.slice(0, 4);
  }

  private addModernFooter(): void {
    // Position footer at bottom
    this.currentY = this.pageHeight - 25;
    
    // Footer line
    this.pdf.setDrawColor(99, 102, 241);
    this.pdf.setLineWidth(2);
    this.pdf.line(20, this.currentY, this.pageWidth - 20, this.currentY);
    
    this.currentY += 8;
    
    // Footer text
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text('Generated by Yappyy AI Speech Coach', 20, this.currentY);
    this.pdf.text(`${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, this.pageWidth - 20, this.currentY, { align: 'right' });
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
      
      // Modern gradient footer background
      this.pdf.setFillColor(...this.colors.primary);
      this.pdf.rect(0, this.pageHeight - 20, this.pageWidth, 20, 'F');
      
      // Subtle gradient overlay
      this.pdf.setFillColor(...this.colors.secondary);
      this.pdf.rect(0, this.pageHeight - 20, this.pageWidth, 8, 'F');
      
      // Professional branding
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.white);
      this.pdf.text('Yappyy', this.margin, this.pageHeight - 12);
      
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text('AI-Powered Speaking Excellence', this.margin, this.pageHeight - 5);
      
      // Generation timestamp
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(255, 255, 255, 0.8);
      this.pdf.text(
        `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        this.pageWidth / 2,
        this.pageHeight - 5,
        { align: 'center' }
      );
      
      // Professional page numbering
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.white);
      this.pdf.text(
        `${i} / ${pageCount}`,
        this.pageWidth - this.margin,
        this.pageHeight - 8,
        { align: 'right' }
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