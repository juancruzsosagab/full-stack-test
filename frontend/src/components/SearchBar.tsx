import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, makeStyles } from '@material-ui/core';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const useStyles = makeStyles((theme) => ({
  searchBarContainer: {
    marginBottom: theme.spacing(4), // Añade espacio debajo del componente de búsqueda
  },
  textField: {
    '& .MuiInputBase-root': {
      color: '#fff', // Texto blanco
      '&:hover': {
        borderColor: '#fff', // Cambiar color del borde al pasar el mouse
      },
      '&::before': {
        borderColor: '#fff !important', // Cambiar color del borde superior
      },
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#fff', // Borde blanco
      },
      '&:hover fieldset': {
        borderColor: '#fff', // Cambiar color del borde al pasar el mouse
      },
    },
  },
  button: {
    color: '#fff', // Texto blanco
    borderColor: '#fff', // Borde blanco
  },
  inputLabel: {
    color: '#fff !important',
    textAlign: 'center',
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const classes = useStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className={classes.searchBarContainer}>
      <Grid container alignItems="center" justifyContent="center">
        <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
          Search
        </Typography>
      </Grid>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <TextField
            className={classes.textField}
            InputLabelProps={{ className: classes.inputLabel }}
            label="Enter query"
            variant="outlined"
            value={query}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item>
          <Button className={classes.button} variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchBar;
