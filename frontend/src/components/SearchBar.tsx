import React, { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Grid container alignItems="center" justifyContent="center">
        <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
          Search
        </Typography>
      </Grid>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <TextField
            style={{
              color: '#fff',
              '& input': {
                color: '#fff',
              },
              '& fieldset': {
                borderColor: '#fff',
              },
              '&:hover fieldset': {
                borderColor: '#fff',
              },
            }}
            InputLabelProps={{ style: { color: '#fff', textAlign: 'center' } }}
            label="Enter query"
            variant="outlined"
            value={query}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item>
          <Button
            style={{ color: '#fff', borderColor: '#fff' }}
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchBar;
