import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { WatermarkOptions } from '../types';

interface WatermarkControlsProps {
  options: WatermarkOptions;
  onOptionsChange: (options: WatermarkOptions) => void;
  onApplyWatermark: () => void;
  isProcessing: boolean;
}

const WatermarkControls: React.FC<WatermarkControlsProps> = ({
  options,
  onOptionsChange,
  onApplyWatermark,
  isProcessing,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ ...options, text: e.target.value });
  };

  const handleFontSizeChange = (_: Event, value: number | number[]) => {
    onOptionsChange({ ...options, fontSize: value as number });
  };

  const handleOpacityChange = (_: Event, value: number | number[]) => {
    onOptionsChange({ ...options, opacity: value as number });
  };

  const handleRotationChange = (_: Event, value: number | number[]) => {
    onOptionsChange({ ...options, rotation: value as number });
  };

  const handlePositionXChange = (_: Event, value: number | number[]) => {
    onOptionsChange({
      ...options,
      position: { ...options.position, x: value as number },
    });
  };

  const handlePositionYChange = (_: Event, value: number | number[]) => {
    onOptionsChange({
      ...options,
      position: { ...options.position, y: value as number },
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ ...options, color: e.target.value });
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Personnalisation du filigrane
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Texte du filigrane"
            value={options.text}
            onChange={handleTextChange}
            margin="normal"
            variant="outlined"
          />

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Taille de la police: {options.fontSize}px</Typography>
            <Slider
              value={options.fontSize}
              onChange={handleFontSizeChange}
              min={12}
              max={144}
              step={1}
              marks={[
                { value: 12, label: '12px' },
                { value: 72, label: '72px' },
                { value: 144, label: '144px' },
              ]}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Opacité: {options.opacity}%</Typography>
            <Slider
              value={options.opacity}
              onChange={handleOpacityChange}
              min={10}
              max={100}
              step={5}
              marks={[
                { value: 10, label: '10%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Rotation: {options.rotation}°</Typography>
            <Slider
              value={options.rotation}
              onChange={handleRotationChange}
              min={-180}
              max={180}
              step={5}
              marks={[
                { value: -180, label: '-180°' },
                { value: 0, label: '0°' },
                { value: 180, label: '180°' },
              ]}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Position X: {options.position.x}%</Typography>
            <Slider
              value={options.position.x}
              onChange={handlePositionXChange}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Position Y: {options.position.y}%</Typography>
            <Slider
              value={options.position.y}
              onChange={handlePositionYChange}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Couleur"
              type="color"
              value={options.color}
              onChange={handleColorChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onApplyWatermark}
              disabled={isProcessing}
              sx={{ minWidth: 200 }}
            >
              {isProcessing ? 'Traitement en cours...' : 'Appliquer le filigrane'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default WatermarkControls;