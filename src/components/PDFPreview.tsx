import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Typography, Paper, IconButton, CircularProgress } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFPreviewProps {
  file: File | null;
  processedFileUrl: string | null;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ file, processedFileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(numPages || 1, newPageNumber));
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  if (!file && !processedFileUrl) {
    return (
      <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          Aucun fichier sélectionné pour prévisualisation
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mt: 3, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <IconButton 
          onClick={previousPage} 
          disabled={pageNumber <= 1}
          sx={{ mr: 2 }}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <Typography variant="body1">
          Page {pageNumber} sur {numPages || '?'}
        </Typography>
        <IconButton 
          onClick={nextPage} 
          disabled={pageNumber >= (numPages || 1)}
          sx={{ ml: 2 }}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', minHeight: 500 }}>
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 1 
          }}>
            <CircularProgress color="primary" />
          </Box>
        )}
        
        <Document
          file={processedFileUrl || file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<CircularProgress color="primary" />}
          error={
            <Typography color="error" align="center">
              Erreur lors du chargement du PDF. Veuillez réessayer.
            </Typography>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={500}
            loading={null}
          />
        </Document>
      </Box>
    </Paper>
  );
};

export default PDFPreview;