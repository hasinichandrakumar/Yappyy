// Professional Template PDF Export System with Yappyy Branding
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
    // Yappyy Brand Colors
    yappyyPurple: [139, 92, 246] as [number, number, number], // Main Yappyy Purple
    yappyyBlue: [59, 130, 246] as [number, number, number], // Yappyy Blue accent
    yappyyIndigo: [99, 102, 241] as [number, number, number], // Yappyy Indigo
    
    // Status Colors
    success: [34, 197, 94] as [number, number, number], // Emerald for success
    warning: [251, 146, 60] as [number, number, number], // Orange for warning
    info: [14, 165, 233] as [number, number, number], // Sky blue for info
    
    // Text Colors
    text: [15, 23, 42] as [number, number, number], // Slate 900 - main text
    mutedText: [71, 85, 105] as [number, number, number], // Slate 600 - secondary text
    lightText: [148, 163, 184] as [number, number, number], // Slate 400 - light text
    
    // Background Colors
    white: [255, 255, 255] as [number, number, number],
    lightGray: [248, 250, 252] as [number, number, number], // Slate 50
    cardBg: [241, 245, 249] as [number, number, number], // Slate 100
  };

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.setupProfessionalStyling();
  }

  private setupProfessionalStyling(): void {
    // Use professional font styling that matches Yappyy brand
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(...this.colors.text); // Professional dark text
  }

  public async generateTemplateReport(templateData: TemplateData): Promise<void> {
    console.log('🎨 Generating professional Yappyy PDF for template:', templateData.title);
    
    try {
      this.currentY = this.margin;
      
      // Professional Yappyy header with purple branding
      this.addProfessionalHeader(templateData.title);
      
      // Template overview with aligned cards
      this.addAlignedTemplateOverview(templateData);
      
      // Content sections with proper spacing
      this.addProfessionalContentSection(templateData);
      
      // Coaching advice with visual hierarchy
      this.addVisualCoachingAdvice(templateData);
      
      // Professional footer with Yappyy branding
      this.addYappyyFooter();
      
      console.log('✅ Professional PDF generation completed successfully');
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      throw error;
    }
  }

  private addProfessionalHeader(title: string): void {
    const headerHeight = 50;
    
    // Purple gradient header background
    this.pdf.setFillColor(...this.colors.yappyyPurple);
    this.pdf.rect(0, 0, this.pageWidth, headerHeight, 'F');
    
    // Yappyy logo/brand text
    this.pdf.setFontSize(28);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.white);
    this.pdf.text('Yappyy', this.margin, 25);
    
    // Subtitle
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Speech Template Guide', this.margin, 35);
    
    // Template title on the right
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    const titleWidth = this.pdf.getTextWidth(title);
    this.pdf.text(title, this.pageWidth - this.margin - titleWidth, 30);
    
    this.currentY = headerHeight + 20;
  }

  private addAlignedTemplateOverview(templateData: TemplateData): void {
    // Section title
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.yappyyPurple);
    this.pdf.text('Template Overview', this.margin, this.currentY);
    this.currentY += 15;
    
    // Card dimensions and positioning
    const cardWidth = (this.pageWidth - this.margin * 2 - 10) / 2; // Two columns with gap
    const cardHeight = 25;
    const gap = 10;
    
    // Row 1: Category and Difficulty
    this.addInfoCard('Category', templateData.category, this.margin, this.currentY, cardWidth, cardHeight, this.colors.yappyyBlue);
    this.addInfoCard('Difficulty', templateData.difficulty, this.margin + cardWidth + gap, this.currentY, cardWidth, cardHeight, this.colors.warning);
    this.currentY += cardHeight + 10;
    
    // Row 2: Duration and Description
    this.addInfoCard('Duration', templateData.duration, this.margin, this.currentY, cardWidth, cardHeight, this.colors.success);
    this.addInfoCard('Description', templateData.description || 'Professional speech template', this.margin + cardWidth + gap, this.currentY, cardWidth, cardHeight, this.colors.yappyyPurple);
    this.currentY += cardHeight + 15;
    
    // Tags section
    if (templateData.tags && templateData.tags.length > 0) {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(...this.colors.text);
      this.pdf.text('Tags:', this.margin, this.currentY);
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(...this.colors.mutedText);
      const tagsText = templateData.tags.join(' • ');
      this.pdf.text(tagsText, this.margin + 25, this.currentY);
      this.currentY += 20;
    }
  }

  private addInfoCard(label: string, value: string, x: number, y: number, width: number, height: number, color: [number, number, number]): void {
    // Card background
    this.pdf.setFillColor(...this.colors.cardBg);
    this.pdf.rect(x, y, width, height, 'F');
    
    // Colored left border
    this.pdf.setFillColor(...color);
    this.pdf.rect(x, y, 3, height, 'F');
    
    // Card content
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.mutedText);
    this.pdf.text(label, x + 8, y + 8);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...color);
    this.pdf.text(value, x + 8, y + 18);
  }

  private addProfessionalContentSection(templateData: TemplateData): void {
    // Content section header
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.yappyyPurple);
    this.pdf.text('Template Content', this.margin, this.currentY);
    this.currentY += 12;
    
    // Content box
    const contentStartY = this.currentY;
    const contentWidth = this.pageWidth - this.margin * 2;
    
    // Background for content
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.rect(this.margin, this.currentY, contentWidth, 60, 'F');
    
    // Content text
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.text);
    
    const contentLines = this.pdf.splitTextToSize(templateData.content, contentWidth - 10);
    this.pdf.text(contentLines, this.margin + 5, this.currentY + 8);
    
    this.currentY += 70;
  }

  private addVisualCoachingAdvice(templateData: TemplateData): void {
    // Coaching advice header
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.yappyyPurple);
    this.pdf.text('Coaching Advice', this.margin, this.currentY);
    this.currentY += 15;
    
    const adviceWidth = this.pageWidth - this.margin * 2;
    const adviceHeight = 30;
    
    // Content Advice
    this.addAdviceSection('Content Strategy', templateData.contentAdvice, this.colors.info, adviceWidth, adviceHeight);
    
    // Voice Advice
    this.addAdviceSection('Voice Coaching', templateData.voiceAdvice, this.colors.success, adviceWidth, adviceHeight);
    
    // Body Language Advice
    this.addAdviceSection('Body Language', templateData.bodyLanguageAdvice, this.colors.warning, adviceWidth, adviceHeight);
  }

  private addAdviceSection(title: string, advice: string, color: [number, number, number], width: number, height: number): void {
    // Advice card background
    this.pdf.setFillColor(...this.colors.white);
    this.pdf.rect(this.margin, this.currentY, width, height, 'F');
    
    // Colored top border
    this.pdf.setFillColor(...color);
    this.pdf.rect(this.margin, this.currentY, width, 2, 'F');
    
    // Section title
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...color);
    this.pdf.text(title, this.margin + 5, this.currentY + 12);
    
    // Advice text
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.text);
    
    const adviceLines = this.pdf.splitTextToSize(advice, width - 10);
    this.pdf.text(adviceLines, this.margin + 5, this.currentY + 22);
    
    this.currentY += height + 8;
  }

  private addYappyyFooter(): void {
    const footerY = this.pageHeight - 30;
    
    // Footer background
    this.pdf.setFillColor(...this.colors.lightGray);
    this.pdf.rect(0, footerY, this.pageWidth, 30, 'F');
    
    // Yappyy branding
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(...this.colors.yappyyPurple);
    this.pdf.text('Powered by Yappyy', this.margin, footerY + 15);
    
    // Date and website
    const currentDate = new Date().toLocaleDateString();
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colors.mutedText);
    this.pdf.text(`Generated: ${currentDate}`, this.margin, footerY + 25);
    
    // Website URL
    const websiteText = 'yappyy.com - AI-Powered Speech Coaching';
    const websiteWidth = this.pdf.getTextWidth(websiteText);
    this.pdf.text(websiteText, this.pageWidth - this.margin - websiteWidth, footerY + 25);
  }

  public async downloadPDF(filename: string): Promise<void> {
    this.pdf.save(filename);
  }

  public getPDFBlob(): Blob {
    return this.pdf.output('blob');
  }
}