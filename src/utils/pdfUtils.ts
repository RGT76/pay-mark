import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { WatermarkOptions } from '../types';
import { saveFileWithDialog, isElectron } from './electronUtils';

export async function addWatermarkToPdf(
  file: File,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = options.pages === 'all' 
    ? pdfDoc.getPages() 
    : options.pages.map(pageNum => pdfDoc.getPage(pageNum - 1));

  // Parse the color from hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 0, b: 0 }; // Default to red if parsing fails
  };
  
  const color = hexToRgb(options.color);

  for (const page of pages) {
    const { width, height } = page.getSize();
    
    // Calculate position based on percentage
    const xPos = width * (options.position.x / 100);
    const yPos = height * (options.position.y / 100);
    
    page.drawText(options.text, {
      x: xPos,
      y: yPos,
      size: options.fontSize,
      font: helveticaFont,
      color: rgb(color.r, color.g, color.b),
      opacity: options.opacity / 100,
      rotate: degrees(options.rotation),
    });
  }

  return await pdfDoc.save();
}

export function createDownloadLink(pdfBytes: Uint8Array, fileName: string): string {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

export async function downloadProcessedFile(pdfBytes: Uint8Array, fileName: string): Promise<boolean> {
  // If running in Electron, use the native save dialog
  if (isElectron()) {
    return await saveFileWithDialog(pdfBytes, fileName);
  } else {
    // Browser download
    const link = document.createElement('a');
    link.href = createDownloadLink(pdfBytes, fileName);
    link.download = `watermarked-${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }
}