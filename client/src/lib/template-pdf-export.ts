// Template PDF Export System with Modern Styling
import { jsPDF } from 'jspdf';

export interface TemplateData {
  title: string;
  category: string;
  duration: string;
  difficulty: string;
  content: string;
  contentAdvice: string;
  voiceAdvice: string;
  bodyLanguageAdvice: string;
  tags?: string[];
  description?: string;
}

export class TemplatePDFExportService {
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
    text: [15, 23, 42], // Slate 900
    mutedText: [71, 85, 105], // Slate 600
    lightGray: [248, 250, 252], // Light background
    white: [255, 255, 255],
  };

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.setupModernStyling();
  }

  private setupModernStyling(): void {
    // Use consistent font styling that matches the website
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(15, 23, 42); // Slate 900 - matches website text
  }

  async generateTemplateReport(template: TemplateData): Promise<void> {
    this.resetDocument();
    
    // Modern header
    this.addModernHeader(template);
    this.currentY = 50;
    
    // Template overview section
    this.addTemplateOverview(template);
    this.currentY += 25;
    
    // Template content section
    this.addTemplateContent(template);
    this.currentY += 20;
    
    // Coaching advice sections
    this.addCoachingAdvice(template);
    
    // Footer
    this.addModernFooter();
  }

  private resetDocument(): void {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.currentY = 20;
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.setupModernStyling();
  }

  private addModernHeader(template: TemplateData): void {
    // Modern gradient header matching website design
    this.pdf.setFillColor(99, 102, 241); // Primary indigo
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F');
    
    // Add subtle gradient effect
    this.pdf.setFillColor(139, 92, 246, 0.3); // Violet overlay
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F');
    
    // Yappyy brand with modern styling
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('Yappyy', 20, 25);
    
    // Subtitle with better spacing
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(241, 245, 249); // Light text
    this.pdf.text('Speech Template Guide', 20, 32);
    
    // Template title on the right with better alignment
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(255, 255, 255);
    const maxWidth = 80; // Maximum width for text
    const lines = this.pdf.splitTextToSize(template.title, maxWidth);
    
    // Position based on number of lines
    const startY = lines.length > 1 ? 18 : 22;
    lines.forEach((line: string, index: number) => {
      this.pdf.text(line, this.pageWidth - 20, startY + (index * 6), { align: 'right' });
    });
  }

  private addTemplateOverview(template: TemplateData): void {
    // Section title
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.primary);
    this.pdf.text('Template Overview', 20, this.currentY);
    
    this.currentY += 15;
    
    // Create overview cards in a grid
    const cardWidth = (this.pageWidth - 50) / 2;
    const cardHeight = 25;
    
    // Left column - Basic info
    this.addInfoCard('Category', template.category, 20, this.currentY, cardWidth, cardHeight, this.colors.accent);
    this.addInfoCard('Duration', template.duration, 20, this.currentY + 30, cardWidth, cardHeight, this.colors.success);
    
    // Right column - Additional info
    this.addInfoCard('Difficulty', template.difficulty, 20 + cardWidth + 10, this.currentY, cardWidth, cardHeight, this.colors.warning);
    
    // Description if available
    if (template.description) {
      this.addInfoCard('Description', template.description, 20 + cardWidth + 10, this.currentY + 30, cardWidth, cardHeight, this.colors.secondary);
    }
    
    // Tags if available
    if (template.tags && template.tags.length > 0) {
      this.currentY += 70;
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.mutedText);
      this.pdf.text('Tags:', 20, this.currentY);
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(...this.colors.text);
      this.pdf.text(template.tags.join(' • '), 45, this.currentY);
    } else {
      this.currentY += 45;
    }
  }

  private addInfoCard(label: string, value: string, x: number, y: number, width: number, height: number, color: number[]): void {
    // Card shadow
    this.pdf.setFillColor(0, 0, 0, 0.1);
    this.pdf.roundedRect(x + 1, y + 1, width, height, 3, 3, 'F');
    
    // Card background
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.setDrawColor(...color);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(x, y, width, height, 3, 3, 'FD');
    
    // Colored top bar
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(x, y, width, 4, 3, 3, 'F');
    this.pdf.rect(x, y + 4, width, height - 4, 'F');
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.rect(x, y + 4, width, height - 4, 'F');
    
    // Label
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.mutedText);
    this.pdf.text(label, x + 8, y + 12);
    
    // Value
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...color);
    
    // Handle long text by splitting if necessary
    const maxWidth = width - 16;
    const lines = this.pdf.splitTextToSize(value, maxWidth);
    if (lines.length > 1) {
      this.pdf.setFontSize(10);
    }
    this.pdf.text(lines[0], x + 8, y + 20);
  }

  private addTemplateContent(template: TemplateData): void {
    this.checkPageBreak(40);
    
    // Section title
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.primary);
    this.pdf.text('Template Script', 20, this.currentY);
    
    this.currentY += 15;
    
    // Content background
    const contentHeight = Math.max(60, this.getTextHeight(template.content, this.pageWidth - 50));
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.setDrawColor(203, 213, 225);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(20, this.currentY, this.pageWidth - 40, contentHeight, 4, 4, 'FD');
    
    // Content text
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.text);
    
    const lines = this.pdf.splitTextToSize(template.content, this.pageWidth - 50);
    let textY = this.currentY + 8;
    
    lines.forEach((line: string) => {
      if (textY > this.pageHeight - 40) {
        this.pdf.addPage();
        textY = 20;
      }
      this.pdf.text(line, 25, textY);
      textY += 5;
    });
    
    this.currentY += contentHeight + 5;
  }

  private addCoachingAdvice(template: TemplateData): void {
    this.checkPageBreak(80);
    
    // Section title
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.primary);
    this.pdf.text('Professional Coaching Advice', 20, this.currentY);
    
    this.currentY += 15;
    
    // Content advice
    this.addAdviceSection('Content Structure', template.contentAdvice, this.colors.accent);
    this.currentY += 5;
    
    // Voice advice
    this.addAdviceSection('Voice Modulation', template.voiceAdvice, this.colors.success);
    this.currentY += 5;
    
    // Body language advice
    this.addAdviceSection('Body Language', template.bodyLanguageAdvice, this.colors.warning);
  }

  private addAdviceSection(title: string, advice: string, color: number[]): void {
    this.checkPageBreak(25);
    
    // Section header with icon
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(20, this.currentY, this.pageWidth - 40, 8, 2, 2, 'F');
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text(title, 25, this.currentY + 6);
    
    this.currentY += 12;
    
    // Advice content
    const adviceHeight = Math.max(15, this.getTextHeight(advice, this.pageWidth - 50));
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.setDrawColor(...color);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(20, this.currentY, this.pageWidth - 40, adviceHeight, 2, 2, 'FD');
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.text);
    
    const lines = this.pdf.splitTextToSize(advice, this.pageWidth - 50);
    let textY = this.currentY + 6;
    
    lines.forEach((line: string) => {
      this.pdf.text(line, 25, textY);
      textY += 4;
    });
    
    this.currentY += adviceHeight + 8;
  }

  private getTextHeight(text: string, maxWidth: number): number {
    const lines = this.pdf.splitTextToSize(text, maxWidth);
    return lines.length * 4 + 8; // 4mm per line + padding
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 40) {
      this.pdf.addPage();
      this.currentY = 20;
    }
  }

  private addModernFooter(): void {
    // Position footer at bottom
    this.currentY = this.pageHeight - 30;
    
    // Modern footer background
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.rect(0, this.currentY - 5, this.pageWidth, 25, 'F');
    
    // Accent line
    this.pdf.setFillColor(...this.colors.primary);
    this.pdf.rect(0, this.currentY - 5, this.pageWidth, 2, 'F');
    
    this.currentY += 5;
    
    // Footer content with better typography
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.mutedText);
    this.pdf.text('Generated by Yappyy AI Speech Coach Platform', 20, this.currentY);
    
    // Timestamp with better formatting
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })} • ${now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
    
    this.pdf.text(timestamp, this.pageWidth - 20, this.currentY, { align: 'right' });
    
    // Website URL
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(100, 116, 139); // More muted
    this.pdf.text('www.yappyy.ai', this.pageWidth - 20, this.currentY + 6, { align: 'right' });
  }

  async downloadPDF(filename: string): Promise<void> {
    this.pdf.save(filename);
  }

  getPDFBlob(): Blob {
    return this.pdf.output('blob');
  }
}