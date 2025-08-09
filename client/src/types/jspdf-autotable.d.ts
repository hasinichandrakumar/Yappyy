declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  export interface UserOptions {
    head?: any[][];
    body?: any[][];
    startY?: number;
    margin?: any;
    pageBreak?: string;
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    theme?: string;
    didDrawCell?: (data: any) => void;
    didParseCell?: (data: any) => void;
  }

  declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: UserOptions) => jsPDF;
    }
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}