import React, { useRef, ChangeEvent } from 'react';
import { Button, makeStyles } from '@material-ui/core';

interface FileUploadButtonProps {
  onFileUpload: (file: File) => void;
}

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    marginBottom: theme.spacing(4), // Ajusta el espacio encima del botón
  },
}));

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileUpload }) => {
  const classes = useStyles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className={classes.buttonContainer}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleInputChange}
        accept=".csv"
      />
      <Button variant="contained" color="primary" onClick={handleFileUpload}>
        Upload CSV
      </Button>
    </div>
  );
};

export default FileUploadButton;
