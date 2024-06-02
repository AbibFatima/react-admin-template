import { Box, Grid, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import ColumnChartUplift from './ColumnChartUplift';

const handleDownload = async () => {
  try {
    const response = await fetch('http://localhost:5000/download-decile');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'decile_1_data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading decile data:', error);
  }
};

const Uplift = () => {
  return (
    <ComponentSkeleton>
      <MainCard>
        <Grid>
          <Box mt={2}>
            <MainCard sx={{ mt: 2 }} content={false}>
              <ColumnChartUplift />
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleDownload}>
                  Télécharger le décile 1
                </Button>
              </Box>
            </MainCard>
          </Box>
        </Grid>
      </MainCard>
    </ComponentSkeleton>
  );
};

export default Uplift;
