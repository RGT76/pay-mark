import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography, 
  Paper,
  Tooltip,
  Button,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { FileWithPreview, ProcessedFile } from '../types';
import { downloadProcessedFile } from '../utils/pdfUtils';

interface FileListProps {
  files: FileWithPreview[];
  processedFiles: ProcessedFile[];
  onRemoveFile: (id: string) => void;
  onPreviewFile: (file: FileWithPreview) => void;
  onDownloadFile: (processedFile: ProcessedFile) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  processedFiles,
  onRemoveFile,
  onPreviewFile,
  onDownloadFile,
}) => {
  if (files.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.paper' }}>
        <Typography variant="body1" align="center" color="textSecondary">
          Aucun fichier sélectionné
        </Typography>
      </Paper>
    );
  }

  const handleDownloadAll = async () => {
    for (const processedFile of processedFiles) {
      await onDownloadFile(processedFile);
    }
  };

  return (
    <Paper sx={{ mt: 3, overflow: 'hidden' }}>
      {processedFiles.length > 0 && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DownloadIcon />}
            onClick={handleDownloadAll}
          >
            Télécharger tous les fichiers
          </Button>
        </Box>
      )}
      
      <List sx={{ width: '100%' }}>
        {files.map((file) => {
          const processedFile = processedFiles.find((pf) => pf.id === file.id);
          
          return (
            <ListItem key={file.id} divider>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Prévisualiser">
                  <IconButton 
                    edge="end" 
                    aria-label="preview" 
                    onClick={() => onPreviewFile(file)}
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                
                {processedFile && (
                  <Tooltip title="Télécharger">
                    <IconButton 
                      edge="end" 
                      aria-label="download" 
                      onClick={() => onDownloadFile(processedFile)}
                      sx={{ mr: 1 }}
                      color="primary"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title="Supprimer">
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={() => onRemoveFile(file.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default FileList;