// PDF Export System for Analysis Reports  
import { jsPDF } from 'jspdf';

// Note: jspdf-autotable removed to avoid deployment issues
// Using native jsPDF features for table creation instead

// Enhanced PDF export with Poppins font support and modern styling
export class PDFExport {
  private pdf: jsPDF;
  private currentY: number = 30;
  private pageWidth: number = 210;
  private pageHeight: number = 297;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.setupDocument();
  }

  private setupDocument(): void {
    // Set page background to match Yappyy theme first
    this.pdf.setFillColor(this.colors.background.secondary[0], this.colors.background.secondary[1], this.colors.background.secondary[2]);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Use Arial font for simple and minimalistic design
    try {
      this.pdf.setFont('Arial', 'normal');
    } catch {
      this.pdf.setFont('helvetica', 'normal');
    }
    this.pdf.setFontSize(11);
  }

  // Yappyy Brand Color Scheme - Matching exact website theme
  private colors = {
    primary: [59, 130, 246],     // #3B82F6 - Yappyy Logo Blue
    secondary: [6, 182, 212],    // #06B6D4 - Yappyy Logo Cyan
    accent: [14, 165, 233],      // #0EA5E9 - Yappyy Logo Sky
    success: [34, 197, 94],      // Green for positive metrics
    warning: [245, 158, 11],     // Orange for warnings
    error: [239, 68, 68],        // Red for errors
    info: [6, 182, 212],         // Cyan for info
    yappyy: {
      blue: [59, 130, 246],      // Primary logo blue
      cyan: [6, 182, 212],       // Logo cyan accent
      sky: [14, 165, 233],       // Logo sky accent
      gradient: [59, 130, 246],  // Start of gradient
      gradientEnd: [14, 165, 233], // End of gradient
    },
    text: {
      primary: [15, 23, 42],     // Deep navy - matching website
      secondary: [51, 65, 85],   // Slate-700
      muted: [100, 116, 139],    // Slate-500
      white: [255, 255, 255],    // White text
    },
    background: {
      primary: [255, 255, 255],  // Pure white
      secondary: [248, 250, 252], // Light blue tint
      accent: [239, 246, 255],   // Very light blue
      card: [254, 254, 255],     // Card background with blue tint
    },
    border: {
      light: [226, 232, 240],    // Light border
      medium: [203, 213, 225],   // Medium border
      accent: [147, 197, 253],   // Blue accent border
    },
  };

  private spacing = {
    margin: 25,
    padding: 15,
    gap: 20,
  };

  private setTextStyle(style: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small'): void {
    // Always use Arial font for simple and minimalistic design
    try {
      this.pdf.setFont('Arial');
    } catch {
      this.pdf.setFont('helvetica');
    }

    switch (style) {
      case 'h1':
        this.pdf.setFontSize(32);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(this.colors.yappyy.blue[0], this.colors.yappyy.blue[1], this.colors.yappyy.blue[2]);
        break;
      case 'h2':
        this.pdf.setFontSize(24);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
        break;
      case 'h3':
        this.pdf.setFontSize(18);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(this.colors.yappyy.blue[0], this.colors.yappyy.blue[1], this.colors.yappyy.blue[2]);
        break;
      case 'h4':
        this.pdf.setFontSize(16);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(this.colors.text.secondary[0], this.colors.text.secondary[1], this.colors.text.secondary[2]);
        break;
      case 'body':
        this.pdf.setFontSize(11);
        this.pdf.setFont(this.pdf.getFont().fontName, 'normal');
        this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
        break;
      case 'caption':
        this.pdf.setFontSize(10);
        this.pdf.setFont(this.pdf.getFont().fontName, 'normal');
        this.pdf.setTextColor(this.colors.text.secondary[0], this.colors.text.secondary[1], this.colors.text.secondary[2]);
        break;
      case 'small':
        this.pdf.setFontSize(9);
        this.pdf.setFont(this.pdf.getFont().fontName, 'normal');
        this.pdf.setTextColor(this.colors.text.muted[0], this.colors.text.muted[1], this.colors.text.muted[2]);
        break;
    }
  }

  private addTemplateHeader(title: string, subtitle?: string): void {
    // Header gradient bar (matches Yappyy brand like the screenshot)
    const headerHeight = 45;
    this.createGradientBackground(0, 0, this.pageWidth, headerHeight);

    // Left: Yappyy wordmark
    this.pdf.setTextColor(255, 255, 255);
    try { this.pdf.setFont('Poppins', 'bold'); } catch { this.pdf.setFont('helvetica', 'bold'); }
    this.pdf.setFontSize(28);
    this.pdf.text('Yappyy', this.spacing.margin, 18);

    // Center: Title and subtitle inside the header
    const centerX = this.pageWidth / 2;
    try { this.pdf.setFont('Poppins', 'normal'); } catch { this.pdf.setFont('helvetica', 'normal'); }
    this.pdf.setFontSize(16);
    const titleText = title || 'Title of Template';
    const titleWidth = this.pdf.getTextWidth(titleText);
    this.pdf.text(titleText, centerX - titleWidth / 2, 16);
    if (subtitle) {
      this.pdf.setFontSize(10);
      const subWidth = this.pdf.getTextWidth(subtitle);
      this.pdf.text(subtitle, centerX - subWidth / 2, 24);
    }

    // Right: circular badge with "Y"
    const badgeCenterX = this.pageWidth - 18;
    const badgeCenterY = 16;
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.circle(badgeCenterX, badgeCenterY, 9, 'F');
    this.pdf.setTextColor(255, 255, 255);
    try { this.pdf.setFont('Poppins', 'bold'); } catch { this.pdf.setFont('helvetica', 'bold'); }
    this.pdf.setFontSize(12);
    this.pdf.text('Y', badgeCenterX, badgeCenterY + 4, { align: 'center' });

    // Set body start below header
    this.currentY = headerHeight + 15;
  }

  private createGradientBackground(x: number, y: number, width: number, height: number): void {
    const fromColor = this.colors.yappyy.blue;
    const toColor = this.colors.yappyy.cyan;
    const steps = 20;
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(fromColor[0] + (toColor[0] - fromColor[0]) * ratio);
      const g = Math.round(fromColor[1] + (toColor[1] - fromColor[1]) * ratio);
      const b = Math.round(fromColor[2] + (toColor[2] - fromColor[2]) * ratio);
      
      this.pdf.setFillColor(r, g, b);
      this.pdf.rect(x, y + (i * height / steps), width, height / steps, 'F');
    }
  }

  private addSectionHeader(title: string): void {
    // Yappyy branded section background card
    const headerHeight = 28;
    this.pdf.setFillColor(this.colors.background.card[0], this.colors.background.card[1], this.colors.background.card[2]);
    this.pdf.roundedRect(this.spacing.margin, this.currentY, this.pageWidth - (this.spacing.margin * 2), headerHeight, 10, 10, 'F');
    
    // Yappyy blue accent border on left
    this.pdf.setFillColor(this.colors.yappyy.blue[0], this.colors.yappyy.blue[1], this.colors.yappyy.blue[2]);
    this.pdf.roundedRect(this.spacing.margin, this.currentY, 5, headerHeight, 5, 5, 'F');
    
    // Yappyy cyan accent dot on right
    this.pdf.setFillColor(this.colors.yappyy.cyan[0], this.colors.yappyy.cyan[1], this.colors.yappyy.cyan[2]);
    this.pdf.circle(this.pageWidth - this.spacing.margin - 15, this.currentY + headerHeight/2, 3, 'F');
    
    // Title with Yappyy styling
    this.setTextStyle('h3');
    this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
    this.pdf.text(title, this.spacing.margin + 18, this.currentY + 19);
    
    this.currentY += headerHeight + this.spacing.gap;
  }

  private addMetricCard(title: string, value: string, subtitle?: string, color: number[] = this.colors.primary): void {
    const cardWidth = (this.pageWidth - (this.spacing.margin * 2) - this.spacing.gap) / 2;
    const cardHeight = 45;
    
    // Create modern card
    this.createModernCard(this.spacing.margin, this.currentY, cardWidth, cardHeight, color);
    
    // Title
    this.setTextStyle('caption');
    this.pdf.setTextColor(this.colors.text.secondary[0], this.colors.text.secondary[1], this.colors.text.secondary[2]);
    this.pdf.text(title, this.spacing.margin + this.spacing.padding, this.currentY + this.spacing.padding + 8);
    
    // Value
    this.setTextStyle('h2');
    this.pdf.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(value, this.spacing.margin + this.spacing.padding, this.currentY + this.spacing.padding + 25);
    
    // Subtitle
    if (subtitle) {
      this.setTextStyle('small');
      this.pdf.setTextColor(this.colors.text.muted[0], this.colors.text.muted[1], this.colors.text.muted[2]);
      this.pdf.text(subtitle, this.spacing.margin + this.spacing.padding, this.currentY + this.spacing.padding + 35);
    }
    
    this.currentY += cardHeight + this.spacing.gap;
  }

  private createModernCard(x: number, y: number, width: number, height: number, color: number[]): void {
    // Card shadow effect (approximate)
    this.pdf.setFillColor(240, 240, 240);
    this.pdf.roundedRect(x + 1.5, y + 1.5, width, height, 8, 8, 'F');

    // Card background (light tint of color)
    const lightR = Math.min(255, Math.round(color[0] * 0.1 + 245));
    const lightG = Math.min(255, Math.round(color[1] * 0.1 + 245));
    const lightB = Math.min(255, Math.round(color[2] * 0.1 + 245));
    this.pdf.setFillColor(lightR, lightG, lightB);
    this.pdf.roundedRect(x, y, width, height, 8, 8, 'F');

    // Card border
    const borderR = Math.round(color[0] * 0.6 + 102);
    const borderG = Math.round(color[1] * 0.6 + 102);
    const borderB = Math.round(color[2] * 0.6 + 102);
    this.pdf.setDrawColor(borderR, borderG, borderB);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(x, y, width, height, 8, 8, 'D');
  }

  private addProgressBar(label: string, value: number, maxValue: number = 100, color: number[] = this.colors.primary): void {
    const barWidth = this.pageWidth - (this.spacing.margin * 2);
    const barHeight = 8;
    
    // Label
    this.setTextStyle('body');
    this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
    this.pdf.text(label, this.spacing.margin, this.currentY);
    
    // Progress bar background
    this.pdf.setFillColor(this.colors.background.accent[0], this.colors.background.accent[1], this.colors.background.accent[2]);
    this.pdf.roundedRect(this.spacing.margin, this.currentY + 8, barWidth, barHeight, 4, 4, 'F');
    
    // Progress bar fill
    const fillWidth = (value / maxValue) * barWidth;
    this.pdf.setFillColor(color[0], color[1], color[2]);
    this.pdf.roundedRect(this.spacing.margin, this.currentY + 8, fillWidth, barHeight, 4, 4, 'F');
    
    // Percentage text
    this.setTextStyle('caption');
    this.pdf.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(`${Math.round(value)}%`, this.spacing.margin + barWidth + 5, this.currentY + 15);
    
    this.currentY += 25;
  }

  private addFooter(text: string = 'Generated by Yappyy AI Speech Coach'): void {
    const footerY = this.pageHeight - 25;
    
    // Yappyy branded footer background with subtle gradient
    this.pdf.setFillColor(this.colors.background.accent[0], this.colors.background.accent[1], this.colors.background.accent[2]);
    this.pdf.rect(0, footerY - 8, this.pageWidth, 35, 'F');
    
    // Yappyy brand accent line
    this.pdf.setDrawColor(this.colors.yappyy.blue[0], this.colors.yappyy.blue[1], this.colors.yappyy.blue[2]);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.spacing.margin, footerY - 8, this.pageWidth - this.spacing.margin, footerY - 8);
    
    // Footer text with Yappyy branding
    this.setTextStyle('small');
    this.pdf.setTextColor(this.colors.yappyy.blue[0], this.colors.yappyy.blue[1], this.colors.yappyy.blue[2]);
    this.pdf.text('Powered by Yappyy AI Speech Coach', this.spacing.margin, footerY + 5);
    
    // Professional website reference
    this.pdf.setTextColor(this.colors.text.muted[0], this.colors.text.muted[1], this.colors.text.muted[2]);
    this.pdf.text('yappyy.com', this.spacing.margin, footerY + 12);
    
    // Date with Yappyy styling
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const dateWidth = this.pdf.getTextWidth(date);
    this.pdf.setTextColor(this.colors.text.secondary[0], this.colors.text.secondary[1], this.colors.text.secondary[2]);
    this.pdf.text(date, this.pageWidth - this.spacing.margin - dateWidth, footerY + 5);
    
    // Page number with accent
    // Determine page number safely across jsPDF versions
    const getPages = (this.pdf as any).getNumberOfPages || (this.pdf as any).internal?.getNumberOfPages;
    const pageNum = typeof getPages === 'function' ? getPages.call(this.pdf) : 1;
    const pageText = `Page ${pageNum}`;
    const pageWidth = this.pdf.getTextWidth(pageText);
    this.pdf.setTextColor(this.colors.yappyy.cyan[0], this.colors.yappyy.cyan[1], this.colors.yappyy.cyan[2]);
    this.pdf.text(pageText, (this.pageWidth - pageWidth) / 2, footerY + 5);
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 50) {
      this.pdf.addPage();
      this.currentY = this.spacing.margin;
    }
  }

  // Public methods for generating different types of PDFs
  public async generateSessionReport(sessionData: any): Promise<void> {
    try {
      // Add header (session report style retained)
      this.addTemplateHeader(
        sessionData.title || 'Practice Session Analysis',
        `Session Report - ${new Date(sessionData.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`
      );

      // Add executive summary
      this.addSectionHeader('Executive Summary');
      
      const summaryData = [
        {
          title: 'Overall Score',
          value: `${Math.round(sessionData.metrics?.overall?.score || 0)}%`,
          subtitle: 'Performance Rating',
          color: this.colors.primary
        },
        {
          title: 'Speaking Rate',
          value: `${sessionData.metrics?.voice?.pace || 0} WPM`,
          subtitle: 'Words per minute',
          color: this.colors.success
        },
        {
          title: 'Duration',
          value: `${Math.floor((sessionData.duration || 0) / 60)}:${String((sessionData.duration || 0) % 60).padStart(2, '0')}`,
          subtitle: 'Session length',
          color: this.colors.accent
        },
        {
          title: 'Word Count',
          value: (sessionData.metrics?.overall?.wordCount || 0).toString(),
          subtitle: 'Total words spoken',
          color: this.colors.info
        }
      ];

      // Create 2x2 grid layout
      this.addMetricCard(summaryData[0].title, summaryData[0].value, summaryData[0].subtitle, summaryData[0].color);
      this.addMetricCard(summaryData[1].title, summaryData[1].value, summaryData[1].subtitle, summaryData[1].color);
      
      this.currentY += this.spacing.gap;
      
      this.addMetricCard(summaryData[2].title, summaryData[2].value, summaryData[2].subtitle, summaryData[2].color);
      this.addMetricCard(summaryData[3].title, summaryData[3].value, summaryData[3].subtitle, summaryData[3].color);

      this.currentY += 30;

      // Add performance metrics
      this.addSectionHeader('Performance Metrics');
      
      if (sessionData.metrics?.voice) {
        this.addProgressBar('Clarity', sessionData.metrics.voice.clarity || 0, 100, this.colors.primary);
        this.addProgressBar('Modulation', sessionData.metrics.voice.modulation || 0, 100, this.colors.secondary);
        this.addProgressBar('Confidence', sessionData.metrics.voice.confidence || 0, 100, this.colors.accent);
      }

      if (sessionData.metrics?.bodyLanguage) {
        this.currentY += this.spacing.gap;
        this.addProgressBar('Eye Contact', sessionData.metrics.bodyLanguage.eyeContact || 0, 100, this.colors.success);
        this.addProgressBar('Posture', sessionData.metrics.bodyLanguage.posture || 0, 100, this.colors.success);
        this.addProgressBar('Engagement', sessionData.metrics.bodyLanguage.engagement || 0, 100, this.colors.success);
      }

      // Add footer
      this.addFooter();

    } catch (error) {
      console.error('Session PDF generation failed:', error);
      throw error;
    }
  }

  public async generateTemplateReport(templateData: any): Promise<void> {
    try {
      // Branded header inside like screenshot
      this.addTemplateHeader(
        templateData.title || 'Title of Template',
        templateData.description || 'Description of Template'
      );

      // Body content starts with generous whitespace under header
      if (templateData.content) {
        this.setTextStyle('body');
        const contentWidth = this.pageWidth - (this.spacing.margin * 2);
        const lines = this.pdf.splitTextToSize(templateData.content, contentWidth);
        this.pdf.text(lines, this.spacing.margin, this.currentY);
        this.currentY += lines.length * 6 + 10;
      }

      // Add footer
      this.addFooter();

    } catch (error) {
      console.error('Template PDF generation failed:', error);
      throw error;
    }
  }

  public async downloadPDF(filename: string): Promise<void> {
    this.pdf.save(filename);
  }

  public getPDFBlob(): Blob {
    return this.pdf.output('blob');
  }
}

// Export convenience functions
export const generateSessionPDF = async (sessionData: any, filename: string = 'session-report.pdf'): Promise<void> => {
  const pdfExport = new PDFExport();
  await pdfExport.generateSessionReport(sessionData);
  await pdfExport.downloadPDF(filename);
};

export const generateTemplatePDF = async (templateData: any, filename: string = 'template-guide.pdf'): Promise<void> => {
  const pdfExport = new PDFExport();
  await pdfExport.generateTemplateReport(templateData);
  await pdfExport.downloadPDF(filename);
};

export default PDFExport;