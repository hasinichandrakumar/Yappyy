// Type declarations for jspdf-autotable
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    head?: any[][];
    body?: any[][];
    startY?: number;
    pageBreak?: string;
    rowPageBreak?: string;
    styles?: {
      fillColor?: number[] | string;
      textColor?: number[] | string;
      fontSize?: number;
      fontStyle?: string;
      overflow?: string;
      cellPadding?: number;
      lineWidth?: number;
      lineColor?: number[] | string;
      halign?: string;
      valign?: string;
    };
    headStyles?: {
      fillColor?: number[] | string;
      textColor?: number[] | string;
      fontSize?: number;
      fontStyle?: string;
    };
    bodyStyles?: {
      fillColor?: number[] | string;
      textColor?: number[] | string;
      fontSize?: number;
    };
    alternateRowStyles?: {
      fillColor?: number[] | string;
    };
    columnStyles?: {
      [key: string]: {
        fillColor?: number[] | string;
        textColor?: number[] | string;
        fontSize?: number;
        fontStyle?: string;
        halign?: string;
        cellWidth?: number | 'auto' | 'wrap';
      };
    };
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    } | number;
    theme?: 'striped' | 'grid' | 'plain';
    tableWidth?: number | 'auto' | 'wrap';
    showHead?: boolean;
    showFoot?: boolean;
    useCss?: boolean;
    createdHeaderCell?: (cell: any, data: any) => void;
    createdCell?: (cell: any, data: any) => void;
    drawHeaderRow?: (row: any, data: any) => void;
    drawRow?: (row: any, data: any) => void;
    drawHeaderCell?: (cell: any, data: any) => void;
    drawCell?: (cell: any, data: any) => void;
    addPageContent?: (data: any) => void;
  }

  interface AutoTableData {
    table: {
      finalY: number;
    };
  }

  declare module 'jspdf' {
    interface jsPDF {
      autoTable(options: AutoTableOptions): jsPDF;
      lastAutoTable?: AutoTableData;
    }
  }
}