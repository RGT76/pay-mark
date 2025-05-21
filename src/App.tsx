import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
} from '@mui/material';
import FileDropzone from './components/FileDropzone';
import FileList from './components/FileList';
import PDFPreview from './components/PDFPreview';
import WatermarkControls from './components/WatermarkControls';
import { FileWithPreview, WatermarkOptions, ProcessedFile } from './types';
import { addWatermarkToPdf, createDownloadLink, downloadProcessedFile } from './utils/pdfUtils';
import { isElectron } from './utils/electronUtils';

function App() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>({
    text: 'PAYÉ',
    fontSize: 72,
    opacity: 50,
    rotation: 45,
    position: {
      x: 50,
      y: 50,
    },
    color: '#ff0000',
    pages: 'all',
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      processedFiles.forEach((file) => URL.revokeObjectURL(file.processedFileUrl));
    };
  }, [files, processedFiles]);

  const handleFilesAdded = useCallback((newFiles: FileWithPreview[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    if (newFiles.length > 0 && !selectedFile) {
      setSelectedFile(newFiles[0]);
    }
    setTabValue(1); // Switch to the Files tab
    setNotification({
      open: true,
      message: `${newFiles.length} fichier(s) ajouté(s) avec succès`,
      severity: 'success',
    });
  }, [selectedFile]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((file) => file.id !== id);
    });

    setProcessedFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.processedFileUrl);
      }
      return prevFiles.filter((file) => file.id !== id);
    });

    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(null);
      setProcessedFileUrl(null);
    }
  }, [selectedFile]);

  const handlePreviewFile = useCallback((file: FileWithPreview) => {
    setSelectedFile(file);
    
    // Check if there's a processed version of this file
    const processedFile = processedFiles.find((pf) => pf.id === file.id);
    setProcessedFileUrl(processedFile ? processedFile.processedFileUrl : null);
    
    setTabValue(2); // Switch to the Preview tab
  }, [processedFiles]);

  const handleDownloadFile = useCallback(async (processedFile: ProcessedFile) => {
    try {
      // Find the original file to get the raw bytes
      const originalFile = files.find(f => f.id === processedFile.id);
      if (!originalFile) return;
      
      // Get the processed PDF bytes
      const pdfBytes = await addWatermarkToPdf(originalFile, watermarkOptions);
      
      // Download the file (either through Electron or browser)
      const success = await downloadProcessedFile(pdfBytes, processedFile.name);
      
      if (success) {
        setNotification({
          open: true,
          message: 'Fichier téléchargé avec succès',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      setNotification({
        open: true,
        message: 'Erreur lors du téléchargement du fichier',
        severity: 'error',
      });
    }
  }, [files, watermarkOptions]);

  const handleApplyWatermark = async () => {
    if (!files.length) {
      setNotification({
        open: true,
        message: 'Veuillez ajouter au moins un fichier PDF',
        severity: 'error',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const newProcessedFiles: ProcessedFile[] = [];
      
      for (const file of files) {
        // Check if we already processed this file with the same options
        const existingProcessed = processedFiles.find((pf) => pf.id === file.id);
        if (existingProcessed) {
          URL.revokeObjectURL(existingProcessed.processedFileUrl);
        }
        
        const pdfBytes = await addWatermarkToPdf(file, watermarkOptions);
        const downloadUrl = createDownloadLink(pdfBytes, file.name);
        
        newProcessedFiles.push({
          id: file.id,
          name: file.name,
          originalFile: file,
          processedFileUrl: downloadUrl,
        });
      }
      
      setProcessedFiles(newProcessedFiles);
      
      // Update the preview if a file is selected
      if (selectedFile) {
        const processedFile = newProcessedFiles.find((pf) => pf.id === selectedFile.id);
        if (processedFile) {
          setProcessedFileUrl(processedFile.processedFileUrl);
        }
      }
      
      setNotification({
        open: true,
        message: `${files.length} fichier(s) traité(s) avec succès`,
        severity: 'success',
      });
      
      // Switch to the preview tab if a file is selected
      if (selectedFile) {
        setTabValue(2);
      }
    } catch (error) {
      console.error('Error applying watermark:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de l\'application du filigrane',
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            PayéMark {isElectron() ? '(Desktop)' : '(Web)'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Ajoutez un filigrane "PAYÉ" à vos documents PDF
          </Typography>
          <Typography variant="body1" paragraph align="center" color="textSecondary">
            Importez vos fichiers, personnalisez le filigrane et téléchargez vos documents traités en quelques clics.
          </Typography>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="application tabs"
            centered
          >
            <Tab label="Importer" />
            <Tab label="Fichiers" />
            <Tab label="Prévisualisation" />
            <Tab label="Personnalisation" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <FileDropzone onFilesAdded={handleFilesAdded} />
          )}

          {tabValue === 1 && (
            <FileList
              files={files}
              processedFiles={processedFiles}
              onRemoveFile={handleRemoveFile}
              onPreviewFile={handlePreviewFile}
              onDownloadFile={handleDownloadFile}
            />
          )}

          {tabValue === 2 && (
            <PDFPreview
              file={selectedFile}
              processedFileUrl={processedFileUrl}
            />
          )}

          {tabValue === 3 && (
            <WatermarkControls
              options={watermarkOptions}
              onOptionsChange={setWatermarkOptions}
              onApplyWatermark={handleApplyWatermark}
              isProcessing={isProcessing}
            />
          )}
        </Box>

        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        )}
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;