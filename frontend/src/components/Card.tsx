import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface CsvData {
    id: number;
    name: string;
    city: string;
    country: string;
    favorite_sport: string;
  }

  interface CsvCardProps {
    data: CsvData;
  }

const CsvCard: React.FC<CsvCardProps> = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {data.name}
        </Typography>
        <Typography variant="body2">
          City: {data.city}
        </Typography>
        <Typography variant="body2">
          Country: {data.country}
        </Typography>
        <Typography variant="body2">
          Favorite Sport: {data.favorite_sport}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CsvCard;