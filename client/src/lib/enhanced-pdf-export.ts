import { jsPDF } from 'jspdf';
// jspdf-autotable removed to avoid deployment issues

// Use Arial font for simple and minimalistic design
const arialFont = {
  normal: 'Arial',
  bold: 'Arial',
  italic: 'Arial',
  boldItalic: 'Arial'
};

interface PDFTheme {
  colors: {
    primary: number[];
    secondary: number[];
    accent: number[];
    success: number[];
    warning: number[];
    error: number[];
    info: number[];
    text: {
      primary: number[];
      secondary: number[];
      muted: number[];
    };
    background: {
      primary: number[];
      secondary: number[];
      accent: number[];
      gradient: {
        from: number[];
        to: number[];
      };
    };
    border: {
      light: number[];
      medium: number[];
      dark: number[];
    };
  };
  fonts: {
    primary: string;
    secondary: string;
    heading: string;
  };
  spacing: {
    margin: number;
    padding: number;
    gap: number;
    sectionGap: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  shadows: {
    light: number;
    medium: number;
    heavy: number;
  };
}

// Enhanced color scheme matching the website
const enhancedTheme: PDFTheme = {
  colors: {
    primary: [59, 130, 246],     // Blue-500 (website primary)
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
      gradient: {
        from: [59, 130, 246],    // Blue-500
        to: [99, 102, 241],      // Indigo-500
      },
    },
    border: {
      light: [226, 232, 240],    // Slate-200
      medium: [203, 213, 225],   // Slate-300
      dark: [148, 163, 184],     // Slate-400
    },
  },
  fonts: {
    primary: 'Arial',
    secondary: 'Arial',
    heading: 'Arial',
  },
  spacing: {
    margin: 25,
    padding: 15,
    gap: 20,
    sectionGap: 30,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  shadows: {
    light: 0.05,
    medium: 0.1,
    heavy: 0.15,
  },
};

export class EnhancedPDFExport {
  protected pdf: jsPDF;
  protected theme: PDFTheme;
  protected pageHeight: number = 297; // A4 height in mm
  protected pageWidth: number = 210;  // A4 width in mm
  protected currentY: number;

  constructor(theme: Partial<PDFTheme> = {}) {
    this.theme = this.mergeThemes(enhancedTheme, theme);
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.currentY = this.theme.spacing.margin;
    this.setupDocument();
  }

  protected setupDocument(): void {
    // Set default font (fallback to Helvetica if Arial not available)
    try {
      this.pdf.setFont(this.theme.fonts.primary);
    } catch {
      this.pdf.setFont('helvetica');
    }
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(0, 0, 0);
  }

  protected mergeThemes(base: PDFTheme, override: Partial<PDFTheme>): PDFTheme {
    return {
      ...base,
      ...override,
      colors: {
        ...base.colors,
        ...(override.colors || {}),
      },
      fonts: {
        ...base.fonts,
        ...(override.fonts || {}),
      },
      spacing: {
        ...base.spacing,
        ...(override.spacing || {}),
      },
    };
  }

