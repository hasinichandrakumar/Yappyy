// PDF Export System for Analysis Reports
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    // Set default font (Poppins if available, fallback to Helvetica)
    try {
      this.pdf.setFont('Poppins');
    } catch {
      this.pdf.setFont('helvetica');
    }
    this.pdf.setFontSize(11);
  }

  // Enhanced color scheme matching the website
  private colors = {
    primary: [59, 130, 246],     // Blue-500
    secondary: [99, 102, 241],   // Indigo-500
    accent: [139, 92, 246],      // Violet-500
    success: [34, 197, 94],      // Green-500
    warning: [251, 146, 60],     // Orange-400
    error: [239, 68, 68],        // Red-500
    info: [6, 182, 212],         // Cyan-500
    text: {
      primary: [15, 23, 42],     // Slate-900
      secondary: [51, 65, 85],   // Slate-700
      muted: [100, 116, 139],    // Slate-500
    },
    background: {
      primary: [255, 255, 255],  // White
      secondary: [248, 250, 252], // Slate-50
      accent: [241, 245, 249],   // Slate-100
    },
    border: {
      light: [226, 232, 240],    // Slate-200
      medium: [203, 213, 225],   // Slate-300
    },
  };

  private spacing = {
    margin: 25,
    padding: 15,
    gap: 20,
  };

  private setTextStyle(style: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small'): void {
    try {
      this.pdf.setFont('Poppins');
    } catch {
      this.pdf.setFont('helvetica');
    }

    switch (style) {
      case 'h1':
        this.pdf.setFontSize(28);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
        break;
      case 'h2':
        this.pdf.setFontSize(22);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
        break;
      case 'h3':
        this.pdf.setFontSize(18);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
        break;
      case 'h4':
        this.pdf.setFontSize(14);
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

  private addHeader(title: string, subtitle?: string): void {
    // Create gradient header background
    this.createGradientBackground(0, 0, this.pageWidth, 50);
    
    // Logo/Title with shadow effect
    this.pdf.setTextColor(255, 255, 255);
    this.setTextStyle('h1');
    
    // Add text shadow effect
    this.pdf.setTextColor(0, 0, 0, 0.1);
    this.pdf.text('Yappyy', this.spacing.margin + 1, 16);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('Yappyy', this.spacing.margin, 15);
    
    // Subtitle
    if (subtitle) {
      this.setTextStyle('h4');
      this.pdf.setTextColor(255, 255, 255, 0.9);
      this.pdf.text(subtitle, this.spacing.margin, 28);
    }
    
    // Document Title
    this.setTextStyle('h2');
    this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
    this.pdf.text(title, this.spacing.margin, 65);
    
    // Add decorative line
    this.pdf.setDrawColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.spacing.margin, 70, this.spacing.margin + 60, 70);
    
    this.currentY = 85;
  }

  private createGradientBackground(x: number, y: number, width: number, height: number): void {
    const fromColor = this.colors.primary;
    const toColor = this.colors.secondary;
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
    // Section background card
    const headerHeight = 25;
    this.pdf.setFillColor(this.colors.background.secondary[0], this.colors.background.secondary[1], this.colors.background.secondary[2]);
    this.pdf.roundedRect(this.spacing.margin, this.currentY, this.pageWidth - (this.spacing.margin * 2), headerHeight, 8, 8, 'F');
    
    // Left accent border
    this.pdf.setFillColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.pdf.roundedRect(this.spacing.margin, this.currentY, 4, headerHeight, 4, 4, 'F');
    
    // Title
    this.setTextStyle('h3');
    this.pdf.setTextColor(this.colors.text.primary[0], this.colors.text.primary[1], this.colors.text.primary[2]);
    this.pdf.text(title, this.spacing.margin + 15, this.currentY + 17);
    
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
    // Card shadow effect
    this.pdf.setFillColor(0, 0, 0, 0.05);
    this.pdf.roundedRect(x + 2, y + 2, width, height, 8, 8, 'F');
    
    // Card background with gradient
    this.pdf.setFillColor(color[0], color[1], color[2], 0.05);
    this.pdf.roundedRect(x, y, width, height, 8, 8, 'F');
    
    // Card border
    this.pdf.setDrawColor(color[0], color[1], color[2], 0.2);
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
    
    // Footer background
    this.pdf.setFillColor(this.colors.background.secondary[0], this.colors.background.secondary[1], this.colors.background.secondary[2]);
    this.pdf.rect(0, footerY - 5, this.pageWidth, 30, 'F');
    
    // Footer line
    this.pdf.setDrawColor(this.colors.border.medium[0], this.colors.border.medium[1], this.colors.border.medium[2]);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.spacing.margin, footerY - 5, this.pageWidth - this.spacing.margin, footerY - 5);
    
    // Footer text
    this.setTextStyle('small');
    this.pdf.setTextColor(this.colors.text.muted[0], this.colors.text.muted[1], this.colors.text.muted[2]);
    this.pdf.text(text, this.spacing.margin, footerY + 5);
    
    // Date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const dateWidth = this.pdf.getTextWidth(date);
    this.pdf.text(date, this.pageWidth - this.spacing.margin - dateWidth, footerY + 5);
    
    // Page number
    const pageText = `Page ${this.pdf.getCurrentPageInfo().pageNumber}`;
    const pageWidth = this.pdf.getTextWidth(pageText);
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
      // Add header
      this.addHeader(
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
      // Add header
      this.addHeader(
        templateData.title,
        'Professional Speech Template Guide'
      );

      // Add template info
      this.addSectionHeader('Template Information');
      
      const infoData = [
        {
          title: 'Category',
          value: templateData.category,
          color: this.colors.primary
        },
        {
          title: 'Difficulty',
          value: templateData.difficulty,
          color: this.colors.accent
        },
        {
          title: 'Duration',
          value: templateData.duration,
          color: this.colors.success
        },
        {
          title: 'Type',
          value: 'Professional Template',
          color: this.colors.info
        }
      ];

      // Create 2x2 grid layout
      this.addMetricCard(infoData[0].title, infoData[0].value, undefined, infoData[0].color);
      this.addMetricCard(infoData[1].title, infoData[1].value, undefined, infoData[1].color);
      
      this.currentY += this.spacing.gap;
      
      this.addMetricCard(infoData[2].title, infoData[2].value, undefined, infoData[2].color);
      this.addMetricCard(infoData[3].title, infoData[3].value, undefined, infoData[3].color);

      this.currentY += 30;

      // Add content section
      this.addSectionHeader('Template Content');
      
      if (templateData.content) {
        this.setTextStyle('body');
        const contentWidth = this.pageWidth - (this.spacing.margin * 2);
        const lines = this.pdf.splitTextToSize(templateData.content, contentWidth - (this.spacing.padding * 2));
        const contentHeight = (lines.length * 8) + (this.spacing.padding * 2);
        
        // Create content card
        this.createModernCard(this.spacing.margin, this.currentY, contentWidth, contentHeight, this.colors.background.accent);
        
        // Add content text
        this.pdf.text(lines, this.spacing.margin + this.spacing.padding, this.currentY + this.spacing.padding);
        
        this.currentY += contentHeight + 30;
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