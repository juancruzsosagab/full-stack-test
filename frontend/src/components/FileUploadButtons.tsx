import React, { ChangeEvent } from 'react';
import { Button } from '@mui/material';

interface FileUploadButtonsProps {
  onSelectFile: (file: File) => void;
  onUploadFile: () => void;
}

const FileUploadButtons: React.FC<FileUploadButtonsProps> = ({ onSelectFile, onUploadFile }) => {
  const buttonContainerStyle: React.CSSProperties = {
    marginBottom: '1rem',
    position: 'relative',
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  return (
    <div style={buttonContainerStyle}>
      <Button variant="contained" color="primary" component="label">
        Select CSV
        <input type="file" hidden accept=".csv" onChange={handleInputChange} />
      </Button>
      <Button variant="contained" color="primary" onClick={onUploadFile}>
        Upload CSV
      </Button>
    </div>
  );
};

export default FileUploadButtons;

