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
    // No background colors - plain white document
    
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
        this.pdf.setFontSize(16);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'h2':
        this.pdf.setFontSize(14);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'h3':
        this.pdf.setFontSize(12);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'h4':
        this.pdf.setFontSize(12);
        this.pdf.setFont(this.pdf.getFont().fontName, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'body':
        this.pdf.setFontSize(11);
        this.pdf.setFont(this.pdf.getFont().fontName, 'normal');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'caption':
        this.pdf.setFontSize(10);
        this.pdf.setFont(this.pdf.getFont().fontName, 'normal');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'small':
        this.pdf.setFontSize(9);
        this.pdf.setFont(this.pdf.getFont().fontName, 'normal');
        this.pdf.setTextColor(0, 0, 0);
        break;
    }
  }

  private addTemplateHeader(title: string, subtitle?: string): void {
    // Simple text header only
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.text(title || 'Title of Template', this.spacing.margin, this.currentY);
    this.currentY += 12;
    
    if (subtitle) {
      this.pdf.setFont('Arial', 'normal');
      this.pdf.setFontSize(12);
      this.pdf.text(subtitle, this.spacing.margin, this.currentY);
      this.currentY += 10;
    }

    this.currentY += 10;
  }

  // Removed gradient background method - using plain text only

  private addSectionHeader(title: string): void {
    // Simple text header only
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(title, this.spacing.margin, this.currentY);
    
    this.currentY += 15;
  }

  private addMetricCard(title: string, value: string, subtitle?: string, color: number[] = this.colors.primary): void {
    // Simple text layout only
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`${title}: ${value}`, this.spacing.margin, this.currentY);
    this.currentY += 8;
    
    if (subtitle) {
      this.pdf.setFont('Arial', 'normal');
      this.pdf.setFontSize(10);
      this.pdf.text(subtitle, this.spacing.margin + 10, this.currentY);
      this.currentY += 8;
    }
    
    this.currentY += 5;
  }

  // Removed modern card method - using plain text only

  private addProgressBar(label: string, value: number, maxValue: number = 100, color: number[] = this.colors.primary): void {
    // Simple text representation only
    this.pdf.setFont('Arial', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`${label}: ${Math.round(value)}%`, this.spacing.margin, this.currentY);
    
    this.currentY += 15;
  }

  private addFooter(text: string = 'Generated by Yappyy AI Speech Coach'): void {
    const footerY = this.pageHeight - 25;
    
    // Simple footer text only
    this.pdf.setFont('Arial', 'normal');
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Generated by Yappyy', this.spacing.margin, footerY);
    
    // Date
    const date = new Date().toLocaleDateString();
    const dateWidth = this.pdf.getTextWidth(date);
    this.pdf.text(date, this.pageWidth - this.spacing.margin - dateWidth, footerY);
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