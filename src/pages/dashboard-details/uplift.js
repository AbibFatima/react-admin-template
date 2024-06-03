import { Box, Grid, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import ColumnChartUplift from './ColumnChartUplift';

const handleDownload = async (decile) => {
  try {
    const response = await fetch(`http://localhost:5000/download-decile?decile=${decile}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `decile_${decile}_data.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading decile data:', error);
  }
};

const Uplift = () => {
  const [selectedDecile, setSelectedDecile] = useState('');

  const handleChange = (event) => {
    setSelectedDecile(event.target.value);
  };

  return (
    <ComponentSkeleton>
      <MainCard>
        <Grid>
          <Box mt={2}>
            <MainCard sx={{ mt: 2 }} content={false}>
              <ColumnChartUplift />
            </MainCard>
          </Box>
        </Grid>
        <Box mt={2} display="flex" justifyContent="center" alignItems="center">
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="select-decile-label">Select Decile</InputLabel>
            <Select labelId="select-decile-label" value={selectedDecile} onChange={handleChange}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((decile) => (
                <MenuItem key={decile} value={decile}>
                  Decile {decile}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={() => handleDownload(selectedDecile)} disabled={!selectedDecile}>
              Télécharger le décile {selectedDecile}
            </Button>
          </Box>
        </Box>
      </MainCard>
    </ComponentSkeleton>
  );
};

export default Uplift;
