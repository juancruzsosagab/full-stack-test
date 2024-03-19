import React, { useState } from 'react';
import { Container, Typography, makeStyles } from '@material-ui/core';
import FileUploadButton from './components/FileUploadButton';
import SearchBar from './components/SearchBar';
import Card from './components/Card';

interface CsvData {
  id: number;
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
    fontSize: '32px',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const [csvData, setCsvData] = useState<CsvData[]>([]);

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/api/files', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users?q=${query}`);
      const data = await response.json();
      setCsvData(data.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" component="h1" className={classes.title}>CSV Data Uploader & Viewer</Typography>
      <FileUploadButton onFileUpload={handleFileUpload} />
      <SearchBar onSearch={handleSearch} />
      <div>
        {csvData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>
    </Container>
  );
};

export default App;