import React, { useState } from 'react';
import { Container, Typography, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import FileUploadButtons from './components/FileUploadButtons';
import SearchBar from './components/SearchBar';
import Card from './components/Card';

const apiUrl = import.meta.env.VITE_API_URL;
interface CsvData {
  id: number;
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSnackbarMessage('File selected successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${apiUrl}/api/files`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setCsvData(data.data);
      setSnackbarMessage(data.message);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      setSnackbarMessage('Error uploading file');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/users?q=${query}`);
      const data = await response.json();
      if (data.data.length === 0) {
        setSnackbarMessage('No data found');
        setSnackbarSeverity('info');
        setOpenSnackbar(true);
        setCsvData([]);
      } else {
        setCsvData(data.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '1rem',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        style={{
          marginBottom: '1rem',
          fontSize: '32px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        CSV Data Uploader & Viewer
      </Typography>
      <FileUploadButtons onSelectFile={handleFileSelect} onUploadFile={handleFileUpload} />
      <SearchBar onSearch={handleSearch} />
      <div>
        {csvData && csvData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Snackbar>
    </Container>
  );
};

export default App;