  protected setTextStyle(style: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small'): void {
    const { text } = this.theme.colors;
    
    try {
      this.pdf.setFont(this.theme.fonts.primary);
    } catch {
      this.pdf.setFont('helvetica');
    }
    
    switch (style) {
      case 'h1':
        this.pdf.setFontSize(16);
        this.pdf.setFont('Arial', 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'h2':
        this.pdf.setFontSize(14);
        this.pdf.setFont('Arial', 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'h3':
        this.pdf.setFontSize(12);
        this.pdf.setFont('Arial', 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'h4':
        this.pdf.setFontSize(12);
        this.pdf.setFont('Arial', 'bold');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'body':
        this.pdf.setFontSize(11);
        this.pdf.setFont('Arial', 'normal');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'caption':
        this.pdf.setFontSize(10);
        this.pdf.setFont('Arial', 'normal');
        this.pdf.setTextColor(0, 0, 0);
        break;
      case 'small':
        this.pdf.setFontSize(9);
        this.pdf.setFont('Arial', 'normal');
        this.pdf.setTextColor(0, 0, 0);
        break;
    }
  }

  protected addHeader(title: string, subtitle?: string): void {
    const { spacing } = this.theme;
    
    // Simple text header only
    this.setTextStyle('h1');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(title, spacing.margin, this.currentY);
    this.currentY += 15;
    
    if (subtitle) {
      this.setTextStyle('h4');
      this.pdf.text(subtitle, spacing.margin, this.currentY);
      this.currentY += 12;
    }
    
    this.currentY += 10;
  }

  // Removed gradient background method - using plain text only

  // Removed pattern overlay method - using plain text only

  protected addSection(title: string, content: string | string[], icon?: string): void {
    const { colors, spacing } = this.theme;
    
    this.checkPageBreak(80);
    
    // Section header with modern styling
    this.addSectionHeader(title, icon);
    
    // Section Content with improved typography
    this.setTextStyle('body');
    const contentArray = Array.isArray(content) ? content : [content];
    
    contentArray.forEach((text) => {
      const lines = this.pdf.splitTextToSize(text, this.pageWidth - (spacing.margin * 2));
      this.pdf.text(lines, spacing.margin, this.currentY);
      this.currentY += (lines.length * 8) + spacing.gap;
    });
  }

  protected addSectionHeader(title: string, icon?: string): void {
    const { spacing } = this.theme;
    
    // Simple text header only
    this.setTextStyle('h3');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(title, spacing.margin, this.currentY);
    
    this.currentY += 15;
  }

  protected addCard(title: string, content: string, color: number[] = this.theme.colors.primary, icon?: string): void {
    const { spacing } = this.theme;
    const cardWidth = this.pageWidth - (spacing.margin * 2);
    const lines = this.pdf.splitTextToSize(content, cardWidth);
    
    this.checkPageBreak(50);
    
    // Simple text layout only
    this.setTextStyle('h4');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(title, spacing.margin, this.currentY);
    this.currentY += 12;
    
    // Content
    this.setTextStyle('body');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(lines, spacing.margin, this.currentY);
    
    this.currentY += (lines.length * 5) + 15;
  }

  // Removed modern card method - using plain text only

  protected addMetricCard(title: string, value: string, subtitle?: string, color: number[] = this.theme.colors.primary): void {
    const { spacing } = this.theme;
    
    this.checkPageBreak(20);
    
    // Simple text layout only
    this.setTextStyle('body');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`${title}: ${value}`, spacing.margin, this.currentY);
    this.currentY += 8;
    
    if (subtitle) {
      this.setTextStyle('small');
      this.pdf.text(subtitle, spacing.margin + 10, this.currentY);
      this.currentY += 8;
    }
    
    this.currentY += 5;
  }

  protected addTable(headers: string[], data: string[][], title?: string): void {
    const { colors, spacing } = this.theme;
    
    this.checkPageBreak(100);
    
    if (title) {
      this.setTextStyle('h4');
      this.pdf.setTextColor(colors.text.primary[0], colors.text.primary[1], colors.text.primary[2]);
      this.pdf.text(title, spacing.margin, this.currentY);
      this.currentY += spacing.gap;
    }
    
    // Create native table using jsPDF drawing methods
    this.addNativeTable(headers, data, colors, spacing);
  }

  protected addProgressBar(label: string, value: number, maxValue: number = 100, color: number[] = this.theme.colors.primary): void {
    const { spacing } = this.theme;
    
    this.checkPageBreak(15);
    
    // Simple text representation only
    this.setTextStyle('body');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`${label}: ${Math.round(value)}%`, spacing.margin, this.currentY);
    
    this.currentY += 15;
  }

  protected addFooter(text: string = 'Generated by Yappyy AI Speech Coach'): void {
    const { colors, spacing } = this.theme;
    const footerY = this.pageHeight - 25;
    
    // Footer background
    this.pdf.setFillColor(colors.background.secondary[0], colors.background.secondary[1], colors.background.secondary[2]);
    this.pdf.rect(0, footerY - 5, this.pageWidth, 30, 'F');
    
    // Footer line
    this.pdf.setDrawColor(colors.border.medium[0], colors.border.medium[1], colors.border.medium[2]);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(spacing.margin, footerY - 5, this.pageWidth - spacing.margin, footerY - 5);
    
    // Footer text
    this.setTextStyle('small');
    this.pdf.setTextColor(colors.text.muted[0], colors.text.muted[1], colors.text.muted[2]);
    this.pdf.text(text, spacing.margin, footerY + 5);
    
    // Date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const dateWidth = this.pdf.getTextWidth(date);
    this.pdf.text(date, this.pageWidth - spacing.margin - dateWidth, footerY + 5);
    
    // Page number
    const pageText = `Page ${this.pdf.getCurrentPageInfo().pageNumber}`;
    const pageWidth = this.pdf.getTextWidth(pageText);
    this.pdf.text(pageText, (this.pageWidth - pageWidth) / 2, footerY + 5);
  }

  protected checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 50) {
      this.pdf.addPage();
      this.currentY = this.theme.spacing.margin;
    }
  }

  protected addDivider(): void {
    const { colors, spacing } = this.theme;
    
    this.pdf.setDrawColor(colors.border.light[0], colors.border.light[1], colors.border.light[2]);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(spacing.margin, this.currentY, this.pageWidth - spacing.margin, this.currentY);
    
    this.currentY += spacing.gap;
  }

  protected addNativeTable(headers: string[], data: string[][], colors: any, spacing: any): void {
    const colWidth = (this.pageWidth - (spacing.margin * 2)) / headers.length;
    const rowHeight = 12;
    let yPos = this.currentY;

    // Draw header
    this.pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    this.pdf.rect(spacing.margin, yPos, this.pageWidth - (spacing.margin * 2), rowHeight, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(11);
    
    headers.forEach((header, i) => {
      this.pdf.text(header, spacing.margin + (i * colWidth) + 4, yPos + 8);
    });
    
    yPos += rowHeight;

    // Draw data rows
    this.pdf.setTextColor(colors.text.primary[0], colors.text.primary[1], colors.text.primary[2]);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
    
    data.forEach((row, rowIndex) => {
      // Alternate row colors
      if (rowIndex % 2 === 1) {
        this.pdf.setFillColor(colors.background.secondary[0], colors.background.secondary[1], colors.background.secondary[2]);
        this.pdf.rect(spacing.margin, yPos, this.pageWidth - (spacing.margin * 2), rowHeight, 'F');
      }
      
      row.forEach((cell, colIndex) => {
        if (colIndex === 0) {
          this.pdf.setFont('helvetica', 'bold');
        } else {
          this.pdf.setFont('helvetica', 'normal');
        }
        this.pdf.text(String(cell), spacing.margin + (colIndex * colWidth) + 4, yPos + 8);
      });
      
      yPos += rowHeight;
    });

    this.currentY = yPos + spacing.gap;
  }

  public async downloadPDF(filename: string): Promise<void> {
    this.pdf.save(filename);
  }

  public getPDFBlob(): Blob {
    return this.pdf.output('blob');
  }
}