export interface FileWithPreview extends File {
  preview: string;
  id: string;
}

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: {
    x: number;
    y: number;
  };
  color: string;
  pages: 'all' | number[];
}

export interface ProcessedFile {
  id: string;
  name: string;
  originalFile: File;
  processedFileUrl: string;
}