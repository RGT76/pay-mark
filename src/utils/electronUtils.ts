// Helper functions for Electron integration

export const isElectron = () => {
  return window.navigator.userAgent.toLowerCase().indexOf('electron') > -1;
};

export const saveFileWithDialog = async (pdfBytes: Uint8Array, suggestedName: string): Promise<boolean> => {
  if (isElectron() && window.electron) {
    try {
      // Convert Uint8Array to base64 for IPC transfer
      const base64Data = arrayBufferToBase64(pdfBytes);
      const result = await window.electron.saveFile(base64Data, `watermarked-${suggestedName}`);
      return result.success;
    } catch (error) {
      console.error('Error saving file with Electron:', error);
      return false;
    }
  }
  return false;
};

export const openFilesWithDialog = async (): Promise<File[]> => {
  if (isElectron() && window.electron) {
    try {
      const result = await window.electron.openFile();
      
      if (result.success && result.files.length > 0) {
        // Convert the base64 data back to File objects
        return result.files.map((fileInfo: any) => {
          const binaryData = base64ToArrayBuffer(fileInfo.data);
          return new File([binaryData], fileInfo.name, { type: 'application/pdf' });
        });
      }
    } catch (error) {
      console.error('Error opening files with Electron:', error);
    }
  }
  return [];
};

// Helper functions for base64 conversion
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}