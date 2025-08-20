// Simplified Yappyy Template PDF Export with Clean Design
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

  // Simplified Yappyy color scheme
  private colors = {
    primary: [37, 99, 235], // Blue-600 - main Yappyy color
    secondary: [59, 130, 246], // Blue-500 
    accent: [99, 102, 241], // Indigo-500
    text: [15, 23, 42], // Dark text
    textLight: [71, 85, 105], // Gray text
    textMuted: [148, 163, 184], // Light gray text
    white: [255, 255, 255],
    gray: [248, 250, 252], // Light background
    success: [34, 197, 94], // Green
    warning: [251, 146, 60], // Orange
  };

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.setupStyling();
  }

  private setupStyling(): void {
    this.pdf.setFont('Arial', 'normal');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(this.colors.text[0], this.colors.text[1], this.colors.text[2]);
  }

  public async generateTemplateReport(templateData: TemplateData): Promise<void> {
    try {
      this.currentY = this.margin;
      
      // Clean header
      this.addCleanHeader(templateData.title);
      
      // Template info cards
      this.addTemplateCards(templateData);
      
      // Content section
      this.addContentSection(templateData);
      
      // Coaching advice
      this.addCoachingSection(templateData);
      
      // Footer
      this.addFooter();
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }

  private addCleanHeader(title: string): void {
    // Blue header background
    this.pdf.setFillColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F');
    
    // Yappyy logo
    this.pdf.setFontSize(24);
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setTextColor(this.colors.white[0], this.colors.white[1], this.colors.white[2]);
    this.pdf.text('Yappyy', this.margin, 20);
    
    // Template title
    this.pdf.setFontSize(14);
    this.pdf.setFont('Arial', 'normal');
    this.pdf.text('Speech Template Guide', this.margin, 30);
    
    this.currentY = 55;
    
    // Template name
    this.pdf.setFontSize(20);
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setTextColor(this.colors.text[0], this.colors.text[1], this.colors.text[2]);
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 20;
  }

  private addTemplateCards(templateData: TemplateData): void {
    const cardWidth = (this.pageWidth - this.margin * 2 - 5) / 2;
    const cardHeight = 20;
    
    // Category card
    this.addInfoCard('Category', templateData.category, this.margin, this.currentY, cardWidth, cardHeight, this.colors.primary);
    
    // Difficulty card
    this.addInfoCard('Difficulty', templateData.difficulty, this.margin + cardWidth + 5, this.currentY, cardWidth, cardHeight, this.colors.warning);
    
    this.currentY += cardHeight + 5;
    
    // Duration card
    this.addInfoCard('Duration', templateData.duration, this.margin, this.currentY, cardWidth, cardHeight, this.colors.success);
    
    // Description card
    const description = templateData.description || 'Professional speech template';
    this.addInfoCard('Description', description, this.margin + cardWidth + 5, this.currentY, cardWidth, cardHeight, this.colors.accent);
    
    this.currentY += cardHeight + 20;
  }

  private addInfoCard(label: string, value: string, x: number, y: number, width: number, height: number, color: number[]): void {
    // Card background
    this.pdf.setFillColor(color[0], color[1], color[2]);
    this.pdf.roundedRect(x, y, width, height, 2, 2, 'F');
    
    // Label
    this.pdf.setFontSize(10);
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setTextColor(this.colors.white[0], this.colors.white[1], this.colors.white[2]);
    this.pdf.text(label, x + 5, y + 8);
    
    // Value
    this.pdf.setFontSize(12);
    this.pdf.setFont('Arial', 'normal');
    this.pdf.text(value, x + 5, y + 15);
  }

  private addContentSection(templateData: TemplateData): void {
    // Section title
    this.pdf.setFontSize(16);
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.pdf.text('Template Content', this.margin, this.currentY);
    this.currentY += 15;
    
    // Content background
    this.pdf.setFillColor(this.colors.gray[0], this.colors.gray[1], this.colors.gray[2]);
    const contentHeight = 80;
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - this.margin * 2, contentHeight, 'F');
    
    // Content text
    this.pdf.setFontSize(10);
    this.pdf.setFont('Arial', 'normal');
    this.pdf.setTextColor(this.colors.text[0], this.colors.text[1], this.colors.text[2]);
    
    const lines = this.pdf.splitTextToSize(templateData.content, this.pageWidth - this.margin * 2 - 10);
    this.pdf.text(lines, this.margin + 5, this.currentY + 10);
    
    this.currentY += contentHeight + 15;
  }

  private addCoachingSection(templateData: TemplateData): void {
    // Section title
    this.pdf.setFontSize(16);
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.pdf.text('Coaching Advice', this.margin, this.currentY);
    this.currentY += 15;
    
    // Content advice
    this.addAdviceBox('Content', templateData.contentAdvice, this.colors.primary);
    
    // Voice advice
    this.addAdviceBox('Voice', templateData.voiceAdvice, this.colors.success);
    
    // Body language advice
    this.addAdviceBox('Body Language', templateData.bodyLanguageAdvice, this.colors.accent);
  }

  private addAdviceBox(label: string, advice: string, color: number[]): void {
    // Box background
    this.pdf.setFillColor(color[0], color[1], color[2]);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - this.margin * 2, 25, 'F');
    
    // Label
    this.pdf.setFontSize(12);
    this.pdf.setFont('Arial', 'bold');
    this.pdf.setTextColor(this.colors.white[0], this.colors.white[1], this.colors.white[2]);
    this.pdf.text(label, this.margin + 5, this.currentY + 8);
    
    // Advice text
    this.pdf.setFontSize(10);
    this.pdf.setFont('Arial', 'normal');
    const lines = this.pdf.splitTextToSize(advice, this.pageWidth - this.margin * 2 - 10);
    this.pdf.text(lines, this.margin + 5, this.currentY + 16);
    
    this.currentY += 30;
  }

  private addFooter(): void {
    // Footer line
    this.pdf.setDrawColor(this.colors.textMuted[0], this.colors.textMuted[1], this.colors.textMuted[2]);
    this.pdf.line(this.margin, this.pageHeight - 30, this.pageWidth - this.margin, this.pageHeight - 30);
    
    // Footer text
    this.pdf.setFontSize(9);
    this.pdf.setFont('Arial', 'normal');
    this.pdf.setTextColor(this.colors.textMuted[0], this.colors.textMuted[1], this.colors.textMuted[2]);
    this.pdf.text('Generated by Yappyy', this.margin, this.pageHeight - 20);
    
    const date = new Date().toLocaleDateString();
    const dateWidth = this.pdf.getTextWidth(date);
    this.pdf.text(date, this.pageWidth - this.margin - dateWidth, this.pageHeight - 20);
  }

  public async downloadPDF(filename: string): Promise<void> {
    this.pdf.save(filename);
  }
}