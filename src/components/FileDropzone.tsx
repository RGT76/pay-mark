import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { v4 as uuidv4 } from 'uuid';
import { FileWithPreview } from '../types';
import { isElectron, openFilesWithDialog } from '../utils/electronUtils';

interface FileDropzoneProps {
  onFilesAdded: (files: FileWithPreview[]) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesAdded }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const processFiles = useCallback(
    (acceptedFiles: File[]) => {
      const filesWithPreview = acceptedFiles.map((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: uuidv4(),
        }) as FileWithPreview;
        return fileWithPreview;
      });
      onFilesAdded(filesWithPreview);
    },
    [onFilesAdded]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      processFiles(acceptedFiles);
    },
    [processFiles]
  );

  const handleOpenFileDialog = async () => {
    if (isElectron()) {
      const files = await openFilesWithDialog();
      if (files.length > 0) {
        processFiles(files);
      }
    }
  };

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <Paper
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active-dropzone' : ''}`}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        cursor: 'pointer',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isDragReject ? 'error.main' : isDragActive ? 'primary.main' : 'grey.400',
        bgcolor: isDragActive ? 'rgba(255, 82, 82, 0.05)' : 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(255, 82, 82, 0.05)',
        },
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Glissez-déposez vos fichiers PDF ici
      </Typography>
      <Typography variant="body2" color="textSecondary">
        ou cliquez pour parcourir vos fichiers
      </Typography>
      {isDragReject && (
        <Box mt={2}>
          <Typography color="error">Seuls les fichiers PDF sont acceptés</Typography>
        </Box>
      )}
      
      {isElectron() && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FolderOpenIcon />}
          onClick={handleOpenFileDialog}
          sx={{ mt: 3 }}
        >
          Sélectionner des fichiers
        </Button>
      )}
    </Paper>
  );
};

export default FileDropzone;