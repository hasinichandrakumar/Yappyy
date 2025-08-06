import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add Poppins font support
const poppinsFont = {
  normal: 'Poppins-Regular',
  bold: 'Poppins-Bold',
  italic: 'Poppins-Italic',
  boldItalic: 'Poppins-BoldItalic'
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
    primary: 'Poppins',
    secondary: 'Poppins',
    heading: 'Poppins',
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
    // Set default font (fallback to Helvetica if Poppins not available)
    try {
      this.pdf.setFont(this.theme.fonts.primary);
    } catch {
      this.pdf.setFont('helvetica');
    }
    this.setTextStyle('body');
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
        this.pdf.setFontSize(28);
        this.pdf.setFont(this.theme.fonts.heading, 'bold');
        this.pdf.setTextColor(text.primary[0], text.primary[1], text.primary[2]);
        break;
      case 'h2':
        this.pdf.setFontSize(22);
        this.pdf.setFont(this.theme.fonts.heading, 'bold');
        this.pdf.setTextColor(text.primary[0], text.primary[1], text.primary[2]);
        break;
      case 'h3':
        this.pdf.setFontSize(18);
        this.pdf.setFont(this.theme.fonts.heading, 'bold');
        this.pdf.setTextColor(text.primary[0], text.primary[1], text.primary[2]);
        break;
      case 'h4':
        this.pdf.setFontSize(14);
        this.pdf.setFont(this.theme.fonts.heading, 'bold');
        this.pdf.setTextColor(text.secondary[0], text.secondary[1], text.secondary[2]);
        break;
      case 'body':
        this.pdf.setFontSize(11);
        this.pdf.setFont(this.theme.fonts.primary, 'normal');
        this.pdf.setTextColor(text.primary[0], text.primary[1], text.primary[2]);
        break;
      case 'caption':
        this.pdf.setFontSize(10);
        this.pdf.setFont(this.theme.fonts.secondary, 'normal');
        this.pdf.setTextColor(text.secondary[0], text.secondary[1], text.secondary[2]);
        break;
      case 'small':
        this.pdf.setFontSize(9);
        this.pdf.setFont(this.theme.fonts.secondary, 'normal');
        this.pdf.setTextColor(text.muted[0], text.muted[1], text.muted[2]);
        break;
    }
  }

  protected addHeader(title: string, subtitle?: string): void {
    const { colors, spacing } = this.theme;
    
    // Create gradient header background
    this.createGradientBackground(0, 0, this.pageWidth, 50, colors.background.gradient.from, colors.background.gradient.to);
    
    // Add subtle pattern overlay
    this.addPatternOverlay(0, 0, this.pageWidth, 50);
    
    // Logo/Title with shadow effect
    this.pdf.setTextColor(255, 255, 255);
    this.setTextStyle('h1');
    
    // Add text shadow effect
    this.pdf.setTextColor(0, 0, 0, 0.1);
    this.pdf.text('Yappyy', spacing.margin + 1, 16);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('Yappyy', spacing.margin, 15);
    
    // Subtitle
    if (subtitle) {
      this.setTextStyle('h4');
      this.pdf.setTextColor(255, 255, 255, 0.9);
      this.pdf.text(subtitle, spacing.margin, 28);
    }
    
    // Document Title with modern styling
    this.setTextStyle('h2');
    this.pdf.setTextColor(colors.text.primary[0], colors.text.primary[1], colors.text.primary[2]);
    this.pdf.text(title, spacing.margin, 65);
    
    // Add decorative line
    this.pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    this.pdf.setLineWidth(2);
    this.pdf.line(spacing.margin, 70, spacing.margin + 60, 70);
    
    this.currentY = 85;
  }

  protected createGradientBackground(x: number, y: number, width: number, height: number, fromColor: number[], toColor: number[]): void {
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

  protected addPatternOverlay(x: number, y: number, width: number, height: number): void {
    // Add subtle geometric pattern
    this.pdf.setDrawColor(255, 255, 255, 0.1);
    this.pdf.setLineWidth(0.5);
    
    for (let i = 0; i < width; i += 10) {
      for (let j = 0; j < height; j += 10) {
        if ((i + j) % 20 === 0) {
          this.pdf.line(x + i, y + j, x + i + 5, y + j + 5);
        }
      }
    }
  }

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
    const { colors, spacing } = this.theme;
    
    // Section background card
    const headerHeight = 25;
    this.pdf.setFillColor(colors.background.secondary[0], colors.background.secondary[1], colors.background.secondary[2]);
    this.pdf.roundedRect(spacing.margin, this.currentY, this.pageWidth - (spacing.margin * 2), headerHeight, this.theme.borderRadius.medium, this.theme.borderRadius.medium, 'F');
    
    // Left accent border
    this.pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    this.pdf.roundedRect(spacing.margin, this.currentY, 4, headerHeight, this.theme.borderRadius.small, this.theme.borderRadius.small, 'F');
    
    // Title
    this.setTextStyle('h3');
    this.pdf.setTextColor(colors.text.primary[0], colors.text.primary[1], colors.text.primary[2]);
    this.pdf.text(title, spacing.margin + 15, this.currentY + 17);
    
    this.currentY += headerHeight + spacing.gap;
  }

  protected addCard(title: string, content: string, color: number[] = this.theme.colors.primary, icon?: string): void {
    const { spacing } = this.theme;
    const cardWidth = this.pageWidth - (spacing.margin * 2);
    const lines = this.pdf.splitTextToSize(content, cardWidth - (spacing.padding * 2));
    const cardHeight = (lines.length * 8) + (spacing.padding * 3) + 20;
    
    this.checkPageBreak(cardHeight + spacing.gap);
    
    // Card with modern styling
    this.createModernCard(spacing.margin, this.currentY, cardWidth, cardHeight, color);
    
    // Title with icon
    this.setTextStyle('h4');
    this.pdf.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(title, spacing.margin + spacing.padding, this.currentY + spacing.padding + 15);
    
    // Content
    this.setTextStyle('body');
    this.pdf.setTextColor(this.theme.colors.text.primary[0], this.theme.colors.text.primary[1], this.theme.colors.text.primary[2]);
    this.pdf.text(lines, spacing.margin + spacing.padding, this.currentY + spacing.padding + 30);
    
    this.currentY += cardHeight + spacing.gap;
  }

  protected createModernCard(x: number, y: number, width: number, height: number, color: number[]): void {
    const { borderRadius } = this.theme;
    
    // Card shadow effect
    this.pdf.setFillColor(0, 0, 0, 0.05);
    this.pdf.roundedRect(x + 2, y + 2, width, height, borderRadius.medium, borderRadius.medium, 'F');
    
    // Card background with gradient
    this.pdf.setFillColor(color[0], color[1], color[2], 0.05);
    this.pdf.roundedRect(x, y, width, height, borderRadius.medium, borderRadius.medium, 'F');
    
    // Card border
    this.pdf.setDrawColor(color[0], color[1], color[2], 0.2);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(x, y, width, height, borderRadius.medium, borderRadius.medium, 'D');
  }

  protected addMetricCard(title: string, value: string, subtitle?: string, color: number[] = this.theme.colors.primary): void {
    const { spacing } = this.theme;
    const cardWidth = (this.pageWidth - (spacing.margin * 2) - spacing.gap) / 2;
    const cardHeight = 45;
    
    this.checkPageBreak(cardHeight + spacing.gap);
    
    // Create modern metric card
    this.createModernCard(spacing.margin, this.currentY, cardWidth, cardHeight, color);
    
    // Title
    this.setTextStyle('caption');
    this.pdf.setTextColor(this.theme.colors.text.secondary[0], this.theme.colors.text.secondary[1], this.theme.colors.text.secondary[2]);
    this.pdf.text(title, spacing.margin + spacing.padding, this.currentY + spacing.padding + 8);
    
    // Value
    this.setTextStyle('h2');
    this.pdf.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(value, spacing.margin + spacing.padding, this.currentY + spacing.padding + 25);
    
    // Subtitle
    if (subtitle) {
      this.setTextStyle('small');
      this.pdf.setTextColor(this.theme.colors.text.muted[0], this.theme.colors.text.muted[1], this.theme.colors.text.muted[2]);
      this.pdf.text(subtitle, spacing.margin + spacing.padding, this.currentY + spacing.padding + 35);
    }
    
    this.currentY += cardHeight + spacing.gap;
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
    
    (this.pdf as any).autoTable({
      head: [headers],
      body: data,
      startY: this.currentY,
      margin: { left: spacing.margin, right: spacing.margin },
      headStyles: {
        fillColor: colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: colors.background.secondary,
      },
      styles: {
        font: this.theme.fonts.primary,
        fontSize: 10,
        cellPadding: 8,
        lineColor: colors.border.light,
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
    });
    
    this.currentY = (this.pdf as any).lastAutoTable.finalY + spacing.gap;
  }

  protected addProgressBar(label: string, value: number, maxValue: number = 100, color: number[] = this.theme.colors.primary): void {
    const { spacing } = this.theme;
    const barWidth = this.pageWidth - (spacing.margin * 2);
    const barHeight = 8;
    
    this.checkPageBreak(30);
    
    // Label
    this.setTextStyle('body');
    this.pdf.setTextColor(this.theme.colors.text.primary[0], this.theme.colors.text.primary[1], this.theme.colors.text.primary[2]);
    this.pdf.text(label, spacing.margin, this.currentY);
    
    // Progress bar background
    this.pdf.setFillColor(this.theme.colors.background.accent[0], this.theme.colors.background.accent[1], this.theme.colors.background.accent[2]);
    this.pdf.roundedRect(spacing.margin, this.currentY + 8, barWidth, barHeight, this.theme.borderRadius.small, this.theme.borderRadius.small, 'F');
    
    // Progress bar fill
    const fillWidth = (value / maxValue) * barWidth;
    this.pdf.setFillColor(color[0], color[1], color[2]);
    this.pdf.roundedRect(spacing.margin, this.currentY + 8, fillWidth, barHeight, this.theme.borderRadius.small, this.theme.borderRadius.small, 'F');
    
    // Percentage text
    this.setTextStyle('caption');
    this.pdf.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(`${Math.round(value)}%`, spacing.margin + barWidth + 5, this.currentY + 15);
    
    this.currentY += 25;
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

  public async downloadPDF(filename: string): Promise<void> {
    this.pdf.save(filename);
  }

  public getPDFBlob(): Blob {
    return this.pdf.output('blob');
  }
}