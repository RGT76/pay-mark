/// <reference types="vite/client" />

interface Window {
  electron?: {
    saveFile: (fileData: string, suggestedName: string) => Promise<{ success: boolean, filePath?: string }>;
    openFile: () => Promise<{ success: boolean, files: Array<{ name: string, path: string, data: string }> }>;
  };
}